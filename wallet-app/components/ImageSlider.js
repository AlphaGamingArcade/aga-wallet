import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import banner1 from '../assets/banner-1.png';
import banner2 from '../assets/banner-2.png';
import banner3 from '../assets/banner-3.png';

const windowWidth = Dimensions.get('window').width;
const bannerImages = [banner1, banner2, banner3, banner1, banner2];

export default function ImageSlider() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((index) => {
        const currentIndex = bannerImages.length - 1 > index ? index + 1 : 0;

        setIsProgrammaticScroll(true);

        scrollViewRef.current.scrollTo({
          x: (windowWidth - 40) * currentIndex,
          animated: true,
        });

        setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, 500);

        return currentIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={(event) => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const currentIndex = Math.round(contentOffset / (windowWidth - 40));
          if (!isProgrammaticScroll) {
            setBannerIndex(currentIndex);
          }
        }}
      >
        {bannerImages.map((bannerImage, index) => {
          return <Image key={index} source={bannerImage} style={styles.image} />;
        })}
      </ScrollView>
      <View style={styles.bannerIndicator}>
        <View style={styles.bannerIndicatorBg}></View>
        <Text style={styles.bannerIndicatorText}>
          {bannerIndex + 1}/{bannerImages.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 'auto',
    height: 120,
    minHeight: 120,
    borderRadius: 10,
    overflow: 'scroll',
    marginTop: 30,
  },
  scrollView: {
    width: windowWidth - 40,
    height: '100%',
    borderRadius: 5,
  },
  image: {
    width: windowWidth - 40,
    height: '100%',
    minHeight: 120,
    borderRadius: 5,
  },
  bannerIndicator: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: 10,
  },
  bannerIndicatorBg: {
    position: 'absolute',
    width: 50,
    height: 26,
    backgroundColor: '#000000',
    opacity: 0.5,
    borderRadius: 100,
  },
  bannerIndicatorText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    paddingTop: 5,
    paddingBottom: 5,
    // add animation here
  },
});
