// Import libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Footer from './Customer_footer';
import axios from 'axios';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => (Math.min(windowWidth, windowHeight) * percentage) / 100;

// Create a component
const Ledger = ({ navigation }) => {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const CustomerData = await AsyncStorage.getItem('CustomerData');
                const CustomerDataJson = JSON.parse(CustomerData);
                if (CustomerDataJson) {
                    const response = await axios.get(`https://customer-node.rupioo.com/ledger/view-ledger-party/${CustomerDataJson?._id}`);
                    console.log(response?.data?.Ledger);
                    setProduct(response?.data?.Ledger || []);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getData();
    }, []);

    // Calculate totals
    const totalDebit = product.reduce((acc, item) => acc + (item.debit || 0), 0);
    const totalCredit = product.reduce((acc, item) => acc + (item.credit || 0), 0);
    const closingBalance = totalCredit - totalDebit;

    // Define column widths (adjust as needed)
    const columnWidths = [calculateWidthPercentage(20), calculateWidthPercentage(24), calculateWidthPercentage(16), calculateWidthPercentage(20), calculateWidthPercentage(20)];

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                    <Row
                        data={["Date", "Voucher\ntype","Voucher No.","Debit", "Credit"]}
                        style={styles.header}
                        widthArr={columnWidths}
                        textStyle={styles.headerText}
                    />
                    <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                        {product.map((item, index) => (
                            <Row
                                key={index}
                                data={[
                                    <Text style={styles.cellText}>{moment(item.createdAt).format('DD/MM/YY')}</Text>,
                                    item?.voucherType || '',
                                    item?.voucherNo || '',
                                    item?.debit || '0.00',
                                    item?.credit || '0.00',
                                ]}
                                style={[styles.row, index % 2 && { backgroundColor: "#F7F6E7" }]}
                                textStyle={styles.text}
                                widthArr={columnWidths}
                            />
                        ))}
                        {/* Total Row */}
                        <Row
                            data={[
                                "Total",
                                "",
                                "",
                                totalDebit.toFixed(2),
                                totalCredit.toFixed(2),
                            ]}
                            style={styles.totalRow}
                            textStyle={styles.text}
                            widthArr={columnWidths}
                        />
                        <Row
                            data={[
                                "Closing Balance",
                                "",
                                "",
                                "",
                                closingBalance.toFixed(2),
                            ]}
                            style={styles.totalRow}
                            textStyle={styles.text}
                            widthArr={columnWidths}
                        />
                    </Table>
                </Table>
            </ScrollView>
            <View style={styles.footer}>
                <Footer navigation={navigation} />
            </View>
        </View>
    );
};

// Define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height: calculateHeightPercentage(6),
        backgroundColor: "#537791",
    },
    headerText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
    },
    row: {
        backgroundColor: "#E7E6E1"
    },
    text: {
        paddingVertical: calculateHeightPercentage(0.5),
        paddingHorizontal: calculateHeightPercentage(0.4),
        textAlign: "center",
    },
    cellText: {
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    totalRow: {
        backgroundColor: "#DCDCDC",
    },
    footer: {
        height: "10%",
        marginTop:calculateHeightPercentage(19),
        marginTop: calculateHeightPercentage(1),
    },
    footerText: {
        fontSize: calculateFontSizePercentage(5),
    },
});

// Make this component available to the app
export default Ledger;
