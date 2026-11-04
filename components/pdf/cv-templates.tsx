import * as React from 'react';

export interface CvExportPayload {
  preset: {
    slug: string;
    name: string;
    template: 'full' | 'one_page' | 'ats';
    locale: 'en' | 'id';
  };
  profile: {
    name: string;
    headline: string;
    bio: string;
    email?: string | null;
    location?: string | null;
    socials?: Record<string, string>;
  } | null;
  sections: {
    experiences?: {
      id: string;
      company: string;
      role: string;
      location?: string | null;
      startDate: string;
      endDate?: string | null;
      description?: string | null;
    }[];
    projects?: {
      id: string;
      title: string;
      summary: string;
      role?: string | null;
    }[];
    education?: {
      id: string;
      institution: string;
      degree?: string | null;
      field?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      gpa?: string | null;
    }[];
    skills?: { id: string; name: string; category: string }[];
    certifications?: { id: string; name: string; issuer: string; issueDate?: string | null }[];
  };
}

export function CvPrintableView({ data }: { data: CvExportPayload }) {
  const isAts = data.preset.template === 'ats';
  const isOnePage = data.preset.template === 'one_page';

  return (
    <article
      className={`mx-auto max-w-3xl bg-background p-8 text-foreground print:p-0 ${
        isAts ? 'font-sans' : ''
      } ${isOnePage ? 'space-y-4 text-xs' : 'space-y-6 text-sm'}`}
    >
      {data.profile && (
        <header className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold">{data.profile.name}</h1>
          <p className="mt-1 font-medium text-muted-foreground">{data.profile.headline}</p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {data.profile.email && <span>{data.profile.email}</span>}
            {data.profile.location && <span>{data.profile.location}</span>}
          </div>
          <p className="mt-3 leading-relaxed">{data.profile.bio}</p>
        </header>
      )}

      {data.sections.experiences && data.sections.experiences.length > 0 && (
        <section className="space-y-3">
          <h2 className="border-b border-border pb-1 text-base font-bold uppercase tracking-wider">
            Work Experience
          </h2>
          {data.sections.experiences.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex items-baseline justify-between">
                <strong className="font-semibold">
                  {exp.role} — {exp.company}
                </strong>
                <span className="text-xs text-muted-foreground">
                  {exp.startDate} – {exp.endDate ?? 'Present'}
                </span>
              </div>
              {exp.description && <p className="text-muted-foreground">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {data.sections.projects && data.sections.projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="border-b border-border pb-1 text-base font-bold uppercase tracking-wider">
            Selected Projects
          </h2>
          {data.sections.projects.map((proj) => (
            <div key={proj.id} className="space-y-1">
              <div className="font-semibold">{proj.title}</div>
              <p className="text-muted-foreground">{proj.summary}</p>
            </div>
          ))}
        </section>
      )}

      {data.sections.education && data.sections.education.length > 0 && (
        <section className="space-y-2">
          <h2 className="border-b border-border pb-1 text-base font-bold uppercase tracking-wider">
            Education
          </h2>
          {data.sections.education.map((edu) => (
            <div key={edu.id} className="flex items-baseline justify-between">
              <div>
                <strong>{edu.institution}</strong>
                {edu.degree && <span> — {edu.degree}</span>}
              </div>
              {edu.gpa && <span className="text-xs text-muted-foreground">GPA: {edu.gpa}</span>}
            </div>
          ))}
        </section>
      )}

      {data.sections.skills && data.sections.skills.length > 0 && (
        <section className="space-y-2">
          <h2 className="border-b border-border pb-1 text-base font-bold uppercase tracking-wider">
            Skills & Technologies
          </h2>
          <p className="text-muted-foreground">
            {data.sections.skills.map((s) => s.name).join(' • ')}
          </p>
        </section>
      )}
    </article>
  );
}

