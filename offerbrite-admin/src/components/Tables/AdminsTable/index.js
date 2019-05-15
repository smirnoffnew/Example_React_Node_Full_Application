import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactTable from 'react-table';
import Modal from 'components/UI/Modal';
import Confirmation from 'components/UI/Confirmation';
import DotsMenu from 'components/DotsMenu';
import { AdminForm } from 'components/Forms';

import { actions as adminsActions } from 'reducers/admins';

class Table extends Component {
  state = {
    isDeleteModalVisible: false,
    isEditFormVisible: false,
    adminId: null,
  }

  onCloseModal = () => {
    this.setState({
      isDeleteModalVisible: false,
      isEditFormVisible: false,
      adminId: null,
    });
  }

  onSetUpdateAdmin = admin => {
    this.props.setAdminToUpdate(admin);
    this.setState({ isEditFormVisible: true, adminId: admin.id });
  }

  onSetDeleteAdmin = adminId => {
    this.setState({ isDeleteModalVisible: true, adminId });
  }

  handleDelete = adminId => {
    this.props.onDelete(adminId);
    this.onCloseModal();
  }

  handleUpdate = () => {
    this.props.updateAdmin();
    this.onCloseModal();
  }

  render() {
    const {
      data,
      onChangeNewAdminTextField,
      newAdmin,
      onChangeRole,
    } = this.props;
    const { isDeleteModalVisible, isEditFormVisible, adminId } = this.state;

    const adminsTableColumns = [
      {
        Header: 'Name',
        Cell: props => props.value,
        accessor: 'username',
        headerClassName: 'withBorderRight',
      },
      {
        Header: 'Email',
        Cell: props => props.value,
        accessor: 'email',
        headerClassName: 'Table__cell__header',
      },
      {
        Header: 'Role',
        Cell: props => props.value,
        accessor: 'role',
        headerClassName: 'Table__cell__header',
      },
      {
        Cell: props => (
          <DotsMenu
            onEdit={() => this.onSetUpdateAdmin(props.original)}
            onDelete={() => this.onSetDeleteAdmin(props.value)}
            id={props.value}
          />
        ),
        accessor: 'id',
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
          columns={adminsTableColumns}
          minRows={5}
          showPaginationBottom={false}
        />
        <Modal
          isVisible={isDeleteModalVisible}
          onClose={this.onCloseModal}
          header="Delete admin"
        >
          <Confirmation
            actionTitle="Delete"
            onCancel={this.onCloseModal}
            onConfirm={() => this.handleDelete(adminId)}
          />
        </Modal>
        <Modal
          isVisible={isEditFormVisible}
          onClose={this.onCloseModal}
          header="Edit admin"
        >
          <AdminForm
            onSubmit={this.handleUpdate}
            onChange={onChangeNewAdminTextField}
            values={newAdmin}
            admin={newAdmin}
            onSelectRole={onChangeRole}
          />
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  newAdmin: state.admins.newAdmin,
});

const mapDispatchToProps = dispatch => ({
  onChangeRole: role => dispatch(adminsActions.onChangeRole(role)),
  onChangeNewAdminTextField: (event, inputName) => dispatch(adminsActions.onChangeNewAdminTextField(event, inputName)),
  setAdminToUpdate: admin => dispatch(adminsActions.setAdminToUpdate(admin)),
  updateAdmin: () => dispatch(adminsActions.updateAdmin()),
});

Table.propTypes = {
  data: PropTypes.array,
  onDelete: PropTypes.func,
};

export const AdminsTable = connect(mapStateToProps, mapDispatchToProps)(Table);
