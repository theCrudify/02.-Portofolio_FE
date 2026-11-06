import { describe, it, expect } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ConfirmProvider, useConfirm } from '@/components/admin/confirm-dialog';

function Harness({ onResult }: { onResult: (ok: boolean) => void }) {
  const confirm = useConfirm();
  return (
    <button type="button" onClick={async () => onResult(await confirm({ title: 'Delete forever?', confirmLabel: 'Delete', tone: 'danger' }))}>
      ask
    </button>
  );
}

describe('Admin confirm dialog', () => {
  it('resolves true on confirm and false on cancel, then closes', async () => {
    const results: boolean[] = [];
    render(
      <ConfirmProvider>
        <Harness onResult={(ok) => results.push(ok)} />
      </ConfirmProvider>,
    );

    fireEvent.click(screen.getByText('ask'));
    expect(screen.getByRole('alertdialog').textContent).toContain('Delete forever?');
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Delete' })));
    expect(screen.queryByRole('alertdialog')).toBeNull();

    fireEvent.click(screen.getByText('ask'));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Cancel' })));

    expect(results).toEqual([true, false]);
  });
});
