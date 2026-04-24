import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { memo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { togglePostLike } from "@/api/posts";
import { CommentIcon } from "@/assets/components/comment-icon";
import { LikeIcon } from "@/assets/components/like-icon";
import { ExpandablePreview } from "@/components/feed/expandable-preview";
import { PaidPostCardContent } from "@/components/feed/paid-post-card-content";
import { PostAuthorRow } from "@/components/post/post-author-row";
import { tokens } from "@/constants/tokens";
import { usePostStore } from "@/stores/root-store-context";
import { FeedPage, Post } from "@/types/feed";

type FeedPostCardProps = {
  post: Post;
  previewText?: string;
  expandedPreview?: boolean;
  openPostOnPress?: boolean;
};

export function FeedPostCardComponent({
  post,
  previewText,
  expandedPreview = false,
  openPostOnPress = true,
}: FeedPostCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const postStore = usePostStore();
  const isPaid = post.tier === "paid";
  const contentPreview = previewText ?? post.preview;

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(post.id),
    onSuccess: ({ isLiked, likesCount }) => {
      queryClient.setQueryData(
        ["post", post.id],
        (current: Post | undefined) => {
          const next = current ? { ...current, isLiked, likesCount } : current;
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
                postItem.id === post.id
                  ? { ...postItem, isLiked, likesCount }
                  : postItem,
              ),
            })),
          };
        },
      );
    },
  });

  const handleLikePress = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeMutation.mutate();
  };

  const handleCardPress = () => {
    if (!openPostOnPress) {
      return;
    }
    postStore.rememberFromFeed(post);
    router.push(`/posts/${post.id}`);
  };

  return (
    <Pressable onPress={handleCardPress} style={styles.card}>
      <PostAuthorRow author={post.author} />
      {isPaid ? (
        <PaidPostCardContent coverUrl={post.coverUrl} />
      ) : (
        <>
          <View style={styles.postInfo}>
            <Image
              source={{ uri: post.coverUrl }}
              style={styles.cover}
              contentFit="cover"
            />
            <Text numberOfLines={2} style={styles.title}>
              {post.title}
            </Text>
            {expandedPreview ? (
              <Text style={styles.preview}>{contentPreview}</Text>
            ) : (
              <ExpandablePreview text={contentPreview} />
            )}
          </View>
          <View style={styles.statsRow}>
            <Pressable
              style={[styles.statPill, post.isLiked && styles.statPillActive]}
              onPress={handleLikePress}
              disabled={likeMutation.isPending}
            >
              <LikeIcon
                width={20}
                height={20}
                color={post.isLiked ? tokens.colors.white : undefined}
              />
              <Text
                style={[
                  styles.statValue,
                  post.isLiked && styles.statValueActive,
                ]}
              >
                {post.likesCount}
              </Text>
            </Pressable>
            <View style={styles.statPill}>
              <CommentIcon width={20} height={20} />
              <Text style={styles.statValue}>{post.commentsCount}</Text>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

export const FeedPostCard = memo(FeedPostCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  cover: {
    aspectRatio: 1,
    marginHorizontal: -tokens.spacing.lg,
    backgroundColor: tokens.colors.border,
  },
  postInfo: {
    gap: tokens.spacing.sm,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: tokens.typography.title,
    lineHeight: 26,
    color: tokens.colors.textPrimary,
  },
  preview: {
    fontFamily: "Manrope_500Medium",
    fontSize: tokens.typography.body,
    lineHeight: 20,
    color: tokens.colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.sm,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.xs,
    backgroundColor: tokens.colors.pillBackground,
    borderRadius: tokens.radius.full,
    padding: 6,
  },
  statPillActive: {
    backgroundColor: tokens.colors.likeActive,
  },
  statValue: {
    color: tokens.colors.textTertiary,
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    lineHeight: 18,
  },
  statValueActive: {
    color: tokens.colors.white,
  },
});
