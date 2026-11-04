import { Badge } from '@/components/ui/badge';

export function StatusBadge({
  status,
  deletedAt,
}: {
  status: 'draft' | 'published' | 'archived' | string;
  deletedAt?: string | null;
}) {
  if (deletedAt) {
    return <Badge variant="destructive">Deleted</Badge>;
  }
  if (status === 'published') {
    return <Badge variant="success">Published</Badge>;
  }
  if (status === 'archived') {
    return <Badge variant="secondary">Archived</Badge>;
  }
  return <Badge variant="warning">Draft</Badge>;
}
