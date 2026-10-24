import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './SectionPlaceholder.module.css';

/**
 * Temporary scaffold for sections that are planned but not yet built.
 * Keeps navigation anchors working and demonstrates the GSAP reveal hook.
 * Replace each usage with a dedicated section component as phases complete.
 */
export default function SectionPlaceholder({ id, index, eyebrow, title, lead }) {
  const ref = useScrollReveal();

  return (
    <section id={id} ref={ref} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeading index={index} eyebrow={eyebrow} title={<span id={`${id}-title`}>{title}</span>} lead={lead} />
        <div className={`chamfer ${styles.panel}`} data-reveal>
          <span className="hud-label">Status</span>
          <span className={styles.status}>Module in development</span>
        </div>
      </div>
    </section>
  );
}
