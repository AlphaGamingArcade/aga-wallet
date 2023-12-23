import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/home';
import SettingsTab from './tabs/settings';
import TransactionsTab from './tabs/transactions';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BOTTOM_TAB_HEIGHT, COLORS, FONT_FAMILY } from '../utils/app_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function IndexScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        backgroundColor: COLORS.WHITE,
        tabBarStyle: { height: BOTTOM_TAB_HEIGHT },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
          fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
          textTransform: 'capitalize',
        },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: '#838383',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = 'home';
          } else if (route.name === 'transactions') {
            iconName = focused ? 'list' : 'list';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings-sharp' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen
        name="transactions"
        component={TransactionsTab}
        options={{ tabBarBadge: 3, tabBarBadgeStyle: { backgroundColor: COLORS.PRIMARY } }}
      />
      <Tab.Screen name="settings" component={SettingsTab} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 75,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    gap: 85,
    padding: 10,
  },
  navbarItems: {
    display: 'flex',
    alignItems: 'center',
  },
  navBarIMG: {
    width: 30,
    height: 27,
  },
  notActive: {
    color: '#838383',
  },
});
