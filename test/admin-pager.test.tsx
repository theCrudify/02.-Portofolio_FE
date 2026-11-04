import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Pager } from '@/components/admin/pager';

describe('Admin Pager', () => {
  it('renders nothing when everything fits on one page', () => {
    const { container } = render(<Pager page={1} total={50} limit={50} onPage={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows page count and moves between pages', () => {
    const onPage = vi.fn();
    render(<Pager page={1} total={120} limit={50} onPage={onPage} />);
    expect(screen.getByText('Page 1 of 3 (120 items)')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPage).toHaveBeenCalledWith(2);
  });
});
