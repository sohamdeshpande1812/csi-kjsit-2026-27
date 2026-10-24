/**
 * CSI KJSIT 2026 — Four core divisions and editable member directories.
 *
 * IMPORTANT:
 * - No real student names, photographs, or personal social profiles are fabricated.
 * - Populate `members` inside each division once official 2026 council data is confirmed.
 *
 * HOW TO UPDATE:
 * - Edit `rawDivisions` below. Each member entry supports:
 *   - `id`          (string)      Unique member identifier
 *   - `name`        (string)      Full name (or `'Member Name Placeholder'`)
 *   - `designation` (string)      Role/designation (also aliased as `role`, e.g. `'Technical Head'`)
 *   - `tier`        (string)      `'lead'` | `'core'` (used by the directory role filter)
 *   - `year`        (string)      Academic year & branch (or `'Academic Year TBA'`)
 *   - `photoUrl`    (string|null) Path under `/images/team/...` (also aliased as `photo`). Leave `null` for placeholder.
 *   - `socialUrl`   (string|null) Optional primary profile URL (`https://...`). Leave `null` until supplied.
 *   - `socials`     (object)      Optional map `{ linkedin?: string|null, github?: string|null, website?: string|null }`
 */

export function hasValidSocialUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || /^tba$/i.test(trimmed)) return false;
  return /^https?:\/\/.+/i.test(trimmed);
}

const rawDivisions = [
  {
    id: 'tech',
    code: 'DIV 01',
    title: 'Tech',
    fullName: 'Technical Division',
    emblemType: 'tech',
    description:
      'Architects of the chapter’s software platforms, web experiences, technical workshops, and open-source repositories.',
    focusAreas: [
      'Full-stack web & interactive 3D engineering',
      'Workshop curriculum & technical labs',
      'Code reviews, infrastructure & tooling',
    ],
    members: [
      {
        id: 'tech-lead-1',
        name: 'Member Name Placeholder',
        designation: 'Technical Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, github: null },
      },
      {
        id: 'tech-lead-2',
        name: 'Member Name Placeholder',
        designation: 'Joint Technical Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, github: null },
      },
      {
        id: 'tech-member-1',
        name: 'Member Name Placeholder',
        designation: 'Core Technical Member (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, github: null },
      },
      {
        id: 'tech-member-2',
        name: 'Member Name Placeholder',
        designation: 'Core Technical Member (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, github: null },
      },
    ],
  },
  {
    id: 'dcc',
    code: 'DIV 02',
    title: 'DCC',
    fullName: 'Design & Content Creation',
    emblemType: 'dcc',
    description:
      'Shapes the visual identity, UI/UX systems, event branding, motion graphics, and editorial voice of CSI KJSIT.',
    focusAreas: [
      'Brand identity & visual design systems',
      'Digital media, 3D assets & event creatives',
      'Technical copywriting & documentation',
    ],
    members: [
      {
        id: 'dcc-lead-1',
        name: 'Member Name Placeholder',
        designation: 'DCC Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, website: null },
      },
      {
        id: 'dcc-lead-2',
        name: 'Member Name Placeholder',
        designation: 'Joint DCC Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, website: null },
      },
      {
        id: 'dcc-member-1',
        name: 'Member Name Placeholder',
        designation: 'Design & Media Member (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, website: null },
      },
      {
        id: 'dcc-member-2',
        name: 'Member Name Placeholder',
        designation: 'Content & Editorial Member (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null, website: null },
      },
    ],
  },
  {
    id: 'operations',
    code: 'DIV 03',
    title: 'Operations',
    fullName: 'Operations & Logistics',
    emblemType: 'operations',
    description:
      'Coordinates end-to-end event execution, scheduling, venue logistics, resource planning, and chapter administration.',
    focusAreas: [
      'Event operations & on-ground execution',
      'Resource & schedule coordination',
      'Documentation, permissions & compliance',
    ],
    members: [
      {
        id: 'ops-lead-1',
        name: 'Member Name Placeholder',
        designation: 'Operations Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
      {
        id: 'ops-lead-2',
        name: 'Member Name Placeholder',
        designation: 'Joint Operations Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
      {
        id: 'ops-member-1',
        name: 'Member Name Placeholder',
        designation: 'Operations Coordinator (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
      {
        id: 'ops-member-2',
        name: 'Member Name Placeholder',
        designation: 'Logistics Coordinator (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
    ],
  },
  {
    id: 'pr',
    code: 'DIV 04',
    title: 'PR',
    fullName: 'Public Relations & Outreach',
    emblemType: 'pr',
    description:
      'Builds relationships with industry speakers, sponsors, partner chapters, and the student body across KJSIT.',
    focusAreas: [
      'Speaker & industry guest relations',
      'Sponsorship & institutional outreach',
      'Community announcements & student engagement',
    ],
    members: [
      {
        id: 'pr-lead-1',
        name: 'Member Name Placeholder',
        designation: 'PR & Outreach Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
      {
        id: 'pr-lead-2',
        name: 'Member Name Placeholder',
        designation: 'Joint PR Head (Placeholder)',
        tier: 'lead',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
      {
        id: 'pr-member-1',
        name: 'Member Name Placeholder',
        designation: 'Outreach Member (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
      {
        id: 'pr-member-2',
        name: 'Member Name Placeholder',
        designation: 'Communications Member (Placeholder)',
        tier: 'core',
        year: 'Academic Year TBA',
        photoUrl: null,
        socialUrl: null,
        socials: { linkedin: null },
      },
    ],
  },
];

// Export normalized structure so both `description`/`shortDescription` and `designation`/`role` work everywhere.
export const teamDivisions = rawDivisions.map((division) => ({
  ...division,
  shortDescription: division.description,
  members: (division.members || []).map((member) => ({
    ...member,
    role: member.designation ?? member.role,
    designation: member.designation ?? member.role,
    photoUrl: member.photoUrl ?? member.photo ?? null,
  })),
}));
