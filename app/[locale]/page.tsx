import type { Metadata } from 'next';
import { AchievementsSection } from '@/components/sections/achievements-section';
import { ActivitiesSection } from '@/components/sections/activities-section';
import { AboutSection } from '@/components/sections/about-section';
import { CertificationsSection } from '@/components/sections/certifications-section';
import { ContactSection } from '@/components/sections/contact-section';
import { EducationSection } from '@/components/sections/education-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { GithubSection } from '@/components/sections/github-section';
import { HeroSection } from '@/components/sections/hero';
import { ProjectsSection } from '@/components/sections/projects-section';
import { PublicationsSection } from '@/components/sections/publications-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import {
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  JsonLdScript,
} from '@/components/seo/json-ld';
import { fetchSiteData } from '@/lib/api/server';
import type { SectionKey, SupportedLocale } from '@/lib/api/types';
import { buildMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const site = await fetchSiteData(typedLocale);

  const title =
    site.settings.seo.title ||
    `${site.profile?.name ?? 'Portfolio'} · ${site.profile?.headline ?? 'Software Engineer'}`;
  const description =
    site.settings.seo.description ||
    site.profile?.bio ||
    'Personal portfolio and engineering case studies.';

  return buildMetadata({
    title,
    description,
    path: '/',
    locale: typedLocale,
    image: site.settings.seo.ogImage?.url,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Without this next-intl reads the locale from headers, which breaks on-demand static rendering.
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const site = await fetchSiteData(typedLocale);

  const hiddenSet = new Set(site.settings.hiddenSections ?? []);
  const orderedSections = (site.settings.sectionOrder ?? []).filter(
    (key): key is SectionKey => !hiddenSet.has(key),
  );

  let visibleNonHeroIndex = 0;

  return (
    <>
      <JsonLdScript data={buildPersonJsonLd(site.profile)} />
      <JsonLdScript
        data={buildWebSiteJsonLd(
          site.profile?.name ?? 'Portfolio',
          site.settings.seo.description ?? site.profile?.headline ?? '',
        )}
      />

      {orderedSections.map((key) => {
        if (key === 'hero') {
          return (
            <HeroSection
              key="hero"
              profile={site.profile}
              settings={site.settings}
              stats={site.stats}
              locale={typedLocale}
              projects={site.featuredProjects}
            />
          );
        }

        const isMuted = visibleNonHeroIndex % 2 === 0;
        visibleNonHeroIndex += 1;

        switch (key) {
          case 'about':
            return <AboutSection key="about" profile={site.profile} muted={isMuted} />;
          case 'projects':
            return (
              <ProjectsSection
                key="projects"
                projects={site.featuredProjects}
                muted={isMuted}
              />
            );
          case 'skills':
            return (
              <SkillsSection
                key="skills"
                technologies={site.technologies}
                muted={isMuted}
              />
            );
          case 'experience':
            return (
              <ExperienceSection
                key="experience"
                experiences={site.experiences}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          case 'education':
            return (
              <EducationSection
                key="education"
                education={site.education}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          case 'certifications':
            return (
              <CertificationsSection
                key="certifications"
                certifications={site.certifications}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          case 'activities':
            return (
              <ActivitiesSection
                key="activities"
                activities={site.activities}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          case 'achievements':
            return (
              <AchievementsSection
                key="achievements"
                achievements={site.achievements}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          case 'publications':
            return (
              <PublicationsSection
                key="publications"
                publications={site.publications}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          case 'testimonials':
            return (
              <TestimonialsSection
                key="testimonials"
                testimonials={site.testimonials}
                muted={isMuted}
              />
            );
          case 'github':
            return <GithubSection key="github" github={site.github} muted={isMuted} />;
          case 'contact':
            return (
              <ContactSection
                key="contact"
                profile={site.profile}
                locale={typedLocale}
                muted={isMuted}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
