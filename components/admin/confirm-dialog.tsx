'use client';

import { AlertTriangle, HelpCircle, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmTone = 'danger' | 'warning' | 'question';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
}

const TONES: Record<ConfirmTone, { icon: typeof Trash2; ring: string; button: 'destructive' | 'default' }> = {
  danger: { icon: Trash2, ring: 'bg-destructive/10 text-destructive ring-destructive/20', button: 'destructive' },
  warning: { icon: AlertTriangle, ring: 'bg-warning/15 text-warning ring-warning/25', button: 'default' },
  question: { icon: HelpCircle, ring: 'bg-primary/10 text-primary ring-primary/20', button: 'default' },
};

/** Centered alert-style confirmation: tone icon, title, explanation, Cancel / Confirm. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'question',
  onConfirm,
  onCancel,
}: ConfirmOptions & { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  const { icon: Icon, ring, button } = TONES[tone];
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm motion-safe:animate-[confirm-fade_150ms_ease-out]"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-desc' : undefined}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-2xl motion-safe:animate-[confirm-pop_180ms_cubic-bezier(0.2,0.9,0.3,1.2)]"
      >
        <span className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-8', ring)}>
          <Icon className="h-7 w-7" />
        </span>
        <h2 id="confirm-dialog-title" className="mt-5 text-lg font-semibold text-foreground">
          {title}
        </h2>
        {description ? (
          <p id="confirm-dialog-desc" className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button autoFocus type="button" variant={button} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

const ConfirmContext = React.createContext<(options: ConfirmOptions) => Promise<boolean>>(
  async () => true,
);

/** Mount once (AdminShell); then `const confirm = useConfirm(); if (await confirm({...})) …`. */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const confirm = React.useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ ...options, resolve })),
    [],
  );
  const close = React.useCallback(
    (ok: boolean) =>
      setState((current) => {
        current?.resolve(ok);
        return null;
      }),
    [],
  );
  const cancel = React.useCallback(() => close(false), [close]);
  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state ? <ConfirmDialog open {...state} onConfirm={() => close(true)} onCancel={cancel} /> : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return React.useContext(ConfirmContext);
}
