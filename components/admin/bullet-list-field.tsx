'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function BulletListField({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
}) {
  function handleUpdate(index: number, val: string) {
    const next = [...items];
    next[index] = val;
    onChange(next);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, idx) => idx !== index));
  }

  function handleAdd() {
    if (items.length >= 20) return;
    onChange([...items, '']);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Add Bullet
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              placeholder={`Highlight #${idx + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(idx)}
              aria-label={`Remove bullet ${idx + 1}`}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

