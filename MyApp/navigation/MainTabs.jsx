import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/app/(tabs)/Home';
import Activity from '@/app/(tabs)/Activity';
import Profile from '@/app/(tabs)/Profile';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
