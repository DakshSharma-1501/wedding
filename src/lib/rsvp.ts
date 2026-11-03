export interface RsvpInput {
  name: string;
  guests: number;
  attending: boolean;
  note?: string;
}

/** The prefilled WhatsApp message: the config template, then attendance details. */
export function rsvpMessage(input: RsvpInput, template: string): string {
  const name = input.name.trim();
  const lines = [
    template.replace(/\{name\}/g, name),
    '',
    `Attending: ${input.attending ? 'Yes, joyfully' : 'Regretfully unable to attend'}`,
  ];
  if (input.attending) lines.push(`Guests: ${input.guests}`);
  const note = input.note?.trim();
  if (note) lines.push(`Note: ${note}`);
  return lines.join('\n');
}

/** wa.me deep link (opens WhatsApp app or web) — no backend needed. */
export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
