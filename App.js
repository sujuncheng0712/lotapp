import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './src/pages/Home';
import GroupHome from './src/pages/GroupHome';
import White from './src/pages/White';
import Login from './src/pages/users/Login';
import MyCenter from './src/pages/users/MyCenter';
import MyShop from './src/pages/users/MyShop';
import Device from './src/pages/users/Device';
import Record from './src/pages/users/Record';
import Address from './src/pages/users/Address';
import Create from './src/pages/users/Create';
import AddDevice from './src/pages/device/AddDevice';
import DeviceIndex from './src/pages/device/DeviceIndex';
import ScanScreen from './src/pages/device/ScanScreen';
import Activation from './src/pages/device/Activation';
import Orders from './src/pages/order/Orders';
import Order from './src/pages/order/Order';
import Settlement from './src/pages/Settlement';
import CashRecord from './src/pages/returnService/CashRecord';
import Wallet from './src/pages/returnService/Wallet';
import Cash from './src/pages/returnService/Cash';
import Code from './src/pages/returnService/Code';
import Setup from './src/pages/returnService/Setup';
import AfterRecord from './src/pages/returnService/AfterRecord';
import Fix from './src/pages/returnService/Fix';
import Share from './src/pages/returnService/Share';
import Extend from './src/pages/returnService/Extend';
import GroupCenter from './src/pages/group/GroupCenter';
import Balance from './src/pages/group/Balance';
import GroupCash from './src/pages/group/GroupCash';
import WriteCard from './src/pages/group/WriteCard';
import CashPassword from './src/pages/group/CashPassword';
import GroupCashRecord from './src/pages/group/GroupCashRecord';
import SetDetail from './src/pages/group/SetDetail';
import ActivataDevice from './src/pages/group/ActivataDevice';
console.disableYellowBox = true;
console.warn('YellowBox is disabled.');

const AppStack = createStackNavigator(
  { GroupCenter:GroupCenter,
    White:White,
    Home:Home,
    GroupHome:GroupHome,
    Login: Login,
    MyCenter: MyCenter,
    Record: Record,
    //Device: Device,
    MyShop: MyShop,
    AddDevice: AddDevice,
    ScanScreen: ScanScreen,
    Activation: Activation,
    Settlement:Settlement,
    Address:Address,
    Create:Create,
    Orders:Orders,
    Order:Order,
    CashRecord:CashRecord,
    Wallet:Wallet,
    Cash:Cash,
    Code:Code,
    Setup:Setup,
    AfterRecord:AfterRecord,
    Fix:Fix,
    Share:Share,
    Extend:Extend,
    DeviceIndex:DeviceIndex,
    //Filter:Filter,
    Wallet:Wallet,
    Balance:Balance,
    GroupCash:GroupCash,
    WriteCard:WriteCard,
    CashPassword:CashPassword,
    GroupCashRecord:GroupCashRecord,
    SetDetail:SetDetail,
    ActivataDevice:ActivataDevice,
  },
  // {
  //   initialRouteName: 'Home',
  // },
);
export default createAppContainer(AppStack);
