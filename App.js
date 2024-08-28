//import liraries
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Home';
import AttendanceList from './src/Main/Attendance/Attendance_List';
import GPSReport from './src/GpsReport';
import LoginScreen from './src/Auth/LoginScreen';
import SalarySlip from './src/Main/Attendance/SalarySlip';
import Target from './src/Main/Attendance/Target';
import Leave from './src/Main/Attendance/Leave';
import CustomerList from './src/Main/Customer/CustomerList';
import Ledger from './src/Main/Customer/Ledger';
import LeadList from './src/Main/Lead/SalesLeadList';
import { CompanyInfo, PersonalInfo, SuperAdmin } from './src/Main/Lead/ConvertCustomer';
import store from './src/Redux/store';
import { Provider } from 'react-redux';
import EditLead from './src/Main/Lead/EditSalesLeade';
import ReceiptSummary from './src/Main/Customer/Receipt/ReceiptSummary';
import Splash from './src/Auth/Splash';
import Order_Summary from './src/Main/Customer/Order/Order_Summary';
import CreateReceipt from './src/Main/Customer/Receipt/CreateReceipt';
import Product from './src/Main/Customer/Order/Create_Order';
import Cart from './src/Main/Customer/Order/Cart';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="GPS Report" component={GPSReport}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Attendance List" component={AttendanceList}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Salary Slip" component={SalarySlip}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Target" component={Target}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Leave" component={Leave}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Customer List" component={CustomerList}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Order" component={Order_Summary} />
          <Stack.Screen name="Create Order" component={Product} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Receipt" component={ReceiptSummary} />
          <Stack.Screen name="Create Receipt" component={CreateReceipt}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Ledger" component={Ledger}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Sales Lead List" component={LeadList}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="Edit Lead" component={EditLead}
            options={
              { headerShown: true }
            }
          />
          <Stack.Screen name="CompanyInformation" component={CompanyInfo} />
          <Stack.Screen name="PersonalInformation" component={PersonalInfo} />
          <Stack.Screen name="SuperAdmin" component={SuperAdmin} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

//make this component available to the app
export default App;
