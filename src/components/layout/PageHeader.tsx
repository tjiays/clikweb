import { Container } from './Container'
import { Breadcrumb, type Crumb } from './Breadcrumb'
import styles from './PageHeader.module.css'

/**
 * Inner-page top area: breadcrumb then title, with the gaps the designer
 * annotated (60px header to breadcrumb, 42px breadcrumb to title).
 */
export function PageHeader({
  title,
  crumbs,
  breadcrumbLabel,
  lead,
}: {
  title: string
  crumbs: Crumb[]
  breadcrumbLabel: string
  lead?: string | null
}) {
  return (
    <Container>
      <div className={styles.wrap}>
        <Breadcrumb items={crumbs} label={breadcrumbLabel} />
        <h1 className={`t-h1 ${styles.title}`}>{title}</h1>
        {lead && <p className={`t-lead ${styles.lead}`}>{lead}</p>}
      </div>
    </Container>
  )
}
