'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useForm } from '@formspree/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ContactFormProps = {
  language: 'de' | 'en';
  privacyText: string;
};

export function ContactForm({ language, privacyText }: ContactFormProps) {
  const [state, handleSubmit, reset] = useForm('xaeykgjq');
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.succeeded) formRef.current?.reset(); }, [state.succeeded]);
  const labels = language === 'de'
    ? { name: 'Name', email: 'E-Mail', message: 'Nachricht', submit: 'Nachricht senden', sending: 'Wird gesendet …', success: 'Danke! Ihre Nachricht wurde gesendet.', error: 'Das Senden hat nicht funktioniert. Bitte versuchen Sie es später erneut.', privacy: 'Datenschutzerklärung' }
    : { name: 'Name', email: 'Email', message: 'Message', submit: 'Send message', sending: 'Sending …', success: 'Thank you! Your message has been sent.', error: 'Your message could not be sent. Please try again later.', privacy: 'Privacy policy' };

  const fieldError = (field: 'name' | 'email' | 'message') => {
    const error = state.errors?.getFieldErrors(field)[0];
    if (!error) return null;
    const message = error.code === 'TYPE_EMAIL'
      ? (language === 'de' ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Please enter a valid email address.')
      : error.code === 'REQUIRED_FIELD_EMPTY' || error.code === 'REQUIRED_FIELD_MISSING'
        ? (language === 'de' ? 'Bitte füllen Sie dieses Feld aus.' : 'Please fill out this field.')
        : (language === 'de' ? 'Bitte prüfen Sie Ihre Eingabe.' : 'Please check your input.');
    return <p id={`${field}-error`} role="alert">{message}</p>;
  };

  return (
    <form ref={formRef} className="contact-form" aria-busy={state.submitting} onSubmit={(event) => {
      if (state.succeeded || state.submitting) { event.preventDefault(); return; }
      void handleSubmit(event);
    }}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">{labels.name}</label>
          <Input id="name" name="name" autoComplete="name" aria-describedby="name-error" required />
          {fieldError('name')}
        </div>
        <div className="field">
          <label htmlFor="email">{labels.email}</label>
          <Input id="email" name="email" type="email" autoComplete="email" aria-describedby="email-error" required />
          {fieldError('email')}
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">{labels.message}</label>
        <Textarea id="message" name="message" rows={5} aria-describedby="message-error" required />
        {fieldError('message')}
      </div>
      <input className="honeypot" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-submit">
        {state.succeeded
          ? <Button type="button" size="lg" onClick={reset}>{language === 'de' ? 'Weitere Nachricht senden' : 'Send another message'} <Send /></Button>
          : <Button type="submit" size="lg" disabled={state.submitting}>{state.submitting ? labels.sending : labels.submit} <Send /></Button>}
        <small>{privacyText} <Link href={`/datenschutz?lang=${language}`}>{labels.privacy}</Link></small>
      </div>
      {state.succeeded && <output className="form-status is-success">{labels.success}</output>}
      {state.errors && <p role="alert" className="form-status is-error">{labels.error}</p>}
    </form>
  );
}
