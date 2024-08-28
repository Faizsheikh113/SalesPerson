import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Modal,TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CustomerBaseUrl } from '../Config/BaseUtil';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

const Home = ({ navigation }) => {
    const [openModal2, setOpenModal2] = useState(false);
    const [Otp2, setOtp2] = useState();

    const handleModle2 = async () => {
        const id = await AsyncStorage.getItem('userId');
        await axios.get(`${CustomerBaseUrl}/good-dispatch/view-otp/${id}`)
            .then((res) => {
                console.log("res", res?.data?.otp);
                setOtp2(res?.data?.otp?.otpVerify);
                setOpenModal2(true);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    }

    const handelLogout = async () => {
        await AsyncStorage.removeItem('userId')
            .then(() => {
                navigation.navigate("Login");
            })
            .catch((err) => { console.log(err?.response?.data) });
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require("../assets/SalesMainLogo.png")}
                    />
                </View>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                </View>
                <View style={styles.logoutButtonContainer}>
                    <TouchableOpacity
                        onPress={handelLogout} // Fixed here
                        style={styles.logoutButton}
                    >
                        <MaterialIcons name="logout" size={35} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.getOtpButtonContainer}>
                <TouchableOpacity
                    style={styles.getOtpButton}
                    onPress={handleModle2}
                >
                    <Text style={styles.getOtpButtonText}>Get Cancle Deliver Otp</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Row_1 */}
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => navigation.navigate("Attendance List")}>
                        <View style={styles.card}>
                            <View style={styles.cardImageContainer}>
                                <Image
                                    style={styles.cardImage}
                                    source={require("../assets/SalesMainLogo.png")}
                                />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardText}>HR</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Customer List")}>
                        <View style={styles.cardCustomer}>
                            <View style={styles.cardImageContainer}>
                                <Image
                                    style={styles.cardImage}
                                    source={require("../assets/ViewAttendance.png")}
                                />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardText}>Customer</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Row_2 */}
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => navigation.navigate("Sales Lead List")}>
                        <View style={styles.cardLead}>
                            <View style={styles.cardImageContainer}>
                                <Image
                                    style={styles.cardImage}
                                    source={require("../assets/Cash.png")}
                                />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardText}>Lead</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("GPS Report")}>
                        <View style={styles.cardReport}>
                            <View style={styles.cardImageContainer}>
                                <Image
                                    style={styles.cardImage}
                                    source={require("../assets/my-salary.png")}
                                />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardText}>Daily{'\n'}Activity</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {openModal2 && (
                <Modal visible={openModal2} animationType='slide' transparent={true}>
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setOpenModal2(false)}
                            >
                                <Ionicons name="close" size={30} color='black' />
                            </TouchableOpacity>

                            <View style={styles.modalTextContainer}>
                                <Text style={styles.modalText}>
                                    Your OTP for Cancle Order is :- 
                                    <Text style={styles.otpText}> {Otp2}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white",
    },
    header: {
        backgroundColor: "white",
        height: "10%",
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
    logoContainer: {
        height: "100%",
        width: calculateWidthPercentage(30),
        justifyContent: "center",
        alignItems: "center",
        marginLeft: calculateWidthPercentage(-3),
    },
    logoImage: {
        height: "80%",
        width: calculateWidthPercentage(17),
    },
    headerTitleContainer: {
        height: "100%",
        width: calculateWidthPercentage(45),
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: calculateFontSizePercentage(5.5),
        fontWeight: "bold",
        color: 'black',
    },
    logoutButtonContainer: {
        height: "100%",
        width: calculateWidthPercentage(25.5),
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: calculateWidthPercentage(5),
    },
    logoutButton: {
        backgroundColor: "transparent",
    },
    getOtpButtonContainer: {
        padding: calculateFontSizePercentage(2),
        alignSelf: 'flex-end',
    },
    getOtpButton: {
        height: calculateHeightPercentage(7),
        width: calculateWidthPercentage(50),
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: calculateFontSizePercentage(2),
        elevation: 5,
    },
    getOtpButtonText: {
        color: 'white',
        fontSize: calculateFontSizePercentage(4),
        textAlign: 'center',
    },
    mainContent: {
        height: "50%",
        width: "100%",
        paddingHorizontal: calculateWidthPercentage(2),
        justifyContent: 'space-around',
        backgroundColor: "white",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        height: calculateHeightPercentage(18),
        width: calculateWidthPercentage(46),
        backgroundColor: "#f2bf66",
        elevation: 5,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    cardCustomer: {
        height: calculateHeightPercentage(18),
        width: calculateWidthPercentage(46),
        backgroundColor: "#68c3f7",
        elevation: 5,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    cardLead: {
        height: calculateHeightPercentage(18),
        width: calculateWidthPercentage(46),
        backgroundColor: "#e1fa7d",
        elevation: 5,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    cardReport: {
        height: calculateHeightPercentage(18),
        width: calculateWidthPercentage(46),
        backgroundColor: "#7ad169",
        elevation: 5,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    cardImageContainer: {
        height: calculateHeightPercentage(7),
        width: calculateWidthPercentage(20),
        justifyContent: "center",
        alignItems: "center",
    },
    cardImage: {
        height: 40,
        width: 50,
        backgroundColor: 'transparent',
    },
    cardTextContainer: {
        height: calculateHeightPercentage(7),
        width: calculateWidthPercentage(40),
        justifyContent: "center",
        alignItems: "center",
    },
    cardText: {
        fontSize: calculateFontSizePercentage(5),
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        width: '80%',
        height: '35%',
        backgroundColor: 'white',
        paddingHorizontal: calculateWidthPercentage(5),
        borderRadius: calculateFontSizePercentage(5),
        paddingVertical: calculateHeightPercentage(5),
        borderWidth: 1,
        borderColor: 'green',
        position: 'relative', // Ensure the close button is correctly positioned
    },
    closeButton: {
        position: 'absolute',
        top: calculateFontSizePercentage(5),
        right: calculateFontSizePercentage(5),
        zIndex: 1, // Ensure the button is above other elements
    },
    modalTextContainer: {
        padding: calculateFontSizePercentage(3),
        marginTop: calculateHeightPercentage(1.5),
    },
    modalText: {
        fontSize: calculateFontSizePercentage(5),
        color: 'black',
    },
    otpText: {
        color: 'green',
        fontSize: calculateFontSizePercentage(4.5),
    },
});

export default Home;
