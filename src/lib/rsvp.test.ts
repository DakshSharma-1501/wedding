import { describe, expect, it } from 'vitest';
import { rsvpMessage, whatsappLink } from './rsvp';

describe('whatsappLink', () => {
  it('builds a wa.me deep link with URL-encoded text', () => {
    expect(whatsappLink('919999999999', 'Hello world & more')).toBe(
      'https://wa.me/919999999999?text=Hello%20world%20%26%20more',
    );
  });

  it('keeps only digits in the phone number', () => {
    expect(whatsappLink('+91 99999-99999', 'Hi')).toBe('https://wa.me/919999999999?text=Hi');
  });
});

describe('rsvpMessage', () => {
  const template = 'Namaste! This is {name}. We would love to celebrate with you.';

  it('fills the template and adds attendance and guest count', () => {
    const msg = rsvpMessage({ name: '  Priya  ', guests: 2, attending: true }, template);
    expect(msg).toContain('Namaste! This is Priya.');
    expect(msg).toContain('Attending: Yes, joyfully');
    expect(msg).toContain('Guests: 2');
  });

  it('writes a gentle decline without a guest count', () => {
    const msg = rsvpMessage({ name: 'Priya', guests: 3, attending: false }, template);
    expect(msg).toContain('Attending: Regretfully unable to attend');
    expect(msg).not.toContain('Guests:');
  });

  it('appends an optional note', () => {
    const msg = rsvpMessage(
      { name: 'Priya', guests: 1, attending: true, note: 'Vegetarian meal please' },
      template,
    );
    expect(msg.endsWith('Note: Vegetarian meal please')).toBe(true);
  });
});
