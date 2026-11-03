export const recipient = 'info@blueprint.ky';

export type EmailDraft = { subject: string; body: string };

export function gmailUrl({ subject, body }: EmailDraft): string {
  const query = new URLSearchParams({ view: 'cm', fs: '1', to: recipient, su: subject, body });
  return `https://mail.google.com/mail/?${query.toString()}`;
}
