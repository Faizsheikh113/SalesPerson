import React from 'react';
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from 'react-native';

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

const NavButton = ({ label, onPress, isSelected }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ alignItems: 'center' }}>
                <Text
                    style={{
                        color: isSelected ? 'black' : '#6d6e6d',
                        borderBottomWidth: isSelected ? 2 : 0,
                        borderBottomStyle: 'solid', 
                        borderColor: 'black',
                        fontSize: calculateFontSizePercentage(4),
                        paddingBottom: calculateHeightPercentage(1),
                    }}
                >
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const NavBar = ({ navigation, route }) => {
    return (
        <View
            style={{
                height: calculateHeightPercentage(6.5),
                width: calculateWidthPercentage(100),
                backgroundColor: 'white',
                alignSelf: 'center',
                marginTop: calculateHeightPercentage(0),
                opacity: 1,
                overflow: 'hidden',
                elevation: 5,
            }}
        >
            <View style={styles.ItemView}>
                <NavButton
                    label="Company Info..."
                    onPress={() => navigation.navigate('CompanyInformation')}
                    isSelected={route.name === 'CompanyInformation'}
                />
                <NavButton
                    label="Personal Info..."
                    onPress={() => navigation.navigate('PersonalInformation')}
                    isSelected={route.name === 'PersonalInformation'}
                />
                <NavButton
                    label="Super Admin"
                    onPress={() => navigation.navigate('SuperAdmin')}
                    isSelected={route.name === 'SuperAdmin'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ItemView: {
        marginTop: calculateHeightPercentage(0.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default NavBar;
