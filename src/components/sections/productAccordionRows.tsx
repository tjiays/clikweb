import { RichText } from '@/components/ui/RichText'
import type { Locale } from '@/i18n/config'
import { productUi } from '@/content/products'
import { t } from '@/lib/content'
import type { ProductAccordionLabels, ProductRow } from './ProductAccordion'

type ListItem = { label?: string | null }

const labelsOf = (items: unknown): string[] =>
  Array.isArray(items)
    ? (items as ListItem[]).map((item) => item?.label ?? '').filter(Boolean)
    : []

/**
 * Turns CMS product-items into ProductAccordion rows. The description is
 * rendered here, on the server, and handed to the client component.
 * `duration` picks the Figma expand timing per row.
 */
export function toAccordionRows(
  products: any[],
  locale: Locale,
  duration: (product: any) => number = () => 0.3,
): ProductRow[] {
  // Both languages sit on the product now, so the page picks its own.
  const L = locale === 'en' ? 'En' : 'Id'
  const pick = (p: any, base: string) => p[`${base}${L}`] ?? p[`${base}Id`]

  return products.map((product) => {
    const status: string[] = Array.isArray(product.statuses) ? product.statuses : []
    return {
      id: product.id,
      name: pick(product, 'name'),
      shortDescription: pick(product, 'shortDescription'),
      description: pick(product, 'description') ? (
        <RichText data={pick(product, 'description')} />
      ) : null,
      /*
       * Drawn in the order the design reads them: what you can do with the
       * product, then whether it is new. The editor's own order is not used,
       * so picking NEW first does not put it in front.
       */
      statuses: ['live', 'ready_to_sell', 'new'].filter((s) => status.includes(s)),
      features: labelsOf(pick(product, 'features')),
      suitableFor: labelsOf(pick(product, 'suitableFor')),
      useCases: labelsOf(pick(product, 'useCases')),
      duration: duration(product),
    }
  })
}

export const accordionLabels = (locale: Locale): ProductAccordionLabels => ({
  description: t(productUi.accordion.description, locale),
  features: t(productUi.accordion.features, locale),
  suitableFor: t(productUi.accordion.suitableFor, locale),
  useCases: t(productUi.accordion.useCases, locale),
  expand: t(productUi.accordion.expand, locale),
  collapse: t(productUi.accordion.collapse, locale),
})

