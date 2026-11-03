import { useRef } from 'react';
import { mapsLink, wedding } from '../../data/config';
import type { EventDay, WeddingEvent } from '../../data/types';
import { cn } from '../../lib/cn';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { buildIcs, downloadIcs } from '../../lib/ics';
import { useExperience } from '../../store/experience';
import { EventIcon } from './EventIcon';
import { deferSetup } from '../../lib/idle';

const coupleLabel = `${wedding.couple.bride.firstName} & ${wedding.couple.groom.firstName}`;

function addToCalendar(event: WeddingEvent) {
  const location = event.venue ? event.venue.name : `${wedding.venue.name}, ${wedding.venue.city}`;
  const ics = buildIcs(event, { coupleLabel, location });
  downloadIcs(`${event.id}-${coupleLabel.replace(/\W+/g, '-').toLowerCase()}.ics`, ics);
}

function EventCard({ event, side }: { event: WeddingEvent; side: 'left' | 'right' }) {
  const place = event.venue ?? wedding.venue;
  return (
    <article
      data-event-card
      className={cn(
        'relative ml-12 rounded-2xl border border-gold/40 bg-[linear-gradient(160deg,#fffdf8,#f7efdf)] p-5 shadow-[0_18px_40px_-26px_rgb(107_78_12/0.55)] md:ml-0 md:w-[calc(50%-2.75rem)]',
        side === 'left' ? 'md:mr-auto' : 'md:ml-auto',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-7 -left-[2.05rem] size-3 rotate-45 border border-gold bg-cream md:top-8',
          side === 'left' ? 'md:right-[-3.15rem] md:left-auto' : 'md:-left-[3.15rem]',
        )}
      />
      <div className="flex gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/50 bg-ivory text-gold-deep">
          <EventIcon name={event.icon} className="size-8" />
        </span>
        <div className="min-w-0">
          <h4 className="font-display text-[1.65rem] leading-tight font-medium text-peacock">
            {event.name}
          </h4>
          {event.subtitle && (
            <p className="text-[0.66rem] tracking-[0.3em] text-teal uppercase">{event.subtitle}</p>
          )}
          <p className="mt-2 flex items-center gap-2 text-sm text-ink/80">
            <svg viewBox="0 0 16 16" className="size-4 text-gold-deep" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M8 4.5V8l2.5 1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            {event.timeLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            <span className="font-medium text-gold-deep">Dress code · </span>
            {event.dressCode}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-gold gold-shimmer"
          onClick={() => addToCalendar(event)}
        >
          <svg
            viewBox="0 0 16 16"
            className="size-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="2" y="3" width="12" height="11" rx="2" />
            <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3M8 8.5v3M6.5 10h3" strokeLinecap="round" />
          </svg>
          Add to calendar
        </button>
        <a
          className="btn btn-gold gold-shimmer"
          href={mapsLink(place)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="0 0 16 16"
            className="size-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M8 1.5c-2.6 0-4.5 2-4.5 4.5 0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5c0-2.5-1.9-4.5-4.5-4.5Z" />
            <circle cx="8" cy="6" r="1.6" />
          </svg>
          Directions
        </a>
      </div>
    </article>
  );
}

interface TimelineProps {
  days: EventDay[];
}

/** Vertical itinerary; the gold line draws itself as you scroll and cards reveal in turn. */
export function Timeline({ days }: TimelineProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useExperience((s) => s.reducedMotion);
  let index = 0;

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        if (reduced) return;
        gsap.fromTo(
          '[data-line-progress]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: true,
            },
          },
        );
        gsap.set('[data-event-card], [data-day-head]', { autoAlpha: 0, y: 34 });
        ScrollTrigger.batch('[data-event-card], [data-day-head]', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: 'power3.out',
            }),
        });
      }),
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="relative mx-auto max-w-4xl">
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-gold/25 md:left-1/2"
      />
      <div
        data-line-progress
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[1.1rem] w-[3px] origin-top rounded-full bg-[linear-gradient(#e8d5a3,#c9a227_40%,#0e7c7b)] md:left-[calc(50%-1px)]"
        style={reduced ? undefined : { transform: 'scaleY(0)' }}
      />
      <ol className="relative space-y-14">
        {days.map((day, d) => (
          <li key={day.date}>
            <div data-day-head className="relative flex md:justify-center">
              <h3 className="relative z-10 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-cream py-1 pr-4 pl-1 font-display text-[1.4rem] text-peacock">
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-full border border-gold bg-ivory font-display text-lg text-gold-dark lining-nums"
                >
                  {d + 1}
                </span>
                {day.label}
                <span className="text-[0.62rem] tracking-[0.3em] text-ink/75 uppercase">
                  {day.weekday}
                </span>
              </h3>
            </div>
            <ul className="mt-6 space-y-6">
              {day.events.map((event) => {
                const side = index++ % 2 === 0 ? 'right' : 'left';
                return (
                  <li key={event.id}>
                    <EventCard event={event} side={side} />
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
