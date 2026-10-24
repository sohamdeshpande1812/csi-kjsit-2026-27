/**
 * Site-wide branding, navigation, and contact placeholders.
 * Edit this file to update copy and official links without touching components.
 */

export const site = {
  name: 'CSI KJSIT',
  year: 2026,
  badge: 'CSI KJSIT 2026',
  fullName: 'Computer Society of India — KJSIT Student Chapter',
  institute: 'K. J. Somaiya Institute of Technology',
  tagline: 'MORE THAN MEETS THE CODE.',
  heroSupportingText:
    'Where innovation meets technology, and ideas transform into possibilities.',
  heroPrimaryCta: {
    label: 'EXPLORE EVENTS',
    href: '#events',
  },
  heroSecondaryCta: {
    label: 'ABOUT CSI',
    href: '#about',
  },
  contactPlaceholders: {
    email: 'Official chapter email — to be supplied',
    location: 'K. J. Somaiya Institute of Technology (Campus address placeholder)',
    facultyCoordinator: 'Faculty Coordinator details — to be supplied',
  },
};

/**
 * Primary navigation links.
 * Every `id` maps to a semantic section landmark on the page.
 */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'events', label: 'Events' },
  { id: 'sponsors', label: 'Sponsors' },
  { id: 'team', label: 'Team' },
];

/**
 * Social media links.
 * Set `url` to the official chapter URL once confirmed.
 * When `url` is null/empty, the UI renders an honest "URL pending" badge
 * rather than a broken or fabricated link.
 */
export const socialLinks = [
  { id: 'instagram', label: 'Instagram', url: null },
  { id: 'linkedin', label: 'LinkedIn', url: null },
  { id: 'github', label: 'GitHub', url: null },
  { id: 'x', label: 'X / Twitter', url: null },
];
