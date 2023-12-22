import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import loadingAsset from '../assets/splash.png';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image style={styles.backgroundImage} source={loadingAsset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  loadingText: {
    fontSize: 20,
  },
});
