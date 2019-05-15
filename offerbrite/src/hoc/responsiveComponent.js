import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { getScreenHeight, getScreenSize, getScreenWidth, getViewMode } from '@/services/helpers/dimensionsControl';

const responsiveComponent = WrappedComponent => {
  return class extends Component {

    state = {
      screenSize: getScreenSize(),
      screenHeight: getScreenHeight(),
      screenWidth: getScreenWidth(),
      mode: getViewMode(),
    }

    constructor(props) {
      super(props);
      Dimensions.addEventListener('change', this._onScreenSizeUpdateHandler);
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this._onScreenSizeUpdateHandler);
    }

    _onScreenSizeUpdateHandler = () => {
      this.setState({
        screenSize: getScreenSize(),
        screenHeight: getScreenHeight(),
        screenWidth: getScreenWidth(),
        mode: getViewMode(),
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          screenSize={this.state.screenSize}
          screenHeight={this.state.screenHeight}
          screenWidth={this.state.screenWidth}
          mode={this.state.mode}
        />
      );
    }
  };
};

export default responsiveComponent;
