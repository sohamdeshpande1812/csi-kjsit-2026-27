import styles from './Logo.module.css';

/**
 * CSI KJSIT 2026 official Computer Society of India emblem + wordmark.
 */
export default function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.markWrap} aria-hidden="true">
        <img
          src="/csi-logo.png"
          alt=""
          width="40"
          height="40"
          className={styles.mark}
          decoding="async"
        />
      </span>
      <span className={styles.text}>
        <span className={styles.primary}>CSI</span>
        <span className={styles.secondary}>KJSIT</span>
        <span className={styles.year}>2026</span>
      </span>
    </span>
  );
}
