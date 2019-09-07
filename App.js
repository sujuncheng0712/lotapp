import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button} from 'react-native';
import Home from './src/pages/Home';
import Login from './src/pages/users/Login';
import MyCenter from './src/pages/users/MyCenter';
import MyShop from './src/pages/users/MyShop';
import Device from './src/pages/users/Device';
import Record from './src/pages/users/Record';
import AddDevice from './src/pages/Device/AddDevice';
import ScanScreen from './src/pages/Device/ScanScreen';
import Activation from './src/pages/Device/Activation';
import Settlement from './src/pages/Settlement';
console.disableYellowBox = true;
console.warn('YellowBox is disabled.');

const AppStack = createStackNavigator(
  {

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
  },
  // {
  //   initialRouteName: 'Home',
  // },
);
export default createAppContainer(AppStack);
