import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';

// Get device dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

const CustomerList = ({ navigation }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [chatData, setChatData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                const database = await AsyncStorage.getItem('database');
                console.log(" :- ", database)
                console.log("Id :- ", id)
                await axios.get(`https://customer-node.rupioo.com/customer/view-customer/${id}/${database}`)
                    .then((response) => {
                        console.log("@@@@@@@@ :-", response.data)
                        const data = response?.data?.Customer || [];
                        setChatData(data);
                        setFilteredData(data); // Initialize filteredData with the full list
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err?.response?.data)
                    })
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleItemPress = async (item) => {
        console.log("Full Selected Data :- ", item);
        await AsyncStorage.setItem('CustomerData', JSON.stringify(item));
        setExpandedId(item.id === expandedId ? null : item.id);
        navigation.navigate('Order');
    };

    const handleSearch = useCallback((text) => {
        const keywords = text.trim().toUpperCase().split(/\s+/);
        const matchesSearch = (item, keywords) => {
            const title = item?.CompanyName.toUpperCase();
            return keywords.every(keyword => title.includes(keyword));
        };

        const filtered = chatData.filter(item => matchesSearch(item, keywords));
        setFilteredData(filtered);
    }, [chatData]);

    const renderItem = (item) => {
        const isExpanded = item.id === expandedId;
        console.log(" Image @@@@@@@@@@@ :- ", item.profileImage)
        return (
            <View style={[styles.card, isExpanded && styles.expandedCard]} key={item.id}>
                <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <View style={styles.cardContent}>
                        <Image source={{ uri: `https://customer-node.rupioo.com/Images/${item?.profileImage}` }} style={styles.avatar} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item?.ownerName}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'grey', fontWeight: '600' }}>Contact: </Text>
                                <Text style={{ color: 'red', fontWeight: '600' }}> {item?.contactNumber}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'gray', fontWeight: '600' }}>Turnover: </Text>
                                <Text style={{ color: 'green', fontWeight: '600' }}> {item?.annualTurnover}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView>
            {/* List */}
            <View style={styles.filters}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Customer..."
                    onChangeText={(text) => handleSearch(text)}
                    autoCapitalize='characters'
                />
            </View>
            <ScrollView style={{ marginTop: calculateHeightPercentage(1), marginBottom: calculateHeightPercentage(12) }}>
                {loading ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View style={styles.cardContainer}>
                        {filteredData.map(renderItem)}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: calculateFontSizePercentage(2),
        margin: calculateFontSizePercentage(1),
        padding: calculateFontSizePercentage(1),
        borderWidth: calculateWidthPercentage(0.3),
        elevation: 2,
    },
    cardContainer: {
        paddingHorizontal: calculateWidthPercentage(2),
    },
    expandedCard: {
        height: 'auto',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        resizeMode: 'contain',
        width: calculateWidthPercentage(28),
        height: calculateHeightPercentage(8),
        marginRight: calculateWidthPercentage(0),
    },
    textContainer: {
        width: calculateWidthPercentage(60),
        paddingVertical: calculateHeightPercentage(0)
    },
    name: {
        marginTop: calculateHeightPercentage(-0.5),
        fontSize: calculateFontSizePercentage(3.5),
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        paddingVertical: calculateHeightPercentage(2.2),
        alignItems: 'center',
        elevation: 2,
    },
    headerText: {
        textAlign: 'center',
        fontSize: calculateFontSizePercentage(6),
        paddingHorizontal: calculateWidthPercentage(5),
        color: 'black'
    },
    searchInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginTop: calculateHeightPercentage(2),
        marginBottom: calculateHeightPercentage(1),
        width: '100%',
        alignSelf: 'center'
    },
    filters: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: calculateWidthPercentage(3.5),
        paddingVertical: calculateHeightPercentage(-10),
    },
});

export default CustomerList;
