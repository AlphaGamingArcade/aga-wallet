import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import IndexScreen from '../screens';
import NotificationScreen from '../screens/notification-screen';
import SignInScreen from '../screens/signin';
import PasscodeScreen from '../screens/passcode';
import SignUpScreen from '../screens/signup';
import { useAuth } from '../services/store/auth/AuthContext';
import LoadingScreen from '../screens/loading';
import SendAssetScreen from '../screens/send-asset';
import SendStatusScreen from '../screens/send-status';
import SendAmountScreen from '../screens/send-amount';

Notifications.setNotificationHandler({
  shouldPlaySound: true,
  shouldShowAlert: true,
  shouldShowBadge: true,
});

const MainStack = createNativeStackNavigator();

export default function MainNavigation() {
  const { state, isAppReady } = useAuth();

  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAppReady && <MainStack.Screen name="loading" component={LoadingScreen} />}
        {state.userToken == null ? (
          <MainStack.Group>
            <MainStack.Screen name="signin" component={SignInScreen} />
            <MainStack.Screen name="passcode" component={PasscodeScreen} />
            <MainStack.Screen name="signup" component={SignUpScreen} />
          </MainStack.Group>
        ) : (
          <MainStack.Group>
            <MainStack.Screen name="index" component={IndexScreen} />
            <MainStack.Screen name="send-asset" component={SendAssetScreen} />
            <MainStack.Screen name="send-status" component={SendStatusScreen} />
            <MainStack.Screen name="send-amount" component={SendAmountScreen} />
            <MainStack.Screen name="notification" component={NotificationScreen} />
          </MainStack.Group>
        )}
      </MainStack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// const { expoPushToken } = usePushNotifications();
// const [user, setUser] = useState(null);
// const [isAppReady, setIsAppReady] = useState(false);
// const [hasConnection, setConnection] = useState(false);

// const saveUserPushNotifToken = async (pushToken) => {
//   if (user?.id) {
//     try {
//       await genericPostRequest('push-notifications/register', {
//         user_id: user.id,
//         push_notification_token: pushToken,
//         platform: Platform.OS,
//       });
//       console.log('Registered for push notifications');
//     } catch (err) {
//       console.log(err);
//     }
//   }
// };

// useEffect(() => {
//   if (expoPushToken) {
//     saveUserPushNotifToken(expoPushToken);
//   }
// }, [expoPushToken]);

// useEffect(() => {
//   const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
//     transports: ['websocket'],
//   });

//   socket.io.on('open', () => setConnection(true));
//   socket.io.on('close', () => setConnection(false));

//   if (user?.id) {
//     socket.emit('setUserID', { userID: user?.id ?? '' });
//   }

//   return () => {
//     socket.disconnect();
//     socket.removeAllListeners();
//   };
// }, [user?.id]);
