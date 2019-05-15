import React from 'react';
import PropTypes from 'prop-types';

import Input from 'components/Input';
import Button from 'components/UI/Button';
import RadioButtons from 'components/UI/RadioButtons';
import styles from './styles.module.scss';

export const AdminForm = ({ onSubmit, onChange, values, admin, onSelectRole }) => {
  const enabled = values.email.length > 3 &&
    values.name.length > 0;

  return (
    <div className={styles.AdminForm}>
      <div className={styles.AdminForm__form}>
        <Input
          placeholder="Email"
          onChange={e => onChange(e, 'email')}
          value={values.email}
        />
        <Input
          placeholder="Name"
          onChange={e => onChange(e, 'name')}
          value={values.name}
        />
        <Input
          placeholder="Password"
          onChange={e => onChange(e, 'password')}
          value={values.password}
        />
        <RadioButtons
          values={admin.roles}
          onSelect={onSelectRole}
        />
        <Button
          disabled={!enabled}
          block
          onClick={onSubmit}
        >
          Save
      </Button>
      </div>
    </div>
  );
};
