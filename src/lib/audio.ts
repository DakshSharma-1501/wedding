import { wedding } from '../data/config';

/** Inharmonic partials of a small brass temple bell: [ratio, amplitude, decay multiplier]. */
const BELL_PARTIALS: readonly [number, number, number][] = [
  [1, 1, 1],
  [2.0, 0.5, 0.72],
  [2.76, 0.36, 0.56],
  [4.07, 0.2, 0.4],
  [5.43, 0.13, 0.3],
  [8.93, 0.05, 0.18],
];

/**
 * All audio is created lazily inside the envelope tap handler (the user gesture),
 * which is what iOS Safari and Chrome's autoplay policy require.
 */
class InviteAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private bgEl: HTMLAudioElement | null = null;
  private bgGain: GainNode | null = null;
  private muted = false;
  private readonly volume = wedding.audio.volume;

  constructor() {
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) {
        void this.ctx.suspend();
        this.bgEl?.pause();
      } else if (!this.muted) {
        void this.ctx.resume();
        void this.bgEl?.play().catch(() => undefined);
      }
    });
  }

  /** Must run synchronously inside a user gesture. Safe to call repeatedly. */
  unlock(muted: boolean): void {
    this.muted = muted;
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = muted ? 0 : this.volume;
    master.connect(ctx.destination);
    this.master = master;

    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(2.8);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    reverb.connect(wet).connect(master);
    this.reverb = reverb;

    if (wedding.audio.background) {
      const el = new Audio(wedding.audio.background);
      el.loop = true;
      el.preload = 'auto';
      el.setAttribute('playsinline', '');
      const source = ctx.createMediaElementSource(el);
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(master);
      this.bgEl = el;
      this.bgGain = gain;
      // play() must be called inside the gesture on iOS; it starts silent and fades in later.
      if (!muted) void el.play().catch(() => undefined);
    }
    void ctx.resume();
  }

  /** The envelope-opening cue: a low bell at the seal crack, a second as the flap lifts, a sparkle as the card flies. */
  playIntro(): void {
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const t0 = ctx.currentTime + 0.05;
    if (wedding.audio.intro) {
      const el = new Audio(wedding.audio.intro);
      const source = ctx.createMediaElementSource(el);
      source.connect(this.master ?? ctx.destination);
      void el.play().catch(() => undefined);
    } else {
      this.bell(t0 + 0.08, 392, 0.5, 4.4); // G4
      this.bell(t0 + 1.0, 587.33, 0.28, 3.6); // D5
      [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => this.bell(t0 + 2.5 + i * 0.085, f, 0.1, 2.6));
    }
    if (this.bgGain) {
      this.bgGain.gain.setValueAtTime(0, t0 + 2.4);
      this.bgGain.gain.linearRampToValueAtTime(0.55, t0 + 7);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(muted ? 0 : this.volume, now, 0.12);
    if (muted) {
      this.bgEl?.pause();
    } else {
      void ctx.resume();
      void this.bgEl?.play().catch(() => undefined);
      if (this.bgGain && this.bgGain.gain.value < 0.01) {
        this.bgGain.gain.setTargetAtTime(0.55, now, 1.2);
      }
    }
  }

  private bell(time: number, freq: number, gain: number, decay: number): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const out = ctx.createGain();
    out.gain.value = gain;
    out.connect(master);
    if (this.reverb) out.connect(this.reverb);
    for (const [ratio, amp, dk] of BELL_PARTIALS) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * ratio;
      osc.detune.value = (Math.random() - 0.5) * 7;
      const env = ctx.createGain();
      const end = time + decay * dk;
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(amp, time + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(env).connect(out);
      osc.start(time);
      osc.stop(end + 0.05);
    }
  }

  /** Synthetic stereo hall impulse response, so no reverb file has to be shipped. */
  private impulse(seconds: number): AudioBuffer | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
      }
    }
    return buffer;
  }
}

export const inviteAudio = new InviteAudio();
