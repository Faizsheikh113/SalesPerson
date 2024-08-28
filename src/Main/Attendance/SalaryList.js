//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Table, Row } from 'react-native-table-component';
import { SafeAreaView } from 'react-native-safe-area-context';
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
const SalaryList = ({navigation}) => {
    const Date = calculateWidthPercentage(27);
    const EmployeeID = calculateWidthPercentage(27);
    const Working = calculateWidthPercentage(23);
    const Basic = calculateWidthPercentage(23);
    const Allowence = calculateWidthPercentage(23);
    const Gross = calculateWidthPercentage(23);
    const EPF = calculateWidthPercentage(23);
    const Total = calculateWidthPercentage(23);
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView>
                <ScrollView horizontal={true}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                        <Row data={['Date', 'Employee Id', 'Working Days', 'Basic Salary', 'Allowence', 'Gross Salary', 'EPF', 'Total Salary',]} style={{ backgroundColor: '#E1E6F7' }} textStyle={{ margin: calculateHeightPercentage(1), fontWeight: '600', fontSize: calculateFontSizePercentage(4), color: 'black', textAlign: 'center' }} widthArr={[Date, EmployeeID, Working, Basic, Allowence, Gross, EPF, Total]} />

                        <Row
                            // key={index}
                            data={[
                                "03/05/2024",
                                "EMP1001",
                                "28",
                                "10,000.00",
                                "500.00",
                                "10,500.00",
                                "9,300.00",
                                "9,300.00",
                            ]}

                            style={{ backgroundColor: '#F2F3F5' }}
                            textStyle={{ paddingVertical: calculateHeightPercentage(2), fontSize: calculateFontSizePercentage(4), textAlign: 'center',color:'gray' }}
                            widthArr={[Date, EmployeeID, Working, Basic, Allowence, Gross, EPF,Total]} />
                    </Table>
                </ScrollView>
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
});

//make this component available to the app
export default SalaryList;
