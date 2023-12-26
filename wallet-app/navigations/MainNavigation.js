import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const MainStack = createNativeStackNavigator();

export default function MainNavigation({ onLoadLayout }) {
  const { state, isAppAuthReady } = useAuth();

  return (
    <NavigationContainer onReady={onLoadLayout}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAppAuthReady && <MainStack.Screen name="loading" component={LoadingScreen} />}
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
