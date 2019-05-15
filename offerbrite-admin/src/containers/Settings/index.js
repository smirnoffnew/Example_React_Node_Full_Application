import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AdminsTable } from 'components/Tables';
import PageTitle from 'components/PageTitle';
import TabBar from 'components/UI/TabBar';
import Tab from 'components/UI/Tab';
import StaticTable from 'components/UI/StaticTable';
import Checkbox from 'components/Checkbox';
import Button from 'components/UI/Button';
import Modal from 'components/UI/Modal';
import { AdminForm } from 'components/Forms';
import styles from './styles.module.scss';

import { actions as settingsActions } from 'reducers/settings';
import { actions as adminsActions } from 'reducers/admins';

const tabs = {
  _1: 'Admins',
  _2: 'Charts',
};

class Settings extends Component {
  state = {
    activeTab: tabs._1,
    isAdminFormVisible: false,
  }

  componentDidMount() {
    this.props.getAdmins();
  }

  handleSubmit = () => {
    this.props.createNewAdmin();
    this.onToggleAdminForm();
  }

  handleTabClick = tab => {
    this.setState({ activeTab: tab });
  }

  handleEdit = adminId => {
    this.onToggleAdminForm();
    // TODO: set admin to edit
  }

  onToggleAdminForm = () => {
    this.setState(prevState => ({ isAdminFormVisible: !prevState.isAdminFormVisible }));
  }

  render() {
    const { activeTab, isAdminFormVisible } = this.state;
    const {
      admins,
      usersTable,
      companiesTable,
      offersTable,
      onChangeUsersTableSettings,
      onChangeCompaniesTableSettings,
      onChangeOffersTableSettings,
      onChangeNewAdminTextField,
      newAdmin,
      admin,
      onChangeRole,
      deleteAdmin,
    } = this.props;

    const createCheckboxes = (settings, onClickAction) => settings.map(item => (
      <Checkbox
        label={item.label}
        checked={item.value}
        onClick={() => onClickAction(item.label)}
      />
    ));

    const tablesSettings = [
      {
        header: 'Users',
        data: createCheckboxes(usersTable, onChangeUsersTableSettings),
      },
      {
        header: 'Companies',
        data: createCheckboxes(companiesTable, onChangeCompaniesTableSettings),
      },
      {
        header: 'Offers',
        data: createCheckboxes(offersTable, onChangeOffersTableSettings),
      },
    ];

    return (
      <div className={styles.Settings}>
        <PageTitle title="Settings" />
        {
          admin.role === 'super-admin' ?
            <Fragment>
              <TabBar>
                <Tab
                  active={activeTab === tabs._1}
                  title={tabs._1}
                  onClick={() => this.handleTabClick(tabs._1)}
                />
                <Tab
                  active={activeTab === tabs._2}
                  title={tabs._2}
                  onClick={() => this.handleTabClick(tabs._2)}
                />
              </TabBar>
              {
                activeTab === tabs._1 ?
                  <Fragment>
                    <Modal
                      isVisible={isAdminFormVisible}
                      onClose={this.onToggleAdminForm}
                      header="Create admin"
                    >
                      <AdminForm
                        onSubmit={this.handleSubmit}
                        onChange={onChangeNewAdminTextField}
                        values={newAdmin}
                        admin={newAdmin}
                        onSelectRole={onChangeRole}
                      />
                    </Modal>
                    <AdminsTable
                      data={admins}
                      onDelete={deleteAdmin}
                    />
                    <div className={styles.Settings__content__button}>
                      <Button onClick={this.onToggleAdminForm}>Add admin</Button>
                    </div>
                  </Fragment> :
                  <StaticTable columns={tablesSettings} />
              }
            </Fragment> :
            <div style={{ marginTop: '2rem' }}>
              <StaticTable columns={tablesSettings} />
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.session.admin,
  admins: state.admins.admins,
  newAdmin: state.admins.newAdmin,
  usersTable: state.settings.users,
  companiesTable: state.settings.companies,
  offersTable: state.settings.offers,
});

const mapDispatchToProps = dispatch => ({
  onChangeNewAdminTextField: (event, inputName) => dispatch(adminsActions.onChangeNewAdminTextField(event, inputName)),
  onChangeUsersTableSettings: setting => dispatch(settingsActions.onChangeUsersTableSettings(setting)),
  onChangeCompaniesTableSettings: setting => dispatch(settingsActions.onChangeCompaniesTableSettings(setting)),
  onChangeOffersTableSettings: setting => dispatch(settingsActions.onChangeOffersTableSettings(setting)),
  onChangeRole: role => dispatch(adminsActions.onChangeRole(role)),
  createNewAdmin: () => dispatch(adminsActions.createNewAdmin()),
  getAdmins: () => dispatch(adminsActions.getAdmins()),
  deleteAdmin: adminId => dispatch(adminsActions.deleteAdmin(adminId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
