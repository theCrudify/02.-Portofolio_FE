import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Pager } from '@/components/admin/pager';

describe('Admin Pager', () => {
  it('renders nothing when the list is empty', () => {
    const { container } = render(<Pager page={1} total={0} limit={50} onPage={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows the range but no page buttons when everything fits on one page', () => {
    render(<Pager page={1} total={7} limit={10} onPage={vi.fn()} />);
    expect(screen.getByRole('navigation').textContent).toContain('Showing 1–7 of 7');
    expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull();
  });

  it('shows the range, numbered pages and moves between pages', () => {
    const onPage = vi.fn();
    const onLimit = vi.fn();
    render(<Pager page={2} total={120} limit={50} onPage={onPage} onLimit={onLimit} />);
    expect(screen.getByRole('navigation').textContent).toContain('Showing 51–100 of 120');
    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page');
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPage).toHaveBeenCalledWith(3);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(onPage).toHaveBeenCalledWith(1);
    fireEvent.change(screen.getByRole('combobox', { name: 'Rows per page' }), { target: { value: '25' } });
    expect(onLimit).toHaveBeenCalledWith(25);
  });
});
