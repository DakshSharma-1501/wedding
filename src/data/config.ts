import type { WeddingConfig } from './types.ts';

/**
 * ─────────────────────────────────────────────────────────────
 *  ONE PLACE TO EDIT. Names, dates, venue, phone, families,
 *  audio and SEO all live here. Events live in ./events.ts.
 *  The sample names below are placeholders — replace them.
 * ─────────────────────────────────────────────────────────────
 */
const bride = { firstName: 'Aarohi', fullName: 'Aarohi Sharma' };
const groom = { firstName: 'Vihaan', fullName: 'Vihaan Mehta' };

export const wedding: WeddingConfig = {
  couple: {
    bride,
    groom,
    monogram: { bride: 'A', groom: 'V' },
    hashtag: '#AarohiWedsVihaan',
  },
  families: {
    bride: 'Sharma',
    groom: 'Mehta',
    blessing: 'With the blessings of our elders and the love of our families',
  },
  invocation: {
    devanagari: '॥ श्री गणेशाय नमः ॥',
    english: 'Shri Ganeshaya Namah — salutations to Lord Ganesha',
  },
  tagline: 'Together with their families',
  copy: {
    shreenathji: {
      mantra: '॥ श्री कृष्णः शरणं मम ॥',
      mantraMeaning: 'Shri Krishnah Sharanam Mama — Lord Krishna is my refuge',
      title: 'With the blessings of Shreenathji',
      blessing: 'May their love be as joyful as His flute, and as steadfast as Govardhan.',
    },
    kali: {
      mantra: '॥ जय माँ काली ॥',
      mantraMeaning: 'Jai Maa Kali — victory to the Divine Mother',
      title: 'Seeking the blessings of Maa Kali',
      blessing:
        'May the Mother shield their union from every shadow, and fill their home with courage, grace and light.',
    },
    phere: {
      title: 'Saat Phere',
      vows: [
        'We will nourish each other, body and soul.',
        'We will grow strong together, in heart and mind.',
        'We will share our fortunes and our labours.',
        'We will honour each other’s families as our own.',
        'We will cherish the little ones life gives us.',
        'We will walk in health, through every season.',
        'We will remain friends, for this life and beyond.',
      ],
      closing: 'Two souls, one journey.',
    },
    story: {
      heading: 'Our Story',
      paragraphs: [
        'It began with a borrowed umbrella on a monsoon evening in Jaipur — and a conversation that simply never ended.',
        'Seven years, two cities and countless cups of chai later, we are ready to begin our forever, surrounded by the people who made us who we are.',
      ],
    },
  },
  dates: {
    teaser: '24 · 25 · 26 January 2027',
    countdownTarget: '2027-01-24T12:00:00+05:30',
    timeZone: 'Asia/Kolkata',
  },
  venue: {
    name: 'Rajmahal Gardens',
    city: 'Udaipur',
    addressLines: ['Lake Pichola Road', 'Udaipur, Rajasthan 313001'],
    mapsQuery: 'Lake Pichola, Udaipur, Rajasthan',
  },
  rsvp: {
    whatsappNumber: '919999999999',
    messageTemplate:
      'Namaste! This is {name}. Thank you for the beautiful invitation — we would be delighted to join the wedding celebrations of Aarohi & Vihaan.',
    deadline: '31 December 2026',
  },
  audio: {
    intro: null,
    background: null,
    volume: 0.6,
  },
  site: {
    url: 'https://example.com',
    title: `${bride.firstName} weds ${groom.firstName} · 24–26 January 2027`,
    description: `With the blessings of Shri Ganesh, ${bride.firstName} & ${groom.firstName} invite you to celebrate their wedding in Udaipur, 24–26 January 2027.`,
    ogImage: '/og-image.jpg',
    themeColor: '#FAF6EE',
    locale: 'en_IN',
  },
};

/** Google Maps link that needs no API key. */
export function mapsLink(place: { mapsQuery: string; mapsUrl?: string }): string {
  return (
    place.mapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`
  );
}

export const monogramText = `${wedding.couple.monogram.bride} & ${wedding.couple.monogram.groom}`;
