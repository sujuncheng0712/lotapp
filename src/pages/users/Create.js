import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const url = 'https://iot2.dochen.cn/api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {default: 1},
      addressInfo: {},
      defaultValue:true,
    };
  }
  // render创建之前
  componentWillMount() {
    let addressInfo = this.props.navigation.getParam('address','');
    this.setState({addressInfo})
    console.log(addressInfo)
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');

  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:navigation.getParam('title')
    };
  };

  render() {
    const {addressInfo,defaultValue} = this.state;
    return (
      <View style={styles.list}>
        <View style={styles.item}>
          <Text style={styles.title}>收货人：</Text>
          <TextInput
            style={styles.input}
            defaultValue={addressInfo !=='' ? addressInfo.contact :''}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>手机：</Text>
          <TextInput
            style={styles.input}
            defaultValue={addressInfo !=='' ? addressInfo.phone:''}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>地区：</Text>

        </View>
        <View style={styles.item}>
          <Text style={styles.title}>详细地址：</Text>
          <TextInput
            style={styles.input}
            defaultValue= { addressInfo !=='' ? addressInfo.address:''}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>默认：</Text>
          <View style={{width:'70%',paddingTop: 10,}}>
            <Icon
              name="check-circle"
              size={20} color={defaultValue ? '#ff8800' : '#666'}
              onPress={()=>{
                this.setState({defaultValue:!defaultValue})
              }}
            />
          </View>

        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('Create',{title:'添加地址'});
          }}>
          <Text
            style={{
              color:'white',
              textAlign:'center',
            }}
          >保存地址</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list:{
    width:'100%',
  },
  item:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth:0.5,
    borderColor: '#bbb',
    height:'12%',
    padding: 5,
  },
  title:{
    paddingTop:10,
  },
  button:{
    backgroundColor: '#FF7A01',
    borderColor:'#FF7A01',
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: 100,
    fontSize:10,
    padding: 5,
    marginTop: 40,
  },
  input:{
    width:'70%',
  }
})
