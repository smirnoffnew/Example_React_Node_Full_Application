import React from 'react';
import PropTypes from 'prop-types';

import Input from 'components/Input';
import Button from 'components/UI/Button';
import styles from './styles.module.scss';

export const UserForm = ({ onSubmit, onChange, values }) => {
  const enabled = values.email.length > 3 && values.username.length > 0;

  return (
    <div className={styles.UserForm}>
      <div className={styles.UserForm__form}>
        <Input
          placeholder="Email"
          onChange={e => onChange(e, 'email')}
          value={values.email}
        />
        <Input
          placeholder="Name"
          onChange={e => onChange(e, 'username')}
          value={values.username}
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
