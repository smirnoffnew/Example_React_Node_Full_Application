export const convertLocation = address => {
  const { building, street, city, state, region, country } = address;
  // building - street - city - state || region - country
  return `${building ? building + ' ' : ''}${street ? street + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ', ' : region ? region + ', ' : ''}${country ? country : ''}`;
};
