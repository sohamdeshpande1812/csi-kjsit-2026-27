import styles from './Button.module.css';

/**
 * Primary call-to-action element.
 * Renders an <a> when `href` is provided, otherwise a <button>.
 *
 * @param {{
 *   variant?: 'primary' | 'ghost',
 *   size?: 'md' | 'lg',
 *   href?: string,
 *   className?: string,
 *   children: React.ReactNode,
 * } & React.HTMLAttributes<HTMLElement>} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        <span className={styles.label}>{children}</span>
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
