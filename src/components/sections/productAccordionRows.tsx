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
  duration: (product: any) => number = () => 0.3,
): ProductRow[] {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description ? <RichText data={product.description} /> : null,
    status: product.productStatus,
    isNew: product.isNew,
    features: labelsOf(product.features),
    suitableFor: labelsOf(product.suitableFor),
    useCases: labelsOf(product.useCases),
    duration: duration(product),
  }))
}

export const accordionLabels = (locale: Locale): ProductAccordionLabels => ({
  description: t(productUi.accordion.description, locale),
  features: t(productUi.accordion.features, locale),
  suitableFor: t(productUi.accordion.suitableFor, locale),
  useCases: t(productUi.accordion.useCases, locale),
  expand: t(productUi.accordion.expand, locale),
  collapse: t(productUi.accordion.collapse, locale),
})
