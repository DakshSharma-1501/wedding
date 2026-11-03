import { describe, expect, it } from 'vitest';
import { timeLeft } from './countdown';

const target = new Date('2027-01-24T12:00:00+05:30');

describe('timeLeft', () => {
  it('splits the remaining time into days, hours, minutes and seconds', () => {
    const offset = ((2 * 24 + 3) * 60 * 60 + 4 * 60 + 5) * 1000;
    const now = new Date(target.getTime() - offset);
    expect(timeLeft(target, now)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5, done: false });
  });

  it('counts large spans in days', () => {
    const now = new Date('2026-11-03T12:00:00+05:30');
    const r = timeLeft(target, now);
    expect(r.days).toBe(82);
    expect(r.done).toBe(false);
  });

  it('is done (all zeros) once the target has passed', () => {
    const now = new Date(target.getTime() + 1000);
    expect(timeLeft(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });
});
