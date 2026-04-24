import { FeedUiStore } from '@/stores/feed-ui-store';
import { PostStore } from '@/stores/post-store';

export class RootStore {
  readonly feedUiStore: FeedUiStore;
  readonly postStore: PostStore;

  constructor() {
    this.feedUiStore = new FeedUiStore();
    this.postStore = new PostStore();
  }
}
