'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/sections/SectionTitle'
import {
  EMPTY_FORM,
  INTERESTS,
  HEARD_FROM,
  validateContactForm,
  type ContactFormValues,
  type FieldErrors,
} from '@/lib/contactForm'
import { contactPage } from '@/content/contact'
import styles from './ContactForm.module.css'

type Strings = Record<string, string>
type Locale = 'id' | 'en'

const INITIAL: ContactFormValues = {
  ...EMPTY_FORM,
  interestedIn: contactPage.defaults.interestedIn,
  hearAboutUs: contactPage.defaults.hearAboutUs,
}

/**
 * Hubungi Kami form — Figma 284:1397.
 *
 * Top: `intro` and the pill fields in a 772px column, `aside` (address, map)
 * to the right. Below, full width: DATA PRIVACY with the consent and
 * marketing check boxes, then Submit.
 *
 * Errors are shown beside the field they belong to. The consent checkbox is
 * mandatory; the marketing preferences are not. There is no CAPTCHA — the
 * server enforces rate limits instead (confirmed decision 18).
 */
export function ContactForm({
  t,
  locale,
  intro,
  aside,
}: {
  /** Validation / status messages (dictionary `contact`). */
  t: Strings
  locale: Locale
  intro?: ReactNode
  aside?: ReactNode
}) {
  const copy = contactPage
  const tx = (value: { id: string; en: string }) => value[locale]

  const [values, setValues] = useState<ContactFormValues>(INITIAL)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  const set = <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  // Choosing a channel means opting in; opting out clears the channels.
  const toggleChannel = (channel: string) => {
    setValues((current) => {
      const has = current.marketingChannels.includes(channel)
      const marketingChannels = has
        ? current.marketingChannels.filter((c) => c !== channel)
        : [...current.marketingChannels, channel]
      return {
        ...current,
        marketingChannels,
        marketingPreference: has ? current.marketingPreference : 'opt_in',
      }
    })
  }

  // The two preference boxes look like check boxes but exclude each other.
  const togglePreference = (value: 'opt_in' | 'opt_out') => {
    setValues((current) => {
      const next = current.marketingPreference === value ? '' : value
      return {
        ...current,
        marketingPreference: next,
        marketingChannels: next === 'opt_out' ? [] : current.marketingChannels,
      }
    })
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
      setValues(INITIAL)
    } catch {
      setStatus('idle')
      setFormError(t.serverError)
    }
  }

  const error = (key: keyof ContactFormValues) =>
    errors[key] ? (
      <p className={styles.error} id={`${key}-error`}>
        {errors[key]}
      </p>
    ) : null

  const input = (
    key: 'firstName' | 'lastName' | 'email' | 'companyName' | 'phone',
    type = 'text',
    autoComplete?: string,
  ) => {
    const placeholder = tx(copy.fields[key])
    return (
      <div className={styles.field}>
        <label htmlFor={key} className="sr-only">
          {placeholder}
        </label>
        <input
          id={key}
          name={key}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={values[key]}
          onChange={(event) => set(key, event.target.value)}
          aria-required="true"
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          className={`${styles.pill} ${errors[key] ? styles.invalid : ''}`}
        />
        {error(key)}
      </div>
    )
  }

  const select = (key: 'interestedIn' | 'hearAboutUs', options: readonly string[]) => (
    <div className={styles.field}>
      <label htmlFor={key} className={styles.label}>
        {tx(copy.fields[key])}
      </label>
      <select
        id={key}
        name={key}
        value={values[key]}
        onChange={(event) => set(key, event.target.value)}
        aria-required="true"
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className={`${styles.pill} ${styles.select} ${errors[key] ? styles.invalid : ''}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error(key)}
    </div>
  )

  const checkbox = (
    checked: boolean,
    onChange: () => void,
    label: ReactNode,
    extra?: { invalid?: boolean; describedBy?: string; className?: string },
  ) => (
    <label className={`${styles.check} ${extra?.className ?? ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-invalid={extra?.invalid || undefined}
        aria-describedby={extra?.describedBy}
        className={extra?.invalid ? styles.invalid : undefined}
      />
      <span>{label}</span>
    </label>
  )

  const sent = status === 'sent'

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.top}>
        <div className={styles.main}>
          {intro}
          {sent ? (
            <div className={styles.success} role="status">
              <h2 className={styles.successTitle}>{t.successTitle}</h2>
              <p>{t.successBody}</p>
              <Button variant="outline" onClick={() => setStatus('idle')}>
                {t.sendAnother}
              </Button>
            </div>
          ) : (
            <div className={styles.fields}>
              <div className={styles.grid}>
                {input('firstName', 'text', 'given-name')}
                {input('lastName', 'text', 'family-name')}
                {input('email', 'email', 'email')}
                {input('companyName', 'text', 'organization')}
                {input('phone', 'tel', 'tel')}
              </div>
              <div className={`${styles.grid} ${styles.selects}`}>
                {select('interestedIn', INTERESTS)}
                {select('hearAboutUs', HEARD_FROM)}
              </div>
              <div className={`${styles.field} ${styles.messageField}`}>
                <label htmlFor="message" className={styles.label}>
                  {tx(copy.fields.messageLabel)}
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={tx(copy.fields.message)}
                  value={values.message}
                  onChange={(event) => set('message', event.target.value)}
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`${styles.pill} ${styles.textarea} ${errors.message ? styles.invalid : ''}`}
                />
                {error('message')}
              </div>
            </div>
          )}
        </div>
        {aside}
      </div>

      {!sent && (
        <section className={styles.privacy} aria-labelledby="data-privacy">
          <SectionTitle as="h2" size="md" weight={700} className={styles.privacyTitle}>
            <span id="data-privacy">{tx(copy.privacy.title)}</span>
          </SectionTitle>

          <p className={styles.text}>{tx(copy.privacy.intro)}</p>

          {checkbox(values.consent, () => set('consent', !values.consent), tx(copy.privacy.consent), {
            invalid: Boolean(errors.consent),
            describedBy: errors.consent ? 'consent-error' : undefined,
            className: styles.consent,
          })}
          {error('consent')}

          <p className={`${styles.text} ${styles.marketingIntro}`}>{tx(copy.privacy.marketingIntro)}</p>
          <p className={`${styles.text} ${styles.prompt}`}>{tx(copy.privacy.marketingPrompt)}</p>

          <div className={styles.preferences}>
            {checkbox(
              values.marketingPreference === 'opt_out',
              () => togglePreference('opt_out'),
              tx(copy.privacy.optOut),
            )}
            {checkbox(
              values.marketingPreference === 'opt_in',
              () => togglePreference('opt_in'),
              tx(copy.privacy.optIn),
            )}
          </div>

          <div className={styles.channels} role="group" aria-label={tx(copy.privacy.optIn)}>
            {copy.privacy.channels.map((channel) =>
              <span key={channel.value}>
                {checkbox(
                  values.marketingChannels.includes(channel.value),
                  () => toggleChannel(channel.value),
                  tx(channel.label),
                )}
              </span>,
            )}
          </div>

          {formError && (
            <p className={styles.formError} role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={status === 'sending'} className={styles.submit}>
            {status === 'sending' ? t.sending : t.submit}
          </Button>
        </section>
      )}
    </form>
  )
}
