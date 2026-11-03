import { useId, useRef, useState, type FormEvent } from 'react';
import { Ornament } from '../../components/decor/Ornament';
import { SceneSection } from '../../components/scene/SceneSection';
import { mapsLink, monogramText, wedding } from '../../data/config';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { rsvpMessage, whatsappLink } from '../../lib/rsvp';
import { getLenis } from '../../lib/scroll';
import { useExperience } from '../../store/experience';
import { deferSetup } from '../../lib/idle';

const { venue, rsvp, families, couple } = wedding;

function VenueCard() {
  const [showMap, setShowMap] = useState(false);
  return (
    <article
      data-reveal-up
      className="overflow-hidden rounded-3xl border border-gold/40 bg-[linear-gradient(160deg,#fffdf8,#f7efdf)] shadow-[0_24px_50px_-30px_rgb(107_78_12/0.55)]"
    >
      <div className="relative aspect-[16/10] bg-ivory">
        {showMap ? (
          <iframe
            title={`Map of ${venue.name}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.mapsQuery)}&z=14&output=embed`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="group absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_45%,#fff8e6,#efe2c4)]"
          >
            <svg
              viewBox="0 0 200 120"
              className="absolute inset-0 h-full w-full opacity-40"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0 80 Q50 60 100 75 T200 70"
                stroke="#0E7C7B"
                strokeWidth="6"
                fill="none"
                strokeOpacity="0.5"
              />
              <path
                d="M-10 30 L210 50 M30 -10 L60 130 M140 -10 L120 130"
                stroke="#C9A227"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
            <span className="relative flex flex-col items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="size-10 text-vermilion drop-shadow"
                aria-hidden="true"
              >
                <path
                  d="M12 2c-3.9 0-7 3-7 6.8C5 13.6 12 22 12 22s7-8.4 7-13.2C19 5 15.9 2 12 2Z"
                  fill="currentColor"
                />
                <circle cx="12" cy="9" r="2.6" fill="#fff" />
              </svg>
              <span className="btn btn-gold gold-shimmer">Show map</span>
            </span>
          </button>
        )}
      </div>
      <div className="p-6 text-center sm:p-8">
        <p className="text-[0.66rem] tracking-[0.4em] text-teal uppercase">The venue</p>
        <h3 className="mt-2 font-display text-[clamp(1.8rem,6vw,2.4rem)] leading-tight text-peacock">
          {venue.name}
        </h3>
        <address className="mt-2 text-ink/75 not-italic">
          {venue.addressLines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </address>
        <a
          href={mapsLink(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solid gold-shimmer mt-6"
        >
          Open in Google Maps
        </a>
      </div>
    </article>
  );
}

function RsvpForm() {
  const id = useId();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please tell us your name.');
      return;
    }
    setError('');
    const message = rsvpMessage({ name, guests, attending, note }, rsvp.messageTemplate);
    window.open(whatsappLink(rsvp.whatsappNumber, message), '_blank', 'noopener,noreferrer');
  };

  return (
    <form
      data-reveal-up
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-gold/40 bg-[linear-gradient(160deg,#fffdf8,#f7efdf)] p-6 text-left shadow-[0_24px_50px_-30px_rgb(107_78_12/0.55)] sm:p-8"
    >
      <p className="text-center text-[0.66rem] tracking-[0.4em] text-teal uppercase">
        Kindly respond
      </p>
      <h3 className="mt-2 text-center font-display text-[clamp(1.8rem,6vw,2.4rem)] leading-tight text-peacock">
        Will you join us?
      </h3>
      {rsvp.deadline && (
        <p className="mt-1 text-center text-sm text-ink/70">Please reply by {rsvp.deadline}</p>
      )}

      <label
        htmlFor={`${id}-name`}
        className="mt-6 block text-[0.7rem] tracking-[0.24em] text-ink/80 uppercase"
      >
        Your name
      </label>
      <input
        id={`${id}-name`}
        className="field mt-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        placeholder="e.g. Priya Kapoor"
      />
      <p id={`${id}-err`} role="alert" className="mt-1 min-h-5 text-sm text-vermilion">
        {error}
      </p>

      <fieldset className="mt-2">
        <legend className="text-[0.7rem] tracking-[0.24em] text-ink/80 uppercase">
          Attending?
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { v: true, label: 'Joyfully accept' },
            { v: false, label: 'Regretfully decline' },
          ].map((o) => (
            <label
              key={String(o.v)}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-sm transition-colors ${
                attending === o.v
                  ? 'border-teal bg-teal text-cream'
                  : 'border-gold/45 bg-white/70 text-ink/80'
              }`}
            >
              <input
                type="radio"
                name={`${id}-attending`}
                className="sr-only"
                checked={attending === o.v}
                onChange={() => setAttending(o.v)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      {attending && (
        <>
          <label
            htmlFor={`${id}-guests`}
            className="mt-5 block text-[0.7rem] tracking-[0.24em] text-ink/80 uppercase"
          >
            Number of guests
          </label>
          <select
            id={`${id}-guests`}
            className="field mt-2"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </>
      )}

      <label
        htmlFor={`${id}-note`}
        className="mt-5 block text-[0.7rem] tracking-[0.24em] text-ink/80 uppercase"
      >
        A note for the couple <span className="tracking-normal normal-case">(optional)</span>
      </label>
      <textarea
        id={`${id}-note`}
        className="field mt-2 min-h-24 resize-y"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Dietary needs, songs for the sangeet, blessings…"
      />

      <button type="submit" className="btn btn-solid gold-shimmer mt-6 w-full">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.8-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" />
        </svg>
        Send RSVP on WhatsApp
      </button>
      <p className="mt-3 text-center text-xs text-ink/70">
        Opens WhatsApp with your reply ready to send — nothing is stored on this site.
      </p>
    </form>
  );
}

/** Scene 7 — venue, RSVP via WhatsApp deep link, and the blessing footer. */
export function RsvpScene() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useExperience((s) => s.reducedMotion);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        if (reduced) return;
        const q = gsap.utils.selector(scope);
        gsap.set(q('[data-reveal-up]'), { autoAlpha: 0, y: 30 });
        ScrollTrigger.batch(q('[data-reveal-up]'), {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out' }),
        });
      }),
    { scope, dependencies: [reduced] },
  );

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <SceneSection id="rsvp" label="Venue and RSVP" className="px-5 pt-[clamp(3rem,10svh,7rem)]">
      <div ref={scope} className="mx-auto max-w-5xl">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <VenueCard />
          <RsvpForm />
        </div>

        <footer
          data-reveal-up
          className="mt-24 flex flex-col items-center pb-[calc(var(--safe-bottom)+3rem)] text-center"
        >
          <Ornament />
          <p lang="hi" className="mt-6 font-deva text-[clamp(1.1rem,4vw,1.4rem)] text-gold-deep">
            ॥ शुभ विवाह ॥
          </p>
          <p className="mt-3 max-w-md font-display text-[clamp(1.25rem,4.6vw,1.6rem)] leading-snug text-balance text-ink/80 italic">
            {families.blessing}
          </p>
          <div
            aria-label={`Monogram ${monogramText}`}
            role="img"
            className="mt-8 grid size-24 place-items-center rounded-full border border-gold bg-[radial-gradient(circle_at_38%_32%,#f6dc8a,#d8b03e_40%,#a9821b_78%,#6e510d)] shadow-[0_12px_24px_-12px_rgb(107_78_12/0.7)]"
          >
            <span className="font-display text-3xl text-[#4A3508] italic [text-shadow:0_1px_0_rgb(251_231_166/0.6)]">
              {couple.monogram.bride}
              <span className="text-xl">&amp;</span>
              {couple.monogram.groom}
            </span>
          </div>
          <p className="mt-6 text-[0.72rem] tracking-[0.32em] text-ink/75 uppercase">
            With love, the {families.bride} &amp; {families.groom} families
          </p>
          <p className="mt-3 font-display text-2xl text-teal">{couple.hashtag}</p>
          <button type="button" onClick={toTop} className="btn btn-gold gold-shimmer mt-10">
            Back to the beginning ↑
          </button>
        </footer>
      </div>
    </SceneSection>
  );
}
