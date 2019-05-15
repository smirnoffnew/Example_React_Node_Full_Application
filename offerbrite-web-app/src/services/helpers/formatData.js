/**
 * Returns data object converted in FormData object
 * @param {object} data - Data which will be converted in FormData object
 * @param {string} excludeKey - Identifier which won't be included in final formdata object
 * @returns {FormData}
 */
export const makeFormData = (data, excludeKey = null) => {
  let formData = new FormData();

  for (let [key, value] of Object.entries(data)) {
    if (key !== excludeKey) {
      formData.append(`${key}`, `${value}`);
    }
  }

  return formData;
};