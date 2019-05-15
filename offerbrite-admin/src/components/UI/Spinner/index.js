import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './styles.module.scss';

class Spinner extends Component {
  render() {
    return (
      <Fragment>
        {this.props.loading ? (
          <div className={styles.Spinner__background}>
            <div className={styles.Spinner} />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

Spinner.propTypes = {
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loading: state.request.loading,
});

export default connect(mapStateToProps)(Spinner);
