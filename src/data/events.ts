import type { EventDay } from './types.ts';

/**
 * The itinerary (Scene 6). Times are IST (+05:30). `timeLabel` is what guests read;
 * `start`/`end` drive the "Add to Calendar" .ics files.
 */
export const eventDays: EventDay[] = [
  {
    date: '2027-01-24',
    label: '24 January 2027',
    weekday: 'Sunday',
    events: [
      {
        id: 'mehndi',
        name: 'Mehndi',
        icon: 'mehndi',
        start: '2027-01-24T12:00:00+05:30',
        end: '2027-01-24T16:00:00+05:30',
        timeLabel: '12:00 PM – 4:00 PM',
        dressCode: 'Shades of green & marigold — breezy and festive',
      },
      {
        id: 'sangeet',
        name: 'Sangeet',
        subtitle: 'Evening',
        icon: 'sangeet',
        start: '2027-01-24T19:00:00+05:30',
        end: '2027-01-24T23:00:00+05:30',
        timeLabel: '7:00 PM – 11:00 PM',
        dressCode: 'Indo-western glamour — sequins welcome',
      },
    ],
  },
  {
    date: '2027-01-25',
    label: '25 January 2027',
    weekday: 'Monday',
    events: [
      {
        id: 'haldi',
        name: 'Haldi',
        icon: 'haldi',
        start: '2027-01-25T10:00:00+05:30',
        end: '2027-01-25T12:00:00+05:30',
        timeLabel: '10:00 AM – 12:00 PM',
        dressCode: 'Yellow & white — clothes you don’t mind getting golden',
      },
      {
        id: 'reception',
        name: 'Reception · Varmala · Baraat',
        subtitle: 'Evening',
        icon: 'reception',
        start: '2027-01-25T19:00:00+05:30',
        timeLabel: '7:00 PM onwards',
        dressCode: 'Royal Indian formal — jewel tones',
      },
    ],
  },
  {
    date: '2027-01-26',
    label: '26 January 2027',
    weekday: 'Tuesday',
    events: [
      {
        id: 'phere',
        name: 'Phere',
        icon: 'phere',
        start: '2027-01-26T06:30:00+05:30',
        timeLabel: '6:30 AM onwards',
        dressCode: 'Traditional — ivory, gold & pastels',
      },
    ],
  },
];
