import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import filterIcon from '../assets/filter-icon-gray.png';
import GameCard from './GameCard';
import sampleGame1Icon from '../assets/sample-game-1.png';
import sampleGame2Icon from '../assets/sample-game-2.png';
import { FONT_SIZE } from '../utils/app_constants';

const gameInfoList = [
  {
    img: sampleGame1Icon,
    name: 'Bacarrat 2.0',
    type: 'Card Game',
    gameValue: 10000000000,
    color: '#0172B4',
  },
  {
    img: sampleGame2Icon,
    name: 'Bacarrat - Big One - Big two - Big three',
    type: 'Card Game',
    gameValue: 10000000000,
    color: '#FF9900',
  },
  {
    img: sampleGame1Icon,
    name: 'Bacarrat - 1222',
    type: 'Card Game',
    gameValue: 10000000000,
    color: '#0172B4',
  },
];

export default function Games() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerGame}>
        <Text style={styles.headerText}>Available Games</Text>
        <Image source={filterIcon} style={styles.filterIcon}></Image>
      </View>
      <View style={styles.gameCardsContainer}>
        {gameInfoList.map((gameInfo, index) => {
          return <GameCard game={gameInfo} key={index} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 28,
  },
  headerGame: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
    fontSize: FONT_SIZE.LARGE - 2,
    fontWeight: '200',
  },
  filterIcon: {
    width: 17,
    height: 17,
  },
  gameCardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
