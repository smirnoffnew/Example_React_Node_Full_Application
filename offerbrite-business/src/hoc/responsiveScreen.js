import { hoistStatics } from 'recompose';
import responsiveComponent from '@/hoc/responsiveComponent';

const responsiveScreen = WrappedComponent => {
  return hoistStatics(responsiveComponent)(WrappedComponent);
};

export default responsiveScreen;
