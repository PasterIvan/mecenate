import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchPostComments, fetchPostDetail } from "@/api/posts";
import { getRealtimeUrl } from "@/api/realtime";
import { FeedErrorState } from "@/components/feed/feed-error-state";
import { PostCommentItem } from "@/components/post/post-comment-item";
import { PostDetailComposer } from "@/components/post/post-detail-composer";
import { PostDetailHeader } from "@/components/post/post-detail-header";
import { tokens } from "@/constants/tokens";
import { usePostRealtime } from "@/hooks/use-post-realtime";
import { usePostStore } from "@/stores/root-store-context";
import { Comment, FeedPage, Post } from "@/types/feed";

function mergeComments(primary: Comment[], secondary: Comment[]) {
  const uniqueMap = new Map<string, Comment>();
  [...primary, ...secondary].forEach((item) => {
    uniqueMap.set(item.id, item);
  });
  return Array.from(uniqueMap.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

const PostDetailsScreen = observer(function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const postStore = usePostStore();

  const [realtimeComments, setRealtimeComments] = useState<Comment[]>([]);
  const knownCommentIdsRef = useRef(new Set<string>());

  const cachedPost = postId ? postStore.getCached(postId) : undefined;

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostDetail(postId as string),
    enabled: Boolean(postId),
    initialData: cachedPost,
    initialDataUpdatedAt: cachedPost ? 0 : undefined,
  });

  useEffect(() => {
    if (!post) {
      return;
    }
    postStore.upsert(post);
  }, [post, postStore]);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isFetchingNextPage: isFetchingCommentsNextPage,
    hasNextPage: hasMoreComments,
    fetchNextPage: fetchCommentsNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery({
    queryKey: ["post-comments", postId],
    queryFn: ({ pageParam }) => fetchPostComments(postId as string, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(postId),
  });

  const comments = useMemo(() => {
    const pagedComments =
      commentsData?.pages.flatMap((page) => page.comments) ?? [];
    return mergeComments(realtimeComments, pagedComments);
  }, [commentsData?.pages, realtimeComments]);

  useEffect(() => {
    knownCommentIdsRef.current = new Set(comments.map((item) => item.id));
  }, [comments]);

  const incrementCommentCounters = useCallback(
    (commentId: string) => {
      if (knownCommentIdsRef.current.has(commentId)) {
        return;
      }
      knownCommentIdsRef.current.add(commentId);

      queryClient.setQueryData(
        ["post", postId],
        (current: Post | undefined) => {
          const next = current
            ? { ...current, commentsCount: current.commentsCount + 1 }
            : current;
          if (next) {
            postStore.upsert(next);
          }
          return next;
        },
      );
      queryClient.setQueriesData(
        { queryKey: ["feed"] },
        (data: { pages: FeedPage[] } | undefined) => {
          if (!data) {
            return data;
          }

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              posts: page.posts.map((postItem) =>
                postItem.id === postId
                  ? { ...postItem, commentsCount: postItem.commentsCount + 1 }
                  : postItem,
              ),
            })),
          };
        },
      );
    },
    [postId, postStore, queryClient],
  );

  usePostRealtime({
    url: getRealtimeUrl(),
    onLikeUpdated: useCallback(
      ({ postId: eventPostId, likesCount }) => {
        if (postId !== eventPostId) {
          return;
        }

        queryClient.setQueryData(
          ["post", postId],
          (current: Post | undefined) => {
            const next = current ? { ...current, likesCount } : current;
            if (next) {
              postStore.upsert(next);
            }
            return next;
          },
        );

        queryClient.setQueriesData(
          { queryKey: ["feed"] },
          (data: { pages: FeedPage[] } | undefined) => {
            if (!data) {
              return data;
            }

            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                posts: page.posts.map((postItem) =>
                  postItem.id === postId
                    ? { ...postItem, likesCount }
                    : postItem,
                ),
              })),
            };
          },
        );
      },
      [postId, postStore, queryClient],
    ),
    onCommentAdded: useCallback(
      ({ postId: postIdParam, comment }) => {
        if (postId !== postIdParam) {
          return;
        }
        setRealtimeComments((previous) => mergeComments([comment], previous));
        incrementCommentCounters(comment.id);
      },
      [incrementCommentCounters, postId],
    ),
  });

  if (!postId) {
    return <FeedErrorState onRetry={() => Promise.resolve()} />;
  }

  if (isPostPending && !post) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.accent} />
      </View>
    );
  }

  if (isPostError || !post) {
    return <FeedErrorState onRetry={() => refetchPost()} />;
  }

  const handleCommentCreated = (comment: Comment) => {
    setRealtimeComments((previous) => mergeComments([comment], previous));
    incrementCommentCounters(comment.id);
  };

  const renderCommentItem: ListRenderItem<Comment> = ({ item }) => (
    <PostCommentItem comment={item} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList<Comment>
        data={comments}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
        onEndReached={() => {
          if (hasMoreComments && !isFetchingCommentsNextPage) {
            fetchCommentsNextPage();
          }
        }}
        onEndReachedThreshold={0.6}
        ListHeaderComponent={<PostDetailHeader post={post} />}
        renderItem={renderCommentItem}
        ListEmptyComponent={
          isCommentsLoading ? (
            <ActivityIndicator color={tokens.colors.accent} />
          ) : (
            <Text style={styles.emptyCommentsText}>Пока нет комментариев</Text>
          )
        }
        ListFooterComponent={
          isFetchingCommentsNextPage ? (
            <View style={styles.commentsFooter}>
              <ActivityIndicator color={tokens.colors.accent} />
            </View>
          ) : null
        }
        refreshing={false}
        onRefresh={() => refetchComments()}
      />
      <PostDetailComposer
        postId={postId}
        bottomInset={insets.bottom}
        onCommentCreated={handleCommentCreated}
      />
    </KeyboardAvoidingView>
  );
});

export default PostDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colors.surface,
  },
  content: {
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
  },
  emptyCommentsText: {
    textAlign: "center",
    color: tokens.colors.textSecondary,
    fontFamily: "Manrope_500Medium",
    paddingVertical: tokens.spacing.lg,
  },
  commentsFooter: {
    paddingVertical: tokens.spacing.md,
  },
});
