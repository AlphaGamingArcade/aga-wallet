import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function TabHeader(props) {
  return (
    <View style={styles.container}>
      <View style={styles.topNavigationContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={props.onPressBack}>
            <Ionicons name="arrow-back" size={32} color={COLORS.BLACK} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#fff',
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
        marginTop: Platform.OS == 'ios' ? 20 : 30,
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
        paddingBottom: 15
      },
      headerText: {
        fontSize: FONT_SIZE.LARGE + 4,
        fontFamily: FONT_FAMILY.POPPINS_BOLD,
      },
})