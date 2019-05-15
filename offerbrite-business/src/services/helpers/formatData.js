import store from '@/store';
import { convertAddressDataToString } from '@/services/helpers/geolocation';
import updateTime from '@/services/helpers/validateTime';
import toCapitalize from '@/services/helpers/toCapitalize';
import moment from 'moment';

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

export const prepareOfferData = () => {
  const offer = store.getState().offer;
  const formValues = store.getState().form.offer.values;
  const businessItem = store.getState().business.businessItem;

  const offerLifeTime = updateTime({
    startDate: offer.startDate,
    endDate: offer.endDate,
  });

  const data = {
    title: formValues.title,
    locations: offer.places.map(place => ({
      position: { ...place.position },
      address: { ...place.address },
    })),
    isDateHidden: offer.isDateHidden,
    category: offer.selectedCategory,
    ...offerLifeTime,
  };

  if (offer.description) {
    data.description = offer.description;
  }

  if (formValues.fullPrice) {
    data.fullPrice = formValues.fullPrice;
  }

  if (formValues.discount) {
    data.discount = formValues.discount;
  }

  if (!data.locations.length) {
    data.locations = [{
      address: businessItem.locations[0].address,
      position: businessItem.locations[0].position,
    }];
  }

  return data;
};

export const setInitialOffer = offer => {
  const places = offer.locations.map(place => {
    const addressWithoutZIP = convertAddressDataToString(place.address);
    return {
      ...place,
      addressWithoutZIP,
    };
  });

  const initialData = {
    startDate: offer.startDate,
    endDate: offer.endDate,
    category: offer.category,
    places,
    image: { imageUrl: offer.imagesUrls[0] },
    isDateHidden: offer.isDateHidden,
  };

  if (offer.description) {
    initialData.description = offer.description;
  }

  if (offer.fullPrice) {
    initialData.fullPrice = offer.fullPrice;
  }

  if (offer.discount) {
    initialData.discount = offer.discount;
  }

  return initialData;
};

export const compareOfferState = () => {
  const prevData = store.getState().offer.prevOffer;
  const currentData = store.getState().offer;
  const formValues = store.getState().form.offer.values;

  const nextOffer = {
    ...formValues,
    description: currentData.description,
    imagesUrls: [currentData.image.imageUrl],
    locations: currentData.places.map(place => ({
      position: { ...place.position },
      address: { ...place.address },
    })),
    category: currentData.selectedCategory,
    isDateHidden: currentData.isDateHidden,
  };

  const data = {
    ...updateTime({
      startDate: currentData.startDate,
      endDate: currentData.endDate,
    }),
  };

  for (let [key, value] of Object.entries(nextOffer)) {
    if (key === 'imagesUrls' && nextOffer[key][0] === prevData[key][0]) {
      continue;
    } else if (key === 'fullPrice') {
      if (value !== `${prevData[key]}`) {
        data.fullPrice = value === '' ? 0 : value;
      } else {
        continue;
      }
    } else if (key === 'discount') {
      if (value !== `${prevData[key]}`) {
        data.discount = value === '' ? 0 : value;
      } else {
        continue;
      }
    } else if (key === 'locations') {
      const validLocations = nextOffer.locations.filter(place => (
        place.position.hasOwnProperty('latitude') && place.position.hasOwnProperty('longitude')
      ));
      if (prevData[key].length !== nextOffer[key].length) {
        data.locations = validLocations;
      } else {
        const filteredLocations = validLocations.filter((place, index) => {
          return place.position.latitude !== prevData[key][index].position.latitude ||
            place.position.longitude !== prevData[key][index].position.longitude;
        });
        if (filteredLocations.length > 0) {
          data.locations = validLocations;
        } else {
          continue;
        }
      }
    } else if (key === 'description' && value === '') {
      data[key] = value;
    } else if (prevData[key] !== value && value !== '') {
      data[key] = typeof value === 'string' ? value.trim() : value;
    }
  }

  return data;
};

export const previewOfferFromEditState = () => {
  const { offer } = store.getState();
  const formValues = store.getState().form.offer.values;

  return {
    ...offer.prevOffer,
    imagesUrls: [offer.image.imageUrl || offer.image.data.uri],
    title: formValues.title,
    description: offer.description,
    fullPrice: formValues.fullPrice ? formValues.fullPrice : 0,
    discount: formValues.discount ? formValues.discount : 0,
    category: offer.selectedCategory,
    isDateHidden: offer.isDateHidden,
    locations: offer.places,
    endDate: offer.endDate,
    past: moment(offer.endDate).isBefore(moment()),
    ...createTags(offer.selectedCategory, offer.places),
  };
};

export const previewOfferFromCreateState = () => {
  const { offer } = store.getState();
  const formValues = store.getState().form.offer.values;
  const business = store.getState().business.businessItem;
  return {
    ...createTags(offer.selectedCategory, offer.places),
    imagesUrls: [offer.image.imageUrl || offer.image.data.uri],
    title: formValues.title.length > 0 ? formValues.title : 'Add title',
    description: offer.description,
    fullPrice: formValues.fullPrice ? formValues.fullPrice : 0,
    discount: formValues.discount ? formValues.discount : 0,
    category: offer.selectedCategory,
    isDateHidden: offer.isDateHidden,
    locations: offer.places,
    endDate: offer.endDate,
    past: moment(offer.endDate).isBefore(moment()),
    business,
  };
};

export const createTags = (category, places) => {
  const tags = [toCapitalize(category)];
  let locationTag;

  places.forEach(location => {
    let { city, state, region, country } = location.address;
    locationTag = city || state || region || country;
    tags.push(locationTag);
  });

  return { tags };
};
