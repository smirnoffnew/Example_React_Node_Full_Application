import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Highlighter from 'react-highlight-words';
import ReactTable from 'react-table';
import DotsMenu from 'components/DotsMenu';
import Modal from 'components/UI/Modal';
import Confirmation from 'components/UI/Confirmation';
import { OfferForm } from 'components/Forms';
import defaultImage from 'assets/images/question-mark.png';

import { actions as offersActions } from 'reducers/offers';
import { convertLocation } from 'services/helpers';

class Table extends Component {
  state = {
    isDeleteModalVisible: false,
    isEditFormVisible: false,
    offerId: null,
  }

  onCloseModal = () => {
    this.props.resetOfferToUpdate();
    this.setState({
      isDeleteModalVisible: false,
      isEditFormVisible: false,
      offerId: null
    });
  }

  onSetUpdateOffer = offerId => {
    this.props.getOfferById(offerId);
    this.setState({ isEditFormVisible: true, offerId: offerId });
  }

  onSetDeleteOffer = offerId => {
    this.setState({ isDeleteModalVisible: true, offerId });
  }

  handleUpdate = () => {
    this.props.updateOffer();
    this.onCloseModal();
  }

  handleDelete = offerId => {
    this.props.deleteOffer(offerId);
    this.onCloseModal();
  }

  render() {
    const {
      data,
      searchWords,
      settings,
      onChangeOfferFormField,
      offerToUpdate,
      categories,
      onChangeOfferCategory,
    } = this.props;
    const { isDeleteModalVisible, isEditFormVisible, offerId } = this.state;

    const columns = [
      {
        Header: 'Offer id',
        accessor: 'id',
        width: 150,
        Cell: props => (
          <Highlighter
            highlightClassName="search_highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={props.value}
          />
        ),
        sortable: false,
      },
      {
        Header: 'Title',
        Cell: props => (
          <Highlighter
            highlightClassName="search_highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={props.value}
          />
        ),
        accessor: 'title',
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: props => props.value,
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Price',
        width: 100,
        accessor: 'fullPrice',
        Cell: props => props.value && props.value > 0 ? props.value : '',
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Discount',
        width: 100,
        accessor: 'discount',
        Cell: props => props.value && props.value > 0 ? props.value : '',
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: props => `${props.value[0].toUpperCase()}${props.value.slice(1)}`,
        headerClassName: 'Table__cell__header',
        width: 180,
      },
      {
        Header: 'Address',
        accessor: 'locations[0].address',
        style: { overflow: 'hidden' },
        Cell: props => convertLocation(props.value),
        headerClassName: 'Table__cell__header',
      },
      {
        Cell: props => (
          <DotsMenu
            onEdit={() => this.onSetUpdateOffer(props.value)}
            onDelete={() => this.onSetDeleteOffer(props.value)}
            id={props.value}
          />
        ),
        width: 100,
        accessor: 'id',
        sortable: false,
        style: { display: 'flex', justifyContent: 'flex-end' },
        headerClassName: 'Table__cell__header',
      },
    ];

    const settingsSelectors = {};
    settings.forEach(setting => {
      settingsSelectors[setting.label] = setting.value;
    });

    const filteredColumns = columns.filter(column => {
      return settingsSelectors[column.Header] || !column.hasOwnProperty('Header');
    });

    return (
      <Fragment>
        <ReactTable
          className="-highlight"
          data={data}
          columns={filteredColumns}
        />
        <Modal
          isVisible={isDeleteModalVisible}
          onClose={this.onCloseModal}
          header="Delete offer"
        >
          <Confirmation
            actionTitle="Delete"
            onCancel={this.onCloseModal}
            onConfirm={() => this.handleDelete(offerId)}
          />
        </Modal>
        <Modal
          isVisible={isEditFormVisible}
          onClose={this.onCloseModal}
          header="Edit offer"
        >
          <OfferForm
            onSubmit={this.handleUpdate}
            onChange={onChangeOfferFormField}
            offer={offerToUpdate}
            categories={categories}
            onChangeCategory={onChangeOfferCategory}
          />
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings.offers,
  offerToUpdate: state.offers.offerToUpdate,
  categories: state.offers.categories,
});

const mapDispatchToProps = dispatch => ({
  deleteOffer: offerId => dispatch(offersActions.deleteOffer(offerId)),
  getOfferById: offerId => dispatch(offersActions.getOfferById(offerId)),
  onChangeOfferFormField: (e, fieldTitle) => dispatch(offersActions.onChangeOfferFormField(e, fieldTitle)),
  onChangeOfferCategory: category => dispatch(offersActions.onChangeOfferCategory(category)),
  resetOfferToUpdate: () => dispatch(offersActions.resetOfferToUpdate()),
  updateOffer: () => dispatch(offersActions.updateOffer()),
});

Table.propTypes = {
  searchWords: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
};

export const OffersTable = connect(mapStateToProps, mapDispatchToProps)(Table);
