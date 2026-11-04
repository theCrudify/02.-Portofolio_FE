/*
 * Admin form definitions. Field names match the API payloads (src/validators/content.ts in the
 * backend): lookup fields hold master-data ids, references hold ids of other resources, and
 * repeaters are child collections saved together with the parent.
 */

export type AdminResourceKey =
  | 'organizations'
  | 'experiences'
  | 'projects'
  | 'technologies'
  | 'education'
  | 'certifications'
  | 'activities'
  | 'achievements'
  | 'publications'
  | 'testimonials';

type Row = Record<string, unknown>;

export interface ResourceFieldDef {
  name: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'bilingual_text'
    | 'bilingual_textarea'
    | 'date'
    | 'url'
    | 'number'
    | 'checkbox'
    | 'lookup'
    | 'reference'
    | 'media'
    | 'repeater';
  nameId?: string;
  nameEn?: string;
  required?: boolean;
  help?: string;
  /** lookup: master-data group code */
  group?: string;
  /** reference: admin resource to pick from, and how to label its rows */
  resource?: string;
  optionLabel?: (row: Row) => string;
  /** media: which kinds the picker lists */
  mediaKind?: 'image' | 'video' | 'document' | 'any';
  /** repeater: fields of each row */
  itemFields?: ResourceFieldDef[];
}

export interface AdminResourceMeta {
  key: AdminResourceKey;
  title: string;
  description: string;
  primaryColumn: string;
  secondaryColumn?: string;
  fields: ResourceFieldDef[];
}

const text = (name: string, label: string, required = false): ResourceFieldDef => ({
  name,
  label,
  type: 'text',
  required,
});
const bi = (
  base: string,
  label: string,
  opts: { multiline?: boolean; required?: boolean } = {},
): ResourceFieldDef => ({
  name: base,
  nameEn: `${base}En`,
  nameId: `${base}Id`,
  label,
  type: opts.multiline ? 'bilingual_textarea' : 'bilingual_text',
  required: opts.required,
});
const lookup = (name: string, label: string, group: string, required = true): ResourceFieldDef => ({
  name,
  label,
  type: 'lookup',
  group,
  required,
});
const organization = (name: string, label: string, required = true): ResourceFieldDef => ({
  name,
  label,
  type: 'reference',
  resource: 'organizations',
  optionLabel: (row) => String(row.name),
  required,
});
const media = (
  name: string,
  label: string,
  mediaKind: 'image' | 'video' | 'document' | 'any' = 'image',
) => ({
  name,
  label,
  type: 'media' as const,
  mediaKind,
});
const bullets = (name: string, label: string, help?: string): ResourceFieldDef => ({
  name,
  label,
  type: 'repeater',
  help,
  itemFields: [{ ...bi('text', 'Text', { multiline: true, required: true }) }],
});
const sortOrder: ResourceFieldDef = { name: 'sortOrder', label: 'Sort order', type: 'number' };

const experienceLabel = (row: Row) =>
  `${String(row.roleEn ?? '')} · ${String(row.startDate ?? '')}${row.endDate ? ` – ${String(row.endDate)}` : ''}`;

export const ADMIN_RESOURCES: Record<AdminResourceKey, AdminResourceMeta> = {
  organizations: {
    key: 'organizations',
    title: 'Organizations',
    description: 'Companies, clients, campuses, certificate issuers and communities — linked from everywhere else.',
    primaryColumn: 'name',
    secondaryColumn: 'slug',
    fields: [
      text('name', 'Name', true),
      text('slug', 'Slug', true),
      lookup('typeId', 'Type', 'organization_type'),
      media('logoMediaId', 'Logo'),
      { name: 'websiteUrl', label: 'Website', type: 'url' },
      text('location', 'Location'),
      bi('description', 'Description', { multiline: true }),
      {
        name: 'isConfidential',
        label: 'Confidential (hide logo and website publicly)',
        type: 'checkbox',
      },
      sortOrder,
    ],
  },
  experiences: {
    key: 'experiences',
    title: 'Experience',
    description: 'Positions at organizations: job description, achievements and the projects done there.',
    primaryColumn: 'roleEn',
    secondaryColumn: 'startDate',
    fields: [
      organization('organizationId', 'Organization'),
      bi('role', 'Role / position', { required: true }),
      lookup('employmentTypeId', 'Employment type', 'employment_type'),
      lookup('workModeId', 'Work mode', 'work_mode', false),
      text('location', 'Location'),
      { name: 'startDate', label: 'Start date', type: 'date', required: true },
      { name: 'endDate', label: 'End date (empty = current)', type: 'date' },
      bi('description', 'Description', { multiline: true }),
      bullets('responsibilities', 'Job description (responsibilities)'),
      bullets('achievements', 'Achievements'),
      {
        name: 'projects',
        label: 'Projects in this position',
        type: 'repeater',
        itemFields: [
          {
            name: 'projectId',
            label: 'Project',
            type: 'reference',
            resource: 'projects',
            optionLabel: (row) => String(row.titleEn),
            required: true,
          },
        ],
      },
      {
        name: 'technologies',
        label: 'Technologies used',
        type: 'repeater',
        itemFields: [
          {
            name: 'technologyId',
            label: 'Technology',
            type: 'reference',
            resource: 'technologies',
            optionLabel: (row) => String(row.name),
            required: true,
          },
        ],
      },
      sortOrder,
    ],
  },
  projects: {
    key: 'projects',
    title: 'Projects',
    description: 'Case studies with job description, repos, documents and the positions they belong to.',
    primaryColumn: 'titleEn',
    secondaryColumn: 'slug',
    fields: [
      text('slug', 'Slug', true),
      bi('title', 'Title', { required: true }),
      bi('summary', 'Summary', { multiline: true, required: true }),
      lookup('typeId', 'Type', 'project_type'),
      lookup('stateId', 'State', 'project_state'),
      {
        name: 'experiences',
        label: 'Positions (company) this project belongs to',
        type: 'repeater',
        itemFields: [
          {
            name: 'experienceId',
            label: 'Position',
            type: 'reference',
            resource: 'experiences',
            optionLabel: experienceLabel,
            required: true,
          },
        ],
      },
      organization('clientOrganizationId', 'Client', false),
      bi('role', 'Your role'),
      { name: 'teamSize', label: 'Team size', type: 'number' },
      { name: 'periodStart', label: 'Start date', type: 'date' },
      { name: 'periodEnd', label: 'End date', type: 'date' },
      bullets('responsibilities', 'Job description (responsibilities)', 'Usually several — one per row.'),
      bi('problem', 'Problem', { multiline: true }),
      bi('solution', 'Solution', { multiline: true }),
      bi('result', 'Result', { multiline: true }),
      bi('challenges', 'Challenges', { multiline: true }),
      bullets('highlights', 'Highlights'),
      {
        name: 'metrics',
        label: 'Metrics',
        type: 'repeater',
        itemFields: [bi('label', 'Label', { required: true }), text('value', 'Value', true)],
      },
      {
        name: 'links',
        label: 'Links (repos FE / BE / integration services, demo, docs, slides…)',
        type: 'repeater',
        itemFields: [
          lookup('typeId', 'Type', 'link_type'),
          text('label', 'Label', true),
          { name: 'url', label: 'URL (empty if private)', type: 'url' },
          { name: 'isPrivate', label: 'Private', type: 'checkbox' },
        ],
      },
      {
        name: 'technologies',
        label: 'Tech stack',
        type: 'repeater',
        itemFields: [
          {
            name: 'technologyId',
            label: 'Technology',
            type: 'reference',
            resource: 'technologies',
            optionLabel: (row) => String(row.name),
            required: true,
          },
          lookup('groupId', 'Group', 'tech_group'),
        ],
      },
      media('coverMediaId', 'Cover image'),
      media('architectureMediaId', 'Architecture diagram'),
      {
        name: 'media',
        label: 'Gallery, documentation, PDFs & slides',
        type: 'repeater',
        itemFields: [
          media('mediaId', 'File (image, PDF or slides)', 'any'),
          lookup('roleId', 'Shown as', 'project_media_role'),
          bi('caption', 'Caption'),
        ],
      },
      { name: 'featured', label: 'Featured on home page', type: 'checkbox' },
      bi('metaTitle', 'SEO title'),
      bi('metaDescription', 'SEO description', { multiline: true }),
      sortOrder,
    ],
  },
  technologies: {
    key: 'technologies',
    title: 'Technologies',
    description: 'Skills shown on the home page and attached to projects and positions.',
    primaryColumn: 'name',
    secondaryColumn: 'slug',
    fields: [
      text('name', 'Name', true),
      text('slug', 'Slug', true),
      lookup('categoryId', 'Category', 'tech_category'),
      { name: 'icon', label: 'Icon (simple-icons slug or URL)', type: 'text' },
      { name: 'showOnSkills', label: 'Show in Skills section', type: 'checkbox' },
      sortOrder,
    ],
  },
  education: {
    key: 'education',
    title: 'Education',
    description: 'Degrees and their activities.',
    primaryColumn: 'degree',
    secondaryColumn: 'startDate',
    fields: [
      organization('organizationId', 'Institution'),
      text('degree', 'Degree'),
      bi('field', 'Field of study'),
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      text('gpa', 'GPA'),
      text('gpaScale', 'GPA scale'),
      bi('description', 'Description', { multiline: true }),
      bullets('activities', 'Activities'),
      sortOrder,
    ],
  },
  certifications: {
    key: 'certifications',
    title: 'Certifications',
    description: 'Certificates, courses and trainings.',
    primaryColumn: 'name',
    secondaryColumn: 'issueDate',
    fields: [
      text('name', 'Name', true),
      lookup('typeId', 'Type', 'cert_type'),
      organization('issuerOrganizationId', 'Issuer'),
      { name: 'issueDate', label: 'Issue date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      text('credentialId', 'Credential ID'),
      { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
      media('imageMediaId', 'Certificate image'),
      { name: 'featured', label: 'Featured on home page', type: 'checkbox' },
      sortOrder,
    ],
  },
  activities: {
    key: 'activities',
    title: 'Activities',
    description: 'Organizations, committees and volunteering.',
    primaryColumn: 'roleEn',
    secondaryColumn: 'eventName',
    fields: [
      lookup('typeId', 'Type', 'activity_type'),
      organization('organizationId', 'Organization'),
      text('eventName', 'Event'),
      bi('role', 'Role', { required: true }),
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      bi('description', 'Description', { multiline: true }),
      bullets('achievements', 'Achievements'),
      media('mediaId', 'Photo'),
      { name: 'linkUrl', label: 'Link', type: 'url' },
      sortOrder,
    ],
  },
  achievements: {
    key: 'achievements',
    title: 'Achievements',
    description: 'Awards and competitions.',
    primaryColumn: 'titleEn',
    secondaryColumn: 'rank',
    fields: [
      bi('title', 'Title', { required: true }),
      organization('issuerOrganizationId', 'Organizer', false),
      text('eventName', 'Event'),
      text('rank', 'Rank'),
      { name: 'date', label: 'Date', type: 'date' },
      bi('description', 'Description', { multiline: true }),
      media('certificateMediaId', 'Certificate'),
      { name: 'linkUrl', label: 'Link', type: 'url' },
      sortOrder,
    ],
  },
  publications: {
    key: 'publications',
    title: 'Publications',
    description: 'Articles, papers and talks.',
    primaryColumn: 'title',
    secondaryColumn: 'venue',
    fields: [
      lookup('typeId', 'Type', 'publication_type'),
      text('title', 'Title', true),
      text('venue', 'Venue'),
      { name: 'date', label: 'Date', type: 'date' },
      bi('summary', 'Summary', { multiline: true }),
      { name: 'url', label: 'URL', type: 'url' },
      media('videoMediaId', 'Video', 'video'),
      sortOrder,
    ],
  },
  testimonials: {
    key: 'testimonials',
    title: 'Testimonials',
    description: 'Quotes from people you worked with.',
    primaryColumn: 'name',
    secondaryColumn: 'position',
    fields: [
      text('name', 'Name', true),
      text('position', 'Position'),
      organization('organizationId', 'Organization', false),
      text('relationship', 'Relationship'),
      bi('quote', 'Quote', { multiline: true, required: true }),
      media('avatarMediaId', 'Photo'),
      { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
      sortOrder,
    ],
  },
};
