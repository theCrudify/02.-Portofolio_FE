import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsLoading() {
  return (
    <Container className="py-16 md:py-24">
      <Skeleton className="mb-3 h-4 w-32" />
      <Skeleton className="mb-10 h-10 w-64" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-96 w-full rounded-md" />
        ))}
      </div>
    </Container>
  );
}
