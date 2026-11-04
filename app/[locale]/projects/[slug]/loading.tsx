import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailLoading() {
  return (
    <Container className="space-y-8 py-12 md:py-20">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-20 w-full max-w-2xl" />
      <Skeleton className="aspect-video w-full rounded-lg" />
    </Container>
  );
}

