import { useCallback, useRef, useState, useEffect } from 'react';
import CoinIcon from '../assets/coin.png';

import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import SearchIcon from '../assets/search-icon.png';
import ArrowLeftV2 from '../assets/arrow-left-v2.png';
import ArrowDownIcon from '../assets/carret-down.png';
import InfoImg from '../assets/info-circle-icon.png';

import CustomBottomSheet from '../components/CustomBottomSheet';
import AssetResultCard from '../components/AssetItemCard';
import { useNetworkAssets } from '../services/store/networkAssets/networkAssetsContext';
import { COLORS, FONT_SIZE, FONT_FAMILY } from '../utils/app_constants';
import { useSendAssetContext } from '../services/store/sendAsset/sendAssetContext';
import useDebounce from '../hooks/useDebounce';
import { genericGetRequest } from '../services/api/genericGetRequest';

const data = [
  'Mistransferred assets cannot be retrieved due to the nature of the blockchain.',
  'When transferring to an exchange or external wallet, please make sure it’s transferred to the same blockchain network.',
  'Transferring by username is function that can used when transferring between aga wallet users.',
];

export default function SendAssetScreen({ navigation }) {
  const [receiverAddress, onChangeReceiverAddress] = useState('');
  const hasInputAddress = receiverAddress.length > 0;
  const sendAssetContext = useSendAssetContext();
  const [isVerifiedReceiverAddr, setIsVerifiedReceiverAddr] = useState(false);
  const [isVerifyingReveiverAddr, setIsVerifyingReveiverAddr] = useState(true);

  const debounceReceiverAddress = useDebounce(receiverAddress, 700);

  const handleRecieverDebounceChange = useCallback(() => {
    const isWalletExists = async (walletAddress) => {
      setIsVerifyingReveiverAddr(true);
      try {
        const data = await genericGetRequest(`wallets/${walletAddress}/exists`);
        setIsVerifiedReceiverAddr(data?.exists ?? false);
      } catch (error) {
        console.log('Error', error, error?.response?.data);
      } finally {
        setIsVerifyingReveiverAddr(false);
      }
    };

    if (debounceReceiverAddress !== '') {
      isWalletExists(debounceReceiverAddress);
    }
  }, [debounceReceiverAddress]);

  useEffect(() => {
    handleRecieverDebounceChange();
  }, [handleRecieverDebounceChange]);

  const networkAssets = useNetworkAssets();
  const sendBottomSheetModalRef = useRef(null);

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressAsset = () => {
    sendBottomSheetModalRef.current?.open();
  };

  const onPressSeletAsset = () => {
    sendBottomSheetModalRef.current?.close();
  };

  const assets = networkAssets?.networkAssets ?? [];

  const onPressNext = () => {
    sendAssetContext.updateTransaction((prevData) => ({
      ...prevData,
      to: receiverAddress,
    }));
    navigation.navigate('send-amount');
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <View style={styles.topNavigationContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
          <Image source={ArrowLeftV2} style={styles.backIcon}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Send Asset</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.sendAssetContainer}
      >
        <View style={styles.sendAssetHeader}>
          <Pressable style={styles.coinContainer} onPress={onPressAsset}>
            <Image source={sendAssetContext?.asset?.icon ?? CoinIcon} style={styles.assetIcon} />
            <Image source={ArrowDownIcon} style={styles.arrowDown}></Image>
          </Pressable>
          <Text style={styles.sendAssetInfoText}>Who are you sending to?</Text>
        </View>
        <TextInput
          style={styles.input}
          value={receiverAddress}
          placeholder="e.g : 16HFHicyvB9RXFTxrBazas... "
          onChangeText={onChangeReceiverAddress}
        />
        {isVerifyingReveiverAddr && hasInputAddress && (
          <Text style={styles.successText}>Verifying...</Text>
        )}
        {hasInputAddress && !isVerifiedReceiverAddr && !isVerifyingReveiverAddr && (
          <Text style={styles.errorText}>
            The address is not verified as belonging to AGA Wallet user.
          </Text>
        )}
        {hasInputAddress && isVerifiedReceiverAddr && !isVerifyingReveiverAddr && (
          <Text style={styles.successText}>
            The address has been verified as belonging to AGA Wallet user.
          </Text>
        )}
        {!hasInputAddress && (
          <View style={[styles.infoContainer]}>
            <View style={styles.headerInfoContainer}>
              <Image source={InfoImg} style={styles.infoImg}></Image>
              <Text style={styles.infoText}>Please check the sending address!</Text>
            </View>
            <View style={styles.listContainer}>
              {data.map((item, index) => {
                return (
                  <View style={styles.listTextContainer} key={index}>
                    <Text>{`\u2022`}</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          disabled={!isVerifiedReceiverAddr}
          style={[styles.nextButton, !isVerifiedReceiverAddr && styles.disabledNextBtn]}
          onPress={onPressNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <CustomBottomSheet ref={sendBottomSheetModalRef} disableSwipeDownClose={true} height={'85%'}>
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
                  navigation={navigation}
                  key={index}
                />
              );
            })}
          </View>
        </ScrollView>
      </CustomBottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  backBtn: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
  },
  backIcon: {
    height: 21,
    width: 21,
  },
  topNavigationContainer: {
    paddingHorizontal: 25,
    marginTop: 50,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingHorizontal: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
  },
  headerText: {
    fontSize: FONT_SIZE.LARGE + 4,
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
  },
  scrollView: {
    flex: 1,
  },
  sendAssetContainer: {
    display: 'flex',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  sendAssetHeader: {
    display: 'flex',
  },
  sendAssetInfoText: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  coinContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
    width: '30%',
  },
  assetIcon: {
    height: 50,
    width: 50,
  },
  arrowDown: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
    marginTop: 9,
    height: 50,
    padding: 3,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 45,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  buttonText: {
    color: '#838383',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  activeButtonText: {
    color: '#000',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    paddingLeft: 9,
    borderBottomWidth: 1,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
  },
  infoContainer: {
    marginTop: 20,
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 'auto',
    padding: 10,
  },
  headerInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoImg: {
    width: 21,
    height: 21,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
  listContainer: {
    marginTop: 9,
    marginLeft: 25,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  listTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  listText: {
    width: '90%',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'justify',
  },
  actionButtonContainer: {
    paddingHorizontal: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    top: 'auto',
    paddingBottom: 20,
  },
  nextButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 55,
  },
  disabledNextBtn: {
    backgroundColor: COLORS.DISABLED_GRAY,
    elevation: 0,
  },
  nextButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  validationContainer: {
    flex: 1,
    marginTop: 6,
  },
  validationText: {
    color: '#074DFF',
  },
  validationFalseText: {
    color: '#FF0000',
  },
  bottomSheetContainer: {
    position: 'absolute',
  },
  selectAssetText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
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
  errorText: {
    color: COLORS.RED,
    textAlign: 'left',
    marginBottom: 15,
  },
  successText: {
    color: COLORS.BLUE,
    textAlign: 'left',
    marginBottom: 15,
  },
});
