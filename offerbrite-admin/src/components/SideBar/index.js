import React, { Component } from 'react';
import { connect } from 'react-redux';

import NavItem from 'components/NavItem';
import styles from './styles.module.scss';
import logo from 'assets/images/logo.svg';
import navigation from './navigation';

const buttonClasses = {
  hidden: 'hamburger--arrow-r',
  visible: 'hamburger--arrow',
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    const initialWindowWidth = window.innerWidth;
    this.state = {
      isSideBarHidden: initialWindowWidth < 1560,
      buttonClasses:
        initialWindowWidth < 1560
          ? buttonClasses.hidden
          : buttonClasses.visible,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', e => {
      if (e.target.innerWidth < 1560) {
        this.hideSideBar();
      }
    });
  }

  hideSideBar = () => {
    this.setState({
      isSideBarHidden: true,
      buttonClasses: buttonClasses.hidden,
    });
  };

  handleMenuButtonClick = () => {
    this.setState(prevState => ({
      isSideBarHidden: !prevState.isSideBarHidden,
      buttonClasses: prevState.isSideBarHidden
        ? buttonClasses.visible
        : buttonClasses.hidden,
    }));
  };

  handleButtonHover = () => {
    this.setState({ buttonClasses: `${this.state.buttonClasses} is-active` });
  };

  handleButtonLeave = () => {
    this.setState({
      buttonClasses: `${this.state.buttonClasses.replace(' is-active', '')}`,
    });
  };

  render() {
    const { isSideBarHidden, buttonClasses } = this.state;
    const { reportsList } = this.props;

    const navItems = isSideBarHidden
      ? navigation.map(item => ({ to: item.to, icon: item.icon, withBadge: item.withBadge }))
      : navigation;

    return (
      <aside
        className={[
          styles.SideBar,
          isSideBarHidden ? styles.hidden : styles.visible,
        ].join(' ')}
      >
        <div className={styles.SideBar__header}>
          {!isSideBarHidden && (
            <div className={styles.SideBar__header__logo}>
              <img src={logo} alt="Logo" />
              <h4 className={styles.SideBar__header__title}>Admin panel</h4>
            </div>
          )}
          <div className={styles.SideBar__header__button}>
            <button
              onClick={this.handleMenuButtonClick}
              onMouseEnter={this.handleButtonHover}
              onMouseLeave={this.handleButtonLeave}
              className={`hamburger ${buttonClasses}`}
              style={{ outline: 'none' }}
              type="button"
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </div>
        </div>
        <nav className={styles.SideBar__navigation}>
          <ul style={{ listStyle: 'none' }}>
            {
              navItems.map((item, index) => (
                <NavItem
                  key={index}
                  hidden={isSideBarHidden}
                  {...item}
                  count={item.withBadge && reportsList.length > 0 ? reportsList.length : null}
                />
              ))
            }
          </ul>
        </nav>
      </aside>
    );
  }
}

const mapStateToProps = state => ({
  reportsList: state.reports.reportsList,
});

export default connect(mapStateToProps, null, null, { pure: false })(SideBar);
