import {createBottomTabNavigator} from 'react-navigation';
import React from 'react';
import GroupCenter from '../pages/group/GroupCenter';
import Notice from '../pages/group/Notice';
import List from '../pages/group/List';
import HomePage from '../pages/group/HomePage';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeBottomRoute = createBottomTabNavigator(
  {
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        title: '概览',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="bar-chart" size={20} color={focused ? '#FF7A01' : '#666'} />
        ),
      },
    },
    List: {
      screen: List,
      navigationOptions: {
        title: '工单',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="list-alt"
            size={20}
            color={focused ? '#FF7A01' : '#666'}
          />
        ),
      },
    },
    GroupCenter: {
      screen: GroupCenter,
      navigationOptions: {
        title: '我的',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="user-o" size={20} color={focused ? '#FF7A01' : '#666'} />
        ),
      },
    },
  },
  {
     // 初始路线名称
     initialRouteName:'HomePage',
      // 标签栏位置
    tabBarPosition: 'bottom',
    // 标签栏选项
    tabBarOptions: {
      activeTintColor: '#FF7A01',
      inactiveTintColor: '#666',
    },
      // 懒加载
    lazy: false,
  },
 
);
HomeBottomRoute.navigationOptions = ({navigation}) => {
  //  关键这一行设置 header:null
  return {
    header: null,
  };
};

export default HomeBottomRoute;
