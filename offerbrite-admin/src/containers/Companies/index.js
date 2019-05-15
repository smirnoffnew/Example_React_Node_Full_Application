import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CompaniesTable } from 'components/Tables';
import PageTitle from 'components/PageTitle';
import SearchBar from 'components/SearchBar';
import InstrumentsPanel from 'components/UI/InstrumentsPanel';
import Dropdown from 'components/UI/Dropdown';
import FilterButton from 'components/UI/FilterButton';
import styles from './styles.module.scss';

import { actions as companiesActions } from 'reducers/companies';

class Companies extends Component {
  state = {
    searchWords: '',
  }

  componentDidMount() {
    this.props.getCompanies();
  }

  handleSearch = e => {
    this.props.filterCompaniesBySearch(e);
    this.setState({ searchWords: e.target.value });
  }

  hanndleResetFilter = () => {
    this.props.turnOffCompaniesFilter();
    this.setState({ searchWords: '' });
  }

  render() {
    const {
      companiesList,
      filteredData,
      selectedCountry,
      filterCompaniesByCountry,
      deleteCompany,
    } = this.props;

    const { searchWords } = this.state;

    const countries = [...new Set(companiesList.map(company => company.country))];

    return (
      <div className={styles.Companies}>
        <PageTitle title="Companies" />
        <InstrumentsPanel>
          <FilterButton
            active={Boolean(filteredData)}
            onClick={this.hanndleResetFilter}
          />
          <SearchBar
            onChange={this.handleSearch}
            placeholder="Search (brand name, website, email)"
            value={searchWords}
          />
          <Dropdown
            title={selectedCountry || 'Country'}
            values={countries}
            onSelect={filterCompaniesByCountry}
          />
        </InstrumentsPanel>
        <div className={styles.Companies__table}>
          <CompaniesTable
            data={filteredData ? filteredData : companiesList}
            searchWords={[searchWords]}
            onDelete={deleteCompany}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  companiesList: state.companies.companiesList,
  filteredData: state.companies.filteredData,
  selectedCountry: state.companies.selectedCountry,
});

const mapDispatchToProps = dispatch => ({
  getCompanies: () => dispatch(companiesActions.getCompanies()),
  deleteCompany: businessUserId => dispatch(companiesActions.deleteCompany(businessUserId)),
  filterCompaniesByCountry: country => dispatch(companiesActions.filterCompaniesByCountry(country)),
  filterCompaniesBySearch: event => dispatch(companiesActions.filterCompaniesBySearch(event)),
  turnOffCompaniesFilter: () => dispatch(companiesActions.turnOffCompaniesFilter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
