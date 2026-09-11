'use client';

import type { SyntheticEvent } from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ContactFormProps = {
  language: 'de' | 'en';
  privacyText: string;
};

export function ContactForm({ language, privacyText }: ContactFormProps) {
  const labels = language === 'de'
    ? { name: 'Name', email: 'E-Mail', message: 'Nachricht', submit: 'E-Mail vorbereiten', subject: 'Portfolio-Anfrage von' }
    : { name: 'Name', email: 'Email', message: 'Message', submit: 'Prepare email', subject: 'Portfolio enquiry from' };

  function prepareEmail(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const readField = (key: string) => {
      const value = data.get(key);
      return typeof value === 'string' ? value.trim() : '';
    };
    const name = readField('name');
    const email = readField('email');
    const message = readField('message');
    const subject = encodeURIComponent(`${labels.subject} ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:ressay93@outlook.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={prepareEmail}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">{labels.name}</label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">{labels.email}</label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">{labels.message}</label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <div className="form-submit">
        <Button type="submit" size="lg">{labels.submit} <Send /></Button>
        <small>{privacyText}</small>
      </div>
    </form>
  );
}
