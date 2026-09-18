import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Creates the first Super Admin. Safe to run repeatedly: if the account
 * already exists it reports that and changes nothing.
 */
const run = async () => {
  const payload = await getPayload({ config })
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME || 'Super Admin'

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set.')
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    payload.logger.info(`User ${email} already exists — nothing to do.`)
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name, role: 'super_admin' },
    overrideAccess: true,
  })

  payload.logger.info(`Created Super Admin ${email}`)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
