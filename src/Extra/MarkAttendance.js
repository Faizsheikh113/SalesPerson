import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import SalaryList from './Main/Attendance/SalaryList';
import AttendanceList from './Main/Attendance/Attendance_List';
import SalarySlip from './Main/Attendance/SalarySlip';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
  const baseDimension = Math.min(windowWidth, windowHeight);
  return (baseDimension * percentage) / 100;
};

const HR = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [driverData, setDriver] = useState(null);

  const handleTabChange = (tabNumber) => {
    setSelectedTab(tabNumber);
  };

  return (
    <View>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => handleTabChange(1)} style={[styles.tab, selectedTab === 1 && styles.activeTab]}>
          <Text style={styles.tabText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange(2)} style={[styles.tab, selectedTab === 2 && styles.activeTab]}>
          <Text style={styles.tabText}>Salary</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange(3)} style={[styles.tab, selectedTab === 3 && styles.activeTab]}>
          <Text style={styles.tabText}>Salary Slip</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 1 ? <AttendanceList driverData={driverData} navigation={navigation} /> :
        selectedTab === 2 ? <SalaryList driverData={driverData} navigation={navigation} /> :
          selectedTab === 3 ? <SalarySlip driverData={driverData} navigation={navigation} /> :
            null}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff0',
  },
  image: {
    alignSelf: 'center',
    marginHorizontal: calculateWidthPercentage(3),
    width: calculateWidthPercentage(12),
    height: calculateHeightPercentage(8),
    resizeMode: 'center',
    borderRadius: calculateFontSizePercentage(100)
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: calculateHeightPercentage(0.5),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingHorizontal: calculateWidthPercentage(5),
    paddingVertical: calculateHeightPercentage(1),
  },
  activeTab: {
    borderBottomWidth: calculateHeightPercentage(0.3),
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: calculateFontSizePercentage(3.8),
    fontWeight: '400',
    color: 'black'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HR;
