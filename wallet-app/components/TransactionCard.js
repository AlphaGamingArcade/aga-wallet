import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../utils/app_constants';
// import copyIcon from '../assets/copy-icon.png'

const amountTextColor = {
  pending: '#DB0000',
  failed: '#DB0000',
  sent: '#DB0000',
  received: '#009065',
};

const amountPrefix = {
  sent: '-',
  received: '+',
};

const TRANSACTION_STATUS_COLOR = {
  PENDING: '#3771F4',
  FAILED: '#DA0B0B',
  COMPLETED: '#21D932',
};

export default function TransactionCard({ transaction }) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.txInfoContainer}>
        <View style={styles.amountAndStatusContainer}>
          <Text
            style={{
              ...styles.amountText,
              color: amountTextColor[transaction.type],
            }}
          >
            {amountPrefix[transaction.type]}
            {transaction.amount}
          </Text>
          <View
            style={{
              ...styles.txTypeContainer,
              backgroundColor: TRANSACTION_STATUS_COLOR[transaction.status],
            }}
          >
            <Text style={styles.txTypeText}>{transaction.status}</Text>
          </View>
        </View>
        <Text style={styles.txHashText}>
          TX Hash: {transaction.txHash}
          {/* <View>
                    <Image style={styles.copyIcon} source={copyIcon} />
                </View> */}
        </Text>
        <Text style={styles.txFromText}>From: {transaction.from}</Text>
        <Text style={styles.txToText}>To: {transaction.to}</Text>
        <View style={styles.bottomContainer}>
          <Text style={styles.txTimestampText}>{transaction.timestamp}</Text>
          <View style={styles.txKindContainer}>
            <Text style={styles.txKindText}>{transaction.kind}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    display: 'flex',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txInfoContainer: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 16,
  },
  amountAndStatusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txInfoContainer2: {
    width: 'auto',
    paddingTop: 8,
    paddingLeft: 10,
    position: 'relative',
  },
  amountText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  txHashText: {
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    fontSize: 14,
    flex: 1,
    paddingRight: 15,
    marginTop: -5,
  },
  copyIcon: {
    height: 16,
    width: 18,
    marginLeft: 5,
    marginTop: 5,
  },
  txFromText: {
    marginTop: 11,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  txToText: {
    marginTop: 0,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  txTimestampText: {
    color: '#838383',
    marginTop: 10,
    marginBottom: 10,
  },
  txTypeContainer: {
    height: 20,
    width: 90,
    marginTop: -20,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTypeText: {
    position: 'absolute',
    textTransform: 'uppercase',
    color: COLORS.WHITE,
    fontFamily: 'Poppins-Regular',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  txKindContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 50,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  txKindText: {
    fontSize: 16,
    color: COLORS.BLACK,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-SemiBold',
  },
});
