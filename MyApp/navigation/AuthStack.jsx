import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '@/app/(auth)/Login';
import Register from '@/app/(auth)/Register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
