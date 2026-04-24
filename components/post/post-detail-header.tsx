import { FeedPostCardComponent } from "@/components/feed/feed-post-card";
import { PostCommentsSectionHeader } from "@/components/post/post-comments-section-header";
import { tokens } from "@/constants/tokens";
import { Post } from "@/types/feed";
import { StyleSheet, View } from "react-native";

type PostDetailHeaderProps = {
  post: Post;
};

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
  return (
    <View style={styles.postCardContainer}>
      <FeedPostCardComponent
        post={post}
        openPostOnPress={false}
        previewText={
          post.tier === "paid"
            ? "Контент скрыт пользователем. Доступ откроется после доната."
            : post.body
        }
        expandedPreview
      />
      <PostCommentsSectionHeader count={post.commentsCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  postCardContainer: {
    marginHorizontal: -tokens.spacing.lg,
  },
});
