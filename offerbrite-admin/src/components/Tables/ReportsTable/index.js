import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Highlighter from 'react-highlight-words';
import ReactTable from 'react-table';
import DotsMenu from 'components/DotsMenu';
import Modal from 'components/UI/Modal';
import Confirmation from 'components/UI/Confirmation';
import { OfferForm } from 'components/Forms';

import { actions as reportsActions } from 'reducers/reports';
import { actions as offersActions } from 'reducers/offers';

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
      offerId: null,
    });
  }

  onSetUpdateOffer = offerId => {
    this.props.getOfferById(offerId);
    this.setState({ isEditFormVisible: true, offerId: offerId });
  }

  onSetDeleteReport = offerId => {
    console.log(offerId);
    this.setState({ isDeleteModalVisible: true, offerId });
  }

  handleUpdate = () => {
    this.props.updateOffer();
    this.onCloseModal();
  }

  handleDelete = offerId => {
    this.props.deleteReport(offerId);
    this.onCloseModal();
  }

  render() {
    const {
      data,
      searchWords,
      onChangeOfferFormField,
      offerToUpdate,
      categories,
      onChangeOfferCategory,
    } = this.props;
    const { isDeleteModalVisible, isEditFormVisible, offerId } = this.state;

    const columns = [
      {
        Header: 'Date',
        accessor: 'reports.createdAt',
        Cell: props => new Date(props.value).toDateString(),
      },
      {
        Header: 'User id',
        Cell: props => props.value,
        accessor: 'user.id',
        sortable: false,
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'User name',
        accessor: 'user.username',
        Cell: props => props.value ?
          <Highlighter
            highlightClassName="search_highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={props.value}
          /> :
          props.value,
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Email',
        accessor: 'user.email',
        Cell: props => props.value,
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Reason',
        accessor: 'reports.reason',
        Cell: props => props.value,
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Offer title',
        accessor: 'offer.title',
        Cell: props => (
          <Highlighter
            highlightClassName="search_highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={props.value}
          />
        ),
        headerClassName: 'Table__cell__header',
      },
      {
        Cell: props => (
          <DotsMenu
            onEdit={() => this.onSetUpdateOffer(props.original.offer.id)}
            onDelete={() => this.onSetDeleteReport(props.original.reports.id)}
          />
        ),
        accessor: 'reports.id',
        sortable: false,
        style: { display: 'flex', justifyContent: 'flex-end' },
        headerClassName: 'Table__cell__header',
      },
    ];

    return (
      <Fragment>
        <ReactTable
          className="-highlight"
          data={data}
          columns={columns}
          minRows={data.length}
        />
        <Modal
          isVisible={isDeleteModalVisible}
          onClose={this.onCloseModal}
          header="Delete report"
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
    )
  }
}

const mapStateToProps = state => ({
  offerToUpdate: state.offers.offerToUpdate,
  categories: state.offers.categories,
});

const mapDispatchToProps = dispatch => ({
  deleteReport: reportId => dispatch(reportsActions.deleteReport(reportId)),
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

export const ReportsTable = connect(mapStateToProps, mapDispatchToProps)(Table);
