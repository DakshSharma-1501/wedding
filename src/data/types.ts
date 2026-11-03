/** Every scroll scene on the page, in order. */
export type SceneId =
  'ganesh' | 'shreenathji' | 'kali' | 'shivparvati' | 'couple' | 'itinerary' | 'rsvp';

export interface PersonInfo {
  /** Shown in large display type, e.g. "Aarohi". */
  firstName: string;
  fullName: string;
  /** Optional line such as "Daughter of Smt. Meera & Shri Rakesh Sharma". */
  parentsLine?: string;
}

export interface VenueInfo {
  name: string;
  city: string;
  addressLines: string[];
  /** Free-text Google Maps search query. No API key required. */
  mapsQuery: string;
  /** Optional exact share link (maps.app.goo.gl/...). Overrides mapsQuery for buttons. */
  mapsUrl?: string;
}

export interface WeddingConfig {
  couple: {
    bride: PersonInfo;
    groom: PersonInfo;
    /** Initials engraved on the wax seal, favicon and footer. */
    monogram: { bride: string; groom: string };
    hashtag: string;
  };
  families: {
    /** Family surnames, e.g. "Sharma" → "the Sharma & Mehta families". */
    bride: string;
    groom: string;
    blessing: string;
  };
  invocation: {
    /** Devanagari line shown above the Ganesh Ji artwork. */
    devanagari: string;
    /** Screen-reader / English rendering of the invocation. */
    english: string;
  };
  tagline: string;
  /** Words shown in the devotional and story scenes. */
  copy: SceneCopy;
  dates: {
    /** Teaser line in Scene 1. Use " · " between days. */
    teaser: string;
    /** ISO 8601 timestamp with offset — the countdown target. */
    countdownTarget: string;
    /** IANA zone used for calendar files and display. */
    timeZone: string;
  };
  venue: VenueInfo;
  rsvp: {
    /** International format, digits only, no "+" — e.g. "919876543210". */
    whatsappNumber: string;
    /** `{name}` is replaced by the guest's name. */
    messageTemplate: string;
    deadline?: string;
  };
  audio: {
    /** Optional file in /public played on envelope open. `null` → built-in synthesized temple bell. */
    intro: string | null;
    /** Optional looping background track in /public, e.g. "/audio/shehnai.mp3". */
    background: string | null;
    /** Master volume 0–1. */
    volume: number;
  };
  site: {
    /** Absolute production URL — used for OpenGraph tags. */
    url: string;
    title: string;
    description: string;
    /** Path in /public, 1200×630. */
    ogImage: string;
    themeColor: string;
    locale: string;
  };
}

export interface BlessingCopy {
  /** Devanagari line. */
  mantra: string;
  /** Transliteration + meaning, for everyone (and screen readers). */
  mantraMeaning: string;
  title: string;
  blessing: string;
}

export interface SceneCopy {
  shreenathji: BlessingCopy;
  kali: BlessingCopy;
  phere: {
    title: string;
    /** One short line per phera — exactly seven. */
    vows: readonly [string, string, string, string, string, string, string];
    closing: string;
  };
  story: {
    heading: string;
    paragraphs: string[];
  };
}

export type EventIcon = 'mehndi' | 'sangeet' | 'haldi' | 'reception' | 'phere';

export interface WeddingEvent {
  id: string;
  name: string;
  /** Small line under the name, e.g. "Evening". */
  subtitle?: string;
  icon: EventIcon;
  /** ISO 8601 with offset. */
  start: string;
  /** ISO 8601 with offset. Omit for "onwards" events. */
  end?: string;
  /** Human time label, e.g. "12:00 PM – 4:00 PM". */
  timeLabel: string;
  dressCode: string;
  description?: string;
  /** Falls back to the main venue when omitted. */
  venue?: Pick<VenueInfo, 'name' | 'mapsQuery' | 'mapsUrl'>;
}

export interface EventDay {
  /** ISO date, e.g. "2027-01-24". */
  date: string;
  /** e.g. "24 January 2027". */
  label: string;
  weekday: string;
  events: WeddingEvent[];
}
