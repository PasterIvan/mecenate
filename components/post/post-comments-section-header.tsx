import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/constants/tokens";

type PostCommentsSectionHeaderProps = {
  count: number;
};

function formatCommentsCount(count: number) {
  if (count === 0) {
    return "Нет комментариев";
  }

  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} комментарий`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} комментария`;
  }

  return `${count} комментариев`;
}

export function PostCommentsSectionHeader({
  count,
}: PostCommentsSectionHeaderProps) {
  const label = formatCommentsCount(count);

  return (
    <View style={styles.row}>
      <Text style={styles.count}>{label}</Text>
      <Pressable hitSlop={8}>
        <Text style={styles.sort}>Сначала новые</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
  },
  count: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.textSecondary,
  },
  sort: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.accentStrong,
  },
});
