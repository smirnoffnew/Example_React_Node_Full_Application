import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { OffersTable } from 'components/Tables';
import PageTitle from 'components/PageTitle';
import SearchBar from 'components/SearchBar';
import InstrumentsPanel from 'components/UI/InstrumentsPanel';
import Dropdown from 'components/UI/Dropdown';
import FilterButton from 'components/UI/FilterButton';
import styles from './styles.module.scss';

import { actions as offersActions } from 'reducers/offers';

class Offers extends Component {
  state = {
    searchWords: '',
  }

  componentDidMount() {
    this.props.getOffers();
  }

  handleSearch = e => {
    this.props.filterOffersBySearch(e);
    this.setState({ searchWords: e.target.value });
  }

  handleReset = () => {
    this.setState({ searchWords: '' });
    this.props.turnOffOffersFilter();
  }

  render() {
    const {
      offersList,
      filteredData,
      selectedCategory,
      selectedCountry,
      filterOffersByCategory,
      filterOffersByCountry,
    } = this.props;

    const { searchWords } = this.state;

    const categories = [...new Set(offersList.map(offer => (
      `${offer.category[0].toUpperCase()}${offer.category.slice(1)}`)
    ))];

    const countries = [...new Set(offersList.map(offer => offer.locations[0].address.country))];

    return (
      <div className={styles.Offers}>
        <PageTitle title="Offers" />
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
            title={selectedCategory || 'Category'}
            values={categories}
            onSelect={filterOffersByCategory}
          />
          <Dropdown
            title={selectedCountry || 'Country'}
            values={countries}
            onSelect={filterOffersByCountry}
          />
        </InstrumentsPanel>
        <div className={styles.Offers__table}>
          <OffersTable
            data={filteredData ? filteredData : offersList}
            searchWords={[searchWords]}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  offersList: state.offers.offersList,
  filteredData: state.offers.filteredData,
  selectedCategory: state.offers.selectedCategory,
  selectedCountry: state.offers.selectedCountry,
});

const mapDispatchToProps = dispatch => ({
  getOffers: () => dispatch(offersActions.getOffers()),
  filterOffersByCategory: category => dispatch(offersActions.filterOffersByCategory(category)),
  filterOffersByCountry: country => dispatch(offersActions.filterOffersByCountry(country)),
  filterOffersBySearch: event => dispatch(offersActions.filterOffersBySearch(event)),
  turnOffOffersFilter: () => dispatch(offersActions.turnOffOffersFilter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Offers);
