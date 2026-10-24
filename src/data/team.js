/**
 * CSI KJSIT 2026 — Chapter Team Roster
 *
 * Tiers:
 * 1. CORE (11):
 *    Chairperson, Vice Chairperson, Secretary, Chief Executive Officer, Chief Technical Officer,
 *    Digital Media Officer, Public Relations Officer, Chief Marketing Officer,
 *    Joint Secretary, Joint Chief Executive Officer, Joint Public Relations Officer.
 *
 * 2. SUBCORE (5):
 *    Marketing Admins, Organising Admins, Digital Creation Admins, Public Relations Admins, Technical Admins.
 *
 * 3. MEMBERS (5):
 *    Technical Team, Organising Team, PR Team, Marketing Team, DCT Team.
 */

export function hasValidSocialUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || /^tba$/i.test(trimmed)) return false;
  return /^https?:\/\/.+/i.test(trimmed);
}

export const teamTiers = [
  { id: 'all', label: 'All', count: 21 },
  { id: 'core', label: 'Core', count: 11 },
  { id: 'subcore', label: 'Subcore', count: 5 },
  { id: 'members', label: 'Members', count: 5 },
];

export const coreMembers = [
  {
    id: 'core-chairperson',
    tier: 'core',
    role: 'Chairperson',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-vice-chairperson',
    tier: 'core',
    role: 'Vice Chairperson',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-secretary',
    tier: 'core',
    role: 'Secretary',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-ceo',
    tier: 'core',
    role: 'Chief Executive Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-cto',
    tier: 'core',
    role: 'Chief Technical Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-dmo',
    tier: 'core',
    role: 'Digital Media Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-pro',
    tier: 'core',
    role: 'Public Relations Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-cmo',
    tier: 'core',
    role: 'Chief Marketing Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-joint-secretary',
    tier: 'core',
    role: 'Joint Secretary',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-joint-ceo',
    tier: 'core',
    role: 'Joint Chief Executive Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'core-joint-pro',
    tier: 'core',
    role: 'Joint Public Relations Officer',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
];

export const subcoreMembers = [
  {
    id: 'subcore-marketing-admins',
    tier: 'subcore',
    role: 'Marketing Admins',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'subcore-organising-admins',
    tier: 'subcore',
    role: 'Organising Admins',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'subcore-digital-creation-admins',
    tier: 'subcore',
    role: 'Digital Creation Admins',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'subcore-pr-admins',
    tier: 'subcore',
    role: 'Public Relations Admins',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'subcore-technical-admins',
    tier: 'subcore',
    role: 'Technical Admins',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
];

export const generalMembers = [
  {
    id: 'members-technical-team',
    tier: 'members',
    role: 'Technical Team',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'members-organising-team',
    tier: 'members',
    role: 'Organising Team',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'members-pr-team',
    tier: 'members',
    role: 'PR Team',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'members-marketing-team',
    tier: 'members',
    role: 'Marketing Team',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
  {
    id: 'members-dct-team',
    tier: 'members',
    role: 'DCT Team',
    name: 'Name TBA',
    photoUrl: null,
    socials: { linkedin: null, github: null, instagram: null },
  },
];

export const allTeamMembers = [...coreMembers, ...subcoreMembers, ...generalMembers];
