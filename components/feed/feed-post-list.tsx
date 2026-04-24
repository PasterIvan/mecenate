import { useInfiniteQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchFeedPage } from "@/api/posts";
import { FeedFilter, FeedFilterTabs } from "@/components/feed/feed-filter-tabs";
import { FeedErrorState } from "@/components/feed/feed-error-state";
import { FeedPostCard } from "@/components/feed/feed-post-card";
import { tokens } from "@/constants/tokens";
import { useFeedUiStore } from "@/stores/root-store-context";
import { FeedPage, Post } from "@/types/feed";

export const FeedPostList = observer(function FeedPostList() {
  const insets = useSafeAreaInsets();
  const feedUiStore = useFeedUiStore();
  const [filter, setFilter] = useState<FeedFilter>("all");

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedPage>({
    queryKey: ["feed", filter],
    queryFn: ({ pageParam }) =>
      fetchFeedPage(pageParam as string | undefined, filter),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data?.pages],
  );

  const onRefresh = useCallback(async () => {
    feedUiStore.setPullRefreshing(true);
    try {
      await refetch();
    } finally {
      feedUiStore.setPullRefreshing(false);
    }
  }, [feedUiStore, refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderPostItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <FeedPostCard post={item} />,
    [],
  );

  const filterTabs = (
    <View style={[styles.tabsContainer, { paddingTop: insets.top }]}>
      <FeedFilterTabs value={filter} onChange={setFilter} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.screen}>
        {filterTabs}
        <View style={styles.centeredBody}>
          <ActivityIndicator color={tokens.colors.accent} />
        </View>
      </View>
    );
  }

  if (isError && posts.length === 0) {
    return (
      <View style={styles.screen}>
        {filterTabs}
        <View style={styles.centeredBody}>
          <FeedErrorState onRetry={() => void refetch()} />
        </View>
      </View>
    );
  }

  return (
    <FlatList<Post>
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        { marginTop: insets.top, paddingBottom: insets.bottom },
      ]}
      renderItem={renderPostItem}
      refreshing={feedUiStore.isPullRefreshing}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <FeedFilterTabs value={filter} onChange={setFilter} />
      }
      stickyHeaderIndices={[0]}
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
  screen: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  tabsContainer: {
    paddingBottom: tokens.spacing.sm,
    backgroundColor: tokens.colors.background,
  },
  listContent: {
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  centeredBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "fixed",
    paddingVertical: tokens.spacing.lg,
  },
});
