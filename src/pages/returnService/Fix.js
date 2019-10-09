import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, TouchableOpacity, ToastAndroid, TextInput, Image} from 'react-native';
import { PickerView,Picker,Provider } from '@ant-design/react-native';
import address1 from '../../../service/address';
import district from 'antd-mobile-demo-data';
import ImagePicker from 'react-native-image-picker';
const url = 'https://iot2.dochen.cn/api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = () => {
      setTimeout(() => {
        this.setState({
          data: district,
        });
      }, 500);
    };
    this.onChange = value => {
      this.setState({ area:value });
    };
    this.state = {
      name:'',
      phone:'',
      area:'',
      address:'',
      LoginInfo:'',
      eid:'',
      avatarSource: null,
      videoSource: null
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:'我要报修',
    };
  };

  // render创建之前
  componentWillMount() {

    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
    const {navigation} = this.props;
    const eid = navigation.getParam('eid','');
    this.setState({eid})
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo});
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  signUp(){
    const {name,phone,area,address,remark,LoginInfo,eid,videoSource} = this.state;
    let urlInfo=`${url}/userSignUp`;
    fetch(urlInfo,{
      method:'POST',
      body:JSON.stringify({
        uid:LoginInfo.uid,
        eid:eid,
        name:name,
        phone:phone,
        area:area,
        address:address,
        remark:remark,
        image:videoSource,
        sale_type:LoginInfo.sale_type,
        type:2,
        mid:LoginInfo.mid,
      })
    }).then(res =>{
      res.json().then(info =>{
        console.log(info);
        if (info.status){
          ToastAndroid.show('提交成功', ToastAndroid.SHORT);
          this.props.navigation.navigate('Home')
        }else{
          ToastAndroid.show('提交失败', ToastAndroid.SHORT);
        }
      })
    })
  }

  //选择图片
  selectPhotoTapped() {
    const options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择照片',
      cameraType: 'back',
      mediaType: 'photo',
      videoQuality: 'high',
      durationLimit: 10,
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
      angle: 0,
      allowsEditing: false,
      noData: false,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  //选择视频
  selectVideoTapped() {
    const options = {

      title: '选择视频',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '录制视频',
      chooseFromLibraryButtonTitle: '选择视频',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }


  render() {
    const {area} = this.state;
    const {navigation} = this.props;
    const eid = navigation.getParam('eid','');
    return (
      <Provider>
        <View style={{flex: 1,}}>
          <View style={styles.top}>
            <Text style={styles.topItem}>请填写以下信息:</Text>
            <TouchableOpacity
              style={styles.topItem}
              onPress={()=>{this.props.navigation.navigate('AfterRecord');}}
            ><Text style={{textAlign: 'center',color:'#bbb',}}>售后记录</Text></TouchableOpacity>
          </View>

          <View style={styles.list}>
            <View style={styles.item}>
              <Text style={styles.title}>确认设备：</Text>
              <TextInput
                style={styles.eidInput}
                placeholder={'请输入设备号'}
                defaultValue={eid}
                onChangeText={(e)=>{this.setState({eid:e});console.log(e)}}
              />
              <TouchableOpacity
                onPress={()=>{this.props.navigation.navigate('ScanScreen',{state:'fix'});}}
              >
                <Image
                  style={styles.topImg}
                  source={require('../../images/scan.png')}
                />
              </TouchableOpacity>

            </View>

            <View style={styles.item}>
              <Text style={styles.title}>联系人：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入联系人'}
                onChangeText={(e)=>{this.setState({name:e})}}
              />
            </View>

            <View style={styles.item}>
              <Text style={styles.title}>地区：</Text>
              <View style={styles.input}  onPress={this.onPress}>
                <Picker
                  data={address1}
                  cols={3}
                  value={this.state.area}
                  placeholder={'请输入地区'}
                  onChange={this.onChange}
                >
                  <Text style={{height:'100%',paddingTop: 10}}>
                    {area}
                  </Text>
                </Picker>
              </View>
            </View>

            <View style={styles.item}>
              <Text style={styles.title}>详细地址：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入详细地址'}
                onChangeText={(e)=>{this.setState({address:e})}}
              />
            </View>

            <View style={styles.item}>
            <Text style={styles.title}>联系电话：</Text>
            <TextInput
              style={styles.input}
              placeholder={'请输入联系电话'}
              onChangeText={(e)=>{this.setState({phone:e})}}
            />
          </View>

            <View style={styles.item}>
              <Text style={styles.title}>故障描述：</Text>
              <TextInput
                style={styles.input}
                placeholder={'请输入故障描述'}
                onChangeText={(e)=>{this.setState({remark:e})}}
              />
            </View>

            <View style={styles.item}>
              <Text style={styles.title}>故障图片：</Text>
              <TouchableOpacity style={styles.input} onPress={this.selectPhotoTapped.bind(this)}>
                <View >
                  { this.state.avatarSource === null ? <Text>选择照片</Text> :
                    <Image style={styles.avatar} source={this.state.avatarSource} />
                  }
                </View>
              </TouchableOpacity>


              { this.state.videoSource &&
              <Text style={{margin: 8, textAlign: 'center'}}>{this.state.videoSource}</Text>
              }
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.signUp();
              }}>
              <Text
                style={{
                  color:'white',
                  textAlign:'center',
                }}
              >确 认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
    top:{
      flexDirection:'row',
    },
  topItem:{
    textAlign:'center',
    color:'#bbb',
    flex:0.5,
    paddingTop:10,
  },
  item:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height:50,
    padding: 5,

  },
  title:{
    paddingTop:10,
  },
  list:{
    width:'100%',
    marginTop:20,
  },
  input:{
    width:'60%',
    marginTop: 0,
    borderColor:'#bbb',
    borderWidth:0.5,
    borderRadius: 5,
    height:40,
    marginRight:43,
  },
  eidInput:{
    width:'60%',
    marginTop: 0,
    borderColor:'#bbb',
    borderWidth:0.5,
    borderRadius: 5,
    height:45,
  },

  button:{
    backgroundColor: '#FF7A01',
    borderColor:'#FF7A01',
    borderWidth:0.5,
    color:'#FF7A01',
    textAlign:'center',
    borderRadius:5,
    width: '100%',
    fontSize:10,
    padding: 5,
    marginTop:130,
  },
  topImg:{
    width:40,
    height:40,
    marginLeft:5,
  },
  avatar: {
    marginTop:50,
    width: 100,
    height: 100
  }
})
