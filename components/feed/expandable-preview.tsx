import { memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/constants/tokens";

type ExpandablePreviewProps = {
  text: string;
};

const PREVIEW_COLLAPSED_LINES = 2;
const PREVIEW_ACTION_TEXT = "Показать еще";
const PREVIEW_RESERVED_CHARS = PREVIEW_ACTION_TEXT.length + 6;

function ExpandablePreviewComponent({ text }: ExpandablePreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean | null>(null);
  const [collapsedText, setCollapsedText] = useState(text);

  const handleMeasureLayout = (event: { nativeEvent: { lines: { text: string }[] } }) => {
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
      .join("");
    const trimLength = Math.max(0, visibleText.length - PREVIEW_RESERVED_CHARS);
    const nextCollapsedText = visibleText.slice(0, trimLength).trimEnd();

    setIsOverflowing(true);
    setCollapsedText(nextCollapsedText.length > 0 ? `${nextCollapsedText}... ` : "");
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

export const ExpandablePreview = memo(ExpandablePreviewComponent);

const styles = StyleSheet.create({
  preview: {
    fontFamily: "Manrope_500Medium",
    fontSize: tokens.typography.body,
    lineHeight: 20,
    color: tokens.colors.textSecondary,
  },
  previewContainer: {
    position: "relative",
  },
  previewMeasure: {
    position: "absolute",
    left: 0,
    right: 0,
    opacity: 0,
    fontFamily: "Manrope_500Medium",
    fontSize: tokens.typography.body,
    lineHeight: 20,
    color: tokens.colors.textSecondary,
  },
  previewAction: {
    color: tokens.colors.accentStrong,
    fontFamily: "Manrope_500Medium",
    fontSize: tokens.typography.body,
    lineHeight: 20,
  },
});
