import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { FeedPostCard } from '@/components/feed/feed-post-card';
import { tokens } from '@/constants/tokens';
import { useFeedUiStore } from '@/stores/root-store-context';
import { Post } from '@/types/feed';

type FeedPostListProps = {
  posts: Post[];
  topInset: number;
  bottomInset: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => Promise<unknown>;
  onRefetch: () => Promise<unknown>;
};

export const FeedPostList = observer(function FeedPostList({
  posts,
  topInset,
  bottomInset,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onRefetch,
}: FeedPostListProps) {
  const feedUiStore = useFeedUiStore();

  const onRefresh = useCallback(async () => {
    feedUiStore.setPullRefreshing(true);
    try {
      await onRefetch();
    } finally {
      feedUiStore.setPullRefreshing(false);
    }
  }, [feedUiStore, onRefetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      onFetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  return (
    <FlatList<Post>
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        { marginTop: topInset, paddingBottom: bottomInset },
      ]}
      renderItem={({ item }) => <FeedPostCard post={item} />}
      refreshing={feedUiStore.isPullRefreshing}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color={tokens.colors.accent} />
          </View>
        ) : null
      }
    />
  );
});

const styles = StyleSheet.create({
  listContent: {
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  footer: {
    paddingVertical: tokens.spacing.lg,
  },
});
