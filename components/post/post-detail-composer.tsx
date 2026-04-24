import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { createPostComment } from "@/api/posts";
import { tokens } from "@/constants/tokens";
import { usePostStore } from "@/stores/root-store-context";
import { Comment, Post } from "@/types/feed";

type PostDetailComposerProps = {
  postId: string;
  bottomInset: number;
  onCommentCreated: (comment: Comment) => void;
};

export function PostDetailComposer({
  postId,
  bottomInset,
  onCommentCreated,
}: PostDetailComposerProps) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const postStore = usePostStore();

  const createCommentMutation = useMutation({
    mutationFn: (value: string) => createPostComment(postId, value),
    onSuccess: (comment) => {
      onCommentCreated(comment);
      const latestPost = queryClient.getQueryData<Post>(["post", postId]);
      if (latestPost) {
        postStore.upsert(latestPost);
      }
      setText("");
    },
  });

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    createCommentMutation.mutate(trimmed);
  };

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: Math.max(bottomInset, tokens.spacing.md) },
      ]}
    >
      <View style={styles.row}>
        <TextInput
          placeholder="Ваш комментарий"
          placeholderTextColor={tokens.colors.textSecondary}
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Pressable
          onPress={handleSend}
          disabled={createCommentMutation.isPending}
          style={[
            styles.send,
            createCommentMutation.isPending && styles.sendDisabled,
          ]}
          hitSlop={8}
        >
          <Ionicons name="arrow-up" size={20} color={tokens.colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 14,
    backgroundColor: tokens.colors.surface,
    paddingLeft: tokens.spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 0,
    color: tokens.colors.textPrimary,
    fontFamily: "Manrope_500Medium",
    fontSize: tokens.typography.body,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colors.accentStrong,
  },
  sendDisabled: {
    opacity: 0.55,
  },
});
