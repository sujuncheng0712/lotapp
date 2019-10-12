import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  ToastAndroid,
} from 'react-native';
import {Button} from '@ant-design/react-native';
const url = 'https://iot2.dochen.cn/api';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: this.props.navigation.getParam('eid'),
      cdkey: '',
      isForbidButton: false,
      haveActivationAt: false,
      deviceData: [],
      LoginInfo: {},
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '激活设备',
    };
  };

  // render创建之前
  componentWillMount() {}

  componentDidMount() {
    this._checkLoginState();
  }

  _checkLoginState = async () => {
    let LoginInfo = await AsyncStorage.getItem('LoginInfo');
    // eslint-disable-next-line no-eval
    LoginInfo = eval('(' + LoginInfo + ')');
    console.log(LoginInfo);
    this.setState({LoginInfo});
    const {navigation} = this.props;
    const eid = navigation.getParam('eid', '');
    let urlInfo = `${url}/devices?search=eid&eid=${eid}&sale_type=${
      LoginInfo.sale_type
    }`;
    fetch(urlInfo).then(res => {
      res.json().then(info => {
        console.log(info);
        if (info.status) {
          if (!info.data[0]) {
            return;
          }
          if (info.data[0].activation_at) {
            this.setState({haveActivationAt: true});
          }
          let deviceData = info.data[0];
          this.setState({deviceData});
        }
      });
    });
  };

  handleSubmit() {
    const {cdkey, deviceData, eid, LoginInfo} = this.state;
    const _cdkey = cdkey.replace(/(^\s+)|(\s+$)/g, '');
    console.log(eid);
    if (!eid) {
      ToastAndroid.show(
        '错误，不是有效的设备ID，请扫描正确的二维码！',
        ToastAndroid.SHORT,
      );
      this.props.navigation.navigate('AddDevice');
      return false;
    }
    if (!(deviceData.online_at && !deviceData.offline_at)) {
      ToastAndroid.show('设备未联网，请联网后重试！', ToastAndroid.SHORT);
      return false;
    }
    this.setState({isForbidButton: true});

    let urlInfo = `${url}/equipments/${eid}/link?uid=${LoginInfo.uid}`;
    fetch(urlInfo, {
      method: 'POST',
      body: JSON.stringify({
        uid: LoginInfo.uid,
        eid: eid,
        cdkey: cdkey,
        sale_type: LoginInfo.sale_type,
      }),
    }).then(res => {
      res.json().then(info => {
        console.log(info);
        if (!info.status) {
          if (info.code === 20005) {
            ToastAndroid.show('激活码不匹配，请查证后激活', ToastAndroid.SHORT);
            this.setState({isForbidButton: false});
          } else if (info.code === 9002) {
            ToastAndroid.show('请安装设备后激活', ToastAndroid.SHORT);
            this.setState({isForbidButton: false});
          } else {
            ToastAndroid.show('激活失敗，请重试', ToastAndroid.SHORT);
            this.setState({isForbidButton: false});
          }
          return false;
        }
        ToastAndroid.show(
          '设备激活成功，即将跳转到设备列表',
          ToastAndroid.SHORT,
        );
        this.setState({isForbidButton: false});
        this.props.navigation.navigate('Device');
      });
    });
  }

  render() {
    const {haveActivationAt, isForbidButton} = this.state;
    const {navigation} = this.props;
    const eid = navigation.getParam('eid', 'NO DATA');
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>激活设备</Text>
        <Text style={styles.content}>此设备当前已链接到云平台，</Text>
        <Text style={styles.content}>可使用激活码进行设备激活。</Text>
        <View style={styles.inputItem}>
          <Text>设备ID</Text>
          <TextInput
            editable={false}
            defaultValue={eid}
            placeholderTextColor={'#9d9d9d'}
            style={styles.input}
            onChangeText={text => this.setState({cdkey: text})}
          />
        </View>
        {haveActivationAt ? null : (
          <View style={styles.inputItem} hidden={false}>
            <Text>激活码</Text>
            <TextInput
              placeholder="若有激活码，请填写"
              placeholderTextColor={'#9d9d9d'}
              style={styles.input}
              onChangeText={text => this.setState({cdkey: text})}
            />
          </View>
        )}
        {!isForbidButton ? (
          <Button
            type="primary"
            onPress={() => {
              this.handleSubmit();
            }}>
            {!isForbidButton ? '激活设备' : '请稍等'}
          </Button>
        ) : (
          <Text>请稍等...</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputItem: {
    display: 'flex',
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 15,
  },
  input: {
    width: 200,
    fontSize: 15,
    textAlign: 'left',
    marginTop: -15,
    marginLeft: 5,
  },
  content: {
    color: '#9d9d9d',
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
});
