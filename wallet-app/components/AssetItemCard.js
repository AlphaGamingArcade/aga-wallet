import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FONT_SIZE } from '../utils/app_constants';

export default function AssetItemCard(props) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => props.onPressSelectAsset(props.asset)}
    >
      <View style={styles.assetInfoContainer}>
        <Image source={props.asset.icon} style={styles.assetIcon}></Image>
        <View>
          <Text style={styles.assetNameText}>{props.asset.name}</Text>
          <Text style={styles.networkText}>{props.asset.network}</Text>
        </View>
      </View>
      <View style={styles.assetInfoContainer2}>
        <Text style={styles.amountText}>{props.asset.amount.toLocaleString()}</Text>
        <Text style={styles.amountConvertionText}>
          ${props.asset.amountConversion.toLocaleString()}.00
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    elevation: 2,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  assetIcon: {
    height: 36,
    width: 36,
  },
  assetNameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FONT_SIZE.REGULAR,
  },
  amountText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  networkText: {
    color: '#757575',
    fontFamily: 'Poppins-Light',
  },
  assetInfoContainer2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  amountConvertionText: {
    fontFamily: 'Poppins-ExtraLight',
    textAlign: 'left',
    color: '#757575',
  },
});
