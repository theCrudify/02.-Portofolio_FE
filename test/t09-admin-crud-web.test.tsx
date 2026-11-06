import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProvider } from '@/components/admin/role-gate';
import { DataTable } from '@/components/admin/data-table';
import { pageWindow } from '@/components/admin/pager';
import { BilingualField } from '@/components/admin/bilingual-field';

describe('T09 · Admin CRUD Web Components', () => {
  it('DataTable hides Publish/Archive/Trash actions for editor and shows them for owner', () => {
    const items = [
      { id: '1', titleEn: 'Edge Gateway', category: 'backend', status: 'draft' },
    ];
    const listProps = {
      offset: 10,
      loading: false,
      status: 'all' as const,
      onStatus: vi.fn(),
      search: '',
      onSearch: vi.fn(),
      sort: 'default' as const,
      onSort: vi.fn(),
    };

    const { rerender } = render(
      <UserProvider
        user={{
          id: '2',
          email: 'editor@example.com',
          name: 'Editor',
          role: 'editor',
          totpEnabled: false,
        }}
      >
        <DataTable
          items={items}
          {...listProps}
          primaryColumn="titleEn"
          secondaryColumn="category"
          onEdit={vi.fn()}
          onTransition={vi.fn()}
          onSoftDelete={vi.fn()}
          onPermanentDelete={vi.fn()}
        />
      </UserProvider>
    );

    expect(screen.getByText('Edge Gateway')).toBeTruthy();
    // Row numbers continue across pages: first row of page 2 (offset 10) is 11.
    expect(screen.getByText('11')).toBeTruthy();
    expect(screen.queryByText('Publish')).toBeNull();

    rerender(
      <UserProvider
        user={{
          id: '1',
          email: 'owner@example.com',
          name: 'Owner',
          role: 'owner',
          totpEnabled: true,
        }}
      >
        <DataTable
          items={items}
          {...listProps}
          primaryColumn="titleEn"
          secondaryColumn="category"
          onEdit={vi.fn()}
          onTransition={vi.fn()}
          onSoftDelete={vi.fn()}
          onPermanentDelete={vi.fn()}
        />
      </UserProvider>
    );

    expect(screen.getByText('Publish')).toBeTruthy();
  });

  it('pageWindow shows first, last and neighbours with gaps', () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(6, 20)).toEqual([1, 'gap', 5, 6, 7, 'gap', 20]);
    expect(pageWindow(20, 20)).toEqual([1, 'gap', 17, 18, 19, 20]);
  });

  it('BilingualField switches between EN and ID tabs properly', () => {
    const onChangeId = vi.fn();
    const onChangeEn = vi.fn();

    render(
      <BilingualField
        label="Headline"
        valueId="Insinyur Perangkat Lunak"
        valueEn="Software Engineer"
        onChangeId={onChangeId}
        onChangeEn={onChangeEn}
      />
    );

    expect(screen.getByDisplayValue('Software Engineer')).toBeTruthy();
    fireEvent.click(screen.getByText('ID'));
    expect(screen.getByDisplayValue('Insinyur Perangkat Lunak')).toBeTruthy();
  });
});

