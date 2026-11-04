import { ApiError, type ApiListResponse } from '@/lib/api/client';
import { FrontendQueryBuilder, type SortOrder } from '@/core/query';
import {
  buildIllustrationUri,
  DEFAULT_AVATAR_URI,
  PORTFOLIO_SHOWCASE_IMAGES,
} from '@/lib/visuals';
import type {
  PublicCertification,
  PublicProjectCard,
  PublicProjectDetail,
  SiteData,
  SupportedLocale,
} from '@/lib/api/types';

export interface ServerFetchOptions {
  locale?: SupportedLocale;
  tags?: string[];
  revalidate?: number | false;
  query?: Record<string, string | number | boolean | undefined>;
  cookieHeader?: string;
}

export function getDefaultSiteData(locale: SupportedLocale = 'en'): SiteData {
  const isId = locale === 'id';

  const cashierCover = PORTFOLIO_SHOWCASE_IMAGES[0]!;
  const edgeCover = PORTFOLIO_SHOWCASE_IMAGES[1]!;
  const mobileCover = PORTFOLIO_SHOWCASE_IMAGES[2]!;
  const telemetryCover = PORTFOLIO_SHOWCASE_IMAGES[3]!;
  const cloudCover = PORTFOLIO_SHOWCASE_IMAGES[4]!;
  const finopsCover = PORTFOLIO_SHOWCASE_IMAGES[5]!;
  const aiCover = PORTFOLIO_SHOWCASE_IMAGES[6]!;
  const communityCover = PORTFOLIO_SHOWCASE_IMAGES[7]!;

  const certAwsImg = buildIllustrationUri({
    title: 'AWS Solutions Architect',
    subtitle: 'Amazon Web Services · Associate',
    badge: 'VERIFIED CREDENTIAL',
    accentA: 'rgb(245, 158, 11)',
    accentB: 'rgb(59, 130, 246)',
    variant: 'certificate',
  });

  const certK8sImg = buildIllustrationUri({
    title: 'Cloud Native Security & Edge',
    subtitle: 'Linux Foundation / CNCF',
    badge: 'CERTIFICATION',
    accentA: 'rgb(56, 189, 248)',
    accentB: 'rgb(99, 102, 241)',
    variant: 'certificate',
  });

  return {
    profile: {
      name: 'Jidan Fathilla',
      headline: isId
        ? 'Fullstack Software Engineer yang membangun sistem web & edge andal'
        : 'Fullstack Software Engineer building reliable web & edge systems',
      bio: isId
        ? 'Software engineer berpengalaman di bidang TypeScript, Next.js, Hono, dan arsitektur cloud terdistribusi dengan fokus pada performa tinggi dan antarmuka modern.'
        : 'Experienced software engineer specializing in TypeScript, Next.js, Hono, and distributed cloud architectures with a focus on high-throughput edge systems and modern UI.',
      avatar: {
        url: DEFAULT_AVATAR_URI,
        width: 800,
        height: 500,
        alt: 'Jidan Fathilla',
      },
      location: 'Jakarta, Indonesia',
      timezone: 'Asia/Jakarta',
      email: 'contact@example.com',
      socials: {
        github: 'https://github.com/theCrudify',
        linkedin: 'https://linkedin.com/in/example',
      },
      availability: 'open_to_work',
      workPreference: 'remote',
      languages: [
        { name: 'Indonesian', level: 'native' },
        { name: 'English', level: 'professional' },
      ],
      interests: [
        { label: isId ? 'Komputasi Edge' : 'Edge Computing', icon: 'cpu' },
        { label: isId ? 'Sumber Terbuka' : 'Open Source', icon: 'code' },
        { label: isId ? 'Arsitektur Cloud' : 'Cloud Architecture', icon: 'globe' },
        { label: isId ? 'Desain Antarmuka' : 'Interactive UI Systems', icon: 'sparkles' },
      ],
      referencesNote: isId ? 'Tersedia berdasarkan permintaan' : 'Available upon request',
      careerStartDate: '2022-01-01',
      updatedAt: '2026-05-01T00:00:00.000Z',
    },
    settings: {
      themePreset: 'slate',
      colorMode: 'system',
      fontPair: 'geist',
      sectionOrder: [
        'hero',
        'about',
        'projects',
        'skills',
        'experience',
        'education',
        'certifications',
        'activities',
        'achievements',
        'publications',
        'testimonials',
        'github',
        'contact',
      ],
      hiddenSections: [],
      heroCvButtons: 'both',
      seo: {
        title: 'Jidan Fathilla · Fullstack Software Engineer',
        description: isId
          ? 'Portofolio pribadi, studi kasus, dan pengalaman rekayasa perangkat lunak.'
          : 'Personal portfolio, case studies, and software engineering experience.',
        ogImage: {
          url: cashierCover.url,
          width: 1200,
          height: 750,
          alt: 'Jidan Fathilla Portfolio Preview',
        },
      },
    },
    stats: {
      yearsExperience: 4,
      projectCount: 12,
      certificationCount: 6,
    },
    technologies: {
      frontend: [
        { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
        { name: 'React', slug: 'react', icon: 'react' },
        { name: 'Next.js', slug: 'nextjs', icon: 'nextdotjs' },
        { name: 'Tailwind CSS', slug: 'tailwindcss', icon: 'tailwindcss' },
      ],
      backend: [
        { name: 'Node.js', slug: 'nodejs', icon: 'nodedotjs' },
        { name: 'Hono', slug: 'hono', icon: 'hono' },
        { name: 'Go', slug: 'go', icon: 'go' },
      ],
      database: [
        { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
        { name: 'Drizzle', slug: 'drizzle', icon: 'drizzle' },
      ],
      devops: [
        { name: 'Cloudflare', slug: 'cloudflare', icon: 'cloudflare' },
        { name: 'Vercel', slug: 'vercel', icon: 'vercel' },
        { name: 'Docker', slug: 'docker', icon: 'docker' },
      ],
      tools: [
        { name: 'Git', slug: 'git', icon: 'git' },
        { name: 'Figma', slug: 'figma', icon: 'figma' },
        { name: 'Vitest', slug: 'vitest', icon: 'vitest' },
        { name: 'OpenTelemetry', slug: 'opentelemetry', icon: 'opentelemetry' },
      ],
      soft_skill: [
        { name: isId ? 'Arsitektur Sistem' : 'System Architecture', slug: 'system-architecture', icon: 'layers' },
        { name: isId ? 'Kepemimpinan Teknis' : 'Technical Leadership', slug: 'tech-leadership', icon: 'users' },
        { name: isId ? 'Rekayasa Performa' : 'Performance Engineering', slug: 'performance', icon: 'zap' },
        { name: isId ? 'Komunikasi Lintas Tim' : 'Cross-Functional Agile', slug: 'agile', icon: 'Compass' },
      ],
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'Tech Nusantara Cloud',
        companyLogo: { url: edgeCover.url, alt: 'Tech Nusantara Cloud' },
        companyUrl: 'https://example.com',
        role: 'Senior Fullstack & Edge Architect',
        employmentType: 'full_time',
        location: 'Jakarta, Indonesia',
        workMode: 'remote',
        startDate: '2024-01-01',
        endDate: null,
        description: isId
          ? 'Memimpin arsitektur platform web skala enterprise, gateway API edge global, serta standarisasi query modular tanpa JSON.'
          : 'Leading enterprise web platform architecture, global edge API gateways, and zero-JSON modular query standardization.',
        achievements: [
          isId
            ? 'Menurunkan latensi API p95 sebesar 45% (ke 11.4ms) melalui caching ETag edge dan optimasi indeks PostgreSQL'
            : 'Reduced p95 API latency by 45% (down to 11.4ms) via edge ETag caching and PostgreSQL composite indexing',
          isId
            ? 'Merancang arsitektur modular 8 domain dengan zero-downtime deployment dan 99.98% SLA uptime'
            : 'Designed 8-domain action-sliced modular architecture with zero-downtime deployment and 99.98% SLA uptime',
          isId
            ? 'Memimpin migrasi sistem monorepo untuk 15+ layanan mikro dengan pipeline CI/CD otomatis'
            : 'Spearheaded monorepo migration across 15+ edge services with automated CI/CD verification gates',
        ],
        technologies: [
          { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
          { name: 'Next.js', slug: 'nextjs', icon: 'nextdotjs' },
          { name: 'Hono', slug: 'hono', icon: 'hono' },
          { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
          { name: 'Cloudflare', slug: 'cloudflare', icon: 'cloudflare' },
        ],
      },
      {
        id: 'exp-2',
        company: 'FinOps Velocity Labs',
        companyLogo: { url: finopsCover.url, alt: 'FinOps Velocity Labs' },
        companyUrl: 'https://example.com',
        role: 'Fullstack Software Engineer',
        employmentType: 'full_time',
        location: 'Bandung, Indonesia',
        workMode: 'hybrid',
        startDate: '2022-06-01',
        endDate: '2023-12-31',
        description: isId
          ? 'Mengembangkan mesin buku besar multi-mata uang real-time, sistem kasir offline-first, dan dasbor analitik finansial.'
          : 'Engineered real-time multi-currency ledger systems, offline-first POS registers, and high-density financial analytics dashboards.',
        achievements: [
          isId
            ? 'Memproses 1.2 juta+ transaksi harian tanpa selisih rekonsiliasi menggunakan antrean idempoten'
            : 'Processed 1.2M+ daily transactions with zero reconciliation drift using idempotent event queues',
          isId
            ? 'Membangun sinkronisasi IndexedDB ke PostgreSQL yang tetap beroperasi saat koneksi ritel terputus'
            : 'Built resilient IndexedDB-to-PostgreSQL sync engine capable of 72-hour offline retail operation',
        ],
        technologies: [
          { name: 'React', slug: 'react', icon: 'react' },
          { name: 'Node.js', slug: 'nodejs', icon: 'nodedotjs' },
          { name: 'Go', slug: 'go', icon: 'go' },
          { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
          { name: 'Docker', slug: 'docker', icon: 'docker' },
        ],
      },
      {
        id: 'exp-3',
        company: 'Garuda Digital Studio',
        companyLogo: { url: mobileCover.url, alt: 'Garuda Digital Studio' },
        companyUrl: 'https://example.com',
        role: 'Frontend & Design Systems Engineer',
        employmentType: 'contract',
        location: 'Jakarta, Indonesia',
        workMode: 'remote',
        startDate: '2021-03-01',
        endDate: '2022-05-31',
        description: isId
          ? 'Membangun pustaka komponen UI aksesibel berstandar WCAG AA dan aplikasi web progresif berkinerja tinggi.'
          : 'Built WCAG AA compliant design system primitives and high-frame-rate progressive web applications.',
        achievements: [
          isId
            ? 'Meningkatkan skor Core Web Vitals (LCP < 1.2s, CLS 0.00) di seluruh 12 aplikasi klien'
            : 'Boosted Core Web Vitals to 99+ Lighthouse scores (LCP < 1.2s, CLS 0.00) across 12 client portals',
        ],
        technologies: [
          { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
          { name: 'React', slug: 'react', icon: 'react' },
          { name: 'Tailwind CSS', slug: 'tailwindcss', icon: 'tailwindcss' },
          { name: 'Figma', slug: 'figma', icon: 'figma' },
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Universitas Indonesia',
        logo: { url: cloudCover.url, alt: 'Universitas Indonesia' },
        degree: 'B.Sc. (S.Kom)',
        field: isId ? 'Ilmu Komputer & Sistem Terdistribusi' : 'Computer Science & Distributed Systems',
        startDate: '2018-08-01',
        endDate: '2022-07-01',
        gpa: '3.88',
        gpaScale: '4.00',
        description: isId
          ? 'Lulus Cum Laude dengan spesialisasi pada arsitektur jaringan terdistribusi, keamanan kriptografi, dan rekayasa perangkat lunak.'
          : 'Graduated Cum Laude specializing in distributed network architecture, applied cryptography, and software engineering.',
        activities: [
          isId
            ? 'Asisten Dosen Pemrograman Web Lanjut & Sistem Basis Data'
            : 'Lead Teaching Assistant for Advanced Web Programming & Database Systems',
          isId
            ? 'Ketua Tim Riset Komputasi Cloud & Edge Laboratorium Sistem'
            : 'Head of Cloud & Edge Computing Student Research Group',
        ],
      },
      {
        id: 'edu-2',
        institution: 'Bangkit Academy (Google, GoTo, Traveloka)',
        logo: { url: aiCover.url, alt: 'Bangkit Academy' },
        degree: 'Distinction Graduate',
        field: isId ? 'Arsitektur Cloud & Rekayasa Perangkat Lunak' : 'Cloud Computing & Distributed Engineering Track',
        startDate: '2021-02-01',
        endDate: '2021-08-01',
        gpa: '98.4',
        gpaScale: '100',
        description: isId
          ? 'Terpilih dalam 5% lulusan terbaik dari 3.000+ peserta nasional untuk proyek Capstone infrastruktur mikroservis.'
          : 'Selected among the top 5% distinction graduates out of 3,000+ national fellows for capstone microservice architecture.',
        activities: [
          isId
            ? 'Arsitek Utama Capstone: Sistem Telemetri IoT & Cloud Berbasis Kubernetes'
            : 'Lead Capstone Architect: Kubernetes-based IoT & Edge Telemetry Platform',
        ],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        type: 'certification',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issuerLogo: { url: certAwsImg, alt: 'AWS' },
        issueDate: '2024-05-01',
        expiryDate: '2027-05-01',
        isExpired: false,
        credentialId: 'AWS-SAA-90412',
        credentialUrl: 'https://aws.amazon.com/verification',
        image: { url: certAwsImg, width: 800, height: 500, alt: 'AWS Solutions Architect Certificate' },
        featured: true,
      },
      {
        id: 'cert-2',
        type: 'certification',
        name: 'Cloud Native Edge & Kubernetes Specialist',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        issuerLogo: { url: certK8sImg, alt: 'CNCF' },
        issueDate: '2025-01-15',
        expiryDate: '2028-01-15',
        isExpired: false,
        credentialId: 'CNCF-EDGE-8891',
        credentialUrl: 'https://www.cncf.io',
        image: { url: certK8sImg, width: 800, height: 500, alt: 'Cloud Native Edge Certificate' },
        featured: true,
      },
      {
        id: 'cert-3',
        type: 'bootcamp',
        name: 'High-Performance Distributed Databases & Drizzle ORM',
        issuer: 'Neon Serverless Engineering Guild',
        issuerLogo: { url: telemetryCover.url, alt: 'Neon Guild' },
        issueDate: '2025-03-10',
        expiryDate: null,
        isExpired: false,
        credentialId: 'NEON-DIST-4410',
        credentialUrl: 'https://neon.tech',
        image: { url: telemetryCover.url, width: 800, height: 500, alt: 'Distributed Databases Certificate' },
        featured: true,
      },
    ],
    activities: [
      {
        id: 'act-1',
        type: 'organization',
        organization: 'Jakarta TypeScript & Edge Community',
        eventName: 'Annual TypeScript & Cloud Summit',
        role: isId ? 'Pembicara Utama & Pengurus Inti' : 'Keynote Speaker & Core Organizer',
        startDate: '2023-01-01',
        endDate: null,
        description: isId
          ? 'Memimpin lokakarya arsitektur sistem bersih, optimasi runtime Cloudflare Workers, dan desain antarmuka modern.'
          : 'Leading deep-dive workshops on clean modular architecture, Cloudflare Workers runtime optimization, and modern UI systems.',
        achievements: [
          isId
            ? 'Menyelenggarakan 16+ sesi bedah kode langsung dengan 850+ engineer'
            : 'Hosted 16+ live architecture & code-review workshops with 850+ engineers',
          isId
            ? 'Menerbitkan template starter open-source Hono + Next.js yang digunakan oleh 40+ tim'
            : 'Published open-source Hono + Next.js starter kits adopted by 40+ engineering teams',
        ],
        media: {
          url: communityCover.url,
          width: 1200,
          height: 750,
          alt: communityCover.alt,
        },
        linkUrl: 'https://example.com',
      },
      {
        id: 'act-2',
        type: 'volunteer',
        organization: 'Open Source Nusantara Foundation',
        eventName: 'National Developer Mentorship Program',
        role: isId ? 'Mentor Rekayasa Sistem & Cloud' : 'System Architecture & Cloud Mentor',
        startDate: '2022-05-01',
        endDate: null,
        description: isId
          ? 'Membimbing mahasiswa dan engineer muda dalam membangun sistem backend yang terukur, pengujian otomatis, dan keamanan web.'
          : 'Mentoring early-career engineers in building scalable backend services, automated testing suites, and web security.',
        achievements: [
          isId
            ? 'Membimbing 35+ mentee hingga berhasil berkontribusi ke proyek open-source global'
            : 'Guided 35+ mentees to ship production PRs to international open-source repositories',
        ],
        media: {
          url: aiCover.url,
          width: 900,
          height: 900,
          alt: aiCover.alt,
        },
        linkUrl: 'https://example.com',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: isId ? 'Juara 1 Cloud & FinTech Architecture Hackathon' : '1st Place Cloud & FinTech Architecture Hackathon',
        issuer: 'Nusantara Tech Summit',
        eventName: 'Annual Engineering Cup 2025',
        rank: '1st Place · Gold Medal',
        date: '2025-08-12',
        description: isId
          ? 'Merancang mesin rekonsiliasi transaksi real-time berlatensi di bawah 15ms di atas jaringan edge terdistribusi.'
          : 'Architected a sub-15ms real-time financial settlement and anomaly detection engine running on distributed edge workers.',
        certificate: {
          url: finopsCover.url,
          width: 1200,
          height: 750,
          alt: 'Hackathon Winner Certificate',
        },
        linkUrl: 'https://example.com',
      },
      {
        id: 'ach-2',
        title: isId ? 'Penghargaan Inovasi Open-Source Terbaik' : 'Best Open-Source Systems Innovation Award',
        issuer: 'Asia Pacific Cloud Guild',
        eventName: 'APAC Systems Engineering Awards',
        rank: 'Winner · Top 1%',
        date: '2024-11-20',
        description: isId
          ? 'Penghargaan atas kontribusi mesin query flat bebas JSON dan sistem telemetri ramah privasi.'
          : 'Recognized for pioneering a zero-JSON flat query engine and cookieless privacy-preserving edge telemetry pipeline.',
        certificate: {
          url: telemetryCover.url,
          width: 1200,
          height: 750,
          alt: 'APAC Innovation Award',
        },
        linkUrl: 'https://example.com',
      },
    ],
    publications: [
      {
        id: 'pub-1',
        title: isId
          ? 'Arsitektur Edge Tanpa Cold-Start: Pola Query Flat & Caching Kondisional ETag'
          : 'Zero-Cold-Start Edge Architecture: Flat Query Patterns & Conditional ETag Caching',
        type: 'article',
        venue: 'Journal of Cloud & Edge Engineering',
        date: '2025-09-15',
        url: 'https://example.com/publications/edge-architecture',
        summary: isId
          ? 'Studi mendalam tentang bagaimana mengganti filter JSON bersarang dengan skema parameter flat meningkatkan rasio hit CDN hingga 94%.'
          : 'An empirical study demonstrating how replacing nested JSON query filters with flat deterministic parameters increases CDN cache hit ratios to 94%.',
      },
      {
        id: 'pub-2',
        title: isId
          ? 'Sinkronisasi Offline-First pada Sistem Kasir Ritel Menggunakan IndexedDB & Antrean Idempoten'
          : 'Offline-First Retail POS Synchronization Using IndexedDB & Idempotent Event Logs',
        type: 'paper',
        venue: 'Southeast Asia Software Engineering Conference',
        date: '2024-10-04',
        url: 'https://example.com/publications/offline-first-pos',
        summary: isId
          ? 'Arsitektur resolusi konflik deterministik untuk sinkronisasi stok multi-cabang saat jaringan tidak stabil.'
          : 'Deterministic conflict-resolution architecture for multi-branch inventory synchronization over intermittent networks.',
      },
    ],
    testimonials: [
      {
        id: 'test-1',
        name: 'Arif Pratama',
        position: 'VP of Engineering',
        company: 'Tech Nusantara Cloud',
        relationship: isId ? 'Manajer Langsung' : 'Direct Manager',
        avatar: { url: edgeCover.url, alt: 'Arif Pratama' },
        quote: isId
          ? 'Jidan memiliki kemampuan langka untuk menyatukan arsitektur backend yang sangat rapi dengan antarmuka frontend yang cepat dan memukau. Standar modular yang ia bangun memangkas waktu rilis fitur kami hingga separuhnya.'
          : 'Jidan possesses the rare ability to unite deeply disciplined backend architecture with blazingly fast, visually striking frontend systems. The modular standards he introduced cut our feature delivery cycle in half.',
      },
      {
        id: 'test-2',
        name: 'Sarah Wijaya',
        position: 'Principal Product Designer',
        company: 'FinOps Velocity Labs',
        relationship: isId ? 'Rekan Lintas Fungsi' : 'Cross-Functional Partner',
        avatar: { url: finopsCover.url, alt: 'Sarah Wijaya' },
        quote: isId
          ? 'Setiap komponen yang dikerjakan Jidan selalu memiliki perhatian tinggi terhadap detail visual, animasi mikro yang halus, dan aksesibilitas WCAG AA yang teruji.'
          : 'Every interface Jidan engineers exhibits extraordinary attention to visual craft, fluid micro-interactions, and verified WCAG AA accessibility.',
      },
      {
        id: 'test-3',
        name: 'Dimas Hendrawan',
        position: 'CTO',
        company: 'RetailScale Indonesia',
        relationship: isId ? 'Klien Enterprise' : 'Enterprise Client',
        avatar: { url: cashierCover.url, alt: 'Dimas Hendrawan' },
        quote: isId
          ? 'Sistem OmniPOS yang dirancang Jidan mampu menangani ribuan transaksi kasir kami bahkan ketika internet toko mati total. Sangat andal dan mudah digunakan.'
          : 'The OmniPOS platform Jidan architected handles thousands of daily checkout transactions across our stores even during complete internet outages. Rock-solid engineering.',
      },
    ],
    github: {
      publicRepos: 34,
      followers: 280,
      totalStars: 640,
      topLanguages: [
        { name: 'TypeScript', percent: 64 },
        { name: 'Go', percent: 18 },
        { name: 'Rust', percent: 10 },
        { name: 'Python', percent: 8 },
      ],
    },
    featuredProjects: [
      {
        slug: 'cashier-app',
        title: isId ? 'Aplikasi Kasir OmniPOS' : 'Cashier App (OmniPOS)',
        summary: isId
          ? 'Aplikasi POS untuk toko ritel dengan sinkronisasi offline, pemindaian barcode cepat, dan inventaris real-time.'
          : 'POS for retail shops with offline IndexedDB sync, instant barcode scanning, and real-time multi-branch inventory.',
        type: 'freelance',
        projectState: 'live',
        featured: true,
        cover: {
          url: cashierCover.url,
          width: cashierCover.width,
          height: cashierCover.height,
          alt: cashierCover.alt,
        },
        images: [
          { url: cashierCover.url, width: 1200, height: 750, alt: cashierCover.title, caption: cashierCover.caption },
          { url: mobileCover.url, width: 900, height: 900, alt: mobileCover.title, caption: mobileCover.caption },
          { url: finopsCover.url, width: 1200, height: 750, alt: finopsCover.title, caption: finopsCover.caption },
          { url: edgeCover.url, width: 1200, height: 750, alt: edgeCover.title, caption: edgeCover.caption },
        ],
        clip: null,
        technologies: [
          { name: 'Next.js', slug: 'nextjs', icon: 'nextdotjs' },
          { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
          { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
          { name: 'Tailwind CSS', slug: 'tailwindcss', icon: 'tailwindcss' },
        ],
        primaryLink: {
          type: 'demo',
          label: 'Live Demo',
          url: 'https://demo.example.com',
          isPrivate: false,
        },
        periodStart: '2025-01-01',
        periodEnd: '2025-04-30',
      },
      {
        slug: 'edge-analytics-engine',
        title: isId ? 'Mesin Analitik Edge' : 'Edge Analytics Engine',
        summary: isId
          ? 'Analitik web tanpa cookie yang ramah privasi di atas Cloudflare Workers dengan agregasi harian otomatis.'
          : 'Privacy-friendly cookieless web analytics running on Cloudflare Workers with automated daily rollups.',
        type: 'open_source',
        projectState: 'live',
        featured: true,
        cover: {
          url: telemetryCover.url,
          width: telemetryCover.width,
          height: telemetryCover.height,
          alt: telemetryCover.alt,
        },
        images: [
          { url: telemetryCover.url, width: 1200, height: 750, alt: telemetryCover.title, caption: telemetryCover.caption },
          { url: edgeCover.url, width: 1200, height: 750, alt: edgeCover.title, caption: edgeCover.caption },
          { url: cloudCover.url, width: 900, height: 900, alt: cloudCover.title, caption: cloudCover.caption },
          { url: aiCover.url, width: 900, height: 900, alt: aiCover.title, caption: aiCover.caption },
        ],
        clip: null,
        technologies: [
          { name: 'Hono', slug: 'hono', icon: 'hono' },
          { name: 'Cloudflare', slug: 'cloudflare', icon: 'cloudflare' },
          { name: 'Drizzle', slug: 'drizzle', icon: 'drizzle' },
          { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
        ],
        primaryLink: {
          type: 'repo',
          label: 'Private Repo',
          url: null,
          isPrivate: true,
        },
        periodStart: '2025-06-01',
        periodEnd: null,
      },
      {
        slug: 'finops-settlement-hub',
        title: isId ? 'Hub Rekonsiliasi FinOps' : 'FinOps Settlement Hub',
        summary: isId
          ? 'Dasbor buku besar multi-mata uang real-time dengan deteksi anomali transaksi otomatis dan ekspor audit.'
          : 'Real-time multi-currency ledger dashboard with automated anomaly detection and one-click audit exports.',
        type: 'company',
        projectState: 'live',
        featured: true,
        cover: {
          url: finopsCover.url,
          width: finopsCover.width,
          height: finopsCover.height,
          alt: finopsCover.alt,
        },
        images: [
          { url: finopsCover.url, width: 1200, height: 750, alt: finopsCover.title, caption: finopsCover.caption },
          { url: cloudCover.url, width: 900, height: 900, alt: cloudCover.title, caption: cloudCover.caption },
          { url: cashierCover.url, width: 1200, height: 750, alt: cashierCover.title, caption: cashierCover.caption },
        ],
        clip: null,
        technologies: [
          { name: 'Go', slug: 'go', icon: 'go' },
          { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
          { name: 'React', slug: 'react', icon: 'react' },
          { name: 'Docker', slug: 'docker', icon: 'docker' },
        ],
        primaryLink: {
          type: 'demo',
          label: 'Live Preview',
          url: 'https://finops.example.com',
          isPrivate: false,
        },
        periodStart: '2024-08-01',
        periodEnd: '2025-01-15',
      },
    ],
  };
}

export async function apiGet<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ApiListResponse<T>> {
  const apiOrigin = process.env.API_ORIGIN || 'http://localhost:8787';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`/v1${normalizedPath}`, apiOrigin);

  if (options.locale) {
    url.searchParams.set('locale', options.locale);
  }
  if (options.query) {
    FrontendQueryBuilder.assertFlatQuery(options.query);
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.cookieHeader) {
    headers.Cookie = options.cookieHeader;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: {
      ...(options.tags ? { tags: options.tags } : {}),
      ...(options.revalidate !== undefined ? { revalidate: options.revalidate } : {}),
    },
  });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    const errObj =
      payload && typeof payload === 'object' && 'error' in payload
        ? (payload as { error?: { code?: string; message?: string } }).error
        : undefined;
    throw new ApiError(
      res.status,
      errObj?.code ?? 'INTERNAL_ERROR',
      errObj?.message ?? `Server API error (${res.status})`,
    );
  }

  return (await res.json()) as ApiListResponse<T>;
}

function enrichCardVisuals(card: PublicProjectCard, index: number): PublicProjectCard {
  const fallbackVisual = PORTFOLIO_SHOWCASE_IMAGES[index % PORTFOLIO_SHOWCASE_IMAGES.length]!;
  const cover = card.cover ?? {
    url: fallbackVisual.url,
    width: fallbackVisual.width,
    height: fallbackVisual.height,
    alt: card.title,
  };
  const images =
    card.images && card.images.length > 0
      ? card.images
      : [
          { url: cover.url, width: cover.width, height: cover.height, alt: cover.alt, caption: card.summary },
          ...PORTFOLIO_SHOWCASE_IMAGES.slice(0, 4)
            .filter((img) => img.url !== cover.url)
            .slice(0, 3)
            .map((img) => ({
              url: img.url,
              width: img.width,
              height: img.height,
              alt: img.title,
              caption: img.caption,
            })),
        ];

  return {
    ...card,
    cover,
    images,
  };
}

export async function fetchSiteData(locale: SupportedLocale = 'en'): Promise<SiteData> {
  try {
    const res = await apiGet<SiteData>('/site', {
      locale,
      tags: ['site'],
    });
    const fallback = getDefaultSiteData(locale);
    return {
      ...res.data,
      profile: res.data.profile
        ? {
            ...res.data.profile,
            avatar: res.data.profile.avatar ?? fallback.profile!.avatar,
          }
        : fallback.profile,
      featuredProjects:
        res.data.featuredProjects && res.data.featuredProjects.length > 0
          ? res.data.featuredProjects.map((p, idx) => enrichCardVisuals(p, idx))
          : fallback.featuredProjects,
      experiences:
        res.data.experiences && res.data.experiences.length > 0
          ? res.data.experiences
          : fallback.experiences,
      education:
        res.data.education && res.data.education.length > 0
          ? res.data.education
          : fallback.education,
      certifications:
        res.data.certifications && res.data.certifications.length > 0
          ? res.data.certifications
          : fallback.certifications,
      activities:
        res.data.activities && res.data.activities.length > 0
          ? res.data.activities
          : fallback.activities,
      achievements:
        res.data.achievements && res.data.achievements.length > 0
          ? res.data.achievements
          : fallback.achievements,
      publications:
        res.data.publications && res.data.publications.length > 0
          ? res.data.publications
          : fallback.publications,
      testimonials:
        res.data.testimonials && res.data.testimonials.length > 0
          ? res.data.testimonials
          : fallback.testimonials,
      github: res.data.github ?? fallback.github,
    };
  } catch {
    return getDefaultSiteData(locale);
  }
}

export async function fetchProjectsList(options: {
  locale: SupportedLocale;
  technology?: string;
  type?: string;
  search?: string;
  q?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  sort?: string;
  featured?: boolean;
  all?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ data: PublicProjectCard[]; meta: { page: number; limit: number; total: number } }> {
  try {
    const res = await apiGet<PublicProjectCard[]>('/projects', {
      locale: options.locale,
      tags: ['projects'],
      query: {
        technology: options.technology,
        type: options.type,
        search: options.search ?? options.q,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        sort: options.sort,
        featured: options.featured,
        all: options.all,
        page: options.page,
        limit: options.limit,
      },
    });
    const enriched = res.data.map((p, idx) => enrichCardVisuals(p, idx));
    return {
      data: enriched,
      meta: res.meta ?? { page: 1, limit: 20, total: enriched.length },
    };
  } catch {
    const rawFallback = getDefaultSiteData(options.locale).featuredProjects.filter((p) => {
      if (options.type && p.type !== options.type) return false;
      if (options.technology && !p.technologies.some((t) => t.slug === options.technology)) {
        return false;
      }
      if (options.featured !== undefined && p.featured !== options.featured) {
        return false;
      }
      return true;
    });

    const queried = FrontendQueryBuilder.executeClientQuery(
      rawFallback as unknown as Record<string, unknown>[],
      {
        page: options.page,
        limit: options.limit,
        search: options.search ?? options.q,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        sort: options.sort,
        all: options.all,
      },
      ['title', 'summary', 'slug', 'type'],
    );

    return {
      data: queried.data as unknown as PublicProjectCard[],
      meta: {
        page: queried.meta.page,
        limit: queried.meta.limit,
        total: queried.meta.total,
      },
    };
  }
}

export async function fetchProjectDetail(
  slug: string,
  locale: SupportedLocale = 'en',
): Promise<PublicProjectDetail | null> {
  const defaultGalleryMedia = PORTFOLIO_SHOWCASE_IMAGES.slice(0, 6).map((img, i) => ({
    id: `gallery-${i + 1}`,
    role: 'gallery' as const,
    provider: 'cloudinary' as const,
    kind: 'image' as const,
    url: img.url,
    embedId: null,
    thumbnailUrl: img.url,
    width: img.width,
    height: img.height,
    alt: img.alt,
    title: img.title,
    caption: img.caption,
  }));

  try {
    const res = await apiGet<PublicProjectDetail>(`/projects/${encodeURIComponent(slug)}`, {
      locale,
      tags: ['projects', `project:${slug}`],
    });
    const data = res.data;
    return {
      ...data,
      cover: data.cover ?? {
        url: PORTFOLIO_SHOWCASE_IMAGES[0]!.url,
        width: 1200,
        height: 750,
        alt: data.title,
      },
      architecture: data.architecture ?? {
        url: PORTFOLIO_SHOWCASE_IMAGES[1]!.url,
        width: 1200,
        height: 750,
        alt: `${data.title} Architecture`,
      },
      media: data.media && data.media.length > 0 ? data.media : defaultGalleryMedia,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    const fallbackCards = getDefaultSiteData(locale).featuredProjects;
    const card = fallbackCards.find((p) => p.slug === slug);
    if (!card) {
      return null;
    }
    const isId = locale === 'id';
    return {
      slug: card.slug,
      title: card.title,
      summary: card.summary,
      type: card.type,
      projectState: card.projectState,
      role: 'Fullstack Developer',
      teamSize: 2,
      client: 'Toko Maju',
      periodStart: card.periodStart,
      periodEnd: card.periodEnd,
      problem: isId
        ? 'Pembukuan manual menyebabkan selisih stok antar cabang.'
        : 'Manual bookkeeping caused frequent stock mismatches across branches.',
      solution: isId
        ? 'Membangun PWA offline-first dengan sinkronisasi latar belakang.'
        : 'Built an offline-first PWA with background sync and barcode scanning.',
      result: isId
        ? 'Memangkas waktu transaksi 60% dan menghilangkan selisih stok harian.'
        : 'Reduced checkout time by 60% and eliminated daily stock discrepancies.',
      challenges: isId
        ? 'Menyelesaikan konflik sinkronisasi data multi-kasir saat kembali online.'
        : 'Resolving multi-device sync conflicts when reconnecting after offline periods.',
      metrics: [
        { label: isId ? 'Waktu kasir' : 'Checkout time', value: '-60%' },
        { label: isId ? 'Transaksi harian' : 'Daily transactions', value: '1,200+' },
        { label: isId ? 'Uptime sistem' : 'System uptime', value: '99.98%' },
      ],
      highlights: [
        isId ? 'Sinkronisasi offline-first IndexedDB' : 'Offline-first IndexedDB sync',
        isId ? 'Kontrol akses berbasis peran' : 'Role-based access control',
        isId ? 'Pemindaian barcode & QRIS instan' : 'Instant barcode & dynamic QRIS checkout',
      ],
      technologies: {
        frontend: card.technologies,
        backend: [{ name: 'Hono', slug: 'hono', icon: 'hono' }],
        database: [{ name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' }],
        devops: [{ name: 'Cloudflare', slug: 'cloudflare', icon: 'cloudflare' }],
        other: [],
      },
      links: card.primaryLink ? [card.primaryLink] : [],
      cover: card.cover,
      architecture: {
        url: PORTFOLIO_SHOWCASE_IMAGES[1]!.url,
        width: 1200,
        height: 750,
        alt: `${card.title} Architecture`,
      },
      media: defaultGalleryMedia,
      seo: {
        title: card.title,
        description: card.summary,
      },
      updatedAt: '2026-05-01T10:00:00.000Z',
      prev: null,
      next: null,
    };
  }
}

export async function fetchCertificationsList(
  locale: SupportedLocale = 'en',
  type?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: SortOrder,
): Promise<PublicCertification[]> {
  try {
    const res = await apiGet<PublicCertification[]>('/certifications', {
      locale,
      tags: ['certifications'],
      query: { type, search, sortBy, sortOrder },
    });
    return res.data;
  } catch {
    const list = getDefaultSiteData(locale).certifications;
    const filtered = type ? list.filter((c) => c.type === type) : list;
    const queried = FrontendQueryBuilder.executeClientQuery(
      filtered as unknown as Record<string, unknown>[],
      { search, sortBy, sortOrder, all: true },
      ['name', 'issuer', 'credentialId'],
    );
    return queried.data as unknown as PublicCertification[];
  }
}
