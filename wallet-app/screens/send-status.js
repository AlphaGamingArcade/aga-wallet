import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import CheckImg from '../assets/check-icon.png';
import ExImg from '../assets/ex-icon.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, STATUS_TYPE } from '../utils/app_constants';
import { useSendAssetContext } from '../services/store/sendAsset/sendAssetContext';

const transactionInfo = {
  success: {
    transaction: 'Your transaction is awaiting inclusion in the next block.',
    transactionImg: CheckImg,
    transactionText: 'Sending',
    transactionButtonText: 'Done',
  },
  failed: {
    transaction: 'Transaction Failed!',
    transactionImg: ExImg,
    transactionText: 'Failed sending',
    transactionButtonText: 'Try again ',
  },
};

export default function SendStatusScreen({ route, navigation }) {
  const { transaction, clearTransaction } = useSendAssetContext();
  const { status } = route.params;

  const onPressActionButton = () => {
    if (status === STATUS_TYPE.SUCCESS) {
      clearTransaction();
      navigation.navigate('index');
    }
    if (status === STATUS_TYPE.FAILED) {
      navigation.pop();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.transactionStateText}>{transactionInfo[status].transaction}</Text>
        <Image
          source={transactionInfo[status].transactionImg}
          style={styles.transactionImg}
        ></Image>
        <Text style={styles.transactionText}>
          {transactionInfo[status].transactionText} <Text style={styles.amountText}>{transaction?.amount ?? 0}</Text> {transaction?.asset?.name ?? ''}
        </Text>
        <Text style={styles.toText}>to</Text>
        <Text style={styles.receiverText}>{transaction?.receiver ?? ''}</Text>
        <View style={styles.transactonInfoContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.transactionDateText}>Date:</Text>
            <Text style={styles.transactionDateValue}>{new Date().toString()}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.transactionDescriptionText}>Description:</Text>
            <Text style={styles.transactionDescriptionValue}>Send Asset</Text>
          </View>
          {/* <View style={styles.transactionHashContainer}>
            <Text style={styles.transactionHashText}>:</Text>
            <Text style={styles.transactionHashValue}>{'Not set'}</Text>
          </View> */}
        </View>
        <TouchableOpacity style={styles.button} onPress={onPressActionButton}>
          <Text style={styles.buttonText}>{transactionInfo[status].transactionButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 28,
    textAlign: 'center',
  },
  transactionStateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 25,
    marginTop: 25,
    marginBottom: 21,
    textAlign: 'center',
  },
  transactionImg: {
    width: 139,
    height: 139
  },
  transactionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FONT_SIZE.LARGE,
    marginBottom: 3,
    paddingHorizontal: 30,
    textAlign: 'center',
    paddingTop: 30
  },
  amountText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 26,
    color: COLORS.PRIMARY
  },
  toText: {
    color: '#838383',
    fontFamily: 'Poppins-Medium',
    fontSize: FONT_SIZE.REGULAR,
    marginBottom: 9,
  },
  receiverText: {
    color: '#838383',
    fontFamily: 'Poppins-Light',
    fontSize: 17,
    marginBottom: 91,
  },
  transactonInfoContainer: {
    width: '100%',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
    gap: 15,
  },
  transactionDateText: {
    color: '#838383',
    fontFamily: 'Poppins-Light',
    fontSize: FONT_SIZE.REGULAR,
    flex: 1,
  },
  transactionDateValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: FONT_SIZE.REGULAR,
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'left',
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 65,
  },
  transactionDescriptionText: {
    color: '#838383',
    fontFamily: 'Poppins-Light',
    fontSize: FONT_SIZE.REGULAR,
  },
  transactionDescriptionValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: FONT_SIZE.REGULAR,
  },
  transactionHashContainer: {
    textAlign: 'left',
    marginBottom: 52,
  },
  transactionHashText: {
    color: '#838383',
    fontFamily: 'Poppins-Light',
    fontSize: FONT_SIZE.REGULAR,
  },
  transactionHashValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: FONT_SIZE.REGULAR,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 55,
    marginTop: 'auto',
    marginBottom: 15
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
});
