import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { darkTheme } from './src/config/theme';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <AppNavigator />
      <StatusBar style="light" />
    </PaperProvider>
  );
}