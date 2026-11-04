'use client';

import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface DetailDialogProps {
  title: string;
  label: string;
  children: ReactNode;
}

/** "View details" button + dialog. Portalled to <body>: cards use backdrop-blur, which traps `fixed` children. */
export function DetailDialog({ title, label, children }: DetailDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open
        ? createPortal(
            <Dialog open onOpenChange={setOpen} title={title} className="max-w-2xl">
              {children}
            </Dialog>,
            document.body,
          )
        : null}
    </>
  );
}
