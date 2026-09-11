'use client';

import type { SyntheticEvent } from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
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
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:ressay93@outlook.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={prepareEmail}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <div className="form-submit">
        <Button type="submit" size="lg">Prepare email <Send /></Button>
        <small>This opens your email app. Nothing is stored on this website.</small>
      </div>
    </form>
  );
}
