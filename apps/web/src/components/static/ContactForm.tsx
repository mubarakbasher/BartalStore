'use client';
import { useState, type FormEvent } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface ContactFormProps {
  dict: Dictionary;
}

interface FormState {
  name: string;
  phone: string;
  orderId: string;
  topic: number;
  message: string;
}

const SUDAN_PHONE = /^\+249\s*\d{2}\s*\d{3}\s*\d{4}$/;

export function ContactForm({ dict }: ContactFormProps) {
  const f = dict.web.contact.form;
  const [state, setState] = useState<FormState>({
    name: '',
    phone: '',
    orderId: '',
    topic: 0,
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!state.name.trim()) next.name = f.validation.nameRequired;
    if (!state.phone.trim()) next.phone = f.validation.phoneRequired;
    else if (!SUDAN_PHONE.test(state.phone.trim())) next.phone = f.validation.phoneFormat;
    if (state.message.trim().length < 10) next.message = f.validation.messageRequired;

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  const fieldClass =
    'w-full h-11 px-3.5 bg-paper border border-line rounded-bartal text-body text-ink placeholder:text-ink-mute focus:outline-none focus:border-amber transition-colors';
  const labelClass = 'block text-micro font-semibold text-ink-mute mb-1.5';
  const errorClass = 'mt-1 text-micro font-semibold text-danger normal-case tracking-normal';

  if (submitted) {
    return (
      <div className="bg-white border border-line rounded-bartal-lg p-7">
        <div className="text-h3 font-semibold text-ink mb-3">{f.heading}</div>
        <div className="bg-amber-tint border border-amber/30 rounded-bartal p-4 text-small text-navy-ink leading-relaxed">
          {f.success}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white border border-line rounded-bartal-lg p-7"
    >
      <div className="text-h3 font-semibold text-ink mb-5">{f.heading}</div>

      <div className="mb-3.5">
        <label htmlFor="cf-name" className={labelClass}>
          {f.fields.name}
        </label>
        <input
          id="cf-name"
          type="text"
          value={state.name}
          onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
          placeholder={f.fields.namePlaceholder}
          className={fieldClass}
        />
        {errors.name && <div className={errorClass}>{errors.name}</div>}
      </div>

      <div className="mb-3.5">
        <label htmlFor="cf-phone" className={labelClass}>
          {f.fields.phone}
        </label>
        <input
          id="cf-phone"
          type="tel"
          dir="ltr"
          value={state.phone}
          onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
          placeholder={f.fields.phonePlaceholder}
          className={`${fieldClass} font-mono`}
        />
        {errors.phone && <div className={errorClass}>{errors.phone}</div>}
      </div>

      <div className="mb-3.5">
        <label htmlFor="cf-order" className={labelClass}>
          {f.fields.orderId}
        </label>
        <input
          id="cf-order"
          type="text"
          dir="ltr"
          value={state.orderId}
          onChange={(e) => setState((s) => ({ ...s, orderId: e.target.value }))}
          placeholder={f.fields.orderIdPlaceholder}
          className={`${fieldClass} font-mono`}
        />
      </div>

      <div className="mb-3.5">
        <div className={labelClass}>{f.fields.topic}</div>
        <div className="flex flex-wrap gap-1.5">
          {f.topics.map((t, i) => {
            const selected = state.topic === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setState((s) => ({ ...s, topic: i }))}
                className={`px-3 py-1.5 rounded-full text-micro font-semibold transition-colors normal-case tracking-normal border ${
                  selected
                    ? 'bg-amber text-white border-amber'
                    : 'bg-transparent text-ink-mute border-line hover:border-amber/40'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="cf-msg" className={labelClass}>
          {f.fields.message}
        </label>
        <textarea
          id="cf-msg"
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
          placeholder={f.fields.messagePlaceholder}
          rows={5}
          className={`${fieldClass} h-auto py-3 leading-relaxed resize-y`}
        />
        {errors.message && <div className={errorClass}>{errors.message}</div>}
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center h-12 bg-amber text-white rounded-bartal font-bold hover:bg-[#B57208] transition-colors"
      >
        {f.submit}
      </button>
    </form>
  );
}
