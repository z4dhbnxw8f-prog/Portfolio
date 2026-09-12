'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ContactFormProps = {
  language: 'de' | 'en';
  privacyText: string;
};

export function ContactForm({ language, privacyText }: ContactFormProps) {
  const [state, handleSubmit] = useForm('xaeykgjq');
  const labels = language === 'de'
    ? { name: 'Name', email: 'E-Mail', message: 'Nachricht', submit: 'Nachricht senden', sending: 'Wird gesendet …', success: 'Danke! Ihre Nachricht wurde gesendet.', error: 'Das Senden hat nicht funktioniert. Bitte versuchen Sie es später erneut.', privacy: 'Datenschutzerklärung' }
    : { name: 'Name', email: 'Email', message: 'Message', submit: 'Send message', sending: 'Sending …', success: 'Thank you! Your message has been sent.', error: 'Your message could not be sent. Please try again later.', privacy: 'Privacy policy' };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">{labels.name}</label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">{labels.email}</label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
          <ValidationError prefix={labels.email} field="email" errors={state.errors} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">{labels.message}</label>
        <Textarea id="message" name="message" rows={5} required />
        <ValidationError prefix={labels.message} field="message" errors={state.errors} />
      </div>
      <input className="honeypot" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-submit">
        <Button type="submit" size="lg" disabled={state.submitting}>{state.submitting ? labels.sending : labels.submit} <Send /></Button>
        <small>{privacyText} <Link href="/datenschutz">{labels.privacy}</Link></small>
      </div>
      {state.succeeded && <output className="form-status is-success">{labels.success}</output>}
      {state.errors && <ValidationError className="form-status is-error" errors={state.errors} />}
    </form>
  );
}
