import { View, Text, StyleSheet, Image } from 'react-native';
import coin from '../assets/coin.png';
import { COLORS, FONT_SIZE } from '../utils/app_constants';

export default function WalletAssetsCard() {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.assetText}>Assets</Text>
      <View style={styles.subContainer}>
        <View style={styles.coinInfo}>
          <Image source={coin} style={styles.assetIcon}></Image>
          <View>
            <Text style={styles.coinText}>AGA COIN</Text>
            <Text style={styles.coinText}>${(100000).toLocaleString()}.00</Text>
          </View>
        </View>
        <Text style={styles.coinValueText}>{(100000).toLocaleString()}.00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 'auto',
  },
  coinContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.WHITE,
  },
  assetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FONT_SIZE.LARGE - 2,
    fontWeight: '200',
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
});
