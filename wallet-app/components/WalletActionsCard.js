import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  ToastAndroid,
} from 'react-native';
import AgaLogo from '../assets/logo.png';
import coin from '../assets/coin.png';
import SendIcon from '../assets/send-icon.png';
import ReceiveIcon from '../assets/receive-icon.png';
import BuyIcon from '../assets/buy-icon.png';
import SwapIcon from '../assets/swap-icon.png';
import CustomBottomSheet from './CustomBottomSheet';
import SearchIcon from '../assets/search-icon.png';
import QRCode from 'react-native-qrcode-svg';
import AssetResultCard from './AssetItemCard';
import { useNetworkAssets } from '../services/store/networkAssets/networkAssetsContext';
import { COLORS, FONT_SIZE } from '../utils/app_constants';
import Button from './ui/Button';
import { useSendAssetContext } from '../services/store/sendAsset/sendAssetContext';
import * as Clipboard from 'expo-clipboard';

export default function WalletActionsCard({ navigation, wallet }) {
  const networkAssets = useNetworkAssets();
  const sendAssetContext = useSendAssetContext();
  const isOnSmallScreen = Dimensions.get('window').height < 675;

  const receiveBottomSheetModalRef = useRef(null);
  const onPressReceiveBtn = () => {
    receiveBottomSheetModalRef.current?.open();
  };

  const sendBottomSheetModalRef = useRef(null);
  const onPressSendBtn = () => {
    sendBottomSheetModalRef.current?.open();
  };

  const onPressSeletAsset = (asset) => {
    sendBottomSheetModalRef.current?.close();
    sendAssetContext?.updateTransaction((prevData) => ({
      ...prevData,
      from: wallet?.wallet_address ?? '',
      asset,
    }));
    navigation.push('send-asset');
  };

  const assets = networkAssets?.networkAssets ?? [];

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(wallet?.wallet_address ?? '').then(() => {
      if (Platform.OS === 'ios') {
        // do something for ios
      } else if (Platform.OS === 'android') {
        ToastAndroid.show('Copied!', ToastAndroid.SHORT);
      } else if (Platform.OS === 'web') {
        // it's on web!
      } else {
        // you probably won't end up here unless you support another platform!
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.bottomSheetContainer}>
        <CustomBottomSheet
          ref={receiveBottomSheetModalRef}
          disableSwipeDownClose={false}
          height={'70%'}
        >
          <Text style={styles.myWalletText}>My Wallet</Text>
          <Text style={styles.myWalletDisclaimerText}>
            You can exclusively accept tokens that are compatible with the AGA Wallet. Attempting to
            receive tokens from different networks might lead to the potential loss of your assets.
          </Text>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={wallet?.wallet_address ?? ''}
              size={isOnSmallScreen ? 150 : 240} // Manually adjust QR Code Size
            />
          </View>
          <Text style={styles.walletAddressText}>{wallet?.wallet_address ?? ''}</Text>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity style={styles.shareBtn}>
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </CustomBottomSheet>

        <CustomBottomSheet
          ref={sendBottomSheetModalRef}
          disableSwipeDownClose={true}
          height={'85%'}
        >
          <Text style={styles.selectAssetText}>Select Asset</Text>
          <View style={styles.searchAssetContainer}>
            <View style={styles.searchAssetInputContainer}>
              <TextInput style={styles.searchAssetInput} placeholder="Search asset" />
              <Image source={SearchIcon} style={styles.searchIcon}></Image>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.sendAssetScrollView}>
            <Text style={styles.availableAssetsText}>Available Assets</Text>
            <View style={styles.assetsListContainer}>
              {assets.map((asset, index) => {
                return (
                  <AssetResultCard
                    onPressSelectAsset={onPressSeletAsset}
                    asset={asset}
                    key={index}
                  />
                );
              })}
            </View>
          </ScrollView>
        </CustomBottomSheet>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={onPressSendBtn} icon={SendIcon} bottomLabel="Send" />
        <Button onPress={onPressReceiveBtn} icon={ReceiveIcon} bottomLabel="Receive" />
        <Button icon={BuyIcon} bottomLabel="Buy" iconStyle={styles.buyBtnIcon} />
        <Button icon={SwapIcon} bottomLabel="Swap" iconStyle={styles.swapBtnIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 15,
    gap: 15,
    paddingTop: 5,
  },
  coinContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  assetText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    fontWeight: '400',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 6,
    gap: 95,
  },
  coinInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetIcon: {
    height: 36,
    width: 36,
  },
  coinText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: '400',
    color: '#111111',
  },
  coinValueText: {
    color: '#111111',
    fontWeight: '400',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buyBtnIcon: {
    height: 26,
    width: 26,
  },
  swapBtnIcon: {
    height: 18,
    width: 18,
  },
  walletInfoContainer: {
    display: 'flex',
    position: 'relative',
    borderWidth: 2,
  },
  myWalletText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    width: '100%',
    paddingLeft: 20,
    paddingTop: 10,
  },
  myWalletDisclaimerText: {
    fontFamily: 'Poppins-Light',
    fontSize: 13,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  qrCodeContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  qrCodeImage: {
    height: 240,
    maxWidth: 240,
    width: '100%',
  },
  walletAddressText: {
    fontSize: 16,
    marginTop: 'auto',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#074DFF',
  },
  actionBtnContainer: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  shareBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
  },
  shareBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#111111',
    textAlign: 'center',
  },
  copyBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
  },
  copyBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  selectAssetText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    width: '100%',
    paddingLeft: 20,
    marginTop: 10,
  },
  searchAssetContainer: {
    width: '100%',
    padding: 0,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchAssetInputContainer: {
    marginTop: 18,
    flex: 1,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    borderRadius: 10,
  },
  searchAssetInput: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    height: 25,
    width: 25,
  },
  bottomSheetContainer: {
    position: 'absolute',
  },
  sendAssetScrollView: {
    flex: 1,
    maxHeight: '83%',
    position: 'relative',
  },
  availableAssetsText: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  assetsListContainer: {
    marginBottom: 20,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
});
