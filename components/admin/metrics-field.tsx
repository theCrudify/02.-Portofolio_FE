'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface MetricItem {
  value: string;
  label_en: string;
  label_id: string;
}

export function MetricsField({
  metrics,
  onChange,
}: {
  metrics: MetricItem[];
  onChange: (next: MetricItem[]) => void;
}) {
  function handleAdd() {
    if (metrics.length >= 12) return;
    onChange([...metrics, { value: '', label_en: '', label_id: '' }]);
  }

  function handleUpdate(idx: number, patch: Partial<MetricItem>) {
    const next = [...metrics];
    next[idx] = { ...next[idx]!, ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Key Metrics (max 12)</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Add Metric
        </Button>
      </div>
      <div className="space-y-2">
        {metrics.map((m, idx) => (
          <div key={idx} className="grid gap-2 sm:grid-cols-4">
            <Input
              value={m.value}
              onChange={(e) => handleUpdate(idx, { value: e.target.value })}
              placeholder="Value (e.g. -64%)"
            />
            <Input
              value={m.label_en}
              onChange={(e) => handleUpdate(idx, { label_en: e.target.value })}
              placeholder="Label (EN)"
            />
            <Input
              value={m.label_id}
              onChange={(e) => handleUpdate(idx, { label_id: e.target.value })}
              placeholder="Label (ID)"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(metrics.filter((_, i) => i !== idx))}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
