import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/loading';
import { useFonts } from 'expo-font';
import { NetworkAssetContextProvider } from './services/store/networkAssets/networkAssetsContext';
import { usePushNotifications } from './hooks/usePushNotification';
import { useEffect, useState } from 'react';
import { genericPostRequest } from './services/api/genericPostRequest';
import * as Notifications from 'expo-notifications';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { WalletsContextProvider } from './services/store/wallets/walletsContext';
import { UserContextProvider } from './services/store/user/userContext';
import { SendAssetContextProvider } from './services/store/sendAsset/sendAssetContext';
import { AuthContextProvider, useAuth } from './services/store/auth/AuthContext';
import MainNavigation from './navigations/MainNavigation';

Notifications.setNotificationHandler({
  shouldPlaySound: true,
  shouldShowAlert: true,
  shouldShowBadge: true,
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <AuthContextProvider>
      <UserContextProvider>
          <WalletsContextProvider>
            <NetworkAssetContextProvider>
              <SendAssetContextProvider>
                <MainNavigation />
              </SendAssetContextProvider>
            </NetworkAssetContextProvider>
          </WalletsContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
}
