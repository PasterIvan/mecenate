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
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
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

export interface PostDetailResponse {
  ok: boolean;
  data: {
    post: Post;
  };
}

export interface LikeResponse {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentsResponse {
  ok: boolean;
  data: CommentsPage;
}

export interface CommentCreatedResponse {
  ok: boolean;
  data: {
    comment: Comment;
  };
}
