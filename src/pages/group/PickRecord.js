import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  AsyncStorage,
  DeviceEventEmitter,
  BackHandler,ScrollView
} from 'react-native';
import { PickerView,Picker,Provider } from '@ant-design/react-native';
import address1 from '../../../service/address';
const url = 'https://iot2.dochen.cn/api';



export default class App extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      LoginInfo:'',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'提货记录'
    };
  };
  // render创建之前
  componentWillMount() {

  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    
    this._checkLoginState();
  }




  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    if (LoginInfo !== null) {
      LoginInfo = eval('(' + LoginInfo + ')');
      LoginInfo = LoginInfo[0];
      console.log(LoginInfo)
      this.setState({LoginInfo});
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    const {addressInfo,defaultValue,area} = this.state;

    return (
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.item}>序号</Text>
          <Text style={styles.item}>日期</Text>
          <Text style={styles.item}>型号</Text>
          <Text style={styles.item}>提货数量</Text>
          <Text style={styles.item}>实际发货</Text>
          <Text style={styles.item}>操作</Text>
        </View>
        <Text style={{width:'100%',textAlign:'center'}}>NO DATA</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    backgroundColor:'#F0EEEF',
  },
  item:{
    width:'16.6%',
    textAlign:'center',
    padding:10,
    fontSize:12,
  }
})
