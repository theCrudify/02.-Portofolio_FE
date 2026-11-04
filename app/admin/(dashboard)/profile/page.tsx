'use client';

import { SingletonEditor } from '@/components/admin/singleton-editor';
import { PROFILE_FIELDS } from '@/lib/admin/singletons';

export default function AdminProfilePage() {
  return (
    <SingletonEditor
      endpoint="/v1/admin/profile"
      title="Profile"
      description="Bilingual bio, availability, social links, languages and interests."
      fields={PROFILE_FIELDS}
    />
  );
}
