import React, { useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import profileIcon from '../../assets/profile-icon.png';
import notificationIcon from '../../assets/notification-icon.png';
import Games from '../../components/Games';
import ImageSlider from '../../components/ImageSlider';
import { COLORS, FONT_FAMILY } from '../../utils/app_constants';
import { useUser } from '../../services/store/user/userContext';
import { useWallets } from '../../services/store/wallets/walletsContext';
import { genericGetRequest } from '../../services/api/genericGetRequest';
import WalletActionsCard from '../../components/WalletActionsCard';
import WalletAssetsCard from '../../components/WalletAssetsCard';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import Drawer from '../../components/CustomDrawer';
import ProfileDrawer from '../../components/ProfileDrawer';
import { useToken } from '../../services/store/token/tokenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeTab({ navigation }) {
  const userContext = useUser();
  const walletsContext = useWallets();
  const tokenContext = useToken();
  const token = tokenContext?.token ?? ''

  const [refreshing, setRefreshing] = React.useState(false);
  
  const onRefresh = React.useCallback(async (userId) => {
    if (userId) {
      setRefreshing(true);
      try {
        const res = await genericGetRequest(`users/${userId}`, tokenContext?.token ?? '');
        const keys = ['@AgaWallet_USER', '@AgaWallet_WALLETS'];
        await AsyncStorage.multiRemove(keys);
  
        const userData = res?.user ?? {};
        const walletsData = res?.wallets ?? [];
  
        const user = ['@AgaWallet_USER', JSON.stringify(userData)];
        const wallets = ['@AgaWallet_WALLETS', JSON.stringify(walletsData)];
  
        await AsyncStorage.multiSet([user, wallets]);
  
        userContext.updateUser(userData);
        walletsContext.updateWallets(walletsData);
        if (walletsData?.length > 0) {
          walletsContext?.updateSelectedWallet(walletsData[0]);
        }
      } catch (error) {
        console.log('Error', error, error?.response?.data);
      } finally {
        setRefreshing(false);
      }
    }
  }, [token]);

  const onPressNotification = () => {
    navigation.navigate('signin');
  };

  const openDrawerRef = useRef(null);
  const onPressProfile = async () => {
    openDrawerRef.current?.open();
  };

  const onPressClose = () => {
    openDrawerRef.current?.close();
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(userContext?.user?.id ?? '')} />
      }
      contentContainerStyle={styles.container}
    >
      <View style={styles.drawerContainer}>
        <Drawer ref={openDrawerRef}>
          <ProfileDrawer navigation={navigation} onClose={onPressClose}/>
        </Drawer>
      </View>
      <View style={styles.topNav}>
        <View>
          <Text style={styles.headerText}>
            Hello, <Text style={styles.headerUserText}>{userContext?.user?.first_name ?? ''}.</Text>
          </Text>
        </View>
        <View style={styles.userActionsContainer}>
          <TouchableOpacity onPress={onPressNotification}>
            <Image style={styles.navIcon} source={notificationIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressProfile}>
            <Image style={styles.navIcon} source={profileIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {walletsContext.selectedWallet && (
        <View style={styles.walletCardContainer}>
          <WalletBalanceCard balance={walletsContext?.selectedWallet?.balance ?? 0} />
          <WalletActionsCard navigation={navigation} wallet={walletsContext?.selectedWallet} />
          <WalletAssetsCard />
        </View>
      )}
      <ImageSlider />
      <Games />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
  },
  drawerContainer: {
    position: 'absolute',
  },
  container: {
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    display: 'flex',
    backgroundColor: COLORS.WHITE,
  },
  navIcon: {
    height: 30,
    width: 30,
  },
  topNav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 34,
    paddingVertical: 15,
    paddingBottom: 10,
    width: '100%',
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  userActionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  headerText: {
    color: COLORS.BLACK,
    fontSize: 26,
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
    marginTop: 5,
    textTransform: 'capitalize',
  },
  headerUserText: {
    color: COLORS.PRIMARY,
  },
  walletCardContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
});
