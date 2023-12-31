import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import filterIcon from '../../assets/filter-icon-gray.png';
import TransactionCard from '../../components/TransactionCard';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../../utils/app_constants';
import ArrowLeftV2 from '../../assets/arrow-left-v2.png';
import { Platform } from 'babel-plugin-react-native-web/src/moduleMap';
import TabHeader from '../../components/TabHeader';

const transactionItems = [
  {
    type: 'sent',
    amount: 0.13,
    txHash: '39782YZXYFVSHsgUTSbs839782YZXYFVSHsgUTSbs8',
    from: '39782YZXYFVSHsgUTSbs8',
    to: '39782YZXYFVSHsgUTSbs8',
    timestamp: '10-10-2023 12:00 PM',
    kind: 'fee',
    status: 'PENDING',
  },
  {
    type: 'received',
    amount: 15.02,
    txHash: '39782YZXYFVSHsgUTSbs8',
    from: '39782YZXYFVSHsgUTSbs8',
    to: '39782YZXYFVSHsgUTSbs8',
    timestamp: '10-10-2023 12:00 PM',
    kind: 'DEX',
    status: 'FAILED',
  },
  {
    type: 'received',
    amount: 11.02,
    txHash: '39782YZXYFVSHsgUTSbs8',
    from: '39782YZXYFVSHsgUTSbs8',
    to: '39782YZXYFVSHsgUTSbs8',
    timestamp: '10-10-2023 12:00 PM',
    kind: 'DEX',
    status: 'COMPLETED',
  },
  {
    type: 'received',
    amount: 1.02,
    txHash: '39782YZXYFVSHsgUTSbs8',
    from: '39782YZXYFVSHsgUTSbs8',
    to: '39782YZXYFVSHsgUTSbs8',
    timestamp: '10-10-2023 12:00 PM',
    kind: 'DEX',
    status: 'COMPLETED',
  },
  {
    type: 'received',
    amount: 1.02,
    txHash: '39782YZXYFVSHsgUTSbs8',
    from: '39782YZXYFVSHsgUTSbs8',
    to: '39782YZXYFVSHsgUTSbs8',
    timestamp: '10-10-2023 12:00 PM',
    kind: 'DEX',
    status: 'COMPLETED',
  },
  {
    type: 'received',
    amount: 1.02,
    txHash: '39782YZXYFVSHsgUTSbs8',
    from: '39782YZXYFVSHsgUTSbs8',
    to: '39782YZXYFVSHsgUTSbs8',
    timestamp: '10-10-2023 12:00 PM',
    kind: 'DEX',
    status: 'COMPLETED',
  },
];

export default function TransactionsTab({ navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'height' : ''}
      style={styles.keyboardAvoidingView}
    >
      <TabHeader title="Transactions" onPressBack={navigation.goBack} />
      <ScrollView
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.transactionList}
      >
        {transactionItems.map((transactionItem, index) => {
          return <TransactionCard transaction={transactionItem} key={index} />;
        })}
      </ScrollView>
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
    marginTop: Platform.OS == 'ios' ? 20 : 30,
    borderWidth: 2,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingHorizontal: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  headerText: {
    fontSize: FONT_SIZE.LARGE + 4,
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
  },
  filterIcon: {
    height: 21,
    width: 21,
  },
  scrollView: {
    flex: 1,
  },
  transactionList: {
    display: 'flex',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
});
