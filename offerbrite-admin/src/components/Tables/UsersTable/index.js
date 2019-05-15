import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Highlighter from 'react-highlight-words';
import ReactTable from 'react-table';
import DotsMenu from 'components/DotsMenu';
import Modal from 'components/UI/Modal';
import Confirmation from 'components/UI/Confirmation';
import { UserForm } from 'components/Forms';

import { actions as usersActions } from 'reducers/users';

class Table extends Component {
  state = {
    isDeleteModalVisible: false,
    isEditFormVisible: false,
    userId: null,
  }

  onCloseModal = () => {
    this.setState({
      isDeleteModalVisible: false,
      isEditFormVisible: false,
      userId: null
    });
  }

  onSetUpdateUser = user => {
    this.props.onEdit(user);
    this.setState({ isEditFormVisible: true, userId: user.id });
  }

  onSetDeleteUser = userId => {
    this.setState({ isDeleteModalVisible: true, userId });
  }

  handleUpdate = () => {
    this.onCloseModal();
    this.props.updateUser();
  }

  handleDelete = userId => {
    this.props.onDelete(userId);
    this.onCloseModal();
  }

  render() {
    const { data, searchWords, settings, onChangeUserFormField, userToUpdate } = this.props;
    const { isDeleteModalVisible, isEditFormVisible, userId } = this.state;

    const columns = [
      {
        Header: 'User id',
        accessor: 'id',
        Cell: props => props.value,
        sortable: false,
      },
      {
        Header: 'Name',
        Cell: props => props.value ?
          <Highlighter
            highlightClassName="search_highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={props.value}
          /> :
          props.value,
        accessor: 'username',
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Email',
        accessor: 'email',
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
        Header: 'Country',
        accessor: 'country',
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
        Header: 'Categories',
        accessor: 'categories',
        Cell: props => props.value ?
          <Highlighter
            highlightClassName="search_highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={`${props.value[0].toUpperCase()}${props.value.slice(1)}`}
          /> :
          props.value,
        headerClassName: 'Table__cell__header',
      },
      {
        Cell: props => (
          <DotsMenu
            onEdit={() => this.onSetUpdateUser(props.original)}
            onDelete={() => this.onSetDeleteUser(props.value)}
            id={props.value}
          />
        ),
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
          minRows={data.length}
        />
        <Modal
          isVisible={isDeleteModalVisible}
          onClose={this.onCloseModal}
          header="Delete user"
        >
          <Confirmation
            actionTitle="Delete"
            onCancel={this.onCloseModal}
            onConfirm={() => this.handleDelete(userId)}
          />
        </Modal>
        <Modal
          isVisible={isEditFormVisible}
          onClose={this.onCloseModal}
          header="Edit user"
        >
          <UserForm
            onSubmit={this.handleUpdate}
            onChange={onChangeUserFormField}
            values={userToUpdate}
          />
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings.users,
  userToUpdate: state.users.userToUpdate,
});

const mapDispatchToProps = dispatch => ({
  onChangeUserFormField: (e, fieldSelector) => dispatch(usersActions.onChangeUserFormField(e, fieldSelector)),
  updateUser: () => dispatch(usersActions.updateUser()),
});

Table.propTypes = {
  searchWords: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
};

export const UsersTable = connect(mapStateToProps, mapDispatchToProps)(Table);
