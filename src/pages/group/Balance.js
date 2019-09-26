import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {View, Text, Button, AsyncStorage,Image,StyleSheet,ScrollView,ImageBackground,TouchableOpacity,FlatList} from 'react-native';
import * as wechat from 'react-native-wechat';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginInfo:{},
      in_out_datas:[],
      come:0,
      out:0,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '收支明细',
    };
  };

  // render创建之前
  componentWillMount() {
  
  }

  componentDidMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
}

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    console.log(LoginInfo)
    LoginInfo = eval('(' + LoginInfo + ')');
    LoginInfo = LoginInfo[0];
    console.log(LoginInfo)
    if (LoginInfo !== null) {
      this.setState({ LoginInfo});
      //获取物流信息
      let urlInfo = `${url}/merchantAccount?mid=${LoginInfo.mid}&sale_type=${LoginInfo.sale_type}`;
      console.log(urlInfo)
        fetch(urlInfo).then(res =>{
            res.json().then(info =>{
                console.log(info)
                if (info.status){
                    let id = 1;
                    let come = 0;
                    let out = 0;
                    info.in_out_datas.forEach(item =>{
                        item.key = id++;
                        if (item.type === 0){
                            out = out+item.amount;
                        }else if(item.type ===1){
                            come = come+item.amount;
                        }
                    })
                    this.setState({
                        in_out_datas:info.in_out_datas,out,come,
                    })
                }
            })
        })

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  

  render() {
    const {in_out_datas,out,come,} = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <View style={{flex:1}}>
        <View style={styles.top}>
          <Text style={styles.topItem}>总收入：{come}元</Text>
          <Text style={styles.topItem}>总支出：{out}元</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.listDate}>时间</Text>
          <Text style={styles.listTitle}>类型</Text>
          <Text style={styles.listTitle}>摘要</Text>
          <Text style={styles.listTitle}>金额</Text>
        </View>

        <View  style={{flex:1}}>
          <FlatList
            style={{flex:1}}
            data={in_out_datas}
            keyExtractor={(item) => String(item.key)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.listDate}>{item.created_at}</Text>
                <Text style={styles.listTitle}>{item.balance>=0 ? '收入':'支出'}</Text>
                <Text style={styles.listTitle}>{item.reference}</Text>
                <Text style={styles.listTitle}>{item.balance}</Text>
              </View>
            }
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    width:'100%',
    borderBottomWidth:0.5,
    borderBottomColor:'#bbb',
  },
  topItem:{
    width:'50%',
    textAlign:'center',
    color:'#666',
    padding:10,
  },
  listDate:{
    width:'30%',
    padding:10,
    textAlign:'center',
  },
  listTitle:{
    width:'23%',
    padding:10,
    textAlign:'center',
  },
})