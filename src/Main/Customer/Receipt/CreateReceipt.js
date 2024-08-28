//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import { CustomerBaseUrl } from '../../../../Config/BaseUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../Customer_footer';
import Geolocation from '@react-native-community/geolocation';


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
const CreateReceipt = ({ navigation }) => {
    const [checked, setChecked] = useState('Cash');
    const [CashAmount, setCashAmount] = useState();
    const [OTP, setOtp] = useState();
    const [ChequeAmount, setChequeAmount] = useState();
    const [ChequeNo, setChequeNo] = useState();
    const [Customer_name, setCustomerName] = useState();
    const [CustomerId, setCustomerId] = useState();
    const [UserId, setUserId] = useState();
    const [Database, setDatabase] = useState();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "App needs access to your location.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;
                            setLatitude(latitude);
                            setLongitude(longitude);
                        },
                        // { timeout: 15000, maximumAge: 1000 },
                    );
                } else {
                    // console.log("Location permission denied");
                    // setLocationError("Location permission denied");
                }
            } catch (err) {
                // console.log(err);
                // setLocationError(err.message);
            }
        }
        getLocation();
    }, [])

    useEffect(() => {
        const getCustomer = async () => {
            const id = await AsyncStorage.getItem('userId')
            const database = await AsyncStorage.getItem('database')
            const CustomerData = await AsyncStorage.getItem('CustomerData');
            const CustomerDataJson = JSON.parse(CustomerData);
            setUserId(id);
            setDatabase(database);
            setCustomerId(CustomerDataJson?._id);
            setCustomerName(CustomerDataJson?.CompanyName);
        }
        getCustomer();
    }, [])

    console.log("Latitude :- ", latitude);
    console.log("Longitude :- ", longitude);

    const SendOtp = async () => {
        console.log("Customer_name!!!!!!!!!! :- ", Customer_name);
        console.log("Party Id @@@@@@@@@@:- ", CustomerId);
        console.log("User Id :##########- ", UserId);
        const otp = Math.floor(1000 + Math.random() * 9000);
        console.log(otp);
        console.log(new Date());
        console.log(latitude);
        console.log(longitude);
        await axios.post(`${CustomerBaseUrl}receipt/save-otp`, {
            otp: otp,
            userId: UserId,
            partyId: CustomerId,
            amount: CashAmount ? CashAmount : ChequeAmount,

        })
            .then((response) => {
                console.log(response?.data)
                Alert.alert('Successfully!!!', "Otp send to customer successfully...")
            })
            .catch((error) => { console.log(error?.response?.data) })
    }


    const verifyOtp = async () => {
        console.log(OTP);
        console.log(CustomerId);
        await axios.post(`${CustomerBaseUrl}receipt/otp-verify`, {
            partyId: CustomerId,
            otp: Number(OTP),
        })
            .then(async (res) => {
                console.log(res?.data?.message);
                if (res) {
                    await axios.post(`${CustomerBaseUrl}receipt/receipt-generate`, {
                        partyId: CustomerId,
                        type: 'receipt',
                        paymentMode: checked,
                        amount:CashAmount,
                        date: new Date(),
                        latitude: latitude,
                        longitude: longitude,
                        database: Database,
                    })
                        .then((res) => {
                            Alert.alert('Successfull!!!', res?.data?.message)
                            navigation.navigate('Receipt Summary')
                            setOtp();
                        })
                        .catch((err) => {
                            console.log(err?.response?.data)
                            Alert.alert('Error!!!', err?.response?.data?.error);
                            setOtp();
                        })
                }
            })
            .catch((err) => {
                console.log(err?.response?.data)
                Alert.alert('Error!!!', err?.response?.data?.message);
            })
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', marginTop: calculateHeightPercentage(5) }}>Customer</Text>
            <TextInput
                editable={false}
                style={styles.input}
                placeholder="Enter cheque number"
                placeholderTextColor={'gray'}
                value={Customer_name}
            />

            {/* RadioButton */}
            <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', marginBottom: calculateHeightPercentage(0) }}>Type</Text>

            <View style={{ height: calculateHeightPercentage(5), backgroundColor: '#f0f0f0', borderRadius: calculateFontSizePercentage(5), flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="Cash"
                    status={checked === 'Cash' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('Cash')}
                />
                <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', marginRight: calculateWidthPercentage(10), }}>Cash</Text>
                <RadioButton
                    style={{
                        marginRight: calculateWidthPercentage(10)
                    }}
                    value="Bank"
                    status={checked === 'Bank' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('Bank')}
                />
                <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', }}>Cheque</Text>

            </View>

            <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', marginTop: calculateHeightPercentage(1) }}>Amount</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter receivable amount"
                placeholderTextColor={'gray'}
                onChangeText={text => setCashAmount(text)}
                value={CashAmount}
            />

            <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', }}>O.T.P.</Text>
            <View style={{
                color: 'black',
                width: '80%',
                paddingHorizontal: calculateWidthPercentage(5),
                flexDirection: 'row',
                height: calculateHeightPercentage(6),
                borderColor: 'black',
                borderRadius: calculateFontSizePercentage(1.5),
                alignItems: 'center',
                backgroundColor: "white",
                borderColor: '#e0e0e5',
                borderWidth: 1,
                elevation: 5,
                marginBottom: calculateHeightPercentage(2),
                justifyContent: 'space-between'
            }}>
                <TextInput
                    placeholder="Enter receved OTP"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setOtp(text)}
                    value={OTP}
                // keyboardType='email-address'
                />
                <TouchableOpacity onPress={() => { SendOtp() }} style={{ width: calculateWidthPercentage(25), backgroundColor: '#3966fa', borderRadius: calculateFontSizePercentage(2), marginLeft: calculateWidthPercentage(20) }}>
                    <Text style={{ color: 'white', padding: calculateFontSizePercentage(3), textAlign: 'center', fontSize: calculateFontSizePercentage(4) }}>Get OTP</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { verifyOtp() }} style={{ width: calculateWidthPercentage(85), backgroundColor: '#3966fa', borderRadius: calculateFontSizePercentage(2), alignSelf: 'center', marginTop: calculateHeightPercentage(5) }}>
                <Text style={{ color: 'white', padding: calculateFontSizePercentage(3), textAlign: 'center', fontSize: calculateFontSizePercentage(4) }}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Footer navigation={navigation} />
            </View>
        </GestureHandlerRootView >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: calculateWidthPercentage(8),
    },
    dropdown: {
        marginTop: calculateHeightPercentage(2),
        color: 'black',
        height: calculateHeightPercentage(6),
        width: "100%",
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
        color: 'black'
    },
    icon: {
        marginRight: 10,
    },
    input: {
        color: 'black',
        paddingHorizontal: calculateWidthPercentage(5),
        flexDirection: 'row',
        height: calculateHeightPercentage(6),
        borderColor: 'black',
        borderRadius: calculateFontSizePercentage(1.5),
        alignItems: 'center',
        backgroundColor: "white",
        borderColor: '#e0e0e5',
        borderWidth: 1,
        elevation: 5,
        marginBottom: calculateHeightPercentage(2),
    },
    footer: {
        position: 'absolute',
        height: "10%",
        alignItems: "center",
        top: calculateHeightPercentage(81)
    },
    footerText: {
        fontSize: calculateFontSizePercentage(5),
    },
});

//make this component available to the app
export default CreateReceipt;
