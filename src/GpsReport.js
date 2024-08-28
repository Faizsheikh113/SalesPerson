import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, FlatList, RefreshControl } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CustomerBaseUrl } from '../Config/BaseUtil';
import moment from 'moment';
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
const GPSReport = ({ navigation }) => {
    const [leadData, setLeadData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const pullMe = () => {
        setRefresh(true);
        GetProduct();
        setTimeout(() => {
            setRefresh(false);
        }, 1000)
    }

    const GetProduct = useCallback(async () => {
        const CustomerData = await AsyncStorage.getItem('CustomerData');
        const CustomerDataJson = JSON.parse(CustomerData);
        try {
            await axios.get(`${CustomerBaseUrl}receipt/view-party-receipt/${CustomerDataJson?._id}/${CustomerDataJson?.database}`)
                .then((res) => {
                    // console.log(res?.data?.Receipts);
                    setLeadData(res?.data?.Receipts || []);
                })
                .catch((err) => {
                    console.log(err?.response?.data)
                })
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [setLeadData, setIsLoading]);

    // useEffect(() => {
    //     if (leadData) {
    //         const lat = leadData[1]?.latitude;
    //         const lon = leadData[1]?.longitude;
    //         fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 const address = data.display_name;
    //                 // Update the placeName state variable with the address
    //                 setPlaceName(address);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     }

    // }, [leadData]);

    // console.log("!@#@!@#@!@#@ :- ", placeName)
    // console.log()

    useEffect(() => {
        GetProduct();
    }, [GetProduct]);

    const Date = calculateWidthPercentage(32);
    const EmployeeID = calculateWidthPercentage(35);
    const CheckIn = calculateWidthPercentage(20);
    const buttons = calculateWidthPercentage(23);
    const renderProductItem = useCallback((item, index) => {
        return (
            <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                    <Row
                        key={index}
                        data={[
                            `${moment(item?.createdAt).format('DD-MM-YYYY')} / ${moment(item?.createdAt).format('hh:ss')}`,
                            item?.partyId?.CompanyName?.toUpperCase(),
                            item?.type?.toUpperCase(),
                            item?.latitude?.toString(),
                            item?.longitude?.toString(),
                        ]}
                        style={[{ backgroundColor: "#E7E6E1", }, index % 2 && { backgroundColor: "#F7F6E7" }]}
                        textStyle={{ fontSize: calculateFontSizePercentage(3), textAlign: 'center', color: '#6b6b6b', height: calculateHeightPercentage(-1), paddingHorizontal: calculateWidthPercentage(1) }}
                        widthArr={[Date, EmployeeID, CheckIn, buttons, buttons]}
                    />
                </Table>
            </ScrollView>
        );
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <ScrollView horizontal={true}>
                    <Table>
                        <Row data={['Date/Time', 'Party Name', 'Report Type', 'Latitude', 'Longitude']} style={{ backgroundColor: '#E1E6F7', }} textStyle={{ margin: calculateHeightPercentage(0.5), fontWeight: '600', fontSize: calculateFontSizePercentage(4), color: 'black', textAlign: 'center' }}
                            borderStyle={{ borderColor: "#C1C0B9", borderWidth: calculateWidthPercentage(0.3), }}
                            widthArr={[Date,EmployeeID,CheckIn,buttons,buttons]}

                        />
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refresh}
                                    onRefresh={() => { pullMe() }}
                                />
                            }
                            style={{ marginBottom: calculateHeightPercentage(1) }}
                            data={leadData}
                            renderItem={({ item, index }) => (
                                renderProductItem(item, index)
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Table>
                </ScrollView>
            )
            }
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        backgroundColor: '#fff0',
    },
    loadingContainer: {
        // flex: 1,
        marginTop: calculateHeightPercentage(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        marginTop: calculateHeightPercentage(10),
        color: 'black',
        height: calculateHeightPercentage(6),
        width: "85%",
        borderColor: '#800080',
        borderWidth: 0.5,
        backgroundColor: 'white',
        paddingHorizontal: calculateWidthPercentage(5),

    },
    placeholderStyle: {
        fontSize: calculateFontSizePercentage(3.5),
        color: 'gray',
    },
    selectedTextStyle: {
        fontSize: calculateFontSizePercentage(3.5),
        color: 'gray'
    },
    icon: {
        marginRight: 10,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: calculateHeightPercentage(0.5),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tab: {
        paddingHorizontal: calculateWidthPercentage(5),
        paddingVertical: calculateHeightPercentage(1),
    },
    activeTab: {
        borderBottomWidth: calculateHeightPercentage(0.3),
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: calculateFontSizePercentage(3.8),
        fontWeight: '400',
        color: 'black'
    },
    footer: {
        position: 'absolute',
        height: "10%",
        alignItems: "center",
        top: calculateHeightPercentage(74)
    },
    footerText: {
        fontSize: calculateFontSizePercentage(5),
    },
});

//make this component available to the app
export default GPSReport;
