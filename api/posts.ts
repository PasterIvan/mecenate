import { getApiBaseUrl, getAuthHeaders } from "@/api/client";
import {
  Comment,
  CommentCreatedResponse,
  CommentsPage,
  CommentsResponse,
  FeedPage,
  LikeResponse,
  Post,
  PostDetailResponse,
  PostsResponse,
  Tier,
} from "@/types/feed";

export async function fetchFeedPage(
  cursor?: string,
  tier?: Tier | "all",
): Promise<FeedPage> {
  const headers = getAuthHeaders();
  const apiBaseUrl = getApiBaseUrl();

  const params = new URLSearchParams({ limit: "10" });
  if (cursor) {
    params.append("cursor", cursor);
  }
  if (tier && tier !== "all") {
    params.append("tier", tier);
  }

  const response = await fetch(`${apiBaseUrl}/posts?${params.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить публикации");
  }

  const payload = (await response.json()) as PostsResponse;

  if (!payload.ok) {
    throw new Error("Не удалось загрузить публикации");
  }

  return payload.data;
}

export async function fetchPostDetail(postId: string): Promise<Post> {
  const headers = getAuthHeaders();
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/posts/${postId}`, { headers });

  if (!response.ok) {
    throw new Error("Не удалось загрузить публикацию");
  }

  const payload = (await response.json()) as PostDetailResponse;
  if (!payload.ok) {
    throw new Error("Не удалось загрузить публикацию");
  }

  return payload.data.post;
}

export async function togglePostLike(postId: string) {
  const headers = getAuthHeaders();
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/posts/${postId}/like`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить лайк");
  }

  const payload = (await response.json()) as LikeResponse;
  if (!payload.ok) {
    throw new Error("Не удалось обновить лайк");
  }

  return payload.data;
}

export async function fetchPostComments(
  postId: string,
  cursor?: string,
): Promise<CommentsPage> {
  const headers = getAuthHeaders();
  const apiBaseUrl = getApiBaseUrl();
  const params = new URLSearchParams({ limit: "20" });

  if (cursor) {
    params.append("cursor", cursor);
  }

  const response = await fetch(
    `${apiBaseUrl}/posts/${postId}/comments?${params.toString()}`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Не удалось загрузить комментарии");
  }

  const payload = (await response.json()) as CommentsResponse;
  if (!payload.ok) {
    throw new Error("Не удалось загрузить комментарии");
  }

  return payload.data;
}

export async function createPostComment(
  postId: string,
  text: string,
): Promise<Comment> {
  const headers = getAuthHeaders();
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/posts/${postId}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Не удалось отправить комментарий");
  }

  const payload = (await response.json()) as CommentCreatedResponse;
  if (!payload.ok) {
    throw new Error("Не удалось отправить комментарий");
  }

  return payload.data.comment;
}
