import { createContext, ReactNode, useContext } from 'react';

import { RootStore } from '@/stores/root-store';

const RootStoreContext = createContext<RootStore | null>(null);

type RootStoreProviderProps = {
  store: RootStore;
  children: ReactNode;
};

export function RootStoreProvider({ store, children }: RootStoreProviderProps) {
  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
}

export function useRootStore() {
  const store = useContext(RootStoreContext);

  if (!store) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }

  return store;
}

export function useFeedUiStore() {
  return useRootStore().feedUiStore;
}

export function usePostStore() {
  return useRootStore().postStore;
}
