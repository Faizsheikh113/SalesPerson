//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Table, Row } from 'react-native-table-component';
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
const AttendanceList = ({ navigation }) => {
    const Date = calculateWidthPercentage(27);
    const EmployeeID = calculateWidthPercentage(27);
    const CheckIn = calculateWidthPercentage(23);
    const CheckOut = calculateWidthPercentage(23);
    const Status = calculateWidthPercentage(33);
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView>
                <ScrollView horizontal={true}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                        <Row data={['Month', 'EmployeeID', 'Checkin Time', 'CheckOut Time', 'Attendance Status']} style={{ backgroundColor: '#E1E6F7' }} textStyle={{ margin: calculateHeightPercentage(1), fontWeight: '600', fontSize: calculateFontSizePercentage(4), color: 'black', textAlign: 'center' }} widthArr={[Date, EmployeeID, CheckIn, CheckOut, Status]} />

                        <Row
                            // key={index}
                            data={[
                                "April",
                                "EMP1001",
                                "09:00 AM",
                                "06:00 PM",
                                "Present",
                            ]}
                            style={{ backgroundColor: '#F2F3F5' }}
                            textStyle={{ margin: calculateHeightPercentage(1), fontSize: calculateFontSizePercentage(4), textAlign: 'center', color: 'gray' }}
                            widthArr={[Date, EmployeeID, CheckIn, CheckOut, Status]}
                        />
                    </Table>
                </ScrollView>
                <View style={styles.footer}>
                    <Footer navigation={navigation} />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: "white",
    },
    header: {
        backgroundColor: "white",
        height: "10%",
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBlockColor: "lightgrey",
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
export default AttendanceList;
