import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, site } from '@/data/site';
import { useScrolled } from '@/hooks/useScrolled';
import { transitions } from '@/animations/motion';
import { Button } from '@/components/ui';
import Logo from '../Logo/Logo';
import styles from './Navbar.module.css';

export default function Navbar() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Track which section is currently in view for active navigation feedback.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.nav} ${scrolled || open ? styles.solid : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a
          href="#home"
          className={styles.brand}
          aria-label={`${site.badge} — Home`}
          onClick={close}
        >
          <Logo />
        </a>

        <nav aria-label="Primary" className={styles.desktop}>
          <ul role="list" className={styles.links}>
            {navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button href="#events" className={styles.cta}>
            Explore Events
          </Button>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.bar} data-open={open} />
            <span className={styles.bar} data-open={open} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className={styles.mobile}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transitions.base}
          >
            <ul role="list" className="container">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...transitions.base, delay: 0.04 * i }}
                >
                  <a
                    href={`#${link.id}`}
                    className={`${styles.mobileLink} ${activeId === link.id ? styles.mobileActive : ''}`}
                    onClick={close}
                  >
                    <span className={styles.mobileIndex}>0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                className={styles.mobileCtaRow}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transitions.base, delay: 0.22 }}
              >
                <Button href="#events" size="lg" onClick={close}>
                  Explore Events
                </Button>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
