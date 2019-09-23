import {createBottomTabNavigator} from 'react-navigation';
import React from 'react';
import Status from '../../pages/device/Status';
import Filter from '../../pages/device/Filter';
import Water from '../../pages/device/Water';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeBottomRoute = createBottomTabNavigator(
  {
    Status: {
      screen: Status,
      navigationOptions: {
        title: '净水器状态',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="dashboard" size={20} color={focused ? '#00C8ED' : '#666'} />
        ),
      },
    },
    Filter: {
      screen: Filter,
      navigationOptions: {
        title: '滤芯',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="filter"
            size={20}
            color={focused ? '#00C8ED' : '#666'}
          />
        ),
      },
    },
    Water: {
      screen: Water,
      navigationOptions: {
        title: '用水量',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="bar-chart" size={20} color={focused ? '#00C8ED' : '#666'} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#00C8ED',
      inactiveTintColor: 'black',
    },
  },
  {
    // 初始路线名称
    initialRouteName: 'Status',

    // 标签栏位置
    tabBarPosition: 'bottom',
    // 标签栏选项
    tabBarOptions: {
      activeTintColor: '#00C8ED',
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
