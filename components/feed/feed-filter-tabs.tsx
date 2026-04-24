import { memo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { tokens } from "@/constants/tokens";
import { Tier } from "@/types/feed";

export type FeedFilter = "all" | Tier;

type FeedFilterTabsProps = {
  value: FeedFilter;
  onChange: (value: FeedFilter) => void;
};

const FILTER_OPTIONS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "free", label: "Бесплатные" },
  { value: "paid", label: "Платные" },
];

function FeedFilterTabsComponent({ value, onChange }: FeedFilterTabsProps) {
  return (
    <View style={styles.row}>
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const FeedFilterTabs = memo(FeedFilterTabsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 30,
    backgroundColor: tokens.colors.surface,
    marginHorizontal: tokens.spacing.lg,
  } satisfies ViewStyle,
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  tabActive: {
    backgroundColor: tokens.colors.accentStrong,
  } satisfies ViewStyle,
  tabLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    color: tokens.colors.textSecondary,
  } satisfies TextStyle,
  tabLabelActive: {
    fontFamily: "Manrope_700Bold",
    color: tokens.colors.white,
  } satisfies TextStyle,
});
