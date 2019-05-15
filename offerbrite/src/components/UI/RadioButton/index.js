import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'native-base';
import styles from './styles';

export default function RadioButton({ checked }) {
  return (
    <Fragment>
      {
        checked ?
          <Icon
            name="md-radio-button-on"
            style={styles.button}
          /> :
          <Icon
            name="md-radio-button-off"
            style={styles.button}
          />
      }
    </Fragment>
  );
}

RadioButton.propTypes = {
  checked: PropTypes.bool,
};
