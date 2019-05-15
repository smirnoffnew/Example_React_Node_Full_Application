import { createStackNavigator } from 'react-navigation';

import SignIn from '@/screens/SignIn';
import RegisterEmail from '@/screens/RegisterEmail';
import RegisterPassword from '@/screens/RegisterPassword';
import RegisterName from '@/screens/RegisterName';
import TermsOfUse from '@/screens/TermsOfUse';
import ForgotPassword from '@/screens/ForgotPassword';
import ActionSuccess from '@/screens/ActionSuccess';

const AuthStack = createStackNavigator(
  {
    SignIn: { screen: SignIn },
    RegisterEmail: { screen: RegisterEmail },
    RegisterPassword: { screen: RegisterPassword },
    RegisterName: { screen: RegisterName },
    TermsOfUse: { screen: TermsOfUse },
    ForgotPassword: { screen: ForgotPassword },
    ActionSuccess: { screen: ActionSuccess },
  },
  {
    initialRouteName: 'SignIn',
  }
);

export default AuthStack;
