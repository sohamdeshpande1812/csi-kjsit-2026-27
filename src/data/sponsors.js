/**
 * Central Sponsor & Institutional Partner Catalogue for CSI KJSIT 2026.
 *
 * IMPORTANT:
 * - Never invent sponsor names or imply that unconfirmed organisations sponsor CSI KJSIT 2026.
 * - All entries below are clearly labelled placeholders until official partnerships are confirmed.
 *
 * HOW TO UPDATE:
 * - Edit `sponsorsList` below (or `sponsorCategoryDefinitions` if adding/renaming categories).
 * - Each sponsor entry supports:
 *   - `id`          (string)      Unique identifier
 *   - `name`        (string)      Sponsor name (or placeholder title)
 *   - `category`    (string)      Category key matching `sponsorCategoryDefinitions[].id`
 *   - `sublabel`    (string)      Tier / partnership note (e.g. 'Official Title Partner' or 'Official Partner Slot — TBA')
 *   - `logo`        (string|null) Path under `/images/sponsors/...` (also aliased as `logoUrl`).
 *                                 Original proportions are preserved automatically via `object-fit: contain`.
 *   - `websiteUrl`  (string|null) Official website URL (`https://...`). Leave `null` for unconfirmed slots.
 */

export const sponsorCategoryDefinitions = [
  {
    id: 'title-tier',
    tierCode: 'TIER 01',
    tierName: 'Title & Principal Partners',
    shortLabel: 'Title & Principal',
    columns: 'large',
  },
  {
    id: 'technology-tier',
    tierCode: 'TIER 02',
    tierName: 'Technology & Platform Partners',
    shortLabel: 'Technology',
    columns: 'medium',
  },
  {
    id: 'associate-tier',
    tierCode: 'TIER 03',
    tierName: 'Associate & Community Partners',
    shortLabel: 'Associate & Community',
    columns: 'medium',
  },
];

export function hasValidWebsiteUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || /^tba$/i.test(trimmed)) return false;
  return /^https?:\/\/.+/i.test(trimmed);
}

export const sponsorsList = [
  {
    id: 'sponsor-slot-01',
    name: 'Title Sponsor Placeholder 01',
    category: 'title-tier',
    sublabel: 'Official Partner Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-02',
    name: 'Principal Partner Placeholder 02',
    category: 'title-tier',
    sublabel: 'Official Partner Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-03',
    name: 'Technology Partner Placeholder 01',
    category: 'technology-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-04',
    name: 'Platform Partner Placeholder 02',
    category: 'technology-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-05',
    name: 'Cloud / Infrastructure Placeholder 03',
    category: 'technology-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-06',
    name: 'Developer Tools Placeholder 04',
    category: 'technology-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-07',
    name: 'Associate Sponsor Placeholder 01',
    category: 'associate-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-08',
    name: 'Associate Sponsor Placeholder 02',
    category: 'associate-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-09',
    name: 'Education Partner Placeholder 03',
    category: 'associate-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
  {
    id: 'sponsor-slot-10',
    name: 'Community Partner Placeholder 04',
    category: 'associate-tier',
    sublabel: 'Partner Logo Slot — TBA',
    logo: null,
    websiteUrl: null,
  },
];

// Grouped structure derived from `sponsorCategoryDefinitions` + `sponsorsList`
export const sponsorTiers = sponsorCategoryDefinitions.map((tier) => ({
  ...tier,
  slots: sponsorsList
    .filter((item) => item.category === tier.id)
    .map((item) => ({
      ...item,
      label: item.name,
      logoUrl: item.logo ?? item.logoUrl ?? null,
    })),
}));
