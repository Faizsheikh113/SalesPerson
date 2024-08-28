// import necessary components
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesing from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import NavBar from './CreateCustomerNavBar';
import { useDispatch, useSelector } from 'react-redux';
import { setSendCompanyData, setSendCompanyImageData, setSendPersonalImageData, setSendProfileData } from '../../Redux/ActionType';
import { fetchCategoryListData, fetchRoleListData, fetchTransporterList } from '../../../utils/ApiCall';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = percentage => {
    return (windowHeight * percentage) / 100;
};

const calculateWidthPercentage = percentage => {
    return (windowWidth * percentage) / 100;
};

const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

// create the component
export const CompanyInfo = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [CompanyName, setCompanyName] = useState('');
    const [Email, setEamil] = useState('');
    const [selectedRegister, setselectedRegister] = useState('');
    const [selectedParty, setselectedParty] = useState('');
    const [CompanyAddress1, setCompanyAddress1] = useState('');
    const [CompanyAddress2, setCompanyAddress2] = useState('');
    const [CompanyContact, setCompanyContact] = useState('');
    const [ShopeSize, setShopeSize] = useState('');
    const [ShopPhoto, setShopePhoto] = useState([]);
    const [Pincode, setPincode] = useState('');
    const [State, setState] = useState('');
    const [City, setCity] = useState('');
    const [GstNumber, setGstNumber] = useState('');
    const [Deals, setDeals] = useState('');
    const [Turnover, setTurnover] = useState('');
    const [showGstNumberField, setShowGstNumberField] = useState(true);
    const RegistrationType = [
        {
            item: 'Regular',
            value: 0,
        },
        {
            item: 'Registered',
            value: 1,
        },
        {
            item: 'Unregistered',
            value: 2,
        }
    ];
    const Party = [{ item: 'Creditor', value: 0 }, { item: 'Debitor', value: 1 }];

    // const RegistrationType =['Regular','Registered','Unregistered'];
    // const Party =['Creditor','Debitor'];

    // Error state variables
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');
    const [GstNumberError, setGstNumberError] = useState('');
    const [DealsError, setDealsError] = useState('');
    const [TurnoverError, setTurnoverError] = useState('');

    const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidContactNumber = contactNumber => /^\d{10}$/.test(contactNumber);
    const isValidShopSize = size => !!size;
    const isValidText = text => !!text;
    const isValidTurnover = turnover => !isNaN(parseFloat(turnover)) && isFinite(turnover);
    // console.log("Edit Id :- ",EditId);

    const pickImage = () => {
        ImagePicker.openPicker({
            multiple: true,
            cropping: true,
            //   compressImageQuality: 0.8, // Optional compression quality
            mediaType: 'photo',
        }).then(images => {
            let tempArray = [];
            images.forEach(image => {
                tempArray.push({
                    // name: image.filename,
                    path: image.path,
                    type: image.mime,
                    size: image.size,
                });
            });
            setShopePhoto(tempArray);
        }).catch(error => {
            console.log('Error selecting images:', error);
        });
    };

    // const pickImage = async () => {
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.images],
    //         });
    //         const tempArray = [{
    //             name :res.name,
    //             path: res.uri,
    //             type: res.type,
    //             size: res.size,
    //         }];
    //         setShopePhoto(tempArray);
    //     } catch (error) {
    //         if (DocumentPicker.isCancel(error)) {
    //             console.log('User cancelled the picker');
    //         } else {
    //             console.log('Error selecting document:', error);
    //         }
    //     }
    // };

    // const pickImage = async () => {
    //     try {
    //       const result = await DocumentPicker.pick({
    //         type: [DocumentPicker.types.images],
    //       });

    //       setShopePhoto(prevImages => [...prevImages, result]);
    //     } catch (error) {
    //       if (DocumentPicker.isCancel(error)) {
    //         console.log('Document picker was canceled');
    //       } else {
    //         console.log('Error selecting image:', error);
    //       }
    //     }
    //   };

    console.log('Selected multiple photo ;- ', ShopPhoto)
    const handleRegistrationTypeChange = (itemValue) => {
        setselectedRegister(itemValue);
        setShowGstNumberField(itemValue !== 2);
    };
    const handleNext = () => {
        // Reset previous error messages
        setNameError('');
        setEmailError('');
        setContactNumberError('');
        setGstNumberError('');
        setDealsError('');
        setTurnoverError('');

        // Validate inputs
        if (!isValidText(CompanyName)) {
            setNameError('Please enter your name.');
        }

        if (!isValidText(Email)) {
            setEmailError('Please enter your email.');
        } else if (!isValidEmail(Email)) {
            setEmailError('Invalid email address.');
        }

        if (!isValidText(CompanyContact)) {
            setContactNumberError('Please enter your contact number.');
        } else if (!isValidContactNumber(CompanyContact)) {
            setContactNumberError('Please enter a valid 10-digit phone number.');
        }

        if (!isValidText(Deals)) {
            setDealsError('Please enter deals in products.');
        }

        if (!isValidTurnover(Turnover)) {
            setTurnoverError('Please enter a valid annual turnover.');
        }

        if (
            !isValidText(CompanyName) ||
            !isValidText(Email) ||
            !isValidText(CompanyAddress1) ||
            !isValidText(CompanyAddress2) ||
            // !selectedRegister ||
            // !selectedParty ||
            !isValidText(CompanyContact) ||
            // !isValidText(ShopeImage) ||
            !isValidShopSize(ShopeSize) ||
            // !isValidText(Country) ||
            !isValidText(State) ||
            !isValidText(City) ||
            !isValidText(Deals) ||
            !isValidTurnover(Turnover)
        ) {
            return;
        }

        const dataToSend = {
            registrationType: Number(selectedRegister),
            partyType: Number(selectedParty),
            gstNumber: GstNumber,
            CompanyName: CompanyName,
            email: Email,
            address1: CompanyAddress1,
            address2: CompanyAddress2,
            contactNumber: Number(CompanyContact),
            shopSize: ShopeSize,
            shopSize: ShopeSize,
            pincode: Number(Pincode),
            State: State,
            City: City,
            dealsInProducts: Deals,
            annualTurnover: Number(Turnover),
        }

        // dispatch(setSendCompanyData(dataToSend));
        dispatch(setSendCompanyData(dataToSend));
        // console.log(" Shop image  111 :-", ShopeImage);
        dispatch(setSendCompanyImageData(ShopPhoto));
        // Navigate to the next screen
        navigation.navigate('PersonalInformation');
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Search bar */}
            <NavBar navigation={navigation} route={route} />
            <ScrollView>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Registration Type</Text>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name='app-registration' size={23} color='black' style={styles.Icon} />
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedRegister}
                            onValueChange={handleRegistrationTypeChange}
                        >
                            <Picker.Item label="Select Registration Type" value="" color='gray' />
                            {RegistrationType.map((registrationType, index,) => (
                                <Picker.Item key={index} label={registrationType.item} value={registrationType.value} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Party Type</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='person-add-outline' size={23} color='black' style={styles.Icon} />
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedParty}
                            onValueChange={(itemValue, itemIndex) => setselectedParty(itemValue)}
                        >
                            <Picker.Item label="Select Party Type" value="" color='gray' />
                            {Party.map((PartyType, index,) => (
                                <Picker.Item key={index} label={PartyType.item} value={PartyType.value} />
                            ))}
                        </Picker>
                    </View>
                </View>
                {showGstNumberField && (
                    <>
                        <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2), marginBottom: calculateHeightPercentage(-1.5) }}>
                            <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Gst Number</Text>
                            <View style={nameError ? styles.searchContainer : styles.errorBorder}>
                                <FontAwesome name='money' size={23} color='black' style={styles.Icon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Enter Gst Number"
                                    onChangeText={(text) => setGstNumber(text)}
                                    value={GstNumber}
                                    keyboardType='default'
                                />
                            </View>
                        </View>
                        {/* {GstNumberError && <Text style={styles.errorText}>{GstNumberError}</Text>} */}
                    </>

                )}
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Company Name</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='person-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput, { borderColor: nameError ? 'red' : 'gray' }]}
                            placeholder="Enter your Name"
                            onChangeText={(text) => setCompanyName(text)}
                            value={CompanyName}
                        />
                    </View>
                </View>
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(1.8) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Email</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='email-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput, { borderColor: nameError ? 'red' : 'gray' }]}
                            placeholder="Enter your Email"
                            onChangeText={(text) => setEamil(text)}
                            value={Email}
                            keyboardType='email-address'
                        />
                    </View>
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(0.8) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Company Address 1</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='location-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput, { borderColor: nameError ? 'red' : 'gray' }]}
                            placeholder="Enter address"
                            onChangeText={(text) => setCompanyAddress1(text)}
                            value={CompanyAddress1}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(1.8) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Company Address 2</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='location-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput, { borderColor: nameError ? 'red' : 'gray' }]}
                            placeholder="Enter address"
                            onChangeText={(text) => setCompanyAddress2(text)}
                            value={CompanyAddress2}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Company Contact</Text>
                    <View style={styles.searchContainer}>
                        <AntDesing name='contacts' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput, { borderColor: nameError ? 'red' : 'gray' }]}
                            placeholder="Enter contact number"
                            onChangeText={text => {
                                if (/^\d{0,10}$/.test(text)) {
                                    setCompanyContact(text);
                                    // setContactNumberError('');
                                }
                            }}
                            value={CompanyContact}
                            keyboardType='phone-pad'
                        />
                    </View>
                </View>
                {contactNumberError ? <Text style={styles.errorText}>{contactNumberError}</Text> : null}

                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(0) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Sope Size</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='move-resize' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput, { borderColor: nameError ? 'red' : 'gray' }]}
                            placeholder="Enter Shope Size"
                            onChangeText={(text) => setShopeSize(text)}
                            value={ShopeSize}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2), marginBottom: calculateHeightPercentage(-4) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Shope Photo</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            color: 'black',
                            backgroundColor: 'lightgray',
                            padding: calculateFontSizePercentage(3),
                            marginTop: calculateHeightPercentage(1),
                        }}
                        onPress={pickImage}>
                        <Text>Choose File</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginVertical: calculateHeightPercentage(1.5) }}>
                        {ShopPhoto.map((image, index) => (
                            <Image key={index} source={{ uri: image.path }} style={{ width: 80, height: 80 }} />
                        ))}
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(0) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Pincode </Text>
                    <View style={styles.searchContainer}>
                        <Icon name='flag-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter pincode"
                            onChangeText={(text) => setPincode(text)}
                            value={Pincode}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>State </Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='map-marker-path' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter State"
                            onChangeText={(text) => setState(text)}
                            value={State}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(0) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>City</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='map-marker-account-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter City"
                            onChangeText={(text) => setCity(text)}
                            value={City}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Deals in product</Text>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name='production-quantity-limits' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Deals"
                            onChangeText={(text) => setDeals(text)}
                            value={Deals}
                        />
                    </View>
                </View>
                {DealsError && <Text style={styles.errorText}>{DealsError}</Text>}

                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Annual Turnover</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='cash-register' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Annual Turnover"
                            onChangeText={(text) => setTurnover(text)}
                            value={Turnover}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                {TurnoverError && <Text style={styles.errorText}>{TurnoverError}</Text>}

                <View style={{ alignSelf: 'center', paddingVertical: calculateHeightPercentage(2) }}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#3966fa', width: calculateWidthPercentage(90), height: calculateHeightPercentage(5), borderRadius: 5, alignItems: 'center', paddingVertical: calculateHeightPercentage(1.3) }}

                        onPress={handleNext}>
                        <Text style={{ fontSize: calculateFontSizePercentage(3.5), color: 'white' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};
export const PersonalInfo = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [OwnerName, setOwnerName] = useState('');
    const [PersonalContact, setPersonalContact] = useState('');
    const [PersonalAddress, setPersonalAddress] = useState('');
    const [PersonalPhoto, setPersonalPhoto] = useState('');
    const [Passport, setPassport] = useState('');
    const [PersonalPinCode, setPersonalPinCode] = useState('');
    const [PersonalState, setPersonalState] = useState('');
    const [PersonalCity, setPersonalCity] = useState('');
    const [Pan, setPan] = useState('');
    const [Addhar, setAddhar] = useState('');


    const pickImage = async () => {
        try {
            const results = await DocumentPicker.pick({
                multiple: true
            });

            if (results) {
                // Process each selected image
                // const PersonalselectedImages = results.map((result) => {
                //     if (result) {
                //         // console.log(result);    
                //         return {
                //             uri: result,
                //             name: result,
                //         };
                //     } else {
                //         console.warn('Image URI is undefined for a selected image:', result);
                //         return null; // or handle it according to your needs
                //     }
                // }).filter(Boolean); // Remove null values from the array
                setPersonalPhoto(results);
                console.log("Personal SelectedImage :- ", results);
            } else {
                console.warn('No images selected');
            }
        } catch (err) {
            if (err.message === 'User cancelled image selection') {
                // User cancelled the picker
                console.log('User cancelled image selection');
            } else {
                console.error('Error picking images:', err);
            }
        }
    };
    console.log("Personal Photo :- ", PersonalPhoto)
    // const PersonalImage = PersonalPhoto?.map((item) => item.name);

    const handleNext = () => {
        console.log(firstName)
        console.log(lastName)
        console.log(PersonalContact)
        console.log(PersonalAddress)
        console.log(PersonalPinCode)
        console.log(PersonalState)
        console.log(PersonalCity)
        console.log(Pan)
        console.log(Addhar)
        // const data = {...userdata}
        const ProfileData = {
            firstName: firstName,
            lastName: lastName,
            ownerName: OwnerName,
            mobileNumber: Number(PersonalContact),
            address: PersonalAddress,
            passPortNo: Passport,
            personalPincode: Number(PersonalPinCode),
            Pcity: PersonalCity,
            Pstate: PersonalState,
            panNo: Pan,
            aadharNo: Number(Addhar),
        }
        if (!firstName || !lastName || !PersonalState || !PersonalCity || !Pan || !Addhar) {
            alert('pleale fill empty fields!!')
            return;
        }
        dispatch(setSendProfileData(ProfileData));
        dispatch(setSendPersonalImageData(PersonalPhoto));
        navigation.navigate('SuperAdmin')
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Nav bar */}
            <NavBar navigation={navigation} route={route} />

            {/* Input field */}
            <ScrollView>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black', }}>First Name</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='person-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter your First Name"
                            onChangeText={(text) => setFirstName(text)}
                            value={firstName}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Last Name</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='person-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter your Last Name"
                            onChangeText={(text) => setLastName(text)}
                            value={lastName}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Owner Name</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='person-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Owner Name"
                            onChangeText={(text) => setOwnerName(text)}
                            value={OwnerName}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Personal Contact</Text>
                    <View style={styles.searchContainer}>
                        <AntDesing name='contacts' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={[styles.searchInput]}
                            placeholder="Enter contact number"
                            onChangeText={text => {
                                if (/^\d{0,10}$/.test(text)) {
                                    setPersonalContact(text);
                                    // setContactNumberError('');
                                }
                            }}
                            value={PersonalContact}
                            keyboardType='phone-pad'
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Passport Number</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='location-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter your Passport Number"
                            onChangeText={(text) => setPassport(text)}
                            value={Passport}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Address</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='location-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter your Address"
                            onChangeText={(text) => setPersonalAddress(text)}
                            value={PersonalAddress}
                        />
                    </View>
                </View>

                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Photo</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            color: 'black',
                            backgroundColor: 'lightgray',
                            padding: calculateFontSizePercentage(3),
                            marginTop: calculateHeightPercentage(1),
                        }}
                        onPress={pickImage}>
                        <Text>Choose File</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginVertical: calculateHeightPercentage(1.5) }}>
                        {/* {PersonalPhoto.map((image, index) => ( */}
                        {PersonalPhoto[0] && <Image source={PersonalPhoto[0]} style={{ width: 80, height: 80, marginBottom: calculateHeightPercentage(2) }} />}
                        {/* ))} */}
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(-2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Pincode</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='flag-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Pincode"
                            onChangeText={(text) => setPersonalPinCode(text)}
                            value={PersonalPinCode}
                            keyboardType='numeric'
                        />
                    </View>
                </View>

                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>State</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='map-marker-path' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter State"
                            onChangeText={(text) => setPersonalState(text)}
                            value={PersonalState}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>City</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='map-marker-account-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter City"
                            onChangeText={(text) => setPersonalCity(text)}
                            value={PersonalCity}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Pan Number</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='id-card-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Annual Turnover"
                            onChangeText={(text) => setPan(text)}
                            value={Pan}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Addhar Number</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='card-account-details-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Annual Turnover"
                            onChangeText={(text) => setAddhar(text)}
                            value={Addhar}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <View style={{ alignSelf: 'center', paddingVertical: calculateHeightPercentage(2) }}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#3966fa', width: calculateWidthPercentage(90), height: calculateHeightPercentage(5), borderRadius: 5, alignItems: 'center', paddingVertical: calculateHeightPercentage(1.3) }}

                        onPress={handleNext}>
                        <Text style={{ fontSize: calculateFontSizePercentage(3.5), color: 'white' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};
export const SuperAdmin = ({ route }) => {

    useEffect(() => {
        const getDatabase = async () => {
            const db = await AsyncStorage.getItem('database');
            setDatabase(db)
        }
        getDatabase();
    }, [])

    const ProfileData = useSelector((state) => state.sendProfileInfo);
    const userdata = useSelector((state) => state.sendCompanyInfo);
    // const ShopPhoto = useSelector((state) => state.sendCompanyImage);
    const ShopPhoto = useSelector((state) => state.sendCompanyImage);
    const ProfilePhoto = useSelector((state) => state.sendPersonalPhoto)
    // console.log('Redux ProfilePhoto 111 :- ',ProfilePhoto);
    // const { database } = useSelector((state) => state.app);
    const [database, setDatabase] = useState();
    const navigation = useNavigation();
    const [Password, setPassword] = useState('');
    const [selectedTranspot, setselectedTranspot] = useState('');
    const [TransporterList, setTransporterList] = useState('');
    const [RoleList, setRoleList] = useState('659e5fb79ef00371955486af');
    const [Category, setCategory] = useState('');
    const [ShowTransporterList, setShowTransporterList] = useState(false);
    const [LockInTime, setLockInTime] = useState('');
    const [Limit, setLimit] = useState('');
    // const [Photo, setPhoto] = useState('');
    const [PaymentTerm, setPaymentTerm] = useState('');
    const [DueDate, setDueDate] = useState('');
    const [GeoTagging, setGeoTagging] = useState('');
    const [ServiceArea, setServiceArea] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const transporterType = [{ item: 'Local', value: 1 }, { item: 'Other', value: 2 }];

    const dispatch = useDispatch();
    useEffect(() => {
        console.log("SUPER ADMIN :- ", database);
        fetchTransporterList(database, dispatch);
        fetchRoleListData(database, dispatch);
        fetchCategoryListData(database, dispatch);
    }, [database, dispatch])

    const TransporterSelect = useSelector((state) => state.sendTransporterList);
    const Name = TransporterSelect?.TransporterList;
    const TransporterListData = Name || [];
    const CategoryList = useSelector((state) => state.sendCategoryList)
    const CategoryData = CategoryList?.CategoryList?.CustomerGroup;
    const CategoryListData = CategoryData || [];

    const handleItemChange = (itemValue, itemIndex) => {
        console.log('selectedTransporter :- ', TransporterListData)
        if (itemIndex === 0) {
            console.log('Placeholder item selected');
        } else {
            const selectedTransporter = TransporterListData[itemIndex - 1];
            if (TransporterList.includes(selectedTransporter)) {
                alert('Already Selected', 'You have already selected this transporter.');
            } else {
                console.log('Selected Item:', selectedTransporter);
                setTransporterList((prevList) => [...prevList, selectedTransporter]);
            }
        }
    };

    // useEffect(() => {
    //     const checkLocationPermission = async () => {
    //         try {
    //             if (Platform.OS === 'ios') {
    //                 const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    //                 if (result === RESULTS.GRANTED) {
    //                     getLocation();
    //                 } else {
    //                     const permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    //                     if (permissionResult === RESULTS.GRANTED) {
    //                         getLocation();
    //                     }
    //                 }
    //             } else if (Platform.OS === 'android') {
    //                 const result = await PermissionsAndroid.request(
    //                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //                 );

    //                 if (result === PermissionsAndroid.RESULTS.GRANTED) {
    //                     getLocation();
    //                 } else {
    //                     console.log('Location permission denied');
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error checking or requesting location permission:', error);
    //         }
    //     };

    //     // const getLocation = () => {
    //     //     Geolocation.getCurrentPosition(
    //     //         position => {
    //     //             const { latitude, longitude } = position.coords;
    //     //             console.log('Latitude:', latitude);
    //     //             console.log('Longitude:', longitude);
    //     //             // Use latitude and longitude
    //     //             setGeoTagging(latitude + "," + longitude);
    //     //         },
    //     //         error => {
    //     //             console.log('Error getting location:', error);
    //     //         },
    //     //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //     //     );
    //     // };

    //     checkLocationPermission();
    // }, []);

    // const ShopImage = ShopPhoto.CompanyImage.map((item) => ({
    //     name: item.name,
    //     size: item.size,
    //     uri: item.uri,
    //     type: item.type
    // }));

    // console.log("Multi Photo :-", ShopPhoto.CompanyImage);
    // console.log("Multi Photo :-", ShopImage);

    const handleSubmit = async () => {
        // const database = useSelector((state)=> state.app);
        console.log('inner Database :- ', database);
        const formData = new FormData();

        const CompanyData = userdata.CompanyInfo;
        const ProfileData1 = ProfileData.ProfileInfo;

        const Tlist = TransporterList;
        // console.log(Tlist);

        const singlePhoto = ProfilePhoto.PersonalPhoto;
        console.log(database)
        const FinalData = {
            transporterDetail: Number(selectedTranspot),
            assignTransporter: JSON.stringify(Tlist),
            password: Password,
            category: Category,
            lockInTime: Number(LockInTime),
            limit: Number(Limit),
            duedate: Number(DueDate),
            serviceArea: ServiceArea,
            paymentTerm: Number(PaymentTerm),
            // geotagging: GeoTagging,
            rolename: RoleList,
            database: database,
        };

        const mergedObject = Object.assign({}, CompanyData, FinalData, ProfileData1);
        for (const [key, value] of Object.entries(mergedObject)) {
            if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        console.log("MERGE OBJECT :- ", mergedObject)

        const image = {
            name: singlePhoto[0].name,
            size: singlePhoto[0].size,
            uri: singlePhoto[0].uri,
            type: singlePhoto[0].type,
        }
        const Shopimage = ShopPhoto.CompanyImage;
        // console.log('Shopimage :- ',image) 
        //     Shopimage.forEach((image) => {
        //         if (image) {
        //             formData.append(`files`, {
        //                 // name: image.uri,
        //                 size: image.size,
        //                 uri: image.uri,
        //                 type: image.mime,
        //             })
        //         }
        //     });

        formData.append('file', image);

        // Make the Axios POST request
        // await axios.post('https://node.rupioo.com/customer/save-customer', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data', // Specify that the request payload is multipart form data
        //     }
        // }).then((response) => {
        //     console.log(response.data);
        //     alert(response.data.message);
        //     navigation.navigate('CreationCustomerList');
        //     console.log('Success');
        // }).catch((error) => {
        //     console.error('Error:', error.response);
        // })
    };

    const handleTransporter = (itemValue) => {
        console.log(itemValue)
        setselectedTranspot(itemValue);
        setShowTransporterList(itemValue == 2);
    };


    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Nav bar */}
            <NavBar navigation={navigation} route={route} />

            <ScrollView>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Transpoter</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='person-outline' size={23} color='black' style={styles.Icon} />
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedTranspot}
                            onValueChange={handleTransporter}
                        >
                            <Picker.Item label="Select Transporter Type" value="Local" />
                            {transporterType.map((name, index) => (
                                <Picker.Item key={index} label={name.item} value={name.value} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {ShowTransporterList && (
                    <>
                        <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2), marginBottom: calculateHeightPercentage(-1.5) }}>
                            <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Transporter List</Text>
                            <View style={styles.searchContainer}>
                                <Icon name='person-outline' size={23} color='black' style={styles.Icon} />
                                <Picker
                                    style={styles.picker}
                                    selectedValue={TransporterList}
                                    onValueChange={(itemValue, itemIndex) => handleItemChange(itemValue, itemIndex)}
                                    mode='multiple'
                                >
                                    <Picker.Item label="Select Role" value="" />
                                    {TransporterListData.length > 0 &&
                                        TransporterListData.map((item, index) => (
                                            <Picker.Item key={index} label={item.name} />
                                        ))}
                                </Picker>
                            </View>
                        </View>

                        {/* {GstNumberError && <Text style={styles.errorText}>{GstNumberError}</Text>} */}
                    </>

                )}
                {/* <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Role List</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='people-outline' size={23} color='black' style={styles.Icon} />
                        <Picker
                            style={styles.picker}
                            selectedValue={RoleList}
                            onValueChange={(itemValue, itemIndex) => setRoleList(itemValue)}
                        >
                            <Picker.Item label="Select Role" value="" />
                            {RoleListData.length > 0 &&
                                RoleListData.map((item, index) => (
                                    <Picker.Item key={index} label={`${item.roleName}`} value={item} />
                                ))}
                        </Picker>

                    </View>
                </View> */}
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Geo Tagging</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='location-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Geo Tagging"
                            onChangeText={(text) => setGeoTagging(text)}
                            value={GeoTagging}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), paddingVertical: calculateHeightPercentage(2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Password</Text>
                    <View style={styles.searchContainer}>
                        <Icon name='lock-closed-outline' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter your password"
                            onChangeText={(text) => setPassword(text)}
                            value={Password}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Icon
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={22}
                                color='black'
                                style={styles.Icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(0) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Category </Text>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name='category' size={23} color='black' style={styles.Icon} />
                        <Picker
                            style={styles.picker}
                            selectedValue={Category}
                            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                        >
                            <Picker.Item label="Select Category" value="" />
                            {CategoryListData.length > 0 &&
                                CategoryListData.map((item, index) => (
                                    <Picker.Item key={index} label={`${item.groupName}`} value={item._id} />
                                ))}
                        </Picker>
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Lock in Time</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='garage-lock' size={28} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Lock in Time"
                            onChangeText={(text) => setLockInTime(text)}
                            value={LockInTime}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Limit</Text>
                    <View style={styles.searchContainer}>
                        <MaterialComIcons name='car-speed-limiter' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Limit"
                            onChangeText={(text) => setLimit(text)}
                            value={Limit}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                {/* <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Logo</Text>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity style={{ borderWidth: 1, color: 'black', backgroundColor: 'lightgray', padding: calculateFontSizePercentage(0.5) }}
                            onPress={pickImage}
                        >
                            <Text>Choose File</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Choose logo from Gallery or Camera Roll"
                            onChangeText={(text) => setPhoto(text)}
                            value={Photo}
                        />
                    </View>
                </View> */}
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Payment Term</Text>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name='payment' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Payment Term"
                            onChangeText={(text) => setPaymentTerm(text)}
                            value={PaymentTerm}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Due Date</Text>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name='wifi-tethering-error' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Due Date"
                            onChangeText={(text) => setDueDate(text)}
                            value={DueDate}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: calculateWidthPercentage(5), marginTop: calculateHeightPercentage(1.5) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(4), color: 'black' }}>Service Area with</Text>
                    <View style={styles.searchContainer}>
                        <FontAwesome name='gear' size={23} color='black' style={styles.Icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter Service area"
                            onChangeText={(text) => setServiceArea(text)}
                            value={ServiceArea}
                        />
                    </View>
                </View>
                <View style={{ alignSelf: 'center', marginTop: calculateHeightPercentage(2) }}>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={{ backgroundColor: '#3966fa', width: calculateWidthPercentage(90), height: calculateHeightPercentage(5), borderRadius: 5, alignItems: 'center', paddingVertical: calculateHeightPercentage(1.3), marginBottom: calculateHeightPercentage(2) }}
                    >
                        <Text style={{ fontSize: calculateFontSizePercentage(3.5), color: 'white' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

// define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height: calculateHeightPercentage(7),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: calculateFontSizePercentage(1),
        width: '100%',
        justifyContent: 'space-evenly',
    },
    backButton: {
        marginLeft: calculateWidthPercentage(-25),
    },
    headerTitle: {
        color: 'black',
        fontSize: calculateFontSizePercentage(5),
        fontWeight: 'bold',
        marginLeft: calculateWidthPercentage(-10),
    },
    searchContainer: {
        height: calculateHeightPercentage(6),
        width: calculateWidthPercentage(90),
        borderRadius: 5,
        borderColor: 'gray',
        // borderWidth: 1,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: calculateHeightPercentage(1),
        opacity: 1,
        overflow: 'hidden',
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(3),
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: 'black',
        fontSize: calculateFontSizePercentage(3.5),
    },
    searchButton: {
        padding: calculateFontSizePercentage(2),
    },
    flatList: {
        flex: 1,
        marginTop: calculateHeightPercentage(4),
    },
    ItemView: {
        marginTop: calculateHeightPercentage(0.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10
    },
    picker: {
        flex: 1,
        height: calculateHeightPercentage(6),
        fontSize: calculateFontSizePercentage(3.5),
        // color: 'black',
    },
    errorText: {
        fontSize: calculateFontSizePercentage(3.5),
        color: 'red',
        marginTop: calculateHeightPercentage(0),
        marginBottom: calculateHeightPercentage(1),
        alignSelf: 'flex-start',
        paddingHorizontal: calculateWidthPercentage(6),
    },
    errorBorder: {
        height: calculateHeightPercentage(6),
        width: calculateWidthPercentage(90),
        borderRadius: 5,
        // borderColor:'gray',
        // borderWidth: 1,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: calculateHeightPercentage(1),
        opacity: 1,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(3),
    },
    image: {
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        marginVertical: 5,
    },
});

