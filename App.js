import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button} from 'react-native';
import Home from './src/pages/Home';
import Login from './src/pages/users/Login';
import MyCenter from './src/pages/users/MyCenter';
import MyShop from './src/pages/users/MyShop';
import Device from './src/pages/users/Device';
import Record from './src/pages/users/Record';
import Address from './src/pages/users/Address';
import Create from './src/pages/users/Create';
import AddDevice from './src/pages/device/AddDevice';
import ScanScreen from './src/pages/device/ScanScreen';
import Activation from './src/pages/device/Activation';
import Orders from './src/pages/order/Orders';
import Order from './src/pages/order/Order';
import Settlement from './src/pages/Settlement';
import CashRecord from './src/pages/returnService/CashRecord';
import Wallet from './src/pages/returnService/Wallet';
import Cash from './src/pages/returnService/Cash';
import Code from './src/pages/returnService/Code';
import Setup from './src/pages/returnService/Setup';
import AfterRecord from './src/pages/returnService/AfterRecord';
import Fix from './src/pages/returnService/Fix';
import Share from './src/pages/returnService/Share';
import Extend from './src/pages/returnService/Extend';
console.disableYellowBox = true;
console.warn('YellowBox is disabled.');

const AppStack = createStackNavigator(
  {
   // Extend:Extend,
    Home: Home,
    Login: Login,
    MyCenter: MyCenter,
    Record: Record,
    Device: Device,
    MyShop: MyShop,
    AddDevice: AddDevice,
    ScanScreen: ScanScreen,
    Activation: Activation,
    Settlement:Settlement,
    Address:Address,
    Create:Create,
    Orders:Orders,
    Order:Order,
    CashRecord:CashRecord,
    Wallet:Wallet,
    Cash:Cash,
    Code:Code,
    Setup:Setup,
    AfterRecord:AfterRecord,
    Fix:Fix,
    Share:Share,
    Extend:Extend,
  },
  // {
  //   initialRouteName: 'Home',
  // },
);
export default createAppContainer(AppStack);
