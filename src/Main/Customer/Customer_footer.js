import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

const Footer = ({ navigation }) => {
    const windowWidth = Dimensions.get("screen").width / 100;
    const windowHeight = Dimensions.get("screen").height / 100;

    const [color, setColor] = useState(0)
    return (
        <View style={{ height: windowHeight * 100, width: windowWidth * 100 }}>
            <View
                style={{
                    width: windowWidth * 100,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    backgroundColor: "white"
                }}
            >
                <View style={{
                    height: windowHeight * 8.5,
                    width: windowWidth * 95,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: "#fdc493",
                    borderRadius: windowHeight * 5
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Order");
                        }}
                        style={{
                            height: windowHeight * 6,
                            width: windowWidth * 19,
                            backgroundColor: color === 1 ? "#99C68E" : "white",
                            borderColor: "lightgrey",
                            borderWidth: 1,
                            flexDirection: "row",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            elevation: 3,
                            bottom: 0
                        }}
                    >
                        <Icon name="storefront-outline" size={20} color="grey"
                            style={{ marginBottom: calculateHeightPercentage(-0.1) }}

                        />
                        <Text style={{ fontSize: calculateFontSizePercentage(2.5), fontWeight: "600", color: "grey", textAlign: 'center' }}>Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Ledger")
                        }}
                        style={{
                            height: windowHeight * 6,
                            width: windowWidth * 17,
                            backgroundColor: color === 2 ? "#99C68E" : "white",
                            borderColor: "lightgrey",
                            borderWidth: 1,
                            flexDirection: "row",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            elevation: 3
                        }}
                    >
                        <Icon
                            name="file-tray-full-outline"
                            size={22}
                            color="grey"
                            style={{ marginBottom: calculateHeightPercentage(-0.2) }}
                        />

                        <Text style={{ fontSize: calculateFontSizePercentage(2.5), fontWeight: "600", color: "grey" }}>Ledger</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { navigation.navigate("Receipt") }}
                        style={{
                            height: windowHeight * 6,
                            width: windowWidth * 17,
                            backgroundColor: color === 3 ? "#99C68E" : "white",
                            borderColor: "lightgrey",
                            borderWidth: 1,
                            flexDirection: "row",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            elevation: 3
                        }}
                    >
                        <Icon name="chatbox-ellipses-outline" size={20} color="grey"
                            style={{ marginBottom: calculateHeightPercentage(-0.2) }}

                        />

                        <Text style={{ fontSize: calculateFontSizePercentage(2.5), fontWeight: "600", color: "grey",textAlign:'center' }}>Receipt</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Footer