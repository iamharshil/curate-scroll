import { MD3DarkTheme } from 'react-native-paper';

/**
 * Dark Material Design theme for CurateScroll
 * Following Material Design 3 dark theme guidelines
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    secondary: '#03DAC6',
    tertiary: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    error: '#CF6679',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
    text: '#FFFFFF',
    placeholder: '#B0B0B0',
    disabled: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#232323',
      level3: '#272727',
      level4: '#2C2C2C',
      level5: '#2E2E2E',
    },
  },
  dark: true,
};

/**
 * Additional custom colors for the app
 */
export const colors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  primary: '#BB86FC',
  secondary: '#03DAC6',
  accent: '#CF6679',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#666666',
  border: '#333333',
  divider: '#2C2C2C',
  error: '#CF6679',
  success: '#03DAC6',
  warning: '#FFA726',
  card: '#1E1E1E',
  cardElevated: '#2C2C2C',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export default darkTheme;
