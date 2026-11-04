'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { ADMIN_RESOURCES } from '@/lib/admin/resources';
import { ResourceForm } from '@/components/admin/resource-form';
import { TechnologyPicker, type TechOption } from '@/components/admin/technology-picker';
import { LinkEditor, type ProjectLinkItem } from '@/components/admin/link-editor';
import { MetricsField, type MetricItem } from '@/components/admin/metrics-field';
import { BulletListField } from '@/components/admin/bullet-list-field';
import { MediaPicker } from '@/components/admin/media-picker';
import { Button } from '@/components/ui/button';

export default function AdminEditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params.id;

  const [project, setProject] = React.useState<Record<string, unknown> | null>(null);
  const [techOptions, setTechOptions] = React.useState<TechOption[]>([]);
  const [selectedTechIds, setSelectedTechIds] = React.useState<string[]>([]);
  const [links, setLinks] = React.useState<ProjectLinkItem[]>([]);
  const [metrics, setMetrics] = React.useState<MetricItem[]>([]);
  const [highlightsEn, setHighlightsEn] = React.useState<string[]>([]);
  const [coverMediaId, setCoverMediaId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<Record<string, unknown>>(`/v1/admin/projects/${projectId}`)
      .then((res) => {
        setProject(res.data);
        setCoverMediaId((res.data.coverMediaId as string | null) ?? null);
        if (Array.isArray(res.data.metrics)) {
          setMetrics(res.data.metrics as MetricItem[]);
        }
        if (Array.isArray(res.data.highlightsEn)) {
          setHighlightsEn(res.data.highlightsEn as string[]);
        }
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Project not found.'));

    apiFetch<TechOption[]>('/v1/admin/technologies')
      .then((res) => setTechOptions(res.data))
      .catch(() => null);
  }, [projectId]);

  async function handleSaveMain(values: Record<string, unknown>) {
    setError(null);
    setStatusMsg(null);
    try {
      const updated = await apiFetch<Record<string, unknown>>(`/v1/admin/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...values,
          coverMediaId,
          metrics,
          highlightsEn,
          confirmSlugChange: true,
        }),
      });
      setProject(updated.data);
      setStatusMsg('Project saved.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save project.');
    }
  }

  async function handleSaveRelations() {
    setError(null);
    setStatusMsg(null);
    try {
      await apiFetch(`/v1/admin/projects/${projectId}/technologies`, {
        method: 'PUT',
        body: JSON.stringify({
          items: selectedTechIds.map((technologyId, sortOrder) => ({
            technologyId,
            sortOrder,
          })),
        }),
      });
      setStatusMsg('Project technologies & links updated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update relations.');
    }
  }

  if (!project) {
    return <div className="p-4 text-sm text-muted-foreground">Loading project...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Project: {String(project.titleEn ?? project.slug)}
          </h1>
          <p className="text-sm text-muted-foreground">Status: {String(project.status)}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/projects')}>
          Back to Projects
        </Button>
      </div>

      {statusMsg && (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">{statusMsg}</div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <ResourceForm
        meta={ADMIN_RESOURCES.projects}
        initialValues={project}
        onSubmit={handleSaveMain}
      />

      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Case Study Details & Relations</h2>
        <MediaPicker
          label="Cover Image"
          value={coverMediaId}
          onChange={(id) => setCoverMediaId(id)}
          acceptKind="image"
        />
        <BulletListField
          label="Highlights (English)"
          items={highlightsEn}
          onChange={setHighlightsEn}
        />
        <MetricsField metrics={metrics} onChange={setMetrics} />
        <TechnologyPicker
          options={techOptions}
          selectedIds={selectedTechIds}
          onChange={setSelectedTechIds}
        />
        <LinkEditor links={links} onChange={setLinks} />
        <div className="flex justify-end">
          <Button type="button" onClick={handleSaveRelations}>
            Save Technologies & Links
          </Button>
        </div>
      </div>
    </div>
  );
}
