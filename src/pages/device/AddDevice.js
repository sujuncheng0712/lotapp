import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import {Button} from '@ant-design/react-native';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      uuid: '',
      name:'',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '添加设备',
    };
  };

  // render创建之前
  componentWillMount() {
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');

  }



  render() {
    const {name} = this.state;
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={styles.title}>你还没有激活设备，请按如下方式激活设备：</Text>
        <View style={styles.content}>
        <Text style={styles.item}>❶ 净水器插上电源。</Text>
        <Text style={styles.item}>❷ 确认净水器水龙头GPRS信号图标常亮，若通电后10分钟仍没有常亮，请将净水机放置在信号良好的位置，或联系商家安装信号天线。</Text>
        <Text style={styles.item}>❸点击本页面下方 [激活设备] 按钮，出现扫描后扫描机身二维码，转到激活页面，填写商家提供的激活码完成激活。</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('ScanScreen');
          }}>
          <Text
            style={{
              color:'white',
              textAlign:'center',
            }}
          >激活设备</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title:{
     marginTop:20,
     marginBottom:25,
     fontSize:15,
   },
  content:{
    paddingLeft:25,
  },
   item:{
     marginBottom: 25,
   },
  button:{
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
