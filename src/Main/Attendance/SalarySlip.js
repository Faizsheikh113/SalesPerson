//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from './HR_Footer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};
// create a component
const SalarySlip = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>SalarySlip</Text>
            <View style={styles.footer}>
                <Footer navigation={navigation} />
            </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
    footer: {
        position: 'absolute',
        height: "10%",
        alignItems: "center",
        top: calculateHeightPercentage(80)
    },
    footerText: {
        fontSize: calculateFontSizePercentage(5),
    },
});

//make this component available to the app
export default SalarySlip;
