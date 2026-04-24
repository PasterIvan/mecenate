import { Image } from "expo-image";
import { memo, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LikeIcon } from "@/assets/components/like-icon";
import { tokens } from "@/constants/tokens";
import { Comment } from "@/types/feed";

type PostCommentItemProps = {
  comment: Comment;
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function PostCommentItemComponent({ comment }: PostCommentItemProps) {
  const initialMeta = useMemo(() => {
    const seed = hashString(comment.id);
    const likesCount = seed % 9;
    const isLiked = seed % 7 === 0;
    return { likesCount, isLiked };
  }, [comment.id]);
  console.log(comment);
  const [isLiked, setIsLiked] = useState(initialMeta.isLiked);
  const [likesCount, setLikesCount] = useState(initialMeta.likesCount);

  const toggleLike = () => {
    setIsLiked((prevLiked) => {
      const nextLiked = !prevLiked;
      setLikesCount((prevCount) =>
        Math.max(0, prevCount + (nextLiked ? 1 : -1)),
      );
      return nextLiked;
    });
  };

  return (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: comment.author.avatarUrl }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentBody}>
        <Text style={styles.commentAuthor}>{comment.author.displayName}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
      <Pressable style={styles.likeColumn} onPress={toggleLike} hitSlop={8}>
        <LikeIcon
          color={
            isLiked ? tokens.colors.likeActive : tokens.colors.textTertiary
          }
        />
        <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
          {likesCount}
        </Text>
      </Pressable>
    </View>
  );
}

export const PostCommentItem = memo(PostCommentItemComponent);

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.sm,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.border,
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentAuthor: {
    fontFamily: "Manrope_700Bold",
    color: tokens.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  commentText: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    color: tokens.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  likeColumn: {
    alignItems: "center",
    gap: 2,
    flexDirection: "row",
  },
  likeCount: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.textTertiary,
    flexDirection: "row",
  },
  likeCountActive: {
    color: tokens.colors.likeActive,
  },
});
