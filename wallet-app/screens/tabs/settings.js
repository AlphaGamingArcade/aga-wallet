import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import indexBG from '../../assets/index-bg.png';
import leftArrowIcon from '../../assets/arrow-left.png';
import exhangeCurrencyIcon from '../../assets/exchange-currency-icon.png';
import lockIconRed from '../../assets/lock-icon-red.png';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../../utils/app_constants';
import ArrowLeftV2 from '../../assets/arrow-left-v2.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const statusBarHeight = StatusBar.currentHeight || 0;

export default function SettingsTab({ navigation }) {
  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <View style={styles.topNavigationContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
          <Image source={ArrowLeftV2} style={styles.backIcon}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.settingsList}
      >
        <View style={styles.settingsItem}>
          <View style={styles.settingItemIconContainer}>
            <Image style={styles.exhangeCurrencyIcon} source={exhangeCurrencyIcon} />
            <Text style={styles.iconLabel}>Currency</Text>
          </View>
          <View>
            <Text style={styles.currencyValueText}> USD (Default)</Text>
          </View>
        </View>
        <View style={styles.settingsItem}>
          <View style={styles.settingItemIconContainer}>
            <Image style={styles.exhangeCurrencyIcon} source={lockIconRed} />
            <Text style={styles.lockWalletLabel}>Lock Wallet</Text>
          </View>
        </View>

        <View style={styles.currenVersionContainer}>
          <Text style={styles.currentVersionText}>Current version: 1.1.0</Text>
        </View>
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
  settingsList: {
    display: 'flex',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  exhangeCurrencyIcon: {
    height: 30,
    width: 30,
  },
  settingsItem: {
    width: '100%',
    elevation: 4,
    backgroundColor: '#ffffff',
    padding: 15,
    height: 'auto',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingItemIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  currencyValueText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#838383',
    fontSize: 14,
  },
  lockWalletLabel: {
    color: '#FF0000',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  currenVersionContainer: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#838383',
  },
  currentVersionText: {
    fontFamily: 'Poppins-Regular',
  },
});
