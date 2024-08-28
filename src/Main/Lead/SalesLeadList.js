//import libraries
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList, RefreshControl, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row } from "react-native-table-component";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomerBaseUrl } from '../../../Config/BaseUtil';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

// create the LeadList component
const LeadList = ({ navigation }) => {
    const [leadData, setLeadData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);


    const GetProduct = useCallback(async () => {
        try {
            const database = await AsyncStorage.getItem('database');
            console.log(database);
            const response = await axios.get(CustomerBaseUrl + `/customer/lead-party-list/${database}`);
            setLeadData(response?.data?.LeadParty || []);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [setLeadData, setIsLoading]);

    useEffect(() => {
        GetProduct();
    }, [GetProduct]);

    const pullMe = () => {
        setRefresh(true);
        GetProduct();
        setTimeout(() => {
            setRefresh(false);
        }, 1000)
    }

    const goToEdit = (data)=>{
        console.log(data);
        navigation.navigate('Edit Lead', {data: data})
    }

    const renderProductItem = useCallback((item, index) => {
        const Date = calculateWidthPercentage(37);
        const EmployeeID = calculateWidthPercentage(28);
        const CheckIn = calculateWidthPercentage(27);
        const CheckOut = calculateWidthPercentage(27);
        const buttons = calculateWidthPercentage(40);
        return (
            <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                    <Row
                        key={index}
                        data={[
                            item?.CompanyName?.toUpperCase(),
                            <TouchableOpacity style={{ alignItems: 'center' }}
                                onPress={() => {
                                    Linking.openURL(`tel:${item.mobileNumber}`);
                                }}
                            >
                                <Text style={{ fontSize: calculateFontSizePercentage(3), color: 'blue' }}>{item.mobileNumber}</Text>
                            </TouchableOpacity>,
                            item?.City?.toUpperCase(),
                            item.address?.toUpperCase(),
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: calculateWidthPercentage(2), padding: calculateFontSizePercentage(1) }}>
                                <TouchableOpacity style={{ alignItems: 'center' }}
                                    onPress={() => { navigation.navigate('CompanyInformation') }}
                                >
                                    <MaterialCommunityIcons name={'account-convert'} size={25} color={'#6b6b6b'} />
                                    <Text style={{ fontSize: calculateFontSizePercentage(3), color: '#6b6b6b' }}>Convert</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}
                                    onPress={() => { goToEdit(item) }}
                                >
                                    <MaterialCommunityIcons name={'account-edit'} size={25} color={'#6b6b6b'} />
                                    <Text style={{ fontSize: calculateFontSizePercentage(3), color: '#6b6b6b' }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name={'calendar-edit'} size={25} color={'#6b6b6b'} />
                                    <Text style={{ fontSize: calculateFontSizePercentage(2.5), color: '#6b6b6b' }}>Remark</Text>
                                </TouchableOpacity>
                            </View>
                        ]}
                        style={[{ backgroundColor: "#E7E6E1" }, index % 2 && { backgroundColor: "#F7F6E7" }]}
                        textStyle={{ fontSize: calculateFontSizePercentage(3), textAlign: 'center', color: '#6b6b6b', height: calculateHeightPercentage(-1), paddingHorizontal: calculateWidthPercentage(1) }}
                        widthArr={[Date, EmployeeID, CheckIn, CheckOut, buttons]}
                    />
                </Table>
            </ScrollView>
        );
    }, []);

    return (

        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <ScrollView horizontal={true}>
                    <Table>
                        <Row data={['Name', 'Number', 'City', 'Address', 'Action']} style={{ backgroundColor: '#E1E6F7', }} textStyle={{ margin: calculateHeightPercentage(0.5), fontWeight: '600', fontSize: calculateFontSizePercentage(4), color: 'black', textAlign: 'center' }}
                            borderStyle={{ borderColor: "#C1C0B9", borderWidth: calculateWidthPercentage(0.3), }}
                            widthArr={[calculateWidthPercentage(37), calculateWidthPercentage(28), calculateWidthPercentage(27), calculateWidthPercentage(27), calculateWidthPercentage(40)]}
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
        </SafeAreaView >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        paddingVertical: calculateHeightPercentage(2.2),
    },
    headerText: {
        marginLeft: calculateWidthPercentage(5),
        marginTop: calculateHeightPercentage(-0.5),
        fontSize: calculateFontSizePercentage(5),
        color: 'black',
        fontWeight: 'bold'
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

export default LeadList;