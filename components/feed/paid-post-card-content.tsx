import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DollarIcon } from "@/assets/components/dollar-icon";
import { tokens } from "@/constants/tokens";

type PaidPostCardContentProps = {
  coverUrl: string;
};

function PaidPostCardContentComponent({ coverUrl }: PaidPostCardContentProps) {
  return (
    <View style={styles.paidContent}>
      <View style={styles.paidHero}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.cover}
          contentFit="cover"
          blurRadius={24}
        />
        <View style={styles.paidOverlay}>
          <View style={styles.paidBadge}>
            <DollarIcon width={30} height={30} color={tokens.colors.white} />
          </View>
          <Text style={styles.paidMessage}>
            Контент скрыт пользователем.
            {"\n"}
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
  );
}

export const PaidPostCardContent = memo(PaidPostCardContentComponent);

const styles = StyleSheet.create({
  paidContent: {
    marginHorizontal: -tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
  },
  paidHero: {
    position: "relative",
    aspectRatio: 1,
    overflow: "hidden",
  },
  cover: {
    aspectRatio: 1,
    marginHorizontal: -tokens.spacing.lg,
    backgroundColor: tokens.colors.border,
  },
  paidOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: tokens.colors.paidCoverOverlay,
    gap: tokens.spacing.md,
  },
  paidBadge: {
    borderRadius: 10,
    padding: 6,
    backgroundColor: tokens.colors.accentStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  paidMessage: {
    color: tokens.colors.white,
    textAlign: "center",
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    lineHeight: 20,
    fontVariant: ["lining-nums", "tabular-nums"],
  },
  paidButton: {
    width: 239,
    height: 42,
    gap: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colors.accentStrong,
  },
  paidButtonText: {
    color: tokens.colors.white,
    fontFamily: "Manrope_600SemiBold",
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
    width: "45%",
  },
});
