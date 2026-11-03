import { describe, expect, it } from 'vitest';
import type { WeddingEvent } from '../data/types';
import { buildIcs } from './ics';

const mehndi: WeddingEvent = {
  id: 'mehndi',
  name: 'Mehndi',
  icon: 'mehndi',
  start: '2027-01-24T12:00:00+05:30',
  end: '2027-01-24T16:00:00+05:30',
  timeLabel: '12:00 PM – 4:00 PM',
  dressCode: 'Shades of green; marigold, too',
};

const phere: WeddingEvent = {
  id: 'phere',
  name: 'Phere',
  icon: 'phere',
  start: '2027-01-26T06:30:00+05:30',
  timeLabel: '6:30 AM onwards',
  dressCode: 'Traditional',
};

const opts = {
  coupleLabel: 'Aadrika & Daksh',
  location: 'Rajmahal Gardens, Udaipur',
  now: new Date('2026-11-03T10:00:00Z'),
};

describe('buildIcs', () => {
  it('produces a valid calendar envelope with CRLF line endings', () => {
    const ics = buildIcs(mehndi, opts);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('VERSION:2.0\r\n');
    expect(ics).toContain('BEGIN:VEVENT\r\n');
    expect(ics).toContain('END:VEVENT\r\n');
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\n/);
  });

  it('converts IST start/end to UTC timestamps', () => {
    const ics = buildIcs(mehndi, opts);
    expect(ics).toContain('DTSTART:20270124T063000Z\r\n');
    expect(ics).toContain('DTEND:20270124T103000Z\r\n');
    expect(ics).toContain('DTSTAMP:20261103T100000Z\r\n');
  });

  it('gives "onwards" events a default three-hour duration', () => {
    const ics = buildIcs(phere, opts);
    expect(ics).toContain('DTSTART:20270126T010000Z\r\n');
    expect(ics).toContain('DTEND:20270126T040000Z\r\n');
  });

  it('escapes commas, semicolons and newlines in text fields', () => {
    // Unfold first (RFC 5545 §3.1: CRLF + space is a soft line continuation).
    const ics = buildIcs(mehndi, opts).replace(/\r\n /g, '');
    expect(ics).toContain('LOCATION:Rajmahal Gardens\\, Udaipur\r\n');
    expect(ics).toContain('Shades of green\\; marigold\\, too');
    expect(ics).toContain('SUMMARY:Mehndi — Aadrika & Daksh\r\n');
  });

  it('uses a stable, per-event UID', () => {
    expect(buildIcs(mehndi, opts)).toMatch(/UID:mehndi-20270124@/);
    expect(buildIcs(phere, opts)).toMatch(/UID:phere-20270126@/);
  });

  it('folds lines longer than 75 octets', () => {
    const long = { ...mehndi, dressCode: 'x'.repeat(200) };
    const lines = buildIcs(long, opts).split('\r\n');
    for (const line of lines) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(lines.some((l) => l.startsWith(' '))).toBe(true);
  });
});
