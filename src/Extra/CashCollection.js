// import React, { useState } from 'react';
// import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Table, Row } from 'react-native-table-component';
// import Bill from './Main/Customer/Bill';
// import Receipt from './Main/Customer/Receipt';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// // Helper functions for dimension calculations
// const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
// const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
// const calculateFontSizePercentage = percentage => {
//     const baseDimension = Math.min(windowWidth, windowHeight);
//     return (baseDimension * percentage) / 100;
// };

// const CashCollection = ({ navigation }) => {
//     const [isFocus, setIsFocus] = useState(false);
//     const [selectedValue, setSelectedValue] = useState(null);
//     const [selectedTab, setSelectedTab] = useState(1);

//     const handleTabChange = (tabNumber) => {
//         setSelectedTab(tabNumber);
//     };

//     const Date = calculateWidthPercentage(27);
//     const EmployeeID = calculateWidthPercentage(27);
//     const CheckIn = calculateWidthPercentage(23);
//     const CheckOut = calculateWidthPercentage(23);
//     const Status = calculateWidthPercentage(33);

//     return (
//         <GestureHandlerRootView style={styles.container}>
//             <View>
//                 <View style={styles.navbar}>
//                     <TouchableOpacity onPress={() => handleTabChange(1)} style={[styles.tab, selectedTab === 1 && styles.activeTab]}>
//                         <Text style={styles.tabText}>Receipt</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleTabChange(2)} style={[styles.tab, selectedTab === 2 && styles.activeTab]}>
//                         <Text style={styles.tabText}>Summary</Text>
//                     </TouchableOpacity>
//                 </View>
//                 {selectedTab === 1 ? <Bill navigation={navigation} /> :
//                     selectedTab === 2 ? <Receipt navigation={navigation} /> :
//                         null}
//             </View>
//         </GestureHandlerRootView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // alignItems: 'center',
//         backgroundColor: '#fff0',
//     },
//     dropdown: {
//         marginTop: calculateHeightPercentage(3),
//         color: 'black',
//         height: 43,
//         width: "90%",
//         borderColor: '#800080',
//         borderWidth: 0.5,
//         backgroundColor: 'white',
//         paddingHorizontal: calculateWidthPercentage(5),
//     },
//     placeholderStyle: {
//         fontSize: calculateFontSizePercentage(3.5),
//         color: 'gray',
//     },
//     selectedTextStyle: {
//         fontSize: calculateFontSizePercentage(3.5),
//         color: 'gray'
//     },
//     icon: {
//         marginRight: 10,
//     },
//     navbar: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         paddingVertical: calculateHeightPercentage(0.5),
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//     },
//     tab: {
//         paddingHorizontal: calculateWidthPercentage(5),
//         paddingVertical: calculateHeightPercentage(1),
//     },
//     activeTab: {
//         borderBottomWidth: calculateHeightPercentage(0.3),
//         borderBottomColor: '#000',
//     },
//     tabText: {
//         fontSize: calculateFontSizePercentage(3.8),
//         fontWeight: '400',
//         color: 'black'
//     },
// });

// export default CashCollection;
