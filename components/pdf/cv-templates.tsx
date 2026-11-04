import type {
  ExportPayload,
  PublicCertification,
  PublicEducation,
  PublicExperience,
  PublicProjectCard,
  PublicTechGroup,
} from '@/lib/api/types';

/** The API's export payload; the web CV page builds the same shape from site data. */
export type CvExportPayload = Pick<ExportPayload, 'preset' | 'profile' | 'sections'>;

export interface CvLabels {
  experience: string;
  projects: string;
  education: string;
  skills: string;
  certifications: string;
  responsibilities: string;
  present: string;
  gpa: string;
}

function Heading({ children }: { children: string }) {
  return (
    <h2 className="border-b border-border pb-1 text-base font-bold uppercase tracking-wider">
      {children}
    </h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="ml-4 list-disc space-y-0.5 text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Printable CV. Sections render in the payload's key order (the preset's order). */
export function CvPrintableView({ data, labels }: { data: CvExportPayload; labels: CvLabels }) {
  const isAts = data.preset.template === 'ats';
  const isOnePage = data.preset.template === 'one_page';
  const period = (start: string | null, end: string | null) =>
    start ? `${start} – ${end ?? labels.present}` : '';

  const renderers: Record<string, (items: unknown[]) => React.ReactNode> = {
    experience: (items) => (
      <section key="experience" className="space-y-3">
        <Heading>{labels.experience}</Heading>
        {(items as PublicExperience[]).map((exp) => (
          <div key={exp.id} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <strong className="font-semibold">
                {exp.role} — {exp.organization?.name}
              </strong>
              <span className="shrink-0 text-xs text-muted-foreground">
                {period(exp.startDate, exp.endDate)}
              </span>
            </div>
            {exp.description ? <p className="text-muted-foreground">{exp.description}</p> : null}
            <Bullets items={[...exp.responsibilities, ...exp.achievements]} />
          </div>
        ))}
      </section>
    ),
    projects: (items) => (
      <section key="projects" className="space-y-3">
        <Heading>{labels.projects}</Heading>
        {(items as PublicProjectCard[]).map((proj) => (
          <div key={proj.slug} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <strong className="font-semibold">
                {proj.title}
                {proj.client ? <span className="font-normal"> — {proj.client.name}</span> : null}
              </strong>
              <span className="shrink-0 text-xs text-muted-foreground">
                {period(proj.periodStart, proj.periodEnd)}
              </span>
            </div>
            <p className="text-muted-foreground">{proj.summary}</p>
            {!isOnePage ? <Bullets items={proj.responsibilities ?? []} /> : null}
          </div>
        ))}
      </section>
    ),
    education: (items) => (
      <section key="education" className="space-y-2">
        <Heading>{labels.education}</Heading>
        {(items as PublicEducation[]).map((edu) => (
          <div key={edu.id} className="flex items-baseline justify-between gap-4">
            <div>
              <strong>{edu.organization?.name}</strong>
              {edu.degree ? <span> — {edu.degree}</span> : null}
              {edu.field ? <span>, {edu.field}</span> : null}
            </div>
            {edu.gpa ? (
              <span className="shrink-0 text-xs text-muted-foreground">
                {labels.gpa}: {edu.gpa}
                {edu.gpaScale ? `/${edu.gpaScale}` : ''}
              </span>
            ) : null}
          </div>
        ))}
      </section>
    ),
    skills: (items) => (
      <section key="skills" className="space-y-2">
        <Heading>{labels.skills}</Heading>
        {(items as PublicTechGroup[]).map((g) => (
          <p key={g.group.code} className="text-muted-foreground">
            <strong className="text-foreground">{g.group.label}:</strong>{' '}
            {g.items.map((s) => s.name).join(' • ')}
          </p>
        ))}
      </section>
    ),
    certifications: (items) => (
      <section key="certifications" className="space-y-1">
        <Heading>{labels.certifications}</Heading>
        {(items as PublicCertification[]).map((cert) => (
          <div key={cert.id} className="flex items-baseline justify-between gap-4">
            <span>
              <strong>{cert.name}</strong> — {cert.issuer?.name}
            </span>
            {cert.issueDate ? (
              <span className="shrink-0 text-xs text-muted-foreground">{cert.issueDate}</span>
            ) : null}
          </div>
        ))}
      </section>
    ),
  };

  return (
    <article
      className={`mx-auto max-w-3xl bg-background p-8 text-foreground print:p-0 ${
        isAts ? 'font-sans' : ''
      } ${isOnePage ? 'space-y-4 text-xs' : 'space-y-6 text-sm'}`}
    >
      {data.profile ? (
        <header className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold">{data.profile.name}</h1>
          <p className="mt-1 font-medium text-muted-foreground">{data.profile.headline}</p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {data.profile.email ? <span>{data.profile.email}</span> : null}
            {data.profile.location ? <span>{data.profile.location}</span> : null}
            {data.profile.socials.map((s) => (
              <span key={s.platform.code}>{s.url}</span>
            ))}
          </div>
          <p className="mt-3 leading-relaxed">{data.profile.bio}</p>
        </header>
      ) : null}

      {Object.entries(data.sections).map(([key, items]) =>
        items.length > 0 ? renderers[key]?.(items) : null,
      )}
    </article>
  );
}
