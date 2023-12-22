import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import CarretDownIcon from '../assets/arrow-down-white.png';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletBalanceCard({ balance }) {
  return (
    <LinearGradient
      colors={['transparent', COLORS.PRIMARY]}
      start={{ x: 1, y: 1.6 }}
      style={styles.mainContainer}
    >
      <TouchableOpacity style={styles.currenyBtn}>
        <Text style={styles.currencyText}>USD</Text>
      </TouchableOpacity>
      <Text style={styles.headerText} numberOfLines={2}>
        My Account
      </Text>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceTextContainer}>
          <Text style={styles.valueBalanceText}>${balance.toLocaleString()}</Text>
        </View>
        <View style={styles.carretContainer}>
          <TouchableOpacity>
            <Image source={CarretDownIcon} style={styles.carretDownIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 'auto',
    backgroundColor: COLORS.BLACK,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'relative',
    elevation: 10,
  },
  currenyBtn: {
    position: 'absolute',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 2.5,
    borderRadius: 5,
    left: 'auto',
    right: 20,
    top: 12,
  },
  currencyText: {
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
  },
  headerText: {
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.WHITE,
  },
  balanceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  balanceTextContainer: {
    paddingRight: 15,
    maxWidth: '95%'
  },
  valueBalanceText: {
    fontSize: FONT_SIZE.EXTRA_LARGE - 2,
    fontWeight: '600',
    color: COLORS.WHITE,
    fontFamily: 'Poppins-SemiBold',
    paddingVertical: 8,
  },
  carretContainer: {
    flex: 1
  },
  carretDownIcon: {
    height: 8,
    width: 10,
    marginTop: -5,
  },
});
