import React from 'react';
import PropTypes from 'prop-types';

import Input from 'components/Input';
import Button from 'components/UI/Button';
import styles from './styles.module.scss';

export const CompanyForm = ({ onSubmit, onChange, values }) => {
  const enabled = values.email.length > 3 && values.brandName.length > 0;

  return (
    <div className={styles.CompanyForm}>
      <div className={styles.CompanyForm__form}>
        <Input
          placeholder="Email"
          onChange={e => onChange(e, 'email')}
          value={values.email}
        />
        <Input
          placeholder="Brand name"
          onChange={e => onChange(e, 'brandName')}
          value={values.brandName}
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
