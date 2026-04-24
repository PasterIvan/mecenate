import { requireApiConfig } from '@/api/client';

export function getRealtimeUrl() {
  const { apiBaseUrl, testUserUuid } = requireApiConfig();
  const wsBaseUrl = apiBaseUrl.replace(/^http/, 'ws');
  return `${wsBaseUrl}/ws?token=${encodeURIComponent(testUserUuid)}`;
}
