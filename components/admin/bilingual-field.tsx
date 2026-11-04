'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function BilingualField({
  label,
  valueId,
  valueEn,
  onChangeId,
  onChangeEn,
  multiline = false,
  required = false,
}: {
  label: string;
  valueId: string;
  valueEn: string;
  onChangeId: (val: string) => void;
  onChangeEn: (val: string) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  const [tab, setTab] = React.useState<'en' | 'id'>('en');

  return (
    <div className="space-y-2 rounded-md border border-border p-3">
      <div className="flex items-center justify-between">
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="inline-flex rounded-md border border-border bg-muted p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab('en')}
            className={`rounded px-2 py-0.5 font-medium ${
              tab === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setTab('id')}
            className={`rounded px-2 py-0.5 font-medium ${
              tab === 'id' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            ID
          </button>
        </div>
      </div>

      {tab === 'en' ? (
        multiline ? (
          <Textarea
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder={`${label} (English)`}
            required={required}
          />
        ) : (
          <Input
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder={`${label} (English)`}
            required={required}
          />
        )
      ) : multiline ? (
        <Textarea
          value={valueId}
          onChange={(e) => onChangeId(e.target.value)}
          placeholder={`${label} (Bahasa Indonesia)`}
        />
      ) : (
        <Input
          value={valueId}
          onChange={(e) => onChangeId(e.target.value)}
          placeholder={`${label} (Bahasa Indonesia)`}
        />
      )}
    </div>
  );
}

