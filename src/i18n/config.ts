export const locales = ['id', 'en'] as const

export type Locale = (typeof locales)[number]

/** Indonesian is the default and carries no URL prefix. English uses /en. */
export const defaultLocale: Locale = 'id'

export const localeLabels: Record<Locale, string> = {
  id: 'ID',
  en: 'EN',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
