import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image, SafeAreaView, Button, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Table, Row } from "react-native-table-component";
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => (Math.min(windowWidth, windowHeight) * percentage) / 100;


const Cart = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getLength = async () => {
            let length = JSON.stringify(products.length)
            console.log(" :-", length);
            await AsyncStorage.setItem("CartDataLength", length);
        }
        getLength();
    }, [products])

    const fetchProducts = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem("ProductArr");
            const parsedData = JSON.parse(data);
            console.log("Data Length :- ", parsedData.length)
            if (data !== null) {
                setProducts(parsedData);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [setProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    console.log(products)

    const calculateTotal = () => {
        let total = 0;
        products.forEach(item => {
            total += Number(item.Product_MRP) * Number(item.count);
        });
        return total.toFixed(2); // If you want to fix the number of decimal places
    };

    const removeitem = async () => {
        await AsyncStorage.setItem("ProductArr", JSON.stringify([]));
        await fetchProducts();
    }

    const removeProductFromCart = async (item) => {
        const newProducts = products.filter(product => product._id !== item._id);
        await AsyncStorage.setItem("ProductArr", JSON.stringify(newProducts));
        setProducts(newProducts);
    }

    const handleSubmit = async () => {
        const dataBase = await AsyncStorage.getItem('database');
        const CustomerData = await AsyncStorage.getItem('CustomerData');
        const CustomerDataJson = JSON.parse(CustomerData);
        console.log("Customer Id :- ", CustomerDataJson?._id)
        const productsToSend = products.map(item => ({
            productId: item._id,
            qty: item.count
        }));
        // console.log("All Data ;- ", productsToSend)

        await axios.post('https://customer-node.rupioo.com/order/save-create-order', {
            database: dataBase,
            partyId: CustomerDataJson?._id,
            orderItems: productsToSend
        })
            .then(async (response) => {
                console.log("Save Succ :- ", response.data);
                Alert.alert('Successfull', 'Your order placed successfully...', [
                    { text: 'OK', onPress: () => { removeitem() } }
                ])
            })
            .catch((err) => {
                console.log(err.response.data);
            })

    }

    const name = calculateWidthPercentage(30);
    const price = calculateWidthPercentage(18);
    const qty = calculateWidthPercentage(18);
    const subtotal = calculateWidthPercentage(22);
    const Delete = calculateWidthPercentage(12);
    return (
        <SafeAreaView style={styles.container}>

            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-outline'} size={23} color={'black'} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
                <View style={styles.shoppingCart}>
                    <Ionicons name="cart" size={24} color="black" />
                    {products.length > 0 && (
                        <View style={styles.itemCountContainer}>
                            <Text style={styles.itemCount}>{products.length}</Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                    <Row
                        data={["Product Name", "Price", "Qty", "Sub-total", "Del."]}
                        style={{
                            height: calculateHeightPercentage(6),
                            backgroundColor: "#537791",
                        }}
                        widthArr={[name, price, qty, subtotal, Delete]}
                        textStyle={styles.headerText}
                    />
                    {products?.length < 1 ?
                        <Text style={{ textAlign: 'center', padding: calculateFontSizePercentage(5), fontSize: calculateFontSizePercentage(5), color: 'gray' }}>No product avaliable ...</Text>
                        : <ScrollView>
                            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                                {products.map((item, index) => (
                                    <Row
                                        key={index}
                                        data={[
                                            <TouchableOpacity
                                                onPress={() => { console.log(item) }}
                                            >
                                                <Text style={{ textAlign: 'center', color: 'blue', textDecorationLine: 'underline', paddingVertical: calculateHeightPercentage(0.5) }}>{item.Product_Title}</Text>
                                            </TouchableOpacity>,
                                            item.Product_MRP.toFixed(2),
                                            item.count,
                                            (item.Product_MRP * item.count).toFixed(0),
                                            <TouchableOpacity style={{ alignItems: 'center' }}
                                                onPress={() => {
                                                    removeProductFromCart(item)
                                                }}
                                            >
                                                <Ionicons name='trash' size={25} color='red' />
                                            </TouchableOpacity>
                                        ]}
                                        style={[styles.row, index % 2 && { backgroundColor: "#F7F6E7" }]}
                                        textStyle={styles.text}
                                        widthArr={[name, price, qty, subtotal, Delete]}
                                    />
                                ))}
                            </Table>
                        </ScrollView>}
                </Table>
            </ScrollView>

            <View>
                <Text style={{ padding: calculateFontSizePercentage(2), fontSize: calculateFontSizePercentage(4.5), color: 'black', alignSelf: 'flex-end', marginHorizontal: calculateWidthPercentage(5) }}>Total:-{calculateTotal()}</Text>
            </View>

            <View>
                <TouchableOpacity style={{ width: '100%', height: calculateHeightPercentage(6), backgroundColor: '#EAAA13', alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { handleSubmit() }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: calculateFontSizePercentage(5), fontWeight: '500' }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    headerText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
    },
    shoppingCart: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: calculateWidthPercentage(60)
    },
    itemCountContainer: {
        backgroundColor: 'red',
        borderRadius: calculateFontSizePercentage(10),
        paddingVertical: calculateHeightPercentage(0.2),
        paddingHorizontal: calculateWidthPercentage(1.5),
        marginLeft: calculateWidthPercentage(-3),
        marginTop: calculateHeightPercentage(-3)
    },
    itemCount: {
        color: 'white',
        fontSize: calculateFontSizePercentage(3),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: calculateHeightPercentage(3),
        backgroundColor: '#fff',
        borderRadius: calculateFontSizePercentage(10),
        elevation: 3,
    },
    productImage: {
        width: calculateWidthPercentage(20),
        height: calculateHeightPercentage(9),
        borderRadius: calculateFontSizePercentage(10),
        margin: calculateFontSizePercentage(2),
    },
    productDetails: {
        flex: 1,
        marginVertical: calculateHeightPercentage(1),
    },
    productName: {
        color: 'gray',
        fontSize: calculateFontSizePercentage(4.5),
        fontWeight: 'bold',
        marginBottom: calculateHeightPercentage(0.2),
    },
    productDescription: {
        color: 'gray',
        fontSize: calculateFontSizePercentage(4),
        marginBottom: calculateHeightPercentage(0.2),
    },
    productPrice: {
        fontSize: calculateFontSizePercentage(4),
        fontWeight: 'bold',
        color: 'green',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: 'lightgray',
        padding: calculateFontSizePercentage(0.01)
    },
    quantityText: {
        paddingHorizontal: calculateWidthPercentage(2)
    },
    addButton1: {
        backgroundColor: '#EAAA13',
        paddingVertical: calculateHeightPercentage(1),
        borderRadius: calculateFontSizePercentage(2),
        width: calculateWidthPercentage(21),
        marginTop: calculateHeightPercentage(-3),
        marginLeft: calculateWidthPercentage(40)
    },
    addButtonText: {
        fontSize: calculateFontSizePercentage(3.3),
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
    },
    productContainer: {
        flex: 1,
        paddingTop: calculateHeightPercentage(2),
        paddingHorizontal: calculateWidthPercentage(3)
    },
    row: {
        backgroundColor: "#E7E6E1"
    },
    text: {
        textAlign: "center",
        color: 'balck',
        paddingVertical: calculateHeightPercentage(0.5)
    },
});

export default Cart;
