import { makeAutoObservable } from 'mobx';

export class FeedUiStore {
  isPullRefreshing = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPullRefreshing(value: boolean) {
    this.isPullRefreshing = value;
  }
}
