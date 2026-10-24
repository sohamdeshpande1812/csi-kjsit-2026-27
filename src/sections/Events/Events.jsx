import { useCallback, useRef, useState } from 'react';
import { eventCategories, eventsList, hasValidRegistrationUrl } from '@/data/events';
import { gsap, useGSAP } from '@/animations/gsap';
import { Button, Modal, SectionHeading } from '@/components/ui';
import { CybertronBackground } from '@/components/layout';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './Events.module.css';

function EventCategoryEmblem({ category, className }) {
  switch (category) {
    case 'Workshop':
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <polygon
            points="22,3 39,12.5 39,31.5 22,41 5,31.5 5,12.5"
            fill="rgba(255, 114, 31, 0.16)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 17l-4 5 4 5M28 17l4 5-4 5M24 15l-4 14"
            fill="none"
            stroke="#ff9a2e"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Flagship':
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <polygon
            points="22,3 41,22 22,41 3,22"
            fill="rgba(255, 114, 31, 0.22)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <polygon
            points="22,10 34,22 22,34 10,22"
            fill="none"
            stroke="#ffc145"
            strokeWidth="1.5"
          />
          <circle cx="22" cy="22" r="4" fill="#ff7315" />
        </svg>
      );
    case 'Competition':
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <circle
            cx="22"
            cy="22"
            r="17"
            fill="rgba(59, 130, 246, 0.14)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          <polygon
            points="22,10 32,27 12,27"
            fill="rgba(255, 154, 46, 0.2)"
            stroke="#ff9a2e"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="22" r="2.8" fill="#ffc145" />
        </svg>
      );
    case 'Seminar':
    default:
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <polygon
            points="22,4 38,13 38,31 22,40 6,31 6,13"
            fill="rgba(255, 114, 31, 0.14)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="22" cy="22" r="5.5" fill="none" stroke="#ff9a2e" strokeWidth="1.6" />
          <circle cx="22" cy="22" r="2.2" fill="#68b5ff" />
          <path
            d="M13 16a12 12 0 0 0 0 12M31 16a12 12 0 0 1 0 12"
            fill="none"
            stroke="#dfe6f2"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

/**
 * Custom multi-layered sci-fi mechanical artwork banner for each event category
 * so every showcase card has a distinct, cinematic visual identity.
 */
function EventBannerArtwork({ eventItem }) {
  const { category, code } = eventItem;

  return (
    <div className={`${styles.bannerArt} ${styles[`banner${category}`] || ''}`} aria-hidden="true">
      <svg viewBox="0 0 600 240" className={styles.bannerSvg} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`steel-${code}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dfe6f2" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#7a889e" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ff7315" stopOpacity="0.24" />
          </linearGradient>
          <radialGradient id={`core-${code}`} cx="72%" cy="46%" r="55%">
            <stop offset="0%" stopColor="#ff8a24" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#ff6214" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#12161f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient energy flare */}
        <rect width="600" height="240" fill={`url(#core-${code})`} />

        {/* Architectural angled gantry lines */}
        <path
          d="M-20 210 L180 30 L390 30 L210 210 Z"
          fill={`url(#steel-${code})`}
        />
        <line x1="60" y1="0" x2="240" y2="240" stroke="rgba(226,232,242,0.14)" strokeWidth="1.5" />
        <line x1="480" y1="0" x2="340" y2="240" stroke="rgba(255,154,46,0.22)" strokeWidth="1.5" />

        {category === 'Flagship' && (
          <g transform="translate(420, 120)">
            <polygon
              points="0,-82 71,-41 71,41 0,82 -71,41 -71,-41"
              fill="rgba(20, 25, 35, 0.72)"
              stroke="#ff9a2e"
              strokeWidth="2"
            />
            <polygon
              points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29"
              fill="rgba(255, 114, 31, 0.18)"
              stroke="#e5ecf6"
              strokeWidth="1.5"
            />
            <polygon
              points="0,-32 32,0 0,32 -32,0"
              fill="rgba(255, 193, 69, 0.28)"
              stroke="#ffc145"
              strokeWidth="2"
            />
            <circle cx="0" cy="0" r="10" fill="#ffc145" />
          </g>
        )}

        {category === 'Workshop' && (
          <g transform="translate(425, 120)">
            <circle
              cx="0"
              cy="0"
              r="74"
              fill="rgba(18, 23, 33, 0.65)"
              stroke="#c8d3e3"
              strokeWidth="1.8"
              strokeDasharray="14 6"
            />
            <polygon
              points="0,-54 47,-27 47,27 0,54 -47,27 -47,-27"
              fill="rgba(255, 114, 31, 0.16)"
              stroke="#ff9a2e"
              strokeWidth="1.8"
            />
            <path
              d="M-20 -14 L-34 0 L-20 14 M20 -14 L34 0 L20 14 M8 -22 L-8 22"
              fill="none"
              stroke="#ffc145"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {category === 'Competition' && (
          <g transform="translate(425, 120)">
            <polygon
              points="0,-76 76,0 0,76 -76,0"
              fill="rgba(18, 23, 33, 0.7)"
              stroke="#dfe6f2"
              strokeWidth="1.8"
            />
            <circle
              cx="0"
              cy="0"
              r="46"
              fill="rgba(255, 114, 31, 0.16)"
              stroke="#ff9a2e"
              strokeWidth="2"
            />
            <polygon
              points="0,-28 26,18 -26,18"
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#68b5ff"
              strokeWidth="2"
            />
            <circle cx="0" cy="4" r="6" fill="#ffc145" />
          </g>
        )}

        {category === 'Seminar' && (
          <g transform="translate(425, 120)">
            <circle
              cx="0"
              cy="0"
              r="72"
              fill="rgba(18, 23, 33, 0.65)"
              stroke="rgba(226, 232, 242, 0.45)"
              strokeWidth="1.6"
            />
            <circle
              cx="0"
              cy="0"
              r="48"
              fill="none"
              stroke="#ff9a2e"
              strokeWidth="1.8"
              strokeDasharray="10 6"
            />
            <circle cx="0" cy="0" r="22" fill="rgba(255, 114, 31, 0.24)" stroke="#ffc145" strokeWidth="2" />
            <circle cx="0" cy="0" r="7" fill="#68b5ff" />
          </g>
        )}
      </svg>

      <div className={styles.bannerOverlayContent}>
        <span className={styles.bannerCode}>{eventItem.code}</span>
        <span className={styles.bannerMode}>{eventItem.mode || 'KJSIT Campus'}</span>
      </div>
    </div>
  );
}

function EventMedia({ eventItem, onSelect }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(eventItem.image) && !imgError;

  return (
    <div
      className={styles.media}
      onClick={() => onSelect(eventItem)}
      role="presentation"
    >
      <div className={styles.mediaInner}>
        {showImage ? (
          <>
            {!imgLoaded && (
              <div className={styles.mediaLoading} aria-hidden="true">
                <span className="hud-label">Loading Artwork…</span>
              </div>
            )}
            <img
              src={eventItem.image}
              alt={eventItem.name}
              className={`${styles.image} ${imgLoaded ? styles.imageReady : ''}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <EventBannerArtwork eventItem={eventItem} />
        )}
      </div>

      <span className={styles.categoryBadge}>{eventItem.category}</span>
      <span className={styles.statusOverlayBadge}>{eventItem.status}</span>
    </div>
  );
}

export default function Events() {
  const ref = useScrollReveal();
  const hasMountedRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const visibleEvents =
    activeCategory === 'All'
      ? eventsList
      : eventsList.filter((item) => item.category === activeCategory);

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;

      try {
        const cards = gsap.utils.toArray('[data-event-card]', ref.current);
        if (!cards.length) return;

        if (hasMountedRef.current) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
          );
          return;
        }

        hasMountedRef.current = true;

        const groupSize = 2;
        for (let i = 0; i < cards.length; i += groupSize) {
          const group = cards.slice(i, i + groupSize);
          gsap.from(group, {
            opacity: 0,
            y: 26,
            duration: 0.68,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: group[0],
              start: 'top 88%',
              once: true,
            },
          });
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[Events] GSAP group reveal skipped:', err);
        }
      }
    },
    { scope: ref, dependencies: [activeCategory, reducedMotion] },
  );

  const handleCardMove = useCallback(
    (event) => {
      if (reducedMotion || event.pointerType === 'touch') return;
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rx', `${(-ny * 3.0).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(nx * 3.0).toFixed(2)}deg`);
    },
    [reducedMotion],
  );

  const handleCardLeave = useCallback((event) => {
    const card = event.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }, []);

  const selectedIndex = selectedEvent
    ? eventsList.findIndex((item) => item.id === selectedEvent.id)
    : -1;

  const handleStepEvent = (delta) => {
    if (selectedIndex < 0 || eventsList.length === 0) return;
    const nextIndex = (selectedIndex + delta + eventsList.length) % eventsList.length;
    setSelectedEvent(eventsList[nextIndex]);
  };

  return (
    <section
      id="events"
      ref={ref}
      className={`section ${styles.events}`}
      aria-labelledby="events-title"
    >
      <CybertronBackground variant="light" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.topRow}>
          <SectionHeading
            index="02"
            tone="light"
            eyebrow="Events Showcase"
            title={<span id="events-title">Technical Events &amp; Workshops.</span>}
            lead="Explore flagship hackathons, hands-on workshops, competitive coding arenas, and industry seminars hosted by CSI KJSIT 2026."
          />

          <div
            className={styles.filters}
            role="tablist"
            aria-label="Filter events by category"
            data-reveal
          >
            {eventCategories.map((category) => {
              const active = activeCategory === category;
              const count =
                category === 'All'
                  ? eventsList.length
                  : eventsList.filter((e) => e.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.filterBtn} ${active ? styles.filterActive : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  <span>{category}</span>
                  <span className={styles.filterCount}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {visibleEvents.length === 0 ? (
          <div className={`${styles.emptyState} chamfer`} role="status">
            <p className="hud-label">NO MATCHING EVENTS</p>
            <p className={styles.emptyText}>
              No events are currently listed under the <strong>{activeCategory}</strong> category.
            </p>
            <Button variant="steel" onClick={() => setActiveCategory('All')}>
              Show All Events
            </Button>
          </div>
        ) : (
          <div className={styles.grid} role="list">
            {visibleEvents.map((eventItem) => {
              const canRegister = hasValidRegistrationUrl(eventItem.registrationUrl);
              const isFeatured = eventItem.category === 'Flagship';

              return (
                <article
                  key={eventItem.id}
                  role="listitem"
                  className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''} chamfer`}
                  data-event-card
                  onPointerMove={handleCardMove}
                  onPointerLeave={handleCardLeave}
                >
                  <EventMedia eventItem={eventItem} onSelect={setSelectedEvent} />

                  <div className={styles.cardBody}>
                    <div className={styles.statusRow}>
                      <span className={styles.dateStatus}>{eventItem.date}</span>
                      <span className={styles.venueBadge}>{eventItem.venue}</span>
                    </div>

                    <h3 className={styles.cardTitle}>
                      <button
                        type="button"
                        className={styles.titleTrigger}
                        onClick={() => setSelectedEvent(eventItem)}
                        aria-haspopup="dialog"
                      >
                        {eventItem.name}
                      </button>
                    </h3>

                    <p className={styles.cardDesc}>{eventItem.description}</p>

                    <div className={styles.cardFooter}>
                      <span className={styles.formatTag}>
                        {eventItem.mode || 'In-Person · KJSIT'}
                      </span>

                      <div className={styles.cardActions}>
                        <Button
                          variant={isFeatured ? 'primary' : 'steel'}
                          onClick={() => setSelectedEvent(eventItem)}
                          aria-haspopup="dialog"
                        >
                          Event Details
                        </Button>

                        {canRegister && (
                          <Button
                            href={eventItem.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Register ↗
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        titleId="event-modal-title"
        size="lg"
        eyebrow={selectedEvent ? `${selectedEvent.code} · ${selectedEvent.category}` : ''}
        title={selectedEvent ? selectedEvent.name : ''}
        headerAccessory={
          selectedEvent ? (
            <EventCategoryEmblem
              category={selectedEvent.category}
              className={styles.modalHeaderEmblem}
            />
          ) : null
        }
      >
        {selectedEvent && (
          <div className={styles.modalContent}>
            <dl className={styles.modalMeta}>
              <div>
                <dt>Date &amp; Schedule</dt>
                <dd>{selectedEvent.date}</dd>
              </div>
              <div>
                <dt>Current Status</dt>
                <dd>{selectedEvent.status}</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{selectedEvent.venue}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{selectedEvent.mode || 'Format TBA'}</dd>
              </div>
            </dl>

            <p className={styles.modalDescription}>{selectedEvent.description}</p>

            {selectedEvent.highlights?.length > 0 && (
              <div className={styles.modalSection}>
                <p className="hud-label">PLANNED HIGHLIGHTS</p>
                <ul className={styles.highlightsList}>
                  {selectedEvent.highlights.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvent.prerequisites && (
              <div className={styles.modalSection}>
                <p className="hud-label">PREREQUISITES &amp; ELIGIBILITY</p>
                <p className={styles.prereqText}>{selectedEvent.prerequisites}</p>
              </div>
            )}

            <div className={styles.registrationNotice}>
              <div>
                <p className="hud-label">REGISTRATION STATUS</p>
                <p className={styles.registrationText}>
                  {hasValidRegistrationUrl(selectedEvent.registrationUrl)
                    ? 'Official registration portal is live. Click the button to proceed to the external form.'
                    : selectedEvent.registrationNote}
                </p>
              </div>

              {hasValidRegistrationUrl(selectedEvent.registrationUrl) ? (
                <Button
                  href={selectedEvent.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now ↗
                </Button>
              ) : (
                <span className={styles.tbaPill}>Registration Link TBA</span>
              )}
            </div>

            <div className={styles.modalActions}>
              <div className={styles.stepGroup}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => handleStepEvent(-1)}
                  aria-label="View previous event"
                >
                  ← Prev Event
                </button>
                <span className={styles.stepIndicator}>
                  {selectedIndex + 1} / {eventsList.length}
                </span>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => handleStepEvent(1)}
                  aria-label="View next event"
                >
                  Next Event →
                </button>
              </div>

              <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
