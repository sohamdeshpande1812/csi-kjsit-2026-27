import { navLinks, site, socialLinks } from '@/data/site';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

export default function Footer() {
  const suppliedSocials = socialLinks.filter((item) => Boolean(item.url));

  return (
    <footer id="footer" className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <a href="#home" aria-label={`${site.badge} — Back to top`}>
            <Logo />
          </a>
          <p className={styles.about}>{site.fullName}</p>
          <p className={styles.about}>{site.institute}</p>
          <p className={styles.taglineBadge}>{site.tagline}</p>
        </div>

        <nav aria-label="Footer quick links">
          <p className="hud-label">Quick Links</p>
          <ul role="list" className={styles.list}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="hud-label">Social Channels</p>
          {suppliedSocials.length > 0 ? (
            <ul role="list" className={styles.list}>
              {suppliedSocials.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <ul role="list" className={styles.list}>
              {socialLinks.map((social) => (
                <li key={social.id} className={styles.pendingItem}>
                  <span>{social.label}</span>
                  <span className={styles.pendingBadge}>URL TBA</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="hud-label">Contact (Placeholders)</p>
          <dl className={styles.contactList}>
            <div>
              <dt>Email</dt>
              <dd>{site.contactPlaceholders.email}</dd>
            </div>
            <div>
              <dt>Campus</dt>
              <dd>{site.contactPlaceholders.location}</dd>
            </div>
            <div>
              <dt>Coordination</dt>
              <dd>{site.contactPlaceholders.facultyCoordinator}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © {site.year} {site.fullName}. All rights reserved.
        </span>
        <a href="#home" className={styles.backToTop}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
