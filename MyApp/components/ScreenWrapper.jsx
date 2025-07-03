import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenWrapper({ children }) {
  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      {children}
    </SafeAreaView>
  );
}
