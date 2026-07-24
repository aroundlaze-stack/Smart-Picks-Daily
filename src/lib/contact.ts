export const CONTACT_EMAIL = 'contactpicksdaily@gmail.com';

export function buildSupportMailto(subject: string, body: string): string {
  const params = new URLSearchParams({
    to: CONTACT_EMAIL,
    subject,
    body,
  });

  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
