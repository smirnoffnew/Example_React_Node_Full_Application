import { createStackNavigator } from 'react-navigation';

import SignIn from '@/screens/SignIn';
import RegisterEmail from '@/screens/RegisterEmail';
import RegisterPassword from '@/screens/RegisterPassword';
import RegisterBrandName from '@/screens/RegisterBrandName';
import RegisterAddress from '@/screens/RegisterAddress';
import RegisterContacts from '@/screens/RegisterContacts';
import RegisterLogo from '@/screens/RegisterLogo';
import ForgotPassword from '@/screens/ForgotPassword';
import ActionSuccess from '@/screens/ActionSuccess';

const AuthStack = createStackNavigator(
  {
    SignIn: { screen: SignIn },
    RegisterEmail: { screen: RegisterEmail },
    RegisterPassword: { screen: RegisterPassword },
    RegisterBrandName: { screen: RegisterBrandName },
    RegisterAddress: { screen: RegisterAddress },
    RegisterContacts: { screen: RegisterContacts },
    RegisterLogo: { screen: RegisterLogo },
    ForgotPassword: { screen: ForgotPassword },
    ActionSuccess: { screen: ActionSuccess },
  },
  {
    initialRouteName: 'SignIn',
  }
);

export default AuthStack;
