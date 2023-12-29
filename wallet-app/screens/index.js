import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/home';
import SettingsTab from './tabs/settings';
import TransactionsTab from './tabs/transactions';
import { TouchableOpacity, SafeAreaView, View, Text, TextInput } from 'react-native';
import { BOTTOM_TAB_HEIGHT, COLORS, FONT_FAMILY } from '../utils/app_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../services/store/user/userContext';
import { genericPostRequest } from '../services/api/genericPostRequest';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

export default function IndexScreen() {
  const { state: userState } = useUser();

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
      <Tab.Screen
        name="token"
        component={() => (
          <View
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <TextInput>{expoPushToken}</TextInput>
          </View>
        )}
      />
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
