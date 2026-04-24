import { makeAutoObservable } from 'mobx';

import { Post } from '@/types/feed';

export class PostStore {
  private postsById = new Map<string, Post>();

  constructor() {
    makeAutoObservable(this);
  }

  rememberFromFeed(post: Post) {
    this.postsById.set(post.id, post);
  }

  getCached(postId: string): Post | undefined {
    return this.postsById.get(postId);
  }

  upsert(post: Post) {
    this.postsById.set(post.id, post);
  }
}
