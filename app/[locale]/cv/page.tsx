import { fetchSiteData } from '@/lib/api/server';
import { CvPrintableView, type CvExportPayload } from '@/components/pdf/cv-templates';

export default async function WebCvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale === 'id' ? 'id' : 'en';
  const site = await fetchSiteData(typedLocale);

  const allSkills = [
    ...(site.technologies?.frontend ?? []),
    ...(site.technologies?.backend ?? []),
    ...(site.technologies?.database ?? []),
    ...(site.technologies?.devops ?? []),
    ...(site.technologies?.tools ?? []),
    ...(site.technologies?.soft_skill ?? []),
  ];

  const exportPayload: CvExportPayload = {
    preset: {
      slug: 'full-cv',
      name: 'Curriculum Vitae',
      template: 'full',
      locale: typedLocale,
    },
    profile: site.profile
      ? {
          name: site.profile.name,
          headline: site.profile.headline,
          bio: site.profile.bio,
          email: site.profile.email,
          location: site.profile.location,
          socials: site.profile.socials,
        }
      : null,
    sections: {
      experiences: site.experiences.map((e) => ({
        id: e.id,
        company: e.company,
        role: e.role,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description,
      })),
      projects: site.featuredProjects.map((p) => ({
        id: p.slug,
        title: p.title,
        summary: p.summary,
        role: null,
      })),
      education: site.education.map((ed) => ({
        id: ed.id,
        institution: ed.institution,
        degree: ed.degree,
        field: ed.field,
        startDate: ed.startDate,
        endDate: ed.endDate,
        gpa: ed.gpa,
      })),
      skills: allSkills.map((s) => ({
        id: s.slug,
        name: s.name,
        category: 'technology',
      })),

    },
  };

  return (
    <div className="container mx-auto py-10 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-lg font-semibold">Print-Friendly Curriculum Vitae</h1>
        <div className="flex gap-2">
          <a
            href={`/api/pdf/full-cv?locale=${typedLocale}`}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            Download Dynamic PDF
          </a>
        </div>
      </div>
      <CvPrintableView data={exportPayload} />
    </div>
  );
}
