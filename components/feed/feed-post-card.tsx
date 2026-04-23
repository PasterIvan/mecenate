import {Image} from 'expo-image';
import {memo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import { CommentIcon } from '@/assets/components/comment-icon';
import { DollarIcon } from '@/assets/components/dollar-icon';
import { LikeIcon } from '@/assets/components/like-icon';
import {tokens} from '@/constants/tokens';
import {Post} from '@/types/feed';

type FeedPostCardProps = {
  post: Post;
};

const PREVIEW_COLLAPSED_LINES = 2;
const PREVIEW_ACTION_TEXT = 'Показать еще';
const PREVIEW_RESERVED_CHARS = PREVIEW_ACTION_TEXT.length + 6;

function ExpandablePreview({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean | null>(null);
  const [collapsedText, setCollapsedText] = useState(text);

  const handleMeasureLayout = (event: { nativeEvent: { lines: Array<{ text: string }> } }) => {
    if (isOverflowing !== null) {
      return;
    }

    const lines = event.nativeEvent.lines;

    if (lines.length <= PREVIEW_COLLAPSED_LINES) {
      setIsOverflowing(false);
      setCollapsedText(text);
      return;
    }

    const visibleText = lines
      .slice(0, PREVIEW_COLLAPSED_LINES)
      .map((line) => line.text)
      .join('');
    const trimLength = Math.max(0, visibleText.length - PREVIEW_RESERVED_CHARS);
    const nextCollapsedText = visibleText.slice(0, trimLength).trimEnd();

    setIsOverflowing(true);
    setCollapsedText(nextCollapsedText.length > 0 ? `${nextCollapsedText}... ` : '');
  };

  return (
    <View style={styles.previewContainer}>
      {isOverflowing === null ? (
        <Text style={styles.previewMeasure} onTextLayout={handleMeasureLayout}>
          {text}
        </Text>
      ) : null}

      {expanded ? (
        <Text style={styles.preview}>{text}</Text>
      ) : isOverflowing ? (
        <Text style={styles.preview}>
          {collapsedText}
          <Text onPress={() => setExpanded(true)} style={styles.previewAction}>
            {PREVIEW_ACTION_TEXT}
          </Text>
        </Text>
      ) : (
        <Text numberOfLines={PREVIEW_COLLAPSED_LINES} style={styles.preview}>
          {text}
        </Text>
      )}
    </View>
  );
}

function FeedPostCardComponent({ post }: FeedPostCardProps) {
  const isPaid = post.tier === 'paid';
  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.displayName}</Text>
      </View>
      {isPaid ? (
        <View style={styles.paidContent}>
          <View style={styles.paidHero}>
            <Image source={{ uri: post.coverUrl }} style={styles.cover} contentFit="cover" blurRadius={24} />
            <View style={styles.paidOverlay}>
              <View style={styles.paidBadge}>
                <DollarIcon width={30} height={30} color={tokens.colors.white} />
              </View>
              <Text style={styles.paidMessage}>
                Контент скрыт пользователем.
                {'\n'}
                Доступ откроется после доната
              </Text>
              <Pressable style={styles.paidButton} hitSlop={8}>
                <Text style={styles.paidButtonText}>Отправить донат</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.paidSkeleton}>
            <View style={[styles.paidSkeletonLine, styles.paidSkeletonShort]} />
            <View style={styles.paidSkeletonLine} />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.postInfo}>
            <Image source={{ uri: post.coverUrl }} style={styles.cover} contentFit="cover" />
            <Text numberOfLines={2} style={styles.title}>
              {post.title}
            </Text>
            <ExpandablePreview text={post.preview} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <LikeIcon width={20} height={20} />
              <Text style={styles.statValue}>{post.likesCount}</Text>
            </View>
            <View style={styles.statPill}>
              <CommentIcon width={20} height={20} />
              <Text style={styles.statValue}>{post.commentsCount}</Text>
            </View>
          </View>
        </>
      )}
    </View>
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
  cover: {
    aspectRatio: 1,
    marginHorizontal: -tokens.spacing.lg,
    backgroundColor: tokens.colors.border,
  },
  postInfo: {
    gap: tokens.spacing.sm,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: tokens.typography.title,
    lineHeight: 26,
    color: tokens.colors.textPrimary,
  },
  preview: {
    fontFamily: 'Manrope_500Medium',
    fontSize: tokens.typography.body,
    lineHeight: 20,
    color: tokens.colors.textSecondary,
  },
  previewContainer: {
    position: 'relative',
  },
  previewMeasure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
    fontFamily: 'Manrope_500Medium',
    fontSize: tokens.typography.body,
    lineHeight: 20,
    color: tokens.colors.textSecondary,
  },
  previewAction: {
    color: tokens.colors.accentStrong,
    fontFamily: 'Manrope_500Medium',
    fontSize: tokens.typography.body,
    lineHeight: 20,
  },
  paidContent: {
    marginHorizontal: -tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
  },
  paidHero: {
    position: 'relative',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  paidOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: tokens.colors.paidCoverOverlay,
    gap: tokens.spacing.md,
  },
  paidBadge: {
    borderRadius: 10,
    padding: 6,
    backgroundColor: tokens.colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidMessage: {
    color: tokens.colors.white,
    textAlign: 'center',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
  paidButton: {
    width: 239,
    height: 42,
    gap: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.accentStrong,
  },
  paidButtonText: {
    color: tokens.colors.white,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 26,
  },
  paidSkeleton: {
    backgroundColor: tokens.colors.skeletonSurface,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  paidSkeletonLine: {
    height: 36,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.skeleton,
  },
  paidSkeletonShort: {
    width: '45%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    backgroundColor: tokens.colors.pillBackground,
    borderRadius: tokens.radius.full,
    padding: 6,
  },
  statValue: {
    color: tokens.colors.textTertiary,
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    lineHeight: 18,
  },
});
