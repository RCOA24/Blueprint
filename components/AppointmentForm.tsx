'use client';

import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/site';
import { addressLines, mapsUrl } from '@/lib/contact';
import { gmailUrl, recipient, type EmailDraft } from '@/lib/email';

function caymanToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Cayman', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export default function AppointmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [minimumDate, setMinimumDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const selected = query.get('service');
    const product = query.get('product');
    if (services.some(item => item.name === selected)) setService(selected ?? '');
    if (product) { setService('Products & fencing supplies'); setMessage(`I would like to enquire about ${product}.\n\nProject location: \nRequirements: `); }
    setMinimumDate(caymanToday());
  }, []);

  function prepare(): EmailDraft | null {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return null;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? '').trim();
    const body = [
      'Hello Blueprint Group,', '', 'I would like to request an appointment.', '',
      `Full name: ${get('name')}`, `Email address: ${get('email')}`,
      ...(get('phone') ? [`Contact number: ${get('phone')}`] : []),
      `Service: ${get('service')}`, `Preferred date: ${get('date')}`,
      `Preferred time of day: ${get('time')} (Cayman Islands time)`,
      ...(get('message') ? ['', 'Additional message:', get('message')] : []),
      '', 'Please confirm availability. Thank you.'
    ].join('\n');
    return { subject: `Appointment request — ${get('service')}`, body };
  }

  function openGmail() {
    const next = prepare();
    if (!next) return;
    window.open(gmailUrl(next), '_blank', 'noopener,noreferrer');
    setStatus('Review and send the draft in Gmail. Your request is not sent until you click Send. If Gmail did not open, check your pop-up settings and try again.');
  }

  return <section className="section appointment-section" aria-labelledby="appointment-heading">
    <div className="wrap contact-grid appointment-layout">
      <div className="contact-info">
        <p className="eyebrow">Personal support starts here</p>
        <h2 id="appointment-heading">A time to discuss<br />your project.</h2>
        <p>Choose a service and share a little about your plans. Our team will confirm availability and advise on next steps.</p>
        <div><h3>Call our team</h3><a href="tel:+13459264546">+1 (345) 926-4546 <span aria-hidden="true">↗</span></a></div>
        <div><h3>Email us</h3><a href={`mailto:${recipient}`}>{recipient} <span aria-hidden="true">↗</span></a></div>
        <div><h3>Visit us</h3><p>{addressLines.map((line, index) => <span key={line}>{line}{index < addressLines.length - 1 && <br />}</span>)}</p><a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a></div>
      </div>
      <form ref={formRef} id="appointment-form" className="appointment-form" onSubmit={event => { event.preventDefault(); openGmail(); }}>
        <h2>Request an appointment</h2>
        <p>Fill in your details, then open a Gmail draft to review and send. The team will reply to confirm a time.</p>
        <div className="form-grid">
          <label>Full name *<input name="name" autoComplete="name" placeholder="Full name" required /></label>
          <label>Email address *<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Contact number<input name="phone" type="tel" autoComplete="tel" /></label>
          <label>What can we help with? *<select name="service" required value={service} onChange={event => setService(event.target.value)}><option value="">Choose a service</option>{services.map(item => <option key={item.slug}>{item.name}</option>)}<option>Products &amp; fencing supplies</option><option>Other enquiry</option></select></label>
          <label>Preferred date *<input name="date" type="date" min={minimumDate || undefined} required /></label>
          <label>Preferred time of day<select name="time" defaultValue="No preference"><option>Morning</option><option>Afternoon</option><option>No preference</option></select></label>
          <label className="full">Anything you’d like us to know? <span className="optional">(optional)</span><textarea name="message" value={message} onChange={event => setMessage(event.target.value)} placeholder="A brief description of your project or question" /></label>
          <div className="full">
            <p className="form-note">Preferred times are in Cayman Islands time. Clicking the button opens Gmail; your request is not sent or booked until you send the email and the team confirms availability.</p>
            <button className="btn" type="submit">Request Appointment <span className="arrow" aria-hidden="true">↗</span></button>
            <p role="status" aria-live="polite">{status}</p>
          </div>
        </div>
      </form>
    </div>
    <div className="wrap appointment-faq"><p className="eyebrow">Before we talk</p><h2>A few helpful answers.</h2><details><summary>Is my appointment confirmed when I complete this form?</summary><p>No. The form opens an email draft. Send it to our team, who will reply to confirm availability.</p></details><details><summary>What should I prepare for the first conversation?</summary><p>Share the service you are interested in and a short overview of your project or product question.</p></details><details><summary>Can I contact the team directly?</summary><p>Yes. Call <a href="tel:+13459264546">+1 (345) 926-4546</a> or email <a href={`mailto:${recipient}`}>{recipient}</a>.</p></details></div>
  </section>;
}
