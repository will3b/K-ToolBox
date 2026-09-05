import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SettingsClient } from './settings-client';

export const metadata: Metadata = {
  title: 'Settings — K-ToolBox',
  description: 'Configure AI provider and API settings for K-ToolBox.',
};

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsClient />
    </Suspense>
  );
}
