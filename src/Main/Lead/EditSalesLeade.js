import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, Modal, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { fetchTransporterList } from '../../../utils/ApiCall';
import { useDispatch, useSelector } from 'react-redux';
import MultiSelect from 'react-native-multiple-select';
import Geolocation from '@react-native-community/geolocation';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

const EditLead = ({ navigation, route }) => {
    const [OwnerName, setOwnerName] = useState('');
    const [ComanyName, setComanyName] = useState('');
    const [mobile, setMobile] = useState('');
    const [Pincode, setPincode] = useState('');
    const [City, setCity] = useState('');
    const [State, setState] = useState('');
    const [Address, setAddress] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [TransporterList, setTransporterList] = useState([]);
    const [database, setDatabase] = useState();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        const getDatabase = async () => {
            const db = await AsyncStorage.getItem('database');
            setDatabase(db)
            const { data } = route.params;
            console.log("GET Data SuccesFully :- @@@@@@@@@@", data);
            setOwnerName(data?.ownerName?.toUpperCase());
            setAddress(data?.address?.toUpperCase());
            setComanyName(data?.CompanyName.toUpperCase());
            setMobile(data?.mobileNumber);
            setPincode(data?.pincode?.toString());
            setCity(data?.City?.toUpperCase());
            setState(data?.State?.toUpperCase());
        }
        getDatabase();
    }, [])

    // useEffect(() => {
    //     const getLocation = async () => {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //                 {
    //                     title: "Location Permission",
    //                     message: "App needs access to your location.",
    //                     buttonNeutral: "Ask Me Later",
    //                     buttonNegative: "Cancel",
    //                     buttonPositive: "OK"
    //                 }
    //             );
    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 Geolocation.getCurrentPosition(
    //                     position => {
    //                         const { latitude, longitude } = position.coords;
    //                         setLatitude(latitude);
    //                         setLongitude(longitude);
    //                     },
    //                     // { timeout: 15000, maximumAge: 1000 },
    //                 );
    //             } else {
    //                 // console.log("Location permission denied");
    //             }
    //         } catch (err) {
    //             // console.warn(err);
    //         }
    //     }

    //     getLocation();
    // }, [])

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("SUPER ADMIN :- ", database);
        fetchTransporterList(database, dispatch);
    }, [database, dispatch])

    const TransporterSelect = useSelector((state) => state.sendTransporterList);
    const Name = TransporterSelect?.TransporterList;
    const TransporterListData = Name || [];

    const handleLogin = async () => {
        console.log("OwnerName :- ", OwnerName);
        console.log("TransporterList :- ", TransporterList);
        console.log("ComanyName :- ", ComanyName);
        console.log("Address :- ", Address);
        console.log("Pincode :- ", Pincode);
        console.log("City :- ", City);
        console.log("State :- ", State);
        // console.log("loction :- ", latitude, longitude);


        // if (OwnerName && ComanyName && mobile && location) {
        //     if (ComanyNameRegex.test(ComanyName)) {
        //         await axios.post('https://chauffit.com/chauffit_admin/api/ApiCommonController/usereditProfile', {
        //             name: OwnerName,
        //             ComanyName: ComanyName,
        //             phone: num.toString(),
        //             latitude: location?.coords?.latitude.toString(),
        //             longitude: location?.coords?.longitude.toString(),
        //             image: photo?.base64,
        //         })
        //             .then(async (response) => {
        //                 console.log("@@@@@@@@@@ :- ", response.data);
        //                 Alert.alert(
        //                     'Success!!', response.data.message,
        //                     [
        //                         {
        //                             text: 'OK',
        //                             onPress: () => console.log('OK Pressed'),
        //                         },
        //                     ],
        //                     { cancelable: false }
        //                 );
        //                 // navigation.navigate('OtpVerify');
        //             })
        //             .catch((err) => {
        //                 console.error('Error:', err);
        //                 Alert.alert('Error', 'Failed to EditLead. Please try again later.');
        //             });
        //     } else {
        //         Alert.alert('Invalid ComanyName', 'Please enter a valid ComanyName address.');
        //     }
        // } else {
        //     Alert.alert('Empty Fields', 'Please fill all the fields');
        // }
    };

    const handleInputChange = text => {
        const formattedText = text.replace(/[^\d]/g, '');
        setMobile(formattedText);
    }

    const onSelectedItemsChange = (selectedItems) => {
        const selectedTransporterObjects = TransporterListData.filter((item) => selectedItems.includes(item._id));
        setTransporterList(selectedTransporterObjects.map((item) => item._id));
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* DropDown */}
            <View style={{ paddingVertical: calculateHeightPercentage(2), marginBottom: calculateHeightPercentage(-1.5) }}>
                <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Transporter List</Text>
                <MultiSelect
                    styleDropdownMenu={{
                        color: 'black',
                        flexDirection: 'row',
                        height: calculateHeightPercentage(6),
                        borderColor: 'black',
                        borderRadius: calculateFontSizePercentage(1),
                        backgroundColor: "#f0f0f0",
                        borderColor: '#e0e0e5',
                        borderWidth: 1,
                        elevation: 2,
                        marginTop: calculateHeightPercentage(1),
                    }}
                    styleTextDropdownSelected={{
                        width: '100%',
                        paddingHorizontal: calculateWidthPercentage(10),
                        color: 'black'
                    }}
                    styleTextDropdown={{
                        paddingHorizontal: calculateWidthPercentage(5)
                    }}
                    hideTags
                    uniqueKey='id'
                    items={TransporterListData}
                    selectedItems={TransporterList}
                    onSelectedItemsChange={onSelectedItemsChange}
                    // onAddItem={()=>{handlePickSubmit(item)}}
                    selectText="Pick Items"
                    searchInputPlaceholderText="Search Items..."
                    selectedItemTextColor="green"
                    selectedItemIconColor="green"
                    itemTextColor="gray"
                    displayKey="name"
                    searchInputStyle={{ color: 'gray' }}
                    submitButtonColor="#48d22b"
                    submitButtonText="Submit"
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black' }}>Owner_name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Owner_name"
                    value={OwnerName}
                    onChangeText={text => setOwnerName(text)}
                />

                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black', marginTop: calculateHeightPercentage(1.5) }}>Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={Address}
                    onChangeText={text => setAddress(text)}
                />

                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black', marginTop: calculateHeightPercentage(1.5) }}>Contact</Text>
                <View style={styles.input}>
                    <TextInput
                        style={{ flex: 1, color: 'black' }}
                        placeholder="Mobile"
                        value={mobile}
                        onChangeText={handleInputChange}
                        keyboardType='numeric'
                    />
                </View>

                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black', marginTop: calculateHeightPercentage(1.5), color: 'black' }}>Company_name</Text>
                <TextInput
                    // editable={false}
                    style={styles.input}
                    placeholder="Company_name"
                    value={ComanyName}
                    onChangeText={text => setComanyName(text)}
                />

                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black', marginTop: calculateHeightPercentage(1.5), color: 'black' }}>PinCode</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Pincode"
                    value={Pincode}
                    onChangeText={text => setPincode(text)}
                />

                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black', marginTop: calculateHeightPercentage(1.5), color: 'black' }}>City</Text>
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={City}
                    onChangeText={text => setCity(text)}
                />

                <Text style={{ fontSize: calculateFontSizePercentage(4), marginBottom: calculateHeightPercentage(-1), color: 'black', marginTop: calculateHeightPercentage(1.5), color: 'black' }}>State</Text>
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={State}
                    onChangeText={text => setState(text)}
                />
            </ScrollView>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Choose an option</Text>
                        <TouchableOpacity onPress={() => { closeModal(); TakePhotoFromCamera(); }} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { closeModal(); TakePhotoFromGallery(); }} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.modalCancelButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: calculateWidthPercentage(8)
    },
    footer: {
        flex: 1,
        height: "30%",
        alignItems: "center",
        top: calculateHeightPercentage(87),
        position: 'absolute'
    },
    footerText: {
        fontSize: calculateFontSizePercentage(5),
    },
    input: {
        color: 'black',
        paddingHorizontal: calculateWidthPercentage(5),
        flexDirection: 'row',
        height: calculateHeightPercentage(6),
        width: calculateWidthPercentage(84),
        borderColor: 'black',
        borderRadius: calculateFontSizePercentage(1),
        alignItems: 'center',
        backgroundColor: "#f0f0f0",
        borderColor: '#e0e0e5',
        borderWidth: 1,
        elevation: 2,
        marginTop: calculateHeightPercentage(1),
    },
    picker: {
        flex: 1,
        height: calculateHeightPercentage(6),
        fontSize: calculateFontSizePercentage(3.5),
        marginLeft: calculateWidthPercentage(-5)
        // color: 'black',
    },
    button: {
        backgroundColor: 'black',
        paddingVertical: calculateHeightPercentage(1),
        marginTop: calculateHeightPercentage(3),
        marginBottom: calculateHeightPercentage(5),
        borderRadius: calculateFontSizePercentage(1),
        width: "85%",
        alignSelf: 'center',
        elevation: 5,
    },
    buttonText: {
        fontSize: calculateFontSizePercentage(5),
        color: 'white',
        textAlign: 'center',
        fontWeight: '650'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: calculateWidthPercentage(85),
        marginTop: calculateHeightPercentage(2),
    },
    photoButton: {
        backgroundColor: 'grey',
        paddingVertical: calculateHeightPercentage(1),
        borderRadius: calculateFontSizePercentage(1),
        width: "48%",
        alignSelf: 'center',
        elevation: 5,
    },
    photo: {
        width: calculateWidthPercentage(50),
        height: calculateHeightPercentage(25),
        marginTop: calculateHeightPercentage(2),
        borderRadius: calculateFontSizePercentage(1),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: calculateFontSizePercentage(2),
        padding: calculateHeightPercentage(2),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: calculateFontSizePercentage(5),
        fontWeight: 'bold',
        marginBottom: calculateHeightPercentage(2),
    },
    modalButton: {
        backgroundColor: 'grey',
        paddingVertical: calculateHeightPercentage(1),
        paddingHorizontal: calculateWidthPercentage(5),
        width: calculateWidthPercentage(70),
        borderRadius: calculateFontSizePercentage(1),
        marginVertical: calculateHeightPercentage(1),
    },
    modalCancelButton: {
        backgroundColor: 'grey',
        paddingVertical: calculateHeightPercentage(1),
        paddingHorizontal: calculateWidthPercentage(5),
        width: calculateWidthPercentage(70),
        borderRadius: calculateFontSizePercentage(1),
        marginVertical: calculateHeightPercentage(1),
    },
    modalButtonText: {
        fontSize: calculateFontSizePercentage(4),
        color: 'white',
        textAlign: 'center',
    },
});

export default EditLead;
