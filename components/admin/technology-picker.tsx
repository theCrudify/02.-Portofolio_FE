'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export interface TechOption {
  id: string;
  name: string;
  category: string;
}

export function TechnologyPicker({
  options,
  selectedIds,
  onChange,
}: {
  options: TechOption[];
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
}) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="space-y-2">
      <Label>Technologies ({selectedIds.length} selected)</Label>
      <div className="flex flex-wrap gap-2 rounded-md border border-border p-3">
        {options.length === 0 ? (
          <span className="text-xs text-muted-foreground">No technologies available.</span>
        ) : (
          options.map((tech) => {
            const active = selectedIds.includes(tech.id);
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggle(tech.id)}
                aria-pressed={active}
              >
                <Badge variant={active ? 'default' : 'outline'}>{tech.name}</Badge>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

