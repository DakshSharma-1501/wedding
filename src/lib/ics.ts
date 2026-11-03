import type { WeddingEvent } from '../data/types';

export interface IcsOptions {
  /** e.g. "Aarohi & Vihaan" — appended to each event title. */
  coupleLabel: string;
  location: string;
  /** Injected for deterministic tests. */
  now?: Date;
  /** Used when an event has no end time ("7 PM onwards"). */
  defaultHours?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** RFC 5545 UTC date-time, e.g. 20270124T063000Z. */
export function toIcsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours(),
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/** Escape TEXT values: backslash, newline, comma, semicolon. */
export function escapeText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

const encoder = new TextEncoder();

/** Fold a content line to ≤75 octets per physical line (continuations start with a space). */
function fold(line: string): string {
  const out: string[] = [];
  let current = '';
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > limit) {
      out.push(current);
      current = ` ${ch}`;
      bytes = 1 + size;
      limit = 75;
    } else {
      current += ch;
      bytes += size;
    }
  }
  out.push(current);
  return out.join('\r\n');
}

/** A single-event .ics calendar file (CRLF line endings, UTC times). */
export function buildIcs(event: WeddingEvent, opts: IcsOptions): string {
  const start = new Date(event.start);
  const end = event.end
    ? new Date(event.end)
    : new Date(start.getTime() + (opts.defaultHours ?? 3) * 3_600_000);
  const day = event.start.slice(0, 10).replace(/-/g, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Shubh Vivah Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${day}@shubh-vivah.invite`,
    `DTSTAMP:${toIcsDate(opts.now ?? new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(`${event.name} — ${opts.coupleLabel}`)}`,
    `LOCATION:${escapeText(opts.location)}`,
    `DESCRIPTION:${escapeText(`${event.timeLabel}. Dress code: ${event.dressCode}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}

/** Trigger a download (desktop) / "Add to Calendar" sheet (iOS, Android) for an .ics file. */
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
