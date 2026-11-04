export type AdminResourceKey =
  | 'projects'
  | 'technologies'
  | 'experiences'
  | 'education'
  | 'certifications'
  | 'activities'
  | 'achievements'
  | 'publications'
  | 'testimonials';

export interface ResourceFieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'bilingual_text' | 'bilingual_textarea' | 'date' | 'url' | 'select' | 'checkbox' | 'bullets';
  nameId?: string;
  nameEn?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface AdminResourceMeta {
  key: AdminResourceKey;
  title: string;
  description: string;
  primaryColumn: string;
  secondaryColumn?: string;
  fields: ResourceFieldDef[];
}

export const ADMIN_RESOURCES: Record<AdminResourceKey, AdminResourceMeta> = {
  projects: {
    key: 'projects',
    title: 'Projects',
    description: 'Portfolio case studies, architecture highlights, and metrics.',
    primaryColumn: 'titleEn',
    secondaryColumn: 'category',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      {
        name: 'title',
        nameId: 'titleId',
        nameEn: 'titleEn',
        label: 'Title',
        type: 'bilingual_text',
        required: true,
      },
      {
        name: 'summary',
        nameId: 'summaryId',
        nameEn: 'summaryEn',
        label: 'Summary',
        type: 'bilingual_textarea',
        required: true,
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { value: 'web', label: 'Web' },
          { value: 'mobile', label: 'Mobile' },
          { value: 'backend', label: 'Backend' },
          { value: 'ai', label: 'AI' },
          { value: 'devops', label: 'DevOps' },
          { value: 'design', label: 'Design' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
  },
  technologies: {
    key: 'technologies',
    title: 'Technologies & Skills',
    description: 'Languages, frameworks, databases, and cloud tools.',
    primaryColumn: 'name',
    secondaryColumn: 'category',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'name', label: 'Name', type: 'text', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { value: 'language', label: 'Language' },
          { value: 'framework', label: 'Framework' },
          { value: 'database', label: 'Database' },
          { value: 'devops', label: 'DevOps' },
          { value: 'cloud', label: 'Cloud' },
          { value: 'tool', label: 'Tool' },
          { value: 'other', label: 'Other' },
        ],
      },
      { name: 'isHighlighted', label: 'Highlight on Skills Grid', type: 'checkbox' },
    ],
  },
  experiences: {
    key: 'experiences',
    title: 'Work Experiences',
    description: 'Career history, roles, and key achievements.',
    primaryColumn: 'company',
    secondaryColumn: 'roleEn',
    fields: [
      { name: 'company', label: 'Company', type: 'text', required: true },
      {
        name: 'role',
        nameId: 'roleId',
        nameEn: 'roleEn',
        label: 'Role',
        type: 'bilingual_text',
        required: true,
      },
      {
        name: 'employmentType',
        label: 'Employment Type',
        type: 'select',
        required: true,
        options: [
          { value: 'full_time', label: 'Full-Time' },
          { value: 'part_time', label: 'Part-Time' },
          { value: 'contract', label: 'Contract' },
          { value: 'freelance', label: 'Freelance' },
          { value: 'internship', label: 'Internship' },
          { value: 'self_employed', label: 'Self-Employed' },
        ],
      },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date' },
      {
        name: 'summary',
        nameId: 'summaryId',
        nameEn: 'summaryEn',
        label: 'Summary',
        type: 'bilingual_textarea',
      },
    ],
  },
  education: {
    key: 'education',
    title: 'Education',
    description: 'Academic degrees, institutions, and coursework highlights.',
    primaryColumn: 'institution',
    secondaryColumn: 'degreeEn',
    fields: [
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      {
        name: 'degree',
        nameId: 'degreeId',
        nameEn: 'degreeEn',
        label: 'Degree',
        type: 'bilingual_text',
        required: true,
      },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date' },
      { name: 'grade', label: 'Grade / GPA', type: 'text' },
    ],
  },
  certifications: {
    key: 'certifications',
    title: 'Certifications',
    description: 'Professional licenses, credentials, and expiry tracking.',
    primaryColumn: 'nameEn',
    secondaryColumn: 'issuer',
    fields: [
      {
        name: 'name',
        nameId: 'nameId',
        nameEn: 'nameEn',
        label: 'Certification Name',
        type: 'bilingual_text',
        required: true,
      },
      { name: 'issuer', label: 'Issuer', type: 'text', required: true },
      { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { name: 'credentialId', label: 'Credential ID', type: 'text' },
      { name: 'credentialUrl', label: 'Credential URL (https://)', type: 'url' },
    ],
  },
  activities: {
    key: 'activities',
    title: 'Activities & Volunteering',
    description: 'Community leadership, speaking, and mentoring.',
    primaryColumn: 'organization',
    secondaryColumn: 'roleEn',
    fields: [
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      {
        name: 'role',
        nameId: 'roleId',
        nameEn: 'roleEn',
        label: 'Role',
        type: 'bilingual_text',
        required: true,
      },
      {
        name: 'activityType',
        label: 'Activity Type',
        type: 'select',
        required: true,
        options: [
          { value: 'organization', label: 'Organization' },
          { value: 'volunteer', label: 'Volunteer' },
          { value: 'community', label: 'Community' },
          { value: 'speaking', label: 'Speaking' },
          { value: 'mentoring', label: 'Mentoring' },
        ],
      },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date' },
    ],
  },
  achievements: {
    key: 'achievements',
    title: 'Achievements & Awards',
    description: 'Hackathons, honors, scholarships, and competitions.',
    primaryColumn: 'titleEn',
    secondaryColumn: 'issuer',
    fields: [
      {
        name: 'title',
        nameId: 'titleId',
        nameEn: 'titleEn',
        label: 'Title',
        type: 'bilingual_text',
        required: true,
      },
      { name: 'issuer', label: 'Issuer', type: 'text', required: true },
      { name: 'achievedDate', label: 'Achieved Date', type: 'date', required: true },
      { name: 'proofUrl', label: 'Proof URL (https://)', type: 'url' },
    ],
  },
  publications: {
    key: 'publications',
    title: 'Publications & Talks',
    description: 'Articles, research papers, books, and conference talks.',
    primaryColumn: 'titleEn',
    secondaryColumn: 'publisherOrVenue',
    fields: [
      {
        name: 'title',
        nameId: 'titleId',
        nameEn: 'titleEn',
        label: 'Title',
        type: 'bilingual_text',
        required: true,
      },
      { name: 'publisherOrVenue', label: 'Publisher / Venue', type: 'text' },
      { name: 'publishedDate', label: 'Published Date', type: 'date', required: true },
      { name: 'url', label: 'URL (https://)', type: 'url' },
    ],
  },
  testimonials: {
    key: 'testimonials',
    title: 'Testimonials',
    description: 'Endorsements from colleagues, managers, and clients.',
    primaryColumn: 'authorName',
    secondaryColumn: 'authorCompany',
    fields: [
      { name: 'authorName', label: 'Author Name', type: 'text', required: true },
      {
        name: 'authorRole',
        nameId: 'authorRoleId',
        nameEn: 'authorRoleEn',
        label: 'Author Role',
        type: 'bilingual_text',
        required: true,
      },
      { name: 'authorCompany', label: 'Company', type: 'text' },
      {
        name: 'quote',
        nameId: 'quoteId',
        nameEn: 'quoteEn',
        label: 'Quote',
        type: 'bilingual_textarea',
        required: true,
      },
    ],
  },
};

