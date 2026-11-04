export type SupportedLocale = 'en' | 'id';

/** A home-page section code (site_section lookup); unknown codes are skipped when rendering. */
export type SectionKey = string;

/** A master-data value as the API sends it: `code` for logic, `label` for display. */
export interface PublicLookup {
  code: string;
  label: string;
  icon: string | null;
  color: string | null;
}

export interface PublicImage {
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
}

export interface PublicMedia {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
  /** media_provider code */
  provider: string;
  /** media_kind code (image, pdf, video, document) */
  kind: string;
  embedId: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  captionsUrl: string | null;
  sources?: { mp4: string; webm: string };
}

export interface PublicOrganization {
  slug: string;
  name: string;
  type: PublicLookup | null;
  logo: PublicImage | null;
  websiteUrl: string | null;
  location: string | null;
}

export interface PublicProfile {
  name: string;
  headline: string;
  bio: string;
  avatar: PublicImage | null;
  location: string | null;
  timezone: string;
  email: string | null;
  socials: { platform: PublicLookup; url: string; handle: string | null }[];
  availability: PublicLookup;
  workPreference: PublicLookup;
  languages: { name: string; level: PublicLookup }[];
  interests: { label: string; icon: string | null }[];
  referencesNote: string | null;
  careerStartDate: string | null;
  updatedAt: string;
}

export interface PublicSiteSection {
  code: SectionKey;
  label: string;
  visible: boolean;
}

export interface PublicSiteSettings {
  themePreset: string;
  colorMode: string;
  fontPair: string;
  /** hero_cv_buttons code: uploaded | export | both */
  heroCvButtons: string;
  sections: PublicSiteSection[];
  seo: {
    title: string | null;
    description: string | null;
    ogImage: PublicImage | null;
  };
}

export interface PublicTechChip {
  name: string;
  slug: string;
  icon: string | null;
}

export interface PublicTechGroup {
  group: PublicLookup;
  items: PublicTechChip[];
}

export interface PublicProjectLink {
  /** link_type lookup (demo, repo_frontend, repo_backend, repo_service, documentation, slides…) */
  type: PublicLookup;
  label: string;
  url: string | null;
  isPrivate: boolean;
}

export interface PublicProjectRef {
  slug: string;
  title: string;
}

export interface PublicProjectCard {
  slug: string;
  title: string;
  summary: string;
  type: PublicLookup;
  state: PublicLookup;
  featured: boolean;
  client: PublicOrganization | null;
  cover: PublicImage | null;
  images?: (PublicImage & { caption?: string })[];
  clip: PublicMedia | null;
  technologies: PublicTechChip[];
  primaryLink: PublicProjectLink | null;
  periodStart: string | null;
  periodEnd: string | null;
  /** Present on the site payload (featured projects) and in exports. */
  role?: string | null;
  responsibilities?: string[];
  metrics?: { label: string; value: string }[];
}

export interface PublicProjectMediaItem extends PublicMedia {
  /** project_media_role lookup (gallery, demo_video, clip, documentation, slides, architecture) */
  role: PublicLookup;
  caption: string | null;
}

/** A position (experience) a project belongs to. */
export interface PublicPositionRef {
  id: string;
  role: string;
  organization: PublicOrganization | null;
  startDate: string;
  endDate: string | null;
}

export interface PublicProjectDetail {
  slug: string;
  title: string;
  summary: string;
  type: PublicLookup;
  state: PublicLookup;
  role: string | null;
  teamSize: number | null;
  client: PublicOrganization | null;
  positions: PublicPositionRef[];
  periodStart: string | null;
  periodEnd: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  challenges: string | null;
  responsibilities: string[];
  metrics: { label: string; value: string }[];
  highlights: string[];
  technologies: PublicTechGroup[];
  links: PublicProjectLink[];
  cover: PublicImage | null;
  architecture: PublicImage | null;
  media: PublicProjectMediaItem[];
  seo: {
    title: string;
    description: string;
  };
  updatedAt: string;
  prev: PublicProjectRef | null;
  next: PublicProjectRef | null;
}

export interface PublicExperience {
  id: string;
  organization: PublicOrganization | null;
  role: string;
  employmentType: PublicLookup;
  location: string | null;
  workMode: PublicLookup | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  responsibilities: string[];
  achievements: string[];
  technologies: PublicTechChip[];
  projects: PublicProjectRef[];
}

export interface PublicEducation {
  id: string;
  organization: PublicOrganization | null;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  gpa: string | null;
  gpaScale: string | null;
  description: string | null;
  activities: string[];
}

export interface PublicCertification {
  id: string;
  type: PublicLookup;
  name: string;
  issuer: PublicOrganization | null;
  issueDate: string | null;
  expiryDate: string | null;
  isExpired: boolean;
  credentialId: string | null;
  credentialUrl: string | null;
  image: PublicImage | null;
  featured: boolean;
}

export interface PublicActivity {
  id: string;
  type: PublicLookup;
  organization: PublicOrganization | null;
  eventName: string | null;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  achievements: string[];
  media: PublicImage | null;
  linkUrl: string | null;
}

export interface PublicAchievement {
  id: string;
  title: string;
  issuer: PublicOrganization | null;
  eventName: string | null;
  rank: string | null;
  date: string | null;
  description: string | null;
  certificate: PublicImage | null;
  linkUrl: string | null;
}

export interface PublicPublication {
  id: string;
  type: PublicLookup;
  title: string;
  venue: string | null;
  date: string | null;
  summary: string | null;
  url: string | null;
  video: PublicMedia | null;
}

export interface PublicTestimonial {
  id: string;
  name: string;
  position: string | null;
  organization: PublicOrganization | null;
  avatar: PublicImage | null;
  relationship: string | null;
  quote: string;
  linkedinUrl: string | null;
}

export interface GithubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: { name: string; percent: number }[];
  contributionsLastYear?: number;
}

export interface SiteData {
  profile: PublicProfile | null;
  settings: PublicSiteSettings;
  stats: {
    yearsExperience: number;
    projectCount: number;
    certificationCount: number;
  };
  /** Skills grouped by tech_category lookup, in master-data order. */
  technologies: PublicTechGroup[];
  experiences: PublicExperience[];
  education: PublicEducation[];
  certifications: PublicCertification[];
  activities: PublicActivity[];
  achievements: PublicAchievement[];
  publications: PublicPublication[];
  testimonials: PublicTestimonial[];
  github: GithubStats | null;
  featuredProjects: PublicProjectCard[];
  /** Public CV export presets (PDF downloads). */
  exportPresets: { slug: string; name: string; template: string; locale: string }[];
  /** Filter options for public listings, from master data. */
  filters: {
    projectTypes: PublicLookup[];
    certificationTypes: PublicLookup[];
    activityTypes: PublicLookup[];
  };
}

export interface ExportPayload {
  preset: {
    slug: string;
    name: string;
    /** export_template code */
    template: string;
    locale: SupportedLocale;
  };
  profile: PublicProfile | null;
  /** Keyed by section code, in the preset's order. */
  sections: Record<string, unknown[]>;
  generatedAt: string;
  siteUrl: string;
}

export interface SharePayload {
  label: string;
  kind: 'document' | 'preset';
  document?: {
    url: string;
    title: string;
    version: number;
    locale: SupportedLocale;
    updatedAt: string;
  };
  export?: ExportPayload;
}

