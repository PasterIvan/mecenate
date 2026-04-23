export type Tier = 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  tier: Tier;
  createdAt: string;
}

export interface FeedPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PostsResponse {
  ok: boolean;
  data: FeedPage;
}
