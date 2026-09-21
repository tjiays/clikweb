import { getPayload } from 'payload'
import config from '@payload-config'
import { productSeeds } from './product-items-content'

/**
 * Fills every product item with the Figma content of its expanded card:
 * short description, description, Fitur Utama chips, Cocok Untuk and
 * Kasus Penggunaan, in Indonesian and English. Also sets status, the NEW
 * badge and the Figma row order.
 *
 * Items are matched by their Indonesian name; a missing item is created.
 * Safe to run repeatedly.
 *
 *   npx payload run scripts/seed-product-items.ts
 */
const paragraph = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      },
    ],
  },
})

const labels = (items: string[]) => items.map((label) => ({ label }))

const run = async () => {
  const payload = await getPayload({ config })
  for (const [index, item] of productSeeds.entries()) {
    const sortOrder = index

    const common = {
      category: item.category,
      productStatus: item.status,
      isNew: item.isNew,
      sortOrder,
      approvalStatus: 'approved' as const,
      _status: 'published' as const,
    }
    const localised = (locale: 'id' | 'en') => ({
      name: item.name,
      shortDescription: item.short[locale],
      description: paragraph(item.description[locale]),
      features: labels(item.features[locale]),
      suitableFor: labels(item.suitableFor[locale]),
      useCases: labels(item.useCases[locale]),
    })

    const existing = await payload.find({
      collection: 'product-items',
      locale: 'id',
      where: { name: { equals: item.name } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })

    let id = existing.docs[0]?.id
    if (id) {
      await payload.update({
        collection: 'product-items',
        id,
        locale: 'id',
        data: { ...common, ...localised('id') } as never,
        overrideAccess: true,
      })
    } else {
      const created = await payload.create({
        collection: 'product-items',
        locale: 'id',
        data: { ...common, ...localised('id') } as never,
        overrideAccess: true,
      })
      id = created.id
    }
    await payload.update({
      collection: 'product-items',
      id,
      locale: 'en',
      data: { ...common, ...localised('en') } as never,
      overrideAccess: true,
    })
    payload.logger.info(`${existing.docs[0] ? 'Updated' : 'Created'} ${item.name}`)
  }

  payload.logger.info(`Seeded ${productSeeds.length} product items.`)
  process.exit(0)
}

try {
  await run()
} catch (error) {
  console.error(error)
  process.exit(1)
}
