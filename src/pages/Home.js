import {createBottomTabNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
///123
import Login from '../pages/users/Login';
import MyCenter from '../pages/users/MyCenter';
import MyShop from './users/MyShop';
import Device from './users/Device';

const HomeBottomRoute = createBottomTabNavigator(
  {
    device: {
      screen: Device,
      navigationOptions: {
        title: '我的设备',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="bars" size={20} color={focused ? '#FF7A01' : '#666'} />
        ),
      },
    },
    shop: {
      screen: MyShop,
      navigationOptions: {
        title: '我的商城',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="shopping-cart"
            size={20}
            color={focused ? '#FF7A01' : '#666'}
          />
        ),
      },
    },
    MyCenter: {
      screen: MyCenter,
      navigationOptions: {
        title: '个人中心',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="user" size={20} color={focused ? '#FF7A01' : '#666'} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#FF7A01',
      inactiveTintColor: 'black',
    },
  },
  {
    // 初始路线名称
    initialRouteName: 'MyCenter',

    // 标签栏位置
    tabBarPosition: 'bottom',
    // 标签栏选项
    tabBarOptions: {
      activeTintColor: '#517eff',
      inactiveTintColor: '#666',
    },
    // 懒加载
    lazy: true,
  },
);
HomeBottomRoute.navigationOptions = ({navigation}) => {
  //  关键这一行设置 header:null
  return {
    header: null,
  };
};

export default HomeBottomRoute;
