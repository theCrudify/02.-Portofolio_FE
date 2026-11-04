export type SupportedLocale = 'en' | 'id';

export type SectionKey =
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'activities'
  | 'achievements'
  | 'publications'
  | 'testimonials'
  | 'github'
  | 'contact';

export interface PublicMedia {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
  provider: 'cloudinary' | 'youtube' | 'vimeo' | 'loom';
  kind: 'image' | 'pdf' | 'video';
  embedId: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  captionsUrl: string | null;
  sources?: { mp4: string; webm: string };
}

export interface PublicProfile {
  name: string;
  headline: string;
  bio: string;
  avatar: { url: string; width: number | null; height: number | null; alt: string } | null;
  location: string | null;
  timezone: string;
  email: string | null;
  socials: Record<string, string>;
  availability: 'open_to_work' | 'freelance' | 'not_available';
  workPreference: 'onsite' | 'hybrid' | 'remote';
  languages: { name: string; level: string }[];
  interests: { label: string; icon: string | null }[];
  referencesNote: string | null;
  careerStartDate: string | null;
  updatedAt: string;
}

export interface PublicSiteSettings {
  themePreset: 'slate' | 'forest' | 'sunset' | 'mono' | string;
  colorMode: 'light' | 'dark' | 'system' | string;
  fontPair: 'geist' | 'inter' | 'serif-accent' | string;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  heroCvButtons: 'uploaded' | 'export' | 'both';
  seo: {
    title: string | null;
    description: string | null;
    ogImage: { url: string; width: number | null; height: number | null; alt: string } | null;
  };
}

export interface PublicTechChip {
  name: string;
  slug: string;
  icon: string | null;
}

export interface PublicProjectLink {
  type:
    | 'demo'
    | 'repo_frontend'
    | 'repo_backend'
    | 'repo'
    | 'api_docs'
    | 'postman'
    | 'design'
    | 'video'
    | 'article'
    | 'other';
  label: string;
  url: string | null;
  isPrivate: boolean;
}

export interface PublicProjectCard {
  slug: string;
  title: string;
  summary: string;
  type: 'personal' | 'freelance' | 'company' | 'open_source' | 'hackathon';
  projectState: 'live' | 'in_development' | 'archived';
  featured: boolean;
  cover: { url: string; width: number | null; height: number | null; alt: string } | null;
  images?: { url: string; width: number | null; height: number | null; alt: string; caption?: string }[];
  clip: PublicMedia | null;
  technologies: PublicTechChip[];
  primaryLink: PublicProjectLink | null;
  periodStart: string | null;
  periodEnd: string | null;
}

export interface PublicProjectMediaItem {
  id: string;
  role: 'gallery' | 'demo_video' | 'clip';
  provider: 'cloudinary' | 'youtube' | 'vimeo' | 'loom';
  kind: 'image' | 'pdf' | 'video';
  url: string;
  embedId: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  alt: string;
  title: string | null;
  caption: string | null;
  sources?: { mp4: string; webm: string };
}

export interface PublicProjectDetail {
  slug: string;
  title: string;
  summary: string;
  type: 'personal' | 'freelance' | 'company' | 'open_source' | 'hackathon';
  projectState: 'live' | 'in_development' | 'archived';
  role: string | null;
  teamSize: number | null;
  client: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  challenges: string | null;
  metrics: { label: string; value: string }[];
  highlights: string[];
  technologies: {
    frontend: PublicTechChip[];
    backend: PublicTechChip[];
    database: PublicTechChip[];
    devops: PublicTechChip[];
    other: PublicTechChip[];
  };
  links: PublicProjectLink[];
  cover: { url: string; width: number | null; height: number | null; alt: string } | null;
  architecture: { url: string; width: number | null; height: number | null; alt: string } | null;
  media: PublicProjectMediaItem[];
  seo: {
    title: string;
    description: string;
  };
  updatedAt: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export interface PublicExperience {
  id: string;
  company: string;
  companyLogo: { url: string; alt: string } | null;
  companyUrl: string | null;
  role: string;
  employmentType: 'full_time' | 'part_time' | 'internship' | 'freelance' | 'contract';
  location: string | null;
  workMode: 'onsite' | 'hybrid' | 'remote' | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  achievements: string[];
  technologies: PublicTechChip[];
}

export interface PublicEducation {
  id: string;
  institution: string;
  logo: { url: string; alt: string } | null;
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
  type: 'certification' | 'course' | 'bootcamp' | 'training';
  name: string;
  issuer: string;
  issuerLogo: { url: string; alt: string } | null;
  issueDate: string | null;
  expiryDate: string | null;
  isExpired: boolean;
  credentialId: string | null;
  credentialUrl: string | null;
  image: { url: string; width: number | null; height: number | null; alt: string } | null;
  featured: boolean;
}

export interface PublicActivity {
  id: string;
  type: 'volunteer' | 'committee' | 'organization';
  organization: string;
  eventName: string | null;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  achievements: string[];
  media: { url: string; width: number | null; height: number | null; alt: string } | null;
  linkUrl: string | null;
}

export interface PublicAchievement {
  id: string;
  title: string;
  issuer: string | null;
  eventName: string | null;
  rank: string | null;
  date: string | null;
  description: string | null;
  certificate: { url: string; width: number | null; height: number | null; alt: string } | null;
  linkUrl: string | null;
}

export interface PublicPublication {
  id: string;
  type: 'article' | 'paper' | 'talk' | 'workshop' | 'podcast';
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
  company: string | null;
  avatar: { url: string; alt: string } | null;
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
  technologies: {
    frontend: PublicTechChip[];
    backend: PublicTechChip[];
    database: PublicTechChip[];
    devops: PublicTechChip[];
    tools: PublicTechChip[];
    soft_skill: PublicTechChip[];
  };
  experiences: PublicExperience[];
  education: PublicEducation[];
  certifications: PublicCertification[];
  activities: PublicActivity[];
  achievements: PublicAchievement[];
  publications: PublicPublication[];
  testimonials: PublicTestimonial[];
  github: GithubStats | null;
  featuredProjects: PublicProjectCard[];
}

export interface ExportPayload {
  preset: {
    slug: string;
    name: string;
    template: 'full' | 'one_page' | 'ats';
    locale: SupportedLocale;
  };
  profile: PublicProfile | null;
  sections: {
    key: SectionKey;
    items: unknown[];
  }[];
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

