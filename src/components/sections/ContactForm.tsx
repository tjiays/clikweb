'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import {
  EMPTY_FORM,
  INTERESTS,
  HEARD_FROM,
  MARKETING_CHANNELS,
  validateContactForm,
  type ContactFormValues,
  type FieldErrors,
} from '@/lib/contactForm'
import styles from './ContactForm.module.css'

type Strings = Record<string, string>

/**
 * Hubungi Kami form — Figma 284:1397.
 *
 * Errors are shown beside the field they belong to. The consent checkbox is
 * mandatory; the marketing preferences are not. There is no CAPTCHA — the
 * server enforces rate limits instead (confirmed decision 18).
 */
export function ContactForm({ t, locale }: { t: Strings; locale: string }) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  const set = <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const toggleChannel = (channel: string) => {
    setValues((current) => ({
      ...current,
      marketingChannels: current.marketingChannels.includes(channel)
        ? current.marketingChannels.filter((c) => c !== channel)
        : [...current.marketingChannels, channel],
    }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const found = validateContactForm(values, (key) => t[key] ?? key)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setFormError(t.errorSummary)
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          pageUrl: window.location.href,
        }),
      })

      if (response.status === 429) {
        setStatus('idle')
        setFormError(t.rateLimited)
        return
      }
      if (!response.ok) {
        setStatus('idle')
        setFormError(t.serverError)
        return
      }

      setStatus('sent')
      setValues(EMPTY_FORM)
    } catch {
      setStatus('idle')
      setFormError(t.serverError)
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.success} role="status">
        <h2 className="t-h3">{t.successTitle}</h2>
        <p>{t.successBody}</p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          {t.sendAnother}
        </Button>
      </div>
    )
  }

  const field = (key: keyof ContactFormValues, label: string, type = 'text') => (
    <div className={styles.field}>
      <label htmlFor={key}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={key}
        name={key}
        type={type}
        value={String(values[key] ?? '')}
        onChange={(event) => set(key, event.target.value as never)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className={errors[key] ? styles.invalid : undefined}
      />
      {errors[key] && (
        <p className={styles.error} id={`${key}-error`}>
          {errors[key]}
        </p>
      )}
    </div>
  )

  const select = (
    key: 'interestedIn' | 'hearAboutUs',
    label: string,
    options: readonly string[],
    required: boolean,
  ) => (
    <div className={styles.field}>
      <label htmlFor={key}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <select
        id={key}
        name={key}
        value={values[key]}
        onChange={(event) => set(key, event.target.value)}
        aria-invalid={Boolean(errors[key])}
        className={errors[key] ? styles.invalid : undefined}
      >
        <option value="">{t.choose}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[key] && (
        <p className={styles.error} id={`${key}-error`}>
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        {field('firstName', t.firstName)}
        {field('lastName', t.lastName)}
      </div>
      <div className={styles.row}>
        {field('email', t.email, 'email')}
        {field('phone', t.phone, 'tel')}
      </div>
      {field('companyName', t.company)}
      {select('interestedIn', t.interestedIn, INTERESTS, true)}
      {select('hearAboutUs', t.hearAboutUs, HEARD_FROM, false)}

      <div className={styles.field}>
        <label htmlFor="message">
          {t.message} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => set('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
          className={errors.message ? styles.invalid : undefined}
        />
        {errors.message && <p className={styles.error}>{errors.message}</p>}
      </div>

      <fieldset className={styles.privacy}>
        <legend className={styles.privacyLegend}>{t.dataPrivacy}</legend>

        <p className={styles.consentHeading}>{t.consentHeading}</p>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(event) => set('consent', event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
          />
          <span>{t.consentText}</span>
        </label>
        {errors.consent && <p className={styles.error}>{errors.consent}</p>}

        <p className={styles.marketingHeading}>{t.marketingHeading}</p>
        <div className={styles.checkboxGroup}>
          {MARKETING_CHANNELS.map((channel) => (
            <label key={channel} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={values.marketingChannels.includes(channel)}
                onChange={() => toggleChannel(channel)}
              />
              <span>{channel}</span>
            </label>
          ))}
        </div>

        <p className={styles.marketingHeading}>{t.marketingPrefHeading}</p>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'opt_in', label: t.optIn },
            { value: 'opt_out', label: t.optOut },
          ].map((option) => (
            <label key={option.value} className={styles.checkbox}>
              <input
                type="radio"
                name="marketingPreference"
                value={option.value}
                checked={values.marketingPreference === option.value}
                onChange={(event) => set('marketingPreference', event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.submit}
      </Button>
    </form>
  )
}
