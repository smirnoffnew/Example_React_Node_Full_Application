import { change, untouch } from 'redux-form';

const reduxFormClear = (formName, fieldsObject, dispatch) => {
  Object.keys(fieldsObject).forEach(fieldName => {
    dispatch(change(formName, fieldName, fieldsObject[fieldName]));
    dispatch(untouch(formName, fieldName));
  });
};

export default reduxFormClear;
