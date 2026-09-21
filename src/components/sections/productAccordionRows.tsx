import Image from 'next/image'
import { RichText } from '@/components/ui/RichText'
import type { Locale } from '@/i18n/config'
import { productUi } from '@/content/products'
import { imageAlt, imageUrl, t } from '@/lib/content'
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
    image: productImage(product),
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

/**
 * The product's own picture, shown above its description when a row is
 * opened. Rendered here on the server and handed down, because
 * ProductAccordion is a client component and a Payload media object is not
 * something to send across that boundary.
 */
function productImage(product: { image?: unknown; name?: unknown }) {
  const url = imageUrl(product.image)
  if (!url) return null
  return (
    <Image
      src={url}
      alt={imageAlt(product.image, typeof product.name === 'string' ? product.name : '')}
      width={1200}
      height={675}
      sizes="(max-width: 768px) 100vw, 640px"
    />
  )
}
