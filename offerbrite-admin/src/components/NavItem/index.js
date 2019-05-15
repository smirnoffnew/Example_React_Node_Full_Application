import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import CountBadge from 'components/UI/CountBadge';
import styles from './styles.module.scss';

class NavItem extends Component {
  render() {
    const { to, title, icon, hidden, withBadge, count } = this.props;

    return (
      <li className={styles.NavItem}>
        <NavLink
          className={styles.NavItem__button}
          style={
            !hidden
              ? { padding: '20px 3rem 20px 3rem' }
              : { padding: '20px 0px 20px 0px', justifyContent: 'center' }
          }
          activeClassName={styles.active}
          to={to}
        >
          <div className={styles.NavItem__icon__wrapper}>
            <img src={icon} className={styles.NavItem__icon} alt={`${title} icon`} />
            {
              count &&
              <CountBadge
                className={styles.NavItem__icon__badge}
                count={count}
              />
            }
          </div>
          {title && <div className={styles.NavItem__title}>{title}</div>}
        </NavLink>
      </li>
    );
  }
}

NavItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  withBadge: PropTypes.bool,
};

export default NavItem;
