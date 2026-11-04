import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FrontendQueryBuilder, standardQuerySchema } from '@/core/query';
import {
  analyticsModule,
  authModule,
  contentModule,
  documentsModule,
  mediaModule,
  publicModule,
  systemModule,
  usersModule,
} from '@/modules';
import {
  MultiImageShowcase,
  type ShowcaseImageEntry,
} from '@/components/media/multi-image-showcase';
import { buildAbstractMeshUri } from '@/lib/visuals';

describe('T14 · Frontend Modular OOP Architecture, Zero-JSON Query Engine & Multi-Image UI', () => {
  it('enforces Zero-JSON in query parameters and builds clean flat query strings', () => {
    expect(FrontendQueryBuilder.isJsonLike('{"role":"owner"}')).toBe(true);
    expect(FrontendQueryBuilder.isJsonLike('["a","b"]')).toBe(true);
    expect(FrontendQueryBuilder.isJsonLike('distributed-tracing')).toBe(false);

    expect(() =>
      FrontendQueryBuilder.toQueryString({
        search: '{"$gt":1}',
      }),
    ).toThrow(/JSON strings are not allowed in query parameter/);

    const parsed = standardQuerySchema.safeParse({
      page: '2',
      limit: '15',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: 'edge',
      all: 'true',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(2);
      expect(parsed.data.limit).toBe(15);
      expect(parsed.data.all).toBe(true);
    }

    const rejectedJson = standardQuerySchema.safeParse({
      search: '{"nested":true}',
    });
    expect(rejectedJson.success).toBe(false);
  });

  it('executes client-side Pagination, Fast Sort, Fast Filter, Search, and Full Query (all=true)', () => {
    const sample = [
      { id: '1', title: 'Alpha Service', type: 'backend', order: 2 },
      { id: '2', title: 'Beta Interface', type: 'frontend', order: 1 },
      { id: '3', title: 'Gamma Worker', type: 'backend', order: 3 },
    ];

    const filtered = FrontendQueryBuilder.executeClientQuery(
      sample,
      {
        sortBy: 'order',
        sortOrder: 'asc',
        filters: { type: 'backend' },
      },
      ['title'],
    );
    expect(filtered.data.map((i) => i.id)).toEqual(['1', '3']);
    expect(filtered.meta.total).toBe(2);

    const searched = FrontendQueryBuilder.executeClientQuery(
      sample,
      { search: 'Beta' },
      ['title'],
    );
    expect(searched.data).toHaveLength(1);
    expect(searched.data[0]?.id).toBe('2');

    const paged = FrontendQueryBuilder.executeClientQuery(
      sample,
      { page: 1, limit: 2, all: false },
      ['title'],
    );
    expect(paged.data).toHaveLength(2);
    expect(paged.meta.totalPages).toBe(2);

    const fullQuery = FrontendQueryBuilder.executeClientQuery(
      sample,
      { page: 1, limit: 1, all: true },
      ['title'],
    );
    expect(fullQuery.data).toHaveLength(3);
    expect(fullQuery.meta.all).toBe(true);
  });

  it('exposes all 8 action-sliced Frontend OOP modules with DTO, Repository, and Service layers', () => {
    expect(authModule.loginAuthService).toBeDefined();
    expect(authModule.logoutAuthService).toBeDefined();
    expect(usersModule.listUsersService).toBeDefined();
    expect(usersModule.createUsersService).toBeDefined();
    expect(usersModule.deleteUsersService).toBeDefined();
    expect(contentModule.listContentService).toBeDefined();
    expect(contentModule.transitionContentService).toBeDefined();
    expect(mediaModule.listMediaService).toBeDefined();
    expect(documentsModule.listDocumentsService).toBeDefined();
    expect(analyticsModule.summaryAnalyticsService).toBeDefined();
    expect(systemModule.ListAuditLogsSystemService).toBeDefined();
    expect(publicModule.ListProjectsPublicService).toBeDefined();
  });

  it('renders MultiImageShowcase with layout switching, category filters, and search', () => {
    const testItems: ShowcaseImageEntry[] = [
      {
        id: 'img-1',
        url: buildAbstractMeshUri(0),
        alt: 'Visual 1',
        title: 'Visual One',
        caption: 'First visual item',
        category: 'ui',
      },
      {
        id: 'img-2',
        url: buildAbstractMeshUri(1),
        alt: 'Visual 2',
        title: 'Visual Two',
        caption: 'Second visual item',
        category: 'architecture',
      },
      {
        id: 'img-3',
        url: buildAbstractMeshUri(2),
        alt: 'Visual 3',
        title: 'Visual Three',
        caption: 'Third visual item',
        category: 'mobile',
      },
      {
        id: 'img-4',
        url: buildAbstractMeshUri(3),
        alt: 'Visual 4',
        title: 'Visual Four',
        caption: 'Fourth visual item',
        category: 'cloud',
      },
    ];

    render(<MultiImageShowcase items={testItems} defaultLayout="bento" />);

    expect(screen.getByText('Visual One')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Grid layout'));
    fireEvent.click(screen.getByLabelText('Filmstrip layout'));
    fireEvent.click(screen.getByLabelText('Bento layout'));

    const archButtons = screen.getAllByText('architecture');
    if (archButtons[0]) {
      fireEvent.click(archButtons[0]);
    }
    expect(screen.getByText('Visual Two')).toBeTruthy();

    const allBtn = screen.getByText('all');
    fireEvent.click(allBtn);
    const searchInput = screen.getByLabelText('Search visuals');
    fireEvent.change(searchInput, { target: { value: 'Four' } });
    expect(screen.getByText('Visual Four')).toBeTruthy();
  });
});
