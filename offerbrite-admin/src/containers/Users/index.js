import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { UsersTable } from 'components/Tables';
import PageTitle from 'components/PageTitle';
import SearchBar from 'components/SearchBar';
import InstrumentsPanel from 'components/UI/InstrumentsPanel';
import Dropdown from 'components/UI/Dropdown';
import FilterButton from 'components/UI/FilterButton';
import Modal from 'components/UI/Modal';
import styles from './styles.module.scss';

import { actions as usersActions } from 'reducers/users';
import { actions as notificationFormActions } from 'reducers/notificationForm';

class Users extends Component {
  state = {
    searchWords: '',
  }

  componentDidMount() {
    this.props.getUsers();
  }

  handleSearch = e => {
    this.props.filterUsersBySearch(e);
    this.handleOnChangeSearch(e.target.value);
  }

  handleReset = () => {
    this.props.turnOffUsersFilter();
    this.handleOnChangeSearch('')
  }

  handleOnChangeSearch = text => {
    this.setState({ searchWords: text });
  }

  render() {
    const {
      usersList,
      filteredData,
      selectedCategory,
      selectedCountry,
      filterUsersByCountry,
      filterUsersByCategory,
      deleteUser,
      setUserToUpdate,
      onChangeUserFormField,
      setInitialCountries,
    } = this.props;
    const { searchWords } = this.state;

    const categories = [...new Set(usersList.map(user => {
      if (user.hasOwnProperty('categories')) {
        return user.categories;
      }
      return null;
    }))].filter(category => !!category).map(str => `${str[0].toUpperCase()}${str.slice(1)}`);

    const countries = [...new Set(usersList.map(user => {
      if (user.hasOwnProperty('country')) {
        return user.country;
      }
      return null;
    }))].filter(country => !!country);
    
    setInitialCountries(countries);

    return (
      <div className={styles.Users}>
        <PageTitle title="Users" />
        <InstrumentsPanel>
          <FilterButton
            active={Boolean(filteredData)}
            onClick={this.handleReset}
          />
          <SearchBar
            onChange={this.handleSearch}
            placeholder="Search by offer title"
            value={searchWords}
          />
          <Dropdown
            title={selectedCountry || 'Country'}
            values={countries}
            onSelect={filterUsersByCountry}
          />
          <Dropdown
            title={selectedCategory || 'Category'}
            values={categories}
            onSelect={filterUsersByCategory}
          />
        </InstrumentsPanel>
        <div className={styles.Users__table}>
          <UsersTable
            data={filteredData ? filteredData : usersList}
            searchWords={[searchWords]}
            onDelete={deleteUser}
            onEdit={setUserToUpdate}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  usersList: state.users.usersList,
  filteredData: state.users.filteredData,
  selectedCategory: state.users.selectedCategory,
  selectedCountry: state.users.selectedCountry,
});

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(usersActions.getUsers()),
  deleteUser: userId => dispatch(usersActions.deleteUser(userId)),
  setUserToUpdate: user => dispatch(usersActions.setUserToUpdate(user)),
  filterUsersByCategory: category => dispatch(usersActions.filterUsersByCategory(category)),
  filterUsersByCountry: country => dispatch(usersActions.filterUsersByCountry(country)),
  filterUsersBySearch: event => dispatch(usersActions.filterUsersBySearch(event)),
  turnOffUsersFilter: () => dispatch(usersActions.turnOffUsersFilter()),
  setInitialCountries: countries => dispatch(notificationFormActions.setInitialCountries(countries)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
