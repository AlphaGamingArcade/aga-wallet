import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import banner1 from '../assets/banner-1.png';
import banner2 from '../assets/banner-2.png';
import banner3 from '../assets/banner-3.png';

export default function Banner() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((count) => (count + 1) % imageIndex.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const imageIndex = [banner1, banner2, banner3];

  const moveToNextPicture = () => {
    setCount((count) => (count + 1) % imageIndex.length);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={moveToNextPicture}>
        <Image source={imageIndex[count]} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.imageCount}>
        {count + 1}/{imageIndex.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    position: 'relative',
    width: '100%',
    height: 150,
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageCount: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#FFFF',
    width: 50,
    height: 25,
    textAlign: 'center',
    paddingTop: 2,
    borderRadius: 25,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
  },
});
