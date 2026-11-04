import type { ResourceFieldDef } from '@/lib/admin/resources';

/** Profile (single row) — field names match the API payload. */
export const PROFILE_FIELDS: ResourceFieldDef[] = [
  { name: 'name', label: 'Full name', type: 'text', required: true },
  { name: 'headline', nameEn: 'headlineEn', nameId: 'headlineId', label: 'Headline', type: 'bilingual_text', required: true },
  { name: 'bio', nameEn: 'bioEn', nameId: 'bioId', label: 'Bio', type: 'bilingual_textarea', required: true },
  { name: 'avatarMediaId', label: 'Photo', type: 'media', mediaKind: 'image' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'timezone', label: 'Timezone', type: 'text', required: true },
  { name: 'email', label: 'Public email', type: 'text' },
  { name: 'availabilityId', label: 'Availability', type: 'lookup', group: 'availability', required: true },
  { name: 'workPreferenceId', label: 'Work preference', type: 'lookup', group: 'work_mode', required: true },
  { name: 'careerStartDate', label: 'Career start (for years of experience)', type: 'date' },
  {
    name: 'referencesNote',
    nameEn: 'referencesNoteEn',
    nameId: 'referencesNoteId',
    label: 'References note',
    type: 'bilingual_text',
  },
  {
    name: 'socials',
    label: 'Social links',
    type: 'repeater',
    itemFields: [
      { name: 'platformId', label: 'Platform', type: 'lookup', group: 'social_platform', required: true },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'handle', label: 'Handle', type: 'text' },
    ],
  },
  {
    name: 'languages',
    label: 'Languages',
    type: 'repeater',
    itemFields: [
      { name: 'name', nameEn: 'nameEn', nameId: 'nameId', label: 'Language', type: 'bilingual_text', required: true },
      { name: 'levelId', label: 'Level', type: 'lookup', group: 'language_level', required: true },
    ],
  },
  {
    name: 'interests',
    label: 'Interests',
    type: 'repeater',
    itemFields: [
      { name: 'label', nameEn: 'labelEn', nameId: 'labelId', label: 'Interest', type: 'bilingual_text', required: true },
      { name: 'icon', label: 'Icon (lucide name)', type: 'text' },
    ],
  },
];

/** Site settings owned by the Appearance page. */
export const APPEARANCE_FIELDS: ResourceFieldDef[] = [
  { name: 'themePresetId', label: 'Theme preset', type: 'lookup', group: 'theme_preset', required: true },
  { name: 'colorModeId', label: 'Default color mode', type: 'lookup', group: 'color_mode', required: true },
  { name: 'fontPairId', label: 'Font pair', type: 'lookup', group: 'font_pair', required: true },
  { name: 'heroCvButtonsId', label: 'Hero CV buttons', type: 'lookup', group: 'hero_cv_buttons', required: true },
  {
    name: 'sections',
    label: 'Home page sections (order and visibility)',
    help: 'Use the arrows to reorder. Unchecked sections are hidden.',
    type: 'repeater',
    itemFields: [
      { name: 'sectionId', label: 'Section', type: 'lookup', group: 'site_section', required: true },
      { name: 'isVisible', label: 'Visible', type: 'checkbox' },
    ],
  },
];

/** Site settings owned by the SEO page. */
export const SEO_FIELDS: ResourceFieldDef[] = [
  { name: 'seoTitle', nameEn: 'seoTitleEn', nameId: 'seoTitleId', label: 'Site title', type: 'bilingual_text' },
  {
    name: 'seoDescription',
    nameEn: 'seoDescriptionEn',
    nameId: 'seoDescriptionId',
    label: 'Site description',
    type: 'bilingual_textarea',
  },
  { name: 'ogMediaId', label: 'Social share image', type: 'media', mediaKind: 'image' },
];
