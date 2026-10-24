import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { transitions } from '@/animations/motion';
import styles from './Modal.module.css';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog for Event details and Team division rosters.
 * Supports Escape key dismissal, Tab focus trapping, focus restoration on close,
 * backdrop click, and body scroll lock.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   titleId: string,
 *   eyebrow?: string,
 *   title: string,
 *   headerAccessory?: React.ReactNode,
 *   size?: 'md' | 'lg',
 *   children: React.ReactNode,
 * }} props
 */
export default function Modal({
  open,
  onClose,
  titleId,
  eyebrow,
  title,
  headerAccessory,
  size = 'md',
  children,
}) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousActiveRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousActiveRef.current = document.activeElement;

    const focusTimer = window.setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }
    }, 20);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (
        previousActiveRef.current &&
        typeof previousActiveRef.current.focus === 'function'
      ) {
        previousActiveRef.current.focus();
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitions.fast}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`${styles.dialog} ${size === 'lg' ? styles.dialogLg : ''} chamfer`}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={transitions.base}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.header}>
              <div className={styles.headerMain}>
                {headerAccessory && (
                  <div className={styles.headerAccessory}>{headerAccessory}</div>
                )}
                <div>
                  {eyebrow && <p className="hud-label">{eyebrow}</p>}
                  <h3 id={titleId} className={styles.title}>
                    {title}
                  </h3>
                </div>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close dialog"
              >
                ESC ✕
              </button>
            </header>

            <div className={styles.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
