import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, TextInput, Alert, FlatList, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Footer from '../Customer_footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = (percentage) => (windowHeight * percentage) / 100;
const calculateWidthPercentage = (percentage) => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = (percentage) => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

export const Product = ({ navigation }) => {

    const [productData, setProductData] = useState([{}]);
    const [productCounts, setProductCounts] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProductData, setFilteredProductData] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [CartDataLength, setCartData] = useState(null);
    const [refresh, setRefresh] = useState(false);


    const getLength = async () => {
        await AsyncStorage.getItem('CartDataLength').then(data => {
            const Cdata = JSON.parse(data);
            setCartData(() => Cdata);
        });
    }

    const pullMe = () => {
        setRefresh(true);
        getLength();
        GetProduct();
        setTimeout(() => {
            setRefresh(false);
        }, 1000)
    }

    const GetProduct = useCallback(async () => {
        try {
            const database = await AsyncStorage.getItem('database');
            const data = await AsyncStorage.getItem('CartDataLength');
            const Cdata = JSON.parse(data);
            console.log(" :- @@@@@@@@@@@@@@@@@@@@@@  ", Cdata)
            setCartData(Cdata);
            setIsLoading(true);
            const response = await axios.get(`https://customer-node.rupioo.com/product/view-product-purchase/${database}`);
            setProductData(response?.data?.Product.reverse() || []);
            const counts = {};
            response?.data?.Product.forEach((item) => {
                counts[item.Product_Title] = 0;
            });
            setProductCounts(counts);
            const uniqueCategories = [...new Set(response?.data?.Product?.map(item => item.category))];
            setCategories(['All', ...uniqueCategories]);
            setFilteredProductData(response?.data?.Product.reverse() || []);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [setCartData, setProductData, setProductCounts, setCategories, setFilteredProductData, setIsLoading]);

    useEffect(() => {
        GetProduct();
    }, [GetProduct]);

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>

                <Ionicons name={'arrow-back-outline'} size={23} color={'black'} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Order</Text>

            <TouchableOpacity style={styles.shoppingCart} onPress={() => { navigation.navigate("Cart") }}>
                <Ionicons name="cart" size={24} color="black" />
                {CartDataLength != null ? <View style={styles.itemCountContainer}>
                    <Text style={styles.itemCount}>{CartDataLength}</Text>
                </View> :
                    <View style={styles.itemCountContainer}>
                        <Text style={styles.itemCount}>0</Text>
                    </View>
                }
            </TouchableOpacity>
        </View>
    );

    const addToCart = useCallback(async (item, count) => {

        await axios.get(`https://customer-node.rupioo.com/product/view-current-stock/${item.warehouse._id}/${item._id}`)
            .then(async (res) => {
                console.log(res?.data?.currentStock?.currentStock);
                console.log("Entered Quantity :- ", count);
                if (res?.data?.currentStock?.currentStock >= count) {
                    console.log("yes");
                    const newItem = { ...item, count };

                    // data.push(newItem)
                    const prevData = await AsyncStorage.getItem('ProductArr');
                    console.log("PrevData ;- ", JSON.parse(prevData))
                    console.log("newItemF ;- ", newItem)
                    if (prevData != null) {
                        const updatedData = [...JSON.parse(prevData), newItem];
                        await AsyncStorage.setItem("ProductArr", JSON.stringify(updatedData));
                        getLength();
                    } else {
                        await AsyncStorage.setItem("ProductArr", JSON.stringify([newItem]));
                    }
                    // setCartItems(prevItems => [...prevItems, newItem]);
                    Alert.alert("successful!!!", 'Product add to cart successfully...')
                }
                else {
                    Alert.alert(
                        `Avaliable quantity is ${res?.data?.currentStock?.currentStock}`,
                        'Please enter quantity below the avaliable quantity'
                    )
                }
            })
            .catch((err) => { console.log(err.response.data) });
    }, []);

    const incrementCount = useCallback((item) => {
        setProductCounts(prevCounts => ({
            ...prevCounts,
            [item.Product_Title]: prevCounts[item.Product_Title] + 1
        }));
    }, []);

    const decrementCount = useCallback((item) => {
        if (productCounts[item.Product_Title] > 0) {
            setProductCounts(prevCounts => ({
                ...prevCounts,
                [item.Product_Title]: prevCounts[item.Product_Title] - 1
            }));
        }
    }, [productCounts]);

    const handleQuantityChange = useCallback((item, value) => {
        const count = parseInt(value) || 0;
        setProductCounts(prevCounts => ({
            ...prevCounts,
            [item.Product_Title]: count
        }));
    }, []);


    const handleSearch = useCallback((text) => {
        const keywords = text.trim().toUpperCase().split(/\s+/);
        const matchesSearch = (product, keywords) => {
            const title = product.Product_Title.toUpperCase();
            return keywords.every(keyword => {
                return title.includes(keyword);
            });
        };
        const filtered = productData.filter(item => {
            return matchesSearch(item, keywords)
        });

        // Update filtered product data state
        setFilteredProductData(filtered);
    }, [productData]);


    const hendleDetail = async (data) => {
        console.log("Create Order Screen :- ", data);
        await AsyncStorage.setItem("Pdetail", JSON.stringify(data));
        navigation.navigate('ProductDetails')
    }

    const renderProductItem = useCallback((item) => {
        console.log("productr Image ;- ", item.Product_image[0]);
        return (
            <Card key={item.id} style={styles.card}>
                <Card.Content style={styles.content}>
                    <TouchableOpacity onPress={() => { hendleDetail(item) }}>
                        <Card.Cover
                            style={styles.image}
                            source={
                                item?.Product_image[0]
                                    ? { uri: `https://customer-node.rupioo.com/Images/${item.Product_image}` }
                                    : require('../../../../assets/Shopping.jpeg')
                            }
                            resizeMode='center'
                        />
                    </TouchableOpacity>
                    <View style={styles.priceContainer}>
                        <Text style={styles.title} numberOfLines={3}>
                            {item?.Product_Title?.toUpperCase()}
                        </Text>
                        <Text style={styles.quantity} numberOfLines={3}>
                            Size: {item.secondarySize}
                        </Text>
                        <Text style={styles.price}>Price: {item?.Product_MRP?.toFixed(2)}</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: calculateHeightPercentage(1),
                                marginBottom: calculateHeightPercentage(-1),
                                width: 'auto',
                                alignItems: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => decrementCount(item)}
                                style={{
                                    height: calculateHeightPercentage(3),
                                    width: calculateHeightPercentage(3),
                                    backgroundColor: 'lightgray',
                                    borderRadius: calculateFontSizePercentage(1.5),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: calculateFontSizePercentage(5),
                                        textAlign: 'center',
                                        color: 'white',
                                        fontWeight: '800',
                                        marginTop: calculateHeightPercentage(-0.3),
                                    }}
                                >
                                    -
                                </Text>
                            </TouchableOpacity>
                            <View>
                                <TextInput
                                    style={styles.quantityInput}
                                    value={productCounts ? productCounts[item.Product_Title].toString() : 0}
                                    onChangeText={(value) => handleQuantityChange(item, value)}
                                    keyboardType="numeric"
                                    numberOfLines={2}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => incrementCount(item)}
                                style={{
                                    height: calculateHeightPercentage(3),
                                    width: calculateHeightPercentage(3),
                                    backgroundColor: 'lightgray',
                                    borderRadius: calculateFontSizePercentage(1.5),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: calculateFontSizePercentage(6),
                                        textAlign: 'center',
                                        color: 'white',
                                        fontWeight: '800',
                                        marginTop: calculateHeightPercentage(-0.6),
                                    }}
                                >
                                    +
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={() => addToCart(item, productCounts[item.Product_Title])}
                            >
                                <Text style={styles.addToCartText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    }, [addToCart, decrementCount, handleQuantityChange, incrementCount, productCounts]);


    return (
        <GestureHandlerRootView style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.filters}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={filteredProductData}
                    onChangeText={(text) => handleSearch(text)}
                    autoCapitalize='characters'
                />
            </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => { pullMe() }}
                        />
                    }
                    data={filteredProductData}
                    renderItem={({ item }) => (
                        <View style={styles.column}>
                            {renderProductItem(item)}
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{
                        paddingHorizontal: calculateWidthPercentage(4),
                        paddingTop: calculateHeightPercentage(-2),
                        paddingBottom: calculateHeightPercentage(8),
                    }}
                />
            )}
            <View style={styles.footer}>
                <Footer navigation={navigation} />
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexWrap: 'wrap',
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
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
    itemCountContainer: {
        backgroundColor: 'red',
        borderRadius: calculateFontSizePercentage(10),
        paddingVertical: calculateHeightPercentage(0.2),
        paddingHorizontal: calculateWidthPercentage(1),
        marginLeft: -10,
        marginTop: calculateHeightPercentage(-3)
    },
    itemCount: {
        color: 'white',
        fontSize: calculateFontSizePercentage(3),
    },
    column: {
        marginBottom: calculateHeightPercentage(2),
    },
    card: {
        width: calculateWidthPercentage(93),
        padding: calculateFontSizePercentage(0.01),
        backgroundColor: '#484A59',
    },
    image: {
        marginTop: calculateHeightPercentage(0.5),
        width: calculateWidthPercentage(40),
        height: calculateHeightPercentage(15),
        // resizeMode: 'center'
    },
    content: {
        // flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: calculateHeightPercentage(0.5),
        paddingHorizontal: calculateWidthPercentage(0.5),
    },
    title: {
        color: 'black',
        fontSize: calculateFontSizePercentage(3.5),
        fontWeight: 'bold',
        width: calculateWidthPercentage(50),
        marginTop: calculateHeightPercentage(1),
    },
    quantity: {
        color: 'black',
        fontSize: calculateFontSizePercentage(3.5),
        marginTop: calculateHeightPercentage(0.1),
        fontWeight: 'bold',
    },
    priceContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: calculateWidthPercentage(1),
    },
    price: {
        marginTop: calculateHeightPercentage(0.1),
        marginBottom: calculateHeightPercentage(-2),
        fontSize: calculateFontSizePercentage(4),
        color: '#EAA132',
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: '#EAA132',
        borderRadius: 50,
        width: calculateWidthPercentage(10),
        height: calculateHeightPercentage(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: calculateWidthPercentage(-3),
        marginLeft: calculateWidthPercentage(13)
    },
    addToCartText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: calculateFontSizePercentage(4),
    },
    footer: {
        position: 'absolute',
        height: "12%",
        alignItems: "center",
        top: calculateHeightPercentage(88)
    },
    quantityInput: {
        alignItems: 'center',
        marginTop: calculateHeightPercentage(0.5),
        textAlign: 'center',
        width: calculateWidthPercentage(13)
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(5),
        paddingVertical: calculateHeightPercentage(1),
    },
});

export default Product;