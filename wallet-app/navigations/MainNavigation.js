import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../screens';
import NotificationScreen from '../screens/notification';
import SignInScreen from '../screens/signin';
import PasscodeScreen from '../screens/passcode';
import SignUpScreen from '../screens/signup';
import { useAuth } from '../services/store/auth/AuthContext';
import SendAssetScreen from '../screens/send-asset';
import SendStatusScreen from '../screens/send-status';
import SendAmountScreen from '../screens/send-amount';
import BarCodeScannerScreen from '../screens/bar-code-scanner';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/app_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MainStack = createNativeStackNavigator();

export default function MainNavigation({ onLoadLayout }) {
  const { state: auth, isAppAuthReady } = useAuth();

  if (!isAppAuthReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLoadLayout}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {auth.userToken == null ? (
          <MainStack.Group>
            <MainStack.Screen
              options={{ animation: 'none' }}
              name="signin"
              component={SignInScreen}
            />
            <MainStack.Screen name="passcode" component={PasscodeScreen} />
            <MainStack.Screen name="signup" component={SignUpScreen} />
          </MainStack.Group>
        ) : (
          <MainStack.Group>
            <MainStack.Screen
              options={{ animation: 'fade_from_bottom' }}
              name="index"
              component={IndexScreen}
            />
            <MainStack.Screen
              name="bar-code-scanner"
              options={{
                animation: 'none',
                headerShown: true,
                title: 'QR Code Scanner',
                headerShadowVisible: false,
                headerLeft: () => {
                  const navigation = useNavigation();
                  return (
                    <TouchableOpacity onPress={() => navigation.pop()} style={styles.backBtn}>
                      <Ionicons name="arrow-back" size={32} color={COLORS.BLACK} />
                    </TouchableOpacity>
                  );
                },
              }}
              component={BarCodeScannerScreen}
            />
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

const styles = StyleSheet.create({
  backBtn: {
    paddingRight: 15,
  },
});
