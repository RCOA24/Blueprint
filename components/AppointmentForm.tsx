'use client';

import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/site';
import { addressLines, mapsUrl } from '@/lib/contact';
import { recipient } from '@/lib/email';

function caymanToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Cayman', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export default function AppointmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [minimumDate, setMinimumDate] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const selected = query.get('service');
    const product = query.get('product');
    if (services.some(item => item.name === selected)) setService(selected ?? '');
    if (product) { setService('Products & fencing supplies'); setMessage(`I would like to enquire about ${product}.\n\nProject location: \nRequirements: `); }
    setMinimumDate(caymanToday());
  }, []);

  async function sendRequest() {
    const form = formRef.current;
    if (!form || !form.reportValidity() || sending) return;
    const data = new FormData(form);
    setSending(true);
    setStatus('Sending your request…');
    try {
      const response = await fetch('/api/appointment.php', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Send failed');
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('message' in result) || result.message !== 'Request sent.') throw new Error('Unexpected response');
      form.reset();
      setService('');
      setMessage('');
      setStatus('Your request was sent. A copy was emailed to you. Our team will reply to confirm availability.');
    } catch {
      setStatus('We could not send your request. Please try again or email info@blueprint.ky.');
    } finally {
      setSending(false);
    }
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
      <form ref={formRef} id="appointment-form" className="appointment-form" onSubmit={event => { event.preventDefault(); void sendRequest(); }}>
        <h2>Request an appointment</h2>
        <p>Fill in your details and send your request directly to our team. We’ll email you a copy and reply to confirm a time.</p>
        <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="form-grid">
          <label>Full name *<input name="name" autoComplete="name" placeholder="Full name" required /></label>
          <label>Email address *<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Contact number<input name="phone" type="tel" autoComplete="tel" /></label>
          <label>What can we help with? *<select name="service" required value={service} onChange={event => setService(event.target.value)}><option value="">Choose a service</option>{services.map(item => <option key={item.slug}>{item.name}</option>)}<option>Products &amp; fencing supplies</option><option>Other enquiry</option></select></label>
          <label>Preferred date *<input name="date" type="date" min={minimumDate || undefined} required /></label>
          <label>Preferred time of day<select name="time" defaultValue="No preference"><option>Morning</option><option>Afternoon</option><option>No preference</option></select></label>
          <label className="full">Anything you’d like us to know? <span className="optional">(optional)</span><textarea name="message" value={message} onChange={event => setMessage(event.target.value)} placeholder="A brief description of your project or question" /></label>
          <div className="full">
            <p className="form-note">Preferred times are in Cayman Islands time. Your appointment is confirmed when our team replies with availability.</p>
            <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Request Appointment'} <span className="arrow" aria-hidden="true">↗</span></button>
            <p role="status" aria-live="polite">{status}</p>
          </div>
        </div>
      </form>
    </div>
    <div className="wrap appointment-faq"><p className="eyebrow">Before we talk</p><h2>A few helpful answers.</h2><details><summary>Is my appointment confirmed when I complete this form?</summary><p>No. We’ll email you a copy of your request, then our team will reply to confirm availability.</p></details><details><summary>What should I prepare for the first conversation?</summary><p>Share the service you are interested in and a short overview of your project or product question.</p></details><details><summary>Can I contact the team directly?</summary><p>Yes. Call <a href="tel:+13459264546">+1 (345) 926-4546</a> or email <a href={`mailto:${recipient}`}>{recipient}</a>.</p></details></div>
  </section>;
}
