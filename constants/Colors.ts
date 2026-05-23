/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const SemanticColors = {
  background: '#FFF9EF',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF3DC',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  accentPrimary: '#D97706',
  accentSoft: '#FDE7C3',
  border: '#F1D7AE',
  success: '#15803D',
  warning: '#C2410C',
  danger: '#B91C1C',
};
