import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Table, Row } from 'react-native-table-component';
import Footer from '../Customer_footer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CustomerBaseUrl } from '../../../../Config/BaseUtil';
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
const ReceiptSummary = ({ navigation }) => {
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
                    console.log(res?.data?.Receipts);
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

    useEffect(() => {
        GetProduct();
    }, [GetProduct]);

    const Date = calculateWidthPercentage(21);
    const EmployeeName = calculateWidthPercentage(35);
    const PaymentModeWidth = calculateWidthPercentage(22);
    const AmountWidth = calculateWidthPercentage(23);
    const renderProductItem = useCallback((item, index) => {
        return (
            <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                    <Row
                        key={index}
                        data={[
                            moment(item?.createdAt).format('DD-MM-YYYY'),
                            item?.partyId?.CompanyName?.toUpperCase(),
                            item?.paymentMode?.toUpperCase(),
                            item?.amount.toString(),
                        ]}
                        style={[{ backgroundColor: "#E7E6E1", }, index % 2 && { backgroundColor: "#F7F6E7" }]}
                        textStyle={{ fontSize: calculateFontSizePercentage(3), textAlign: 'center', color: '#6b6b6b', height: calculateHeightPercentage(-1), paddingHorizontal: calculateWidthPercentage(1) }}
                        widthArr={[Date, EmployeeName, PaymentModeWidth, AmountWidth]}
                    />
                </Table>
            </ScrollView>
        );
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>

                    <Ionicons name={'arrow-back-outline'} size={23} color={'black'} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Receipt</Text>

                <TouchableOpacity style={styles.shoppingCart} onPress={() => { navigation.navigate('Create Receipt') }}>
                    <View style={{ alignItems: 'center' }}>
                        <AntDesign name="addfile" size={25} color='black' />
                        <Text style={{
                            textAlign: 'center',
                            marginTop: calculateHeightPercentage(-0.5),
                            color: 'black',
                        }}>Create Receipt</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <ScrollView horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Table>
                        <Row data={['Date', 'Party Name', 'Payment Mode', 'Amount']} style={{ backgroundColor: '#E1E6F7', }} textStyle={{ margin: calculateHeightPercentage(0.5), fontWeight: '600', fontSize: calculateFontSizePercentage(4), color: 'black', textAlign: 'center' }}
                            borderStyle={{ borderColor: "#C1C0B9", borderWidth: calculateWidthPercentage(0.3), }}
                            widthArr={[Date, EmployeeName, PaymentModeWidth, AmountWidth]}

                        />
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refresh}
                                    onRefresh={() => { pullMe() }}
                                />
                            }
                            style={{ marginBottom: calculateHeightPercentage(18) }}
                            data={leadData}
                            renderItem={({ item, index }) => (
                                renderProductItem(item, index)
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </Table>
                </ScrollView>
            )
            }
            <View style={styles.footer}>
                <Footer navigation={navigation} />
            </View>
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
    header: {
        height: calculateHeightPercentage(8),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(5),
        borderBottomWidth: calculateWidthPercentage(0.06),
        elevation: 3
    },
    backIcon: {
        paddingRight: calculateWidthPercentage(5),
    },
    headerTitle: {
        fontSize: calculateFontSizePercentage(5.5),
        color: 'black',
    },
    shoppingCart: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto'
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
        top: calculateHeightPercentage(88)
    },
    footerText: {
        fontSize: calculateFontSizePercentage(5),
    },
});

//make this component available to the app
export default ReceiptSummary;
