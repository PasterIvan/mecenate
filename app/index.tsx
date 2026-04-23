import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFeedPage } from '@/api/feed-api';
import { FeedErrorState } from '@/components/feed/feed-error-state';
import { FeedPostList } from '@/components/feed/feed-post-list';
import { tokens } from '@/constants/tokens';
import { FeedPage } from '@/types/feed';

function FeedScreen() {
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedPage>({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data?.pages],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.accent} />
      </View>
    );
  }

  if (isError && posts.length === 0) {
    return <FeedErrorState onRetry={() => refetch()} />;
  }

  return (
    <View style={styles.container}>
      <FeedPostList
        posts={posts}
        topInset={insets.top}
        bottomInset={insets.bottom}
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        onRefetch={refetch}
      />
    </View>
  );
}

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
  },
});
