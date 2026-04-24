import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';
import { Author } from '@/types/feed';

type PostAuthorRowProps = {
  author: Author;
};

function PostAuthorRowComponent({ author }: PostAuthorRowProps) {
  return (
    <View style={styles.authorRow}>
      <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
      <Text style={styles.authorName}>{author.displayName}</Text>
    </View>
  );
}

export const PostAuthorRow = memo(PostAuthorRowComponent);

const styles = StyleSheet.create({
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.border,
  },
  authorName: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: tokens.typography.body,
    color: tokens.colors.textPrimary,
  },
});
