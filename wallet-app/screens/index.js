import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/home';
import SettingsTab from './tabs/settings';
import TransactionsTab from './tabs/transactions';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import { BOTTOM_TAB_HEIGHT, COLORS, FONT_FAMILY } from '../utils/app_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUser } from '../services/store/user/userContext';
import { usePushNotifications } from '../hooks/usePushNotification';
import { genericPostRequest } from '../services/api/genericPostRequest';

const Tab = createBottomTabNavigator();

export default function IndexScreen() {
  const { expoPushToken } = usePushNotifications();
  const { state: userState } = useUser();
  const [hasConnection, setConnection] = useState(false);

  useEffect(() => {
    const registerPushNotifToken = async () => {
      try {
        await genericPostRequest('push-notifications/register', {
          user_id: userState?.user.id,
          push_notification_token: expoPushToken,
          platform: Platform.OS,
        });
        alert('Registered for push notifications');
      } catch (error) {
        console.log(error);
        alert('Register push token failed');
      }
    };
    if (expoPushToken && userState?.user?.id) {
      registerPushNotifToken();
    }
  }, [expoPushToken, userState?.user?.id]);

  useEffect(() => {
    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.io.on('open', () => setConnection(true));
    socket.io.on('close', () => setConnection(false));

    if (userState?.user?.id) {
      socket.emit('setUserID', { userID: userState?.user?.id ?? '' });
    }

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [userState?.user?.id]);

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
