import { FeedPage, PostsResponse } from '@/types/feed';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TEST_USER_UUID = process.env.EXPO_PUBLIC_TEST_USER_UUID;

export async function fetchFeedPage(cursor?: string): Promise<FeedPage> {
  if (!API_BASE_URL || !TEST_USER_UUID) {
    throw new Error('Отсутствуют env переменные EXPO_PUBLIC_API_BASE_URL или EXPO_PUBLIC_TEST_USER_UUID');
  }

  const params = new URLSearchParams({ limit: '10' });
  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await fetch(`${API_BASE_URL}/posts?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${TEST_USER_UUID}`,
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить публикации');
  }

  const payload = (await response.json()) as PostsResponse;

  if (!payload.ok) {
    throw new Error('Не удалось загрузить публикации');
  }

  return payload.data;
}
