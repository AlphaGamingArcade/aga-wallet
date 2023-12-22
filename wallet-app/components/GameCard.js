import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
export default function GameCard({ game }) {
  return (
    <TouchableOpacity style={styles.gameContainer}>
      <View style={styles.gameIconContainer}>
        <Image source={game.img} style={styles.gameIcon} />
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.gameName}>{game.name}</Text>
        <Text style={styles.gameType}>{game.type}</Text>
      </View>
      <View style={{ ...styles.featured, backgroundColor: game.color }}>
        <Text style={styles.featuredText}>Featured</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  gameContainer: {
    width: '48%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 5,
    margin: 0,
    padding: 0,
    paddingBottom: 25,
  },
  gameIconContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  gameIcon: {
    width: '100%',
    height: 100,
  },
  gameInfo: {
    width: '100%',
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  gameName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  gameType: {
    fontFamily: 'Poppins-Regular',
    color: '#838383',
    fontSize: 13,
  },
  featured: {
    position: 'absolute',
    top: 'auto',
    bottom: 0,
    borderBottomEndRadius: 10,
    alignSelf: 'flex-end',
    paddingLeft: 15,
    paddingRight: 15,
  },
  featuredText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#ffffff',
  },
});
