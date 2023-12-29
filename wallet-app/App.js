import LoadingScreen from './screens/loading';
import { useFonts } from 'expo-font';
import { NetworkAssetContextProvider } from './services/store/networkAssets/networkAssetsContext';
import * as Notifications from 'expo-notifications';
import { WalletsContextProvider } from './services/store/wallets/walletsContext';
import { UserContextProvider } from './services/store/user/userContext';
import { SendAssetContextProvider } from './services/store/sendAsset/sendAssetContext';
import { AuthContextProvider } from './services/store/auth/AuthContext';
import { NotificationProvider } from './services/store/notificationAssets/notificationAssetsContext';
import MainNavigation from './navigations/MainNavigation';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

Notifications.setNotificationHandler({
  shouldPlaySound: true,
  shouldShowAlert: true,
  shouldShowBadge: true,
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthContextProvider>
      <UserContextProvider>
        <WalletsContextProvider>
          <NetworkAssetContextProvider>
            <NotificationProvider>
              <SendAssetContextProvider>
                <MainNavigation onLoadLayout={onLayoutRootView} />
              </SendAssetContextProvider>
            </NotificationProvider>
          </NetworkAssetContextProvider>
        </WalletsContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
}
