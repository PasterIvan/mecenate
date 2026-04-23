import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';

type FeedErrorStateProps = {
  onRetry: () => void;
};

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Не удалось загрузить публикации</Text>
      <Pressable onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Повторить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
  },
  button: {
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.accent,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
  },
  buttonText: {
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
  },
});
