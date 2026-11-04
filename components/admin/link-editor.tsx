'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ProjectLinkItem {
  type: string;
  label: string;
  url: string;
  isPrivate: boolean;
}

export function LinkEditor({
  links,
  onChange,
}: {
  links: ProjectLinkItem[];
  onChange: (next: ProjectLinkItem[]) => void;
}) {
  function handleAdd() {
    onChange([...links, { type: 'demo', label: 'Live Demo', url: '', isPrivate: false }]);
  }

  function handleUpdate(idx: number, patch: Partial<ProjectLinkItem>) {
    const next = [...links];
    next[idx] = { ...next[idx]!, ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Project Links</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Add Link
        </Button>
      </div>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-4">
            <select
              value={link.type}
              onChange={(e) => handleUpdate(idx, { type: e.target.value })}
              className="flex h-10 rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="demo">Demo</option>
              <option value="repo">Repository</option>
              <option value="repo_frontend">Frontend Repo</option>
              <option value="repo_backend">Backend Repo</option>
              <option value="api_docs">API Docs</option>
              <option value="design">Design</option>
              <option value="video">Video</option>
              <option value="other">Other</option>
            </select>
            <Input
              value={link.label}
              onChange={(e) => handleUpdate(idx, { label: e.target.value })}
              placeholder="Label"
            />
            <Input
              value={link.url}
              onChange={(e) => handleUpdate(idx, { url: e.target.value })}
              placeholder="https://..."
            />
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={link.isPrivate}
                  onChange={(e) => handleUpdate(idx, { isPrivate: e.target.checked })}
                />
                Private
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(links.filter((_, i) => i !== idx))}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
