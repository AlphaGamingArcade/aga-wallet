import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZE, FONT_FAMILY, APP_STATUS, STATUS_TYPE } from '../utils/app_constants';
import ArrowLeftV2 from '../assets/arrow-left-v2.png';
import { useSendAssetContext } from '../services/store/sendAsset/sendAssetContext';
import { useToken } from '../services/store/token/tokenContext';
import { genericPostRequest } from '../services/api/genericPostRequest';
import { useWallets } from '../services/store/wallets/walletsContext';

export default function SendAmountScreen({ navigation }) {
  const sendAssetContext = useSendAssetContext();
  const walletsContext = useWallets();
  const tokenContext = useToken();
  const userBalance = walletsContext?.selectedWallet?.balance ?? 0;
  const [status, setStatus] = useState(APP_STATUS.IDLE);

  const [isValidTransaction, setIsValidTransaction] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(true);
  const [amount, setAmount] = useState('');

  const onPressBack = () => {
    navigation.goBack();
  };

  const checkBalance = (amount) => {
    setAmount(amount);
    if (amount == '') {
      setIsEnoughBalance(true);
      setIsValidTransaction(false);
    } else if (parseFloat(amount) <= parseFloat(userBalance)) {
      setIsEnoughBalance(true);
      setIsValidTransaction(true);
    } else {
      setIsEnoughBalance(false);
      setIsValidTransaction(false);
    }
  };

  const onPressSend = async () => {
    try {
      setStatus(APP_STATUS.LOADING);
      sendAssetContext.updateTransaction((prevData) => ({
        ...prevData,
        amount: parseFloat(amount),
      }));

      await genericPostRequest(
        'transactions',
        {
          receiver_address: sendAssetContext?.transaction?.to ?? '',
          sender_address: sendAssetContext?.transaction?.from ?? '',
          amount: parseFloat(amount) ?? 0,
        },
        tokenContext?.token
      );

      navigation.navigate('send-status', { status: STATUS_TYPE.SUCCESS });
    } catch (error) {
      const message = error?.response?.data ?? 'Unexpected error occured';
      console.log(message);
      navigation.navigate('send-status', { status: STATUS_TYPE.FAILED });
    } finally {
      setStatus(APP_STATUS.IDLE);
    }
  };

  const onPressChangeAddress = () => {
    navigation.pop();
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <View style={styles.topNavigationContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
          <Image source={ArrowLeftV2} style={styles.backIcon}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Send {sendAssetContext?.asset?.name} to</Text>
        <View style={styles.receiverAddressContainer}>
          <View style={styles.receiverAddressWrapper}>
            <Text style={styles.receiverAddressText}>
              {sendAssetContext?.transaction?.to ?? ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.changeAddressBtn} onPress={onPressChangeAddress}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.sendAssetContainer}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.availableBalanceText}>
            Wallet balance:{' '}
            <Text style={styles.balanceAmountText}>{userBalance.toLocaleString()}</Text>
          </Text>
          <Text style={styles.amountText}>Amount</Text>
          <TextInput
            value={amount}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Enter amount"
            onChangeText={checkBalance}
          />
          <Text style={[styles.validationText, !isEnoughBalance && { display: 'flex' }]}>
            Insufficient balance
          </Text>
        </View>
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          disabled={!isEnoughBalance || !isValidTransaction}
          style={[
            styles.sendButton,
            (!isEnoughBalance || !isValidTransaction || status === APP_STATUS.LOADING) &&
              styles.disabledNextBtn,
          ]}
          onPress={onPressSend}
        >
          {status === APP_STATUS.LOADING ? (
            <ActivityIndicator size="large" color={COLORS.WHITE} />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
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
    flexDirection: 'column',
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
  receiverAddressText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZE.REGULAR,
  },
  receiverAddressContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  receiverAddressWrapper: {
    flex: 1,
  },
  changeAddressBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    elevation: 3,
  },
  changeText: {
    color: COLORS.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  inputContainer: {
    marginTop: 35,
  },
  availableBalanceText: {
    color: '#838383',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: '500',
  },
  balanceAmountText: {
    fontFamily: 'Poppins-Medium',
  },
  amountText: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 3,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    paddingLeft: 9,
    borderBottomWidth: 1,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    fontSize: FONT_SIZE.LARGE,
    fontFamily: 'Poppins-SemiBold',
  },
  validationText: {
    display: 'none',
    color: '#FF0000',
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
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
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 55,
  },
  sendButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
    textAlign: 'center',
  },
  disabledNextBtn: {
    backgroundColor: COLORS.DISABLED_GRAY,
    elevation: 0,
  },
});
