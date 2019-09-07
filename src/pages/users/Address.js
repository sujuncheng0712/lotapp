import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  ToastAndroid,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
const url = 'https://iot2.dochen.cn/api';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      LoginInfo:{},
      modalVisible: false,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '地址簿',
    };
  };

  // render创建之前
  componentWillMount() {
    this._checkLoginState();
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    if (LoginInfo !== null) {
      console.log(LoginInfo.name);
      this.setState({LoginInfo});
      //获取地址记录
      let urlInfo = `${url}/users/${LoginInfo.uid}/address?uid=${LoginInfo.uid}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if (info.status){
            this.setState({lists: info.data});
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  //设置默认地址
  addressDefault(uuid, params){
    const {LoginInfo} = this.state;
    console.log(JSON.stringify({params}))
    let urlInfo = `${url}/users/${LoginInfo.uid}/address/${uuid}?uid=${LoginInfo.uid}`;
    fetch(urlInfo,{
      method:'PUT',
      body:JSON.stringify({
        id:params.id,
        uuid:params.uuid,
        uid:params.uid,
        contact:params.contact,
        phone:params.phone,
        area:params.area,
        address:params.address,
        zipcode:params.zipcode,
        default:params.default,
        created_at:params.created_at,
        updated_at:params.updated_at,
        remark:params.remark,
      }),
    }).then(res =>{
      res.json().then(info =>{
        console.log(info);
        if (info.status){
          ToastAndroid.show('设置成功！', ToastAndroid.SHORT);
          this._checkLoginState();
        }
      })
    })
  }

  addressDelete(uuid){
    const {LoginInfo} = this.state;
    let urlInfo  =`${url}/users/${LoginInfo.uid}/address/${uuid}?uid=${LoginInfo.uid}`;
    fetch(urlInfo,{
      method:'DELETE',
    }).then(res =>{
      res.json().then(info =>{
        console.log(info);
        if (info.status){
          this.setState({modalVisible:false})
          this._checkLoginState();
        }
      })
    })
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const {lists} = this.state;
    let showList = lists.map((item,key)=>{
      return(
        <View style={styles.item} key={key}>
          <View style={styles.one}>
              <Icon
                style={{flex:0.09}}
                name="check-circle"
                size={20} color={item.default ? '#ff8800' : '#666'}
                onPress={()=>{
                  item.default = 1;
                  this.addressDefault(item.uuid,item)
                }}
              /><Text  style={{flex:0.85}}>默认</Text>
            <Icon
              style={{flex:0.1}}
              name="edit"
              size={20} color={'#ff8800'}
              onPress={()=>{
                this.props.navigation.navigate('Create', {uuid: item.uuid,title:'修改地址',address:item});
              }}
            />
            <Icon
              style={{flex:0.1}}
              name="close"
              size={20} color={'#ff8800'}
              onPress={()=>{
                this.setModalVisible(true);
              }}
            />
          </View>
          <View style={styles.one}>
            <Text>收货人：{item.contact}  </Text>
            <Text>  手机：{item.phone}</Text>
          </View>
          <View style={styles.one}>
            <Text>地区：{item.area}</Text>
          </View>
          <View style={styles.one}>
            <Text>收货地址：{item.address}</Text>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}
          >
            <View style={{height:Dimensions.get('window').height, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
              <View style={{height:250,  width:300, margin:20, backgroundColor:'white'}}>
                <View style={{flex:1, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:'#eee'}}>
                  <Text>确认删除该地址？</Text>
                </View>
                <View style={styles.one}>
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      this.addressDelete(item.uuid);
                    }}
                  >
                    <Text style={{textAlign: 'center',color:'#fff',}}>确认</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.button2}
                    onPress={() => {
                      this.setModalVisible(false);
                    }}
                  >
                    <Text style={{textAlign: 'center',}}>取消</Text>
                  </TouchableHighlight>
                </View>

              </View>
            </View>
          </Modal>
        </View>
      )
    });
    return (
      <View style={styles.list}>
        {showList}
        <TouchableOpacity
          style={styles.button3}
          onPress={() => {
            this.props.navigation.navigate('Create',{title:'添加地址'});
          }}>
          <Text
            style={{
              color:'white',
              textAlign:'center',
            }}
          >添加新地址</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list:{
    width:'100%',
    padding:10,

  },
  item:{
    width:'100%',
    borderColor:'red',
    borderWidth: 1,
    padding: 10,
  },
  one:{
    flexDirection: 'row',
    width:'100%',
  },
  button:{
    height:'100%',
    width:'50%',
    backgroundColor:'#FF7A01',
  },
  button2:{
    height:'100%',
    width:'50%',
  },
  button3:{
    backgroundColor: '#FF7A01',
    borderColor:'#FF7A01',
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: 150,
    fontSize:10,
    padding: 5,
    marginTop: 40,
  }
})
