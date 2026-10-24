import styles from './SectionHeading.module.css';

/**
 * Architectural section header: index + eyebrow + bold display title + lead.
 * Supports `tone="dark"` (default, for dark steel sections) and `tone="light"`
 * (for brushed-platinum / off-white sections).
 *
 * @param {{
 *   index?: string,
 *   eyebrow: string,
 *   title: React.ReactNode,
 *   lead?: React.ReactNode,
 *   align?: 'left' | 'center',
 *   tone?: 'dark' | 'light',
 *   as?: 'h1' | 'h2' | 'h3',
 * }} props
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'dark',
  as: Tag = 'h2',
}) {
  return (
    <header
      className={`${styles.heading} ${styles[align]} ${tone === 'light' ? styles.light : ''}`}
    >
      <div className={styles.boundaryLine} data-section-line aria-hidden="true" />
      <p className={styles.kicker} data-reveal>
        {index && <span className={styles.index}>{index}</span>}
        <span className={styles.separator} aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <Tag className={styles.title} data-reveal>
        {title}
      </Tag>
      {lead && (
        <p className={styles.lead} data-reveal>
          {lead}
        </p>
      )}
    </header>
  );
}
