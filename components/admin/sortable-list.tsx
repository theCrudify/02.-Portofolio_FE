'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export function SortableList<T extends { id: string }>({
  items,
  renderItem,
  onReorder,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onReorder: (nextItems: T[]) => void;
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed!);
    onReorder(next);
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3"
        >
          <div className="min-w-0 flex-1">{renderItem(item, idx)}</div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={idx === 0}
              onClick={() => move(idx, -1)}
              aria-label="Move up"
            >
              ↑
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={idx === items.length - 1}
              onClick={() => move(idx, 1)}
              aria-label="Move down"
            >
              ↓
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
