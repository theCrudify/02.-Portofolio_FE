'use client';

import { SingletonEditor } from '@/components/admin/singleton-editor';
import { APPEARANCE_FIELDS } from '@/lib/admin/singletons';

export default function AdminAppearancePage() {
  return (
    <SingletonEditor
      endpoint="/v1/admin/settings"
      title="Appearance"
      description="Theme, color mode, fonts, hero buttons and the order of home page sections."
      fields={APPEARANCE_FIELDS}
    />
  );
}
