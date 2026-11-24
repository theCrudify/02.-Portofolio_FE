import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  neighbours,
  PortfolioDetailPage,
} from "@/components/sections/portfolio-detail";
import { fetchSiteData } from "@/lib/api/server";
import type { PublicEducation, SupportedLocale } from "@/lib/api/types";
import { formatDuration, formatPeriod } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; id: string }>;

const titleOf = (edu: PublicEducation) =>
  [edu.degree, edu.field].filter(Boolean).join(" · ") ||
  edu.organization?.name ||
  "";

// Every published education entry is already in the (cached) site payload.
async function loadEducation(locale: SupportedLocale) {
  return (await fetchSiteData(locale)).education;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === "id" ? "id" : "en";
  const edu = (await loadEducation(typedLocale)).find((e) => e.id === id);
  return buildMetadata({
    title: edu
      ? `${titleOf(edu)} · ${edu.organization?.name ?? ""}`
      : "Not found",
    description: edu?.description ?? "",
    path: `/education/${id}`,
    locale: typedLocale,
    image: edu?.attachments?.find((a) => a.kind === "image")?.url,
    noIndex: !edu,
  });
}

export default async function EducationDetailPage({
  params,
}: {
  params: Params;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === "id" ? "id" : "en";
  const [t, tSection, list] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: "sections.extras" }),
    getTranslations({ locale: typedLocale, namespace: "sections.education" }),
    loadEducation(typedLocale),
  ]);
  const index = list.findIndex((e) => e.id === id);
  const edu = list[index];
  if (!edu) notFound();

  return (
    <PortfolioDetailPage
      {...edu}
      {...neighbours(list, index, (e) => ({
        href: `/education/${e.id}`,
        title: titleOf(e),
      }))}
      title={titleOf(edu)}
      backHref="/#education"
      backLabel={tSection("title")}
      trackId={`education-${edu.id}`}
      kicker={
        edu.startDate
          ? formatPeriod(edu.startDate, edu.endDate, typedLocale)
          : null
      }
      organization={edu.organization}
      achievements={edu.activities}
      achievementsTitle={tSection("campusActivities")}
      facts={[
        {
          label: tSection("gpa"),
          value: edu.gpa ? `${edu.gpa} / ${edu.gpaScale ?? "4.00"}` : null,
        },
        {
          label: t("duration"),
          value: edu.startDate
            ? formatDuration(edu.startDate, edu.endDate, typedLocale)
            : null,
        },
      ]}
    />
  );
}
