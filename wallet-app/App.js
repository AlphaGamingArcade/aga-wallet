import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from './screens';
import LoadingScreen from './screens/loading';
import { useFonts } from 'expo-font';
import SignUpScreen from './screens/signup';
import SignInScreen from './screens/signin';
import PasscodeScreen from './screens/passcode';
import { NetworkAssetContextProvider } from './services/store/networkAssets/networkAssetsContext';
import { usePushNotifications } from './hooks/usePushNotification';
import { useEffect, useState } from 'react';
import { genericPostRequest } from './services/api/genericPostRequest';
import SendStatusScreen from './screens/send-status';
import SendAssetScreen from './screens/send-asset';
import SendAmountScreen from './screens/send-amount';
import * as Notifications from 'expo-notifications';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { WalletsContextProvider } from './services/store/wallets/walletsContext';
import { UserContextProvider } from './services/store/user/userContext';
import { SendAssetContextProvider } from './services/store/sendAsset/sendAssetContext';
import { TokenContextProvider } from './services/store/token/tokenContext';
import io from 'socket.io-client';
import CustomDrawer from './components/CustomDrawer';
import ProfileDrawer from './components/ProfileDrawer';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  shouldPlaySound: true,
  shouldShowAlert: true,
  shouldShowBadge: true,
});

export default function App() {
  const { expoPushToken } = usePushNotifications();
  const { getItem: getLocalStorageUser } = useAsyncStorage('@AgaWallet_USER');
  const [user, setUser] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('index');
  const [hasConnection, setConnection] = useState(false);

  const initializeUser = async () => {
    const walletUser = await getLocalStorageUser();
    setUser(JSON.parse(walletUser));
    setIsAppReady(true);
    if (walletUser) {
      setInitialRouteName('index');
    } else {
      setInitialRouteName('signin');
    }
  };

  const saveUserPushNotifToken = async (pushToken) => {
    if (user?.id) {
      try {
        await genericPostRequest('push-notifications/register', {
          user_id: user.id,
          push_notification_token: pushToken,
          platform: Platform.OS,
        });
        console.log('Registered for push notifications');
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      saveUserPushNotifToken(expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    const socket = io('http://192.168.8.121:9091/blockchain', {
      transports: ['websocket'],
    });

    socket.io.on('open', () => setConnection(true));
    socket.io.on('close', () => setConnection(false));

    if (user?.id) {
      socket.emit('setUserID', { userID: user?.id ?? '' });
    }

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [user?.id]);

  const [fontsLoaded] = useFonts({
    'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded || !isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <UserContextProvider>
      <TokenContextProvider>
        <WalletsContextProvider>
          <NetworkAssetContextProvider>
            <SendAssetContextProvider>
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={{ headerShown: false }}
                  initialRouteName={initialRouteName}
                >
                  <Stack.Screen name="loading" component={LoadingScreen} />
                  <Stack.Screen name="passcode" component={PasscodeScreen} />
                  <Stack.Screen name="signup" component={SignUpScreen} />
                  <Stack.Screen name="signin" component={SignInScreen} />
                  <Stack.Screen name="send-asset" component={SendAssetScreen} />
                  <Stack.Screen name="send-status" component={SendStatusScreen} />
                  <Stack.Screen name="send-amount" component={SendAmountScreen} />
                  <Stack.Screen name="index" component={IndexScreen} />
                </Stack.Navigator>
                <StatusBar style="auto" />
              </NavigationContainer>
            </SendAssetContextProvider>
          </NetworkAssetContextProvider>
        </WalletsContextProvider>
      </TokenContextProvider>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
