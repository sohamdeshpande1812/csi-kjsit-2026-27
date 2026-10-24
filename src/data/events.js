/**
 * Central Event Catalogue for CSI KJSIT 2026.
 *
 * HOW TO UPDATE:
 * - Edit or append objects in `eventsList` below. No component code changes are required.
 * - Each event supports:
 *   - `id`              (string)  Unique identifier
 *   - `code`            (string)  HUD index tag, e.g. 'EVT-01'
 *   - `name`            (string)  Event name (also aliased as `title` for compatibility)
 *   - `category`        (string)  'Workshop' | 'Flagship' | 'Competition' | 'Seminar'
 *   - `date`            (string)  Confirmed date or 'Date TBA' placeholder
 *   - `status`          (string)  Current status badge, e.g. 'Upcoming Placeholder', 'Registration Open'
 *   - `venue`           (string)  Location or 'Venue TBA'
 *   - `mode`            (string)  Delivery format or 'Format TBA'
 *   - `image`           (string|null) Path under `/images/events/...` or `null` for schematic placeholder
 *   - `description`     (string)  Short summary shown on the card and modal
 *   - `highlights`      (string[]) Bullet points shown inside the Event Details modal
 *   - `prerequisites`   (string)  Tools/eligibility note or placeholder
 *   - `registrationUrl` (string|null) Official registration URL (`https://...`). Leave `null` until live;
 *                                     the UI automatically hides registration buttons when `null`.
 *   - `registrationNote`(string)  Status explanation shown when `registrationUrl` is not yet active
 */

export const eventCategories = ['All', 'Workshop', 'Flagship', 'Competition', 'Seminar'];

/**
 * Returns true ONLY when a real external or absolute registration URL is provided.
 * Prevents rendering dead or placeholder registration buttons.
 *
 * @param {string | null | undefined} url
 * @returns {boolean}
 */
export function hasValidRegistrationUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || /^tba$/i.test(trimmed)) return false;
  return /^https?:\/\/.+/i.test(trimmed);
}

const rawEvents = [
  {
    id: 'event-slot-01',
    code: 'EVT-01',
    name: 'Technical Workshop — Placeholder 01',
    category: 'Workshop',
    date: 'Date TBA · Schedule Placeholder',
    status: 'Upcoming Placeholder',
    venue: 'Venue TBA (KJSIT Campus / Lab)',
    mode: 'Hands-On Lab · Format TBA',
    image: null, // Supply '/images/events/...' when official artwork is confirmed
    registrationUrl: null, // Supply 'https://...' when registration opens
    description:
      'Placeholder entry for an upcoming hands-on CSI KJSIT technical workshop. Official topic, prerequisites, speaker details, and schedule will be published here.',
    highlights: [
      'Hands-on technical session (Topic TBA)',
      'Guided lab exercises and starter repository walkthrough',
      'Open to student members and registered participants',
    ],
    prerequisites: 'Laptop & setup instructions TBA upon topic announcement.',
    registrationNote:
      'Registration button will appear automatically once an official registration URL is supplied in src/data/events.js.',
  },
  {
    id: 'event-slot-02',
    code: 'EVT-02',
    name: 'Flagship Hackathon / Symposium — Placeholder 02',
    category: 'Flagship',
    date: 'Date TBA · Schedule Placeholder',
    status: 'Planning Phase',
    venue: 'Venue TBA (KJSIT Campus)',
    mode: 'Team Build · Format TBA',
    image: null,
    registrationUrl: null,
    description:
      'Placeholder entry for CSI KJSIT’s flagship technical event. Problem statements, tracks, judging criteria, and timelines will replace this placeholder.',
    highlights: [
      'Multi-track engineering challenge (Tracks TBA)',
      'Mentorship checkpoints and technical evaluations',
      'Team size and submission parameters to be announced',
    ],
    prerequisites: 'Team formation guidelines and eligibility criteria TBA.',
    registrationNote:
      'Team registration portal will be enabled here upon official council release.',
  },
  {
    id: 'event-slot-03',
    code: 'EVT-03',
    name: 'Algorithmic & Coding Challenge — Placeholder 03',
    category: 'Competition',
    date: 'Date TBA · Schedule Placeholder',
    status: 'Upcoming Placeholder',
    venue: 'Venue TBA (Computer Labs / Online)',
    mode: 'Timed Contest · Format TBA',
    image: null,
    registrationUrl: null,
    description:
      'Placeholder entry for a competitive programming or debugging contest hosted by CSI KJSIT. Platform details, round structure, and rules are pending confirmation.',
    highlights: [
      'Structured algorithmic and debugging problem sets',
      'Individual or pair participation (Format TBA)',
      'Post-contest editorial and solution walkthrough',
    ],
    prerequisites: 'Supported programming languages and contest platform TBA.',
    registrationNote:
      'Contest platform link and registration button will be activated once finalised.',
  },
  {
    id: 'event-slot-04',
    code: 'EVT-04',
    name: 'Industry & Alumni Tech Talk — Placeholder 04',
    category: 'Seminar',
    date: 'Date TBA · Schedule Placeholder',
    status: 'Speaker TBA',
    venue: 'Auditorium / Seminar Hall TBA',
    mode: 'Interactive Keynote · Format TBA',
    image: null,
    registrationUrl: null,
    description:
      'Placeholder entry for an interactive seminar on software engineering, systems architecture, or emerging research. Speaker biography and session abstract will be added here.',
    highlights: [
      'Technical keynote and real-world architecture insights',
      'Live Q&A and career pathway discussion with students',
      'Session resource notes and reference links (if applicable)',
    ],
    prerequisites: 'Open to all KJSIT students; seat reservation details TBA.',
    registrationNote:
      'Seat reservation link will be published ahead of the confirmed session date.',
  },
];

// Export normalized list so both `name`/`title` and `date`/`dateStatus` and `status`/`statusBadge` work seamlessly.
export const eventsList = rawEvents.map((item) => ({
  ...item,
  title: item.name,
  dateStatus: item.date,
  statusBadge: item.status,
}));
