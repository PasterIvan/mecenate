import { FeedUiStore } from '@/stores/feed-ui-store';

export class RootStore {
  readonly feedUiStore: FeedUiStore;

  constructor() {
    this.feedUiStore = new FeedUiStore();
  }
}
