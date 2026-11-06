import type { ReactNode } from 'react';
import type {
  ExportPayload,
  PublicCertification,
  PublicEducation,
  PublicExperience,
  PublicProjectCard,
  PublicTechGroup,
} from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
import { cn } from '@/lib/utils';

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
    <h2 className="mb-3 flex break-after-avoid items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary print:mb-2">
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </h2>
  );
}

/** Title + right-aligned date, then a muted detail line. In print the header never splits from its first lines. */
function Entry({
  title,
  date,
  detail,
  children,
}: {
  title: ReactNode;
  date?: string;
  detail?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="break-inside-avoid break-after-avoid">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-semibold leading-snug text-foreground">{title}</h3>
          {date ? (
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">{date}</span>
          ) : null}
        </div>
        {detail ? <p className="text-[0.95em] text-muted-foreground">{detail}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-1 text-foreground/85">
      {items.map((item, i) => (
        <li key={i} className="relative break-inside-avoid pl-4 leading-relaxed before:absolute before:left-0 before:text-primary before:content-['▸']">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** "https://www.linkedin.com/in/x/" -> "linkedin.com/in/x". */
function shortUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

const dot = <span aria-hidden="true" className="text-border">•</span>;

/** Printable CV. Sections render in the payload's key order (the preset's order). */
export function CvPrintableView({ data, labels }: { data: CvExportPayload; labels: CvLabels }) {
  const isAts = data.preset.template === 'ats';
  const isOnePage = data.preset.template === 'one_page';
  const locale = data.preset.locale;
  const month = (d: string | null) => formatMonthYear(d, locale);
  const period = (start: string | null, end: string | null) =>
    start ? `${month(start)} – ${end ? month(end) : labels.present}` : '';
  const line = (...parts: (string | null | undefined)[]) => parts.filter(Boolean).join(' · ');

  const renderers: Record<string, (items: unknown[]) => ReactNode> = {
    experience: (items) => (
      <section key="experience">
        <Heading>{labels.experience}</Heading>
        <div className="space-y-4">
          {(items as PublicExperience[]).map((exp) => (
            <Entry
              key={exp.id}
              title={exp.role}
              date={period(exp.startDate, exp.endDate)}
              detail={
                <>
                  <span className="font-medium text-primary">{exp.organization?.name}</span>
                  {[exp.location, exp.employmentType.label]
                    .filter(Boolean)
                    .map((part) => ` · ${part}`)
                    .join('')}
                </>
              }
            >
              {exp.description && !isOnePage ? <p className="text-foreground/85">{exp.description}</p> : null}
              <Bullets items={[...exp.responsibilities, ...exp.achievements]} />
            </Entry>
          ))}
        </div>
      </section>
    ),
    projects: (items) => (
      <section key="projects">
        <Heading>{labels.projects}</Heading>
        <div className="space-y-3">
          {(items as PublicProjectCard[]).map((proj) => (
            <Entry
              key={proj.slug}
              title={proj.title}
              date={period(proj.periodStart, proj.periodEnd)}
              detail={line(proj.client?.name, proj.technologies?.map((t) => t.name).slice(0, 5).join(', '))}
            >
              <p className="text-foreground/85">{proj.summary}</p>
              {!isOnePage ? <Bullets items={proj.responsibilities ?? []} /> : null}
            </Entry>
          ))}
        </div>
      </section>
    ),
    education: (items) => (
      <section key="education">
        <Heading>{labels.education}</Heading>
        <div className="space-y-3">
          {(items as PublicEducation[]).map((edu) => (
            <Entry
              key={edu.id}
              title={edu.organization?.name}
              date={period(edu.startDate, edu.endDate)}
              detail={line(
                [edu.degree, edu.field].filter(Boolean).join(', '),
                edu.gpa ? `${labels.gpa} ${edu.gpa}${edu.gpaScale ? `/${edu.gpaScale}` : ''}` : null,
              )}
            />
          ))}
        </div>
      </section>
    ),
    skills: (items) => (
      <section key="skills">
        <Heading>{labels.skills}</Heading>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5">
          {(items as PublicTechGroup[]).map((g) => (
            <div key={g.group.code} className="contents">
              <dt className="font-semibold text-foreground">{g.group.label}</dt>
              <dd className="text-foreground/85">{g.items.map((s) => s.name).join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>
    ),
    certifications: (items) => (
      <section key="certifications">
        <Heading>{labels.certifications}</Heading>
        <div className="space-y-2">
          {(items as PublicCertification[]).map((cert) => (
            <Entry key={cert.id} title={cert.name} date={month(cert.issueDate)} detail={cert.issuer?.name} />
          ))}
        </div>
      </section>
    ),
  };

  const profile = data.profile;
  return (
    <article
      className={cn(
        // On screen: an A4 sheet. In print: the page margins come from @page below.
        'mx-auto w-full max-w-[210mm] bg-card px-6 py-8 text-foreground shadow-lg ring-1 ring-border sm:px-[14mm] sm:py-[14mm]',
        'print:max-w-none print:bg-transparent print:p-0 print:shadow-none print:ring-0',
        isAts && 'font-sans',
        isOnePage ? 'space-y-4 text-xs' : 'space-y-6 text-[13px] leading-relaxed',
      )}
    >
      {/* Print on plain paper: drop the site's tinted grid background. */}
      <style>{'@page { size: A4; margin: 14mm 15mm; } @media print { html, body { background: white !important; } body * { background-image: none !important; } }'}</style>
      {profile ? (
        <header className="border-b-2 border-primary pb-5">
          <h1 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground">
            {profile.name}
          </h1>
          {profile.headline ? <p className="mt-1 text-[15px] font-medium text-primary">{profile.headline}</p> : null}
          <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            {profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : null}
            {profile.location ? (
              <>
                {dot}
                <span>{profile.location}</span>
              </>
            ) : null}
            {profile.socials.map((s) => (
              <span key={s.platform.code} className="contents">
                {dot}
                <a href={s.url} className="hover:text-primary">
                  {shortUrl(s.url)}
                </a>
              </span>
            ))}
          </p>
          {profile.bio ? <p className="mt-4 text-foreground/85">{profile.bio}</p> : null}
        </header>
      ) : null}

      {Object.entries(data.sections).map(([key, items]) =>
        items.length > 0 ? renderers[key]?.(items) : null,
      )}
    </article>
  );
}
