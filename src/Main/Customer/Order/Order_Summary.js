import React, { useCallback, useEffect, useState, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Alert, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Footer from '../Customer_footer';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import moment from 'moment';

// Calculate dimensions
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const calculateHeightPercentage = (percentage) => (windowHeight * percentage) / 100;
const calculateWidthPercentage = (percentage) => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = (percentage) => (Math.min(windowWidth, windowHeight) * percentage) / 100;

// Table headers
const tableHead = ['Product Name', 'Quantity', 'Stock', 'Price'];

// OrderHeader Component
const OrderHeader = ({ onBack, onCreateOrder }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
            <Ionicons name='arrow-back-outline' size={23} color='black' style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order</Text>
        <TouchableOpacity style={styles.shoppingCart} onPress={onCreateOrder}>
            <View style={styles.cartIconContainer}>
                <Ionicons name="person-add-sharp" size={25} color='black' />
                <Text style={styles.cartText}>Create Order</Text>
            </View>
        </TouchableOpacity>
    </View>
);

// OrderDetails Component
const OrderDetails = memo(({ item, onEdit }) => {
    // Function to calculate the grand total
    const calculateGrandTotal = async () => {
        try {
            const CustomerData = await AsyncStorage.getItem('CustomerData');
            const CustomerDataJson = JSON.parse(CustomerData);
            const discount = (CustomerDataJson?.category?.discount + 100) / 100;
            console.log(discount)
            return item.orderItems.reduce((total, product) => {
                const productTotal = (product.qty * product.productId.Product_MRP)/discount;
                return total + productTotal;
            }, 0).toFixed(2);
        } catch (error) {
            console.error("Error calculating grand total:", error);
            return "0.00";
        }
    };

    const [grandTotal, setGrandTotal] = useState("0.00");
    const decimalPart = grandTotal % 1;
  
    // Decide whether to use Math.ceil() or Math.floor()
    const roundedTotal = decimalPart > 0.49 ? Math.ceil(grandTotal) : Math.floor(grandTotal);

    useEffect(() => {
        const fetchGrandTotal = async () => {
            const total = await calculateGrandTotal();
            setGrandTotal(total);
        };
        fetchGrandTotal();
    }, [item.orderItems]);

    return (
        <View key={item.id} style={styles.orderContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>
                        Date: {moment(item.createdAt).format("DD-MMM-YYYY")}
                    </Text>
                    <Text style={styles.headerText}>
                        Order No: {item.orderNo}
                    </Text>
                </View>
            </View>
            <Table borderStyle={styles.tableBorder}>
                <Row
                    data={tableHead}
                    style={styles.tableHeader}
                    textStyle={styles.tableHeaderText}
                    widthArr={[
                        calculateWidthPercentage(35),
                        calculateWidthPercentage(18),
                        calculateWidthPercentage(20),
                        calculateWidthPercentage(20),
                    ]}
                />
                {item.orderItems.map((product, index) => (
                    <Row
                        key={index}
                        data={[
                            product?.productId?.Product_Title,
                            product.qty,
                            product?.productId?.Opening_Stock,
                            product?.productId?.Product_MRP.toFixed(2),
                        ]}
                        style={styles.productRow}
                        textStyle={styles.productText}
                        widthArr={[
                            calculateWidthPercentage(35),
                            calculateWidthPercentage(18),
                            calculateWidthPercentage(20),
                            calculateWidthPercentage(20),
                        ]}
                    />
                ))}
            </Table>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Grand Total: {roundedTotal.toFixed(2)}</Text>
            </View>
            {/* <View style={styles.buttonContainer}>
                <Pressable onPress={() => onEdit(item.id)}>
                    <Entypo name="trash" color="#FF0000" size={20} />
                </Pressable>
            </View> */}
        </View>
    );
});

// Main Component
const OrderHistory = ({ navigation }) => {
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const GetProduct = useCallback(async () => {
        try {
            const CustomerData = await AsyncStorage.getItem('CustomerData');
            const CustomerDataJson = JSON.parse(CustomerData);
            setIsLoading(true);
            const response = await axios.get(`https://customer-node.rupioo.com/order/view-order-party/${CustomerDataJson?._id}`);
            const filteredOrderList = response?.data?.orderHistory.filter(ele => ele?.status === "pending") || [];
            setProductData(filteredOrderList);
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        GetProduct();
    }, [GetProduct]);

    const handleConfirmation = (id) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to proceed?',
            [{ text: 'Cancel', style: 'cancel' }, { text: 'OK' }],
            { cancelable: false }
        );
    };

    const totalAmount = productData.reduce((acc, curr) => acc + curr.total, 0).toFixed(2);

    return (
        <GestureHandlerRootView>
            <OrderHeader
                onBack={() => navigation.goBack()}
                onCreateOrder={() => navigation.navigate("Create Order")}
            />
            <ScrollView style={styles.container}>
                {productData.map(item => (
                    <OrderDetails key={item.id} item={item} onEdit={handleConfirmation} />
                ))}
                {/* Uncomment if total amount should be displayed */}
                {/* <View style={styles.totalAmountContainer}>
                    <Text style={styles.totalAmountText}>Total Amount: {totalAmount}</Text>
                </View> */}
            </ScrollView>
            <View style={styles.footer}>
                <Footer navigation={navigation} />
            </View>
        </GestureHandlerRootView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        paddingTop: calculateHeightPercentage(1),
        marginBottom: calculateHeightPercentage(10),
        paddingHorizontal: calculateWidthPercentage(3),
    },
    header: {
        height: calculateHeightPercentage(8),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(5),
        borderBottomWidth: calculateWidthPercentage(0.06),
        elevation: 3,
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
        marginLeft: 'auto',
    },
    cartIconContainer: {
        alignItems: 'center',
    },
    cartText: {
        textAlign: 'center',
        marginTop: calculateHeightPercentage(-0.5),
        color: 'black',
    },
    orderContainer: {
        backgroundColor: "#FFFFFF",
        elevation: 3,
        borderRadius: calculateFontSizePercentage(2),
        marginBottom: calculateHeightPercentage(3),
    },
    headerContainer: {
        backgroundColor: 'white',
        borderRadius: calculateFontSizePercentage(5),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: calculateWidthPercentage(2),
    },
    headerText: {
        fontWeight: '500',
        fontSize: calculateFontSizePercentage(3.5),
        padding: calculateFontSizePercentage(3),
        color: '#000000',
    },
    tableBorder: {
        borderColor: '#C1C0B9',
        borderWidth: 1,
    },
    tableHeader: {
        height: calculateHeightPercentage(5),
        backgroundColor: '#f1f8ff',
    },
    tableHeaderText: {
        fontSize: calculateFontSizePercentage(4),
        fontWeight: '600',
        textAlign: 'center',
        color: '#000000',
    },
    productRow: {
        backgroundColor: '#ffffff',
    },
    productText: {
        padding: calculateFontSizePercentage(1),
        fontSize: calculateFontSizePercentage(3),
        textAlign: 'center',
        color: '#000000',
    },
    totalContainer: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: '#D3D3D3',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: calculateFontSizePercentage(2),
        borderBottomRightRadius: calculateFontSizePercentage(2),
    },
    totalText: {
        fontSize: calculateFontSizePercentage(4.5),
        fontWeight: '600',
        textAlign: 'right',
        color: '#000000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 5,
        paddingHorizontal: calculateWidthPercentage(10),
    },
    totalAmountContainer: {
        alignItems: 'flex-end',
        marginBottom: calculateHeightPercentage(3),
        paddingHorizontal: calculateWidthPercentage(5),
    },
    totalAmountText: {
        fontSize: calculateFontSizePercentage(4),
        color: '#000000',
    },
    footer: {
        position: 'absolute',
        height: "10%",
        alignItems: "center",
        top: calculateHeightPercentage(88),
    },
});

export default OrderHistory;
