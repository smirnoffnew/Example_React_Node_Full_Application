import { createStackNavigator } from 'react-navigation';

import Verification from '@/screens/Verification';
import VerifyAccount from '@/screens/VerifyAccount';

const VerificationStack = createStackNavigator(
  {
    Verification: { screen: Verification },
    VerifyAccount: { screen: VerifyAccount },
  },
  {
    initialRouteName: 'Verification',
  }
);

export default VerificationStack;
