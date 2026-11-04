import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';

export default function RootNotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-2 font-heading text-3xl font-bold">Page Not Found</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <div className="mt-6">
        <Link href="/" className={buttonVariants({ variant: 'default' })}>
          Back to Home
        </Link>
      </div>
    </Container>
  );
}

