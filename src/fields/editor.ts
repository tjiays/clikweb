import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  LinkFeature,
  UploadFeature,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'

/**
 * One editor for every long-form field: articles, reports, product
 * descriptions and job specs.
 *
 * Two choices worth stating. The toolbar is fixed rather than floating —
 * Payload's default only appears once text is selected, which leaves someone
 * staring at an empty box wondering where the controls are. And tables are
 * on, because the annual reports carry financial statements and there is no
 * other way to lay those out.
 *
 * Images are inserted from the media library inline, so a writer places them
 * in the flow rather than attaching them to a separate field.
 */
export const contentEditor = lexicalEditor({
  features: [
    FixedToolbarFeature(),

    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    AlignFeature(),
    IndentFeature(),

    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),

    BlockquoteFeature(),
    HorizontalRuleFeature(),

    LinkFeature({
      enabledCollections: ['articles', 'reports'],
    }),

    // Inline images, with the alt text the public site needs for each one.
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
              label: 'Keterangan gambar',
              localized: true,
              admin: { description: 'Muncul di bawah gambar. Kosongkan bila tidak perlu.' },
            },
          ],
        },
      },
    }),

    // Financial tables in the annual reports need this.
    EXPERIMENTAL_TableFeature(),
  ],
})
