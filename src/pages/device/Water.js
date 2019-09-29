import React from 'react';
import {View, Text, AsyncStorage,StyleSheet,ScrollView,ImageBackground,TouchableOpacity,Dimensions} from 'react-native';
import {Echarts, echarts} from 'react-native-secharts';
import Icon from 'react-native-vector-icons/AntDesign';
const url = 'https://iot2.dochen.cn/api';
const {height,width} =  Dimensions.get('window');
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo: '',
      eid: '',
      model: '',
      data: [],
      state:'day',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '水流量',
    };
  };

  // render创建之前
  componentWillMount() {
 
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async (state) => {
    //  let eid = "860344047689287";
    //  let model = 'DCA20-A';
    let eid = this.props.navigation.getParam('eid');
    let model = this.props.navigation.getParam('model');
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({LoginInfo,eid,model});
      //获取物流信息
      let urlInfo = `${url}/equipments/${eid}/usage?uid=${LoginInfo.uid}&filter=${state}`;
      fetch(urlInfo).then(res =>{
        res.json().then(info =>{
          console.log(info);
          if(info.status){
            this.setState({data: info.data});
          }
        })
      })
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    this._checkLoginState('day');
  }

  componentWillUnmount() {
   
  }

  render() {
    const {data,eid, model,state} = this.state;

    let _data = {
      xAxis: [],
      date: [],
      series: [],
    };

    if (state === 'day') {
      if (data) {
        if (data.length > 7) {
          data.splice(0, data.length - 7);
        }

        data.map((val) => {
          _data.xAxis.push(`${val.record_at.split('-')[1]}-${val.record_at.split('-')[2]}`);
          _data.series.push(val.normal / 1000);
          return true;
        });
      }
    } else if (state === 'month') {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        let l = 0;
        data.map((val) => {
          _data.xAxis.push(`${new Date(val.record_at).getFullYear()}-${new Date(val.record_at).getMonth() + 1}`);
          if (new Date(val.record_at).getMonth() === new Date().getMonth() - i) l = l + val.normal;
        });
        arr.push(l / 1000);
      }

      _data.xAxis = [...new Set(_data.xAxis)];

      for (let i in arr) {
        if (arr[i] !== 0) _data.series.push(arr[i]);
      }
      _data.series = _data.series.reverse();
    } else if (state === 'week') {
      data.map((val) => {
        _data.xAxis.push(`${new Date(val.record_at).getFullYear()}-${new Date(val.record_at).getDate() - new Date(val.record_at).getDay() + 1}`);
      });
      _data.xAxis = [...new Set(_data.xAxis)];

      _data.xAxis.map((value) => {
        let l = 0;
        data.map((val) => {
          if (new Date(val.record_at).getDate() - new Date(val.record_at).getDay() + 1 === parseInt(value.split('-')[1])) l = l + val.normal;
        });
        _data.series.push(l / 1000);
      });
    }

    const option = {
     
      xAxis: {
          data: _data.xAxis
      },
      yAxis: {
        name: '单位/L',
      },
      series: [{
          name: '单位/L',
          type: 'bar',
          data: _data.series,
          itemStyle: {
            color: '#c3f5fd',
          },
      }],
      textStyle: {
        color: '#c3f5fd',
      },
    };
    return (
      <ScrollView style={{flex: 1}}>    
      <ImageBackground
        style={styles.ImageBackground }
        source={require('../../images/dev_backgroud.png')}>
          <ImageBackground
            style={styles.ImageBackground }
            source={require('../../images/device_bg2.png')}>
              <View style={styles.top}>
                <Text style={{color:'#fff',textAlign:'center',padding:10,fontSize:20}}>用水情况</Text>
              </View>
              <TouchableOpacity
                style={styles.home}
                onPress={()=> this.props.navigation.navigate('Home')}>
                <Icon  name="home" size={25} color={'#fff'} />
              </TouchableOpacity>  
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={state ===1 ? styles.button2 : styles.button}
                  onPress={()=>{
                    this.setState({state:'day'})
                    this._checkLoginState('day');
                  }}
                >
                    <Text style={state===1 ? styles.buttonFont2 : styles.buttonFont}>日</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={state ===2 ? styles.button2 : styles.button}
                  onPress={()=>{
                    this.setState({state:'week'})
                    this._checkLoginState('week');
                  }}
                >
                  <Text style={state===2 ? styles.buttonFont2 : styles.buttonFont}>周</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={state ===3 ? styles.button2 : styles.button}
                    onPress={()=>{
                      this.setState({state:'month'})
                      this._checkLoginState('month');
                    }}
                >
                    <Text style={state===3 ? styles.buttonFont2 : styles.buttonFont}>月</Text>
                </TouchableOpacity>
              </View>   
              <Echarts option={option} height={350} />
              <View style={{paddingBottom:40,alignItems:'center',marginTop:20}}>
                <Text style={styles.buttonFont}>{data[data.length - 1] ? data[data.length - 1].record_at : '0000-00-00'}</Text>
                <Text style={styles.buttonFont}>用水总量：{data[data.length - 1] ? data[data.length - 1].normal / 1000 : '0'}L</Text>
              </View>  
          </ImageBackground>        
      </ImageBackground>
     
    </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    height:height/15,
    marginBottom:20,
    borderBottomColor:'#fff',
    borderBottomWidth:1,
    width:'100%',
  },
  home:{
    position:'absolute',
    top:height/70,
    left:10,
  },
  ImageBackground:{
    flex:1,
    width:'100%',
    height:height-70,
    alignItems:'center',
  },
  buttonGroup:{
    padding:10,
    flexDirection:'row',
    marginBottom:25,
  },
  button:{
    width:'33%',
    borderColor:'#fff',
    borderWidth:0.5,
    borderRadius:5,
  },
  button2:{
    width:'33%',
    borderColor:'#fff',
    borderWidth:0.5,
    borderRadius:5,
    backgroundColor:'#fff',
  },
  buttonFont:{
    color:'#fff',
    textAlign:'center',
  },
  buttonFont2:{
    color:'#00C8ED',
    textAlign:'center',
  },
})