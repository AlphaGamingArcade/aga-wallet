import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import exhangeCurrencyIcon from '../../assets/exchange-currency-icon.png';
import lockIconRed from '../../assets/lock-icon-red.png';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../../utils/app_constants';
import TabHeader from '../../components/TabHeader';

export default function SettingsTab({ navigation }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "height" : ""} style={styles.keyboardAvoidingView}>
      <TabHeader onPressBack={navigation.goBack} title="Settings" />
      <ScrollView
        scrollEventThrottle={16}
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
