import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/home';
import SettingsTab from './tabs/settings';
import TransactionsTab from './tabs/transactions';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import homeIconRed from '../assets/home-icon-red.png';
import homeIconGray from '../assets/home-icon-gray.png';
import transactionsIconRed from '../assets/transactions-icon-red.png';
import transactionsIconGray from '../assets/transactions-icon-gray.png';
import settingsIconRed from '../assets/settings-icon-red.png';
import settingsIconGray from '../assets/settings-icon-gray.png';
import { BOTTOM_TAB_HEIGHT, COLORS, FONT_FAMILY } from '../utils/app_constants';

const Tab = createBottomTabNavigator();

export default function IndexScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { height: BOTTOM_TAB_HEIGHT },
        tabBarLabelStyle: {
          fontSize: 14,
          paddingBottom: 5,
          fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
          textTransform: 'capitalize',
        },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: '#838383',
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'home') {
            iconSource = focused ? homeIconRed : homeIconGray;
          } else if (route.name === 'transactions') {
            iconSource = focused ? transactionsIconRed : transactionsIconGray;
          } else if (route.name === 'settings') {
            iconSource = focused ? settingsIconRed : settingsIconGray;
          }

          return <Image source={iconSource} style={styles.navBarIMG} />;
        },
      })}
    >
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen name="transactions" component={TransactionsTab} />
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
