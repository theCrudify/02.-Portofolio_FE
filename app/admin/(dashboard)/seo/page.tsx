'use client';

import { SingletonEditor } from '@/components/admin/singleton-editor';
import { SEO_FIELDS } from '@/lib/admin/singletons';

export default function AdminSeoPage() {
  return (
    <SingletonEditor
      endpoint="/v1/admin/settings"
      title="SEO Global"
      description="Default title, description and share image for the whole site."
      fields={SEO_FIELDS}
    />
  );
}
