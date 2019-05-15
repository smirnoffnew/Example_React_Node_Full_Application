import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValues } from 'redux-form';
import moment from 'moment';

import { Container, View, Content, Text } from 'native-base';
import { TextInput, ScrollView } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ContentScroll from '@/components/UI/ContentScroll';
import ContainerCenter from '@/components/UI/ContainerCenter';
import AppHeader from '@/components/AppHeader';
import ImageContainer from '@/components/ImageContainer';
import TextContent from '@/components/TextContent';
import Input from '@/components/Input';
import Checkbox from '@/components/UI/Checkbox';
import DropDown from '@/components/UI/DropDown';
import AddressField from '@/components/AddressField/Select';
import ButtonSquare from '@/components/UI/ButtonSquare';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import Confirm from '@/components/Confirm';
import styles, { datePickerStyles } from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { offerTitle } from '@/services/helpers/inputDataValidation';
import { actions as offerActions, selectors as offerSelectors } from '@/reducers/offer';
import { actions as businessOffersActions } from '@/reducers/businessOffers';
import { priceValidation, discountValidation } from '@/services/helpers/inputDataValidation';
import throwNotification from '@/services/helpers/notification';
import { DATE_FORMAT } from '@/services/helpers/formatDate';
import { previewOfferFromEditState, previewOfferFromCreateState } from '@/services/helpers/formatData';
import { GA_trackScreen } from '@/services/analytics';

class OfferManagement extends Component {
  static navigationOptions = ({ navigation }) => {
    const screenTitle = navigation.state.params.action === 'create' ?
      'Create offer' :
      'Edit offer';

    return {
      header: <AppHeader type="withBackButton" screenTitle={screenTitle} />,
    };
  }

  constructor(props) {
    super(props);
    this.action = this.props.navigation.getParam('action');
    this.offer = this.props.navigation.getParam('offer');
    if (this.offer) {
      const initialFormData = {
        title: this.offer.title,
      };

      if (this.offer.fullPrice) {
        initialFormData.fullPrice = `${this.offer.fullPrice}`;
      }

      if (this.offer.discount) {
        initialFormData.discount = `${this.offer.discount}`;
      }

      this.props.initialize(initialFormData);
    }
  }

  state = {
    isModalVisible: false,
    titleLayoutPosition: 0,
  }

  componentDidMount() {
    GA_trackScreen('Offer Management');
    this.props.getCategories();

    if (this.action === 'create') {
      this.props.resetOffer();
      this.props.setDefaultPlace();
    } else if (this.action === 'edit' && this.offer) {
      // this.props.setOfferToEdit(this.offer);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.newOffer && this.props.newOffer) {
      this.props.navigation.navigate('Offers');
      this.props.resetOffer();
    }
  }

  _toggleModalVisibility = () => {
    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  }

  _onPreview = () => {
    if (this.action === 'create') {
      const offer = previewOfferFromCreateState();
      this.props.navigation.navigate('OfferPreview', { offer });
    } else {
      const offer = previewOfferFromEditState();
      this.props.navigation.navigate('OfferPreview', { offer });
    }
  }

  _onSubmit = () => {
    if (!this.props.image.imageUrl) {
      throwNotification('Image is required');
      this._handleScroll(0);
    } else if (this.props.selectedCategory === 'Category') {
      throwNotification('Choose a category');
    } else if (this.props.description.length > 0 && this.props.description.length < 30) {
      throwNotification('If you want to add description make it at least 30 characters long');
    } else if (this.props.places.length === 0) {
      throwNotification('The offer must have at least one address');
    } else {
      if (this.action === 'create') {
        this.props.sendOffer(this.action);
      } else {
        this.props.updateOffer();
      }
    }
  }

  _onDeletePressHandler = () => {
    this._toggleModalVisibility();
    this.props.deleteOffer(this.offer.id);
    this.props.resetOffer();
    this.props.navigation.navigate('Offers');
  }

  _handleTitleLayout = event => {
    this.setState({ titleLayoutPosition: Math.round(event.nativeEvent.layout.y) });
    console.log(event.nativeEvent);
  }

  _handleScroll = y => {
    this.scrollView.scrollTo({ x: 0, y, animated: true });
  }

  render() {
    const {
      handleSubmit,
      dispatch,
      onChangeDescription,
      image,
      setImage,
      description,
      startDate,
      endDate,
      onDateChange,
      onToggleDateVisibility,
      isDateHidden,
      places,
      removePlace,
      addPlace,
      eraseAddress,
      editAddress,
      setPlace,
      categories,
      selectedCategory,
      setCategory,
      deleteOffer,
      // form,
    } = this.props;

    const startDateMin = moment().format(DATE_FORMAT);
    const startDateMax = moment(startDateMin).add(30, 'days').format(DATE_FORMAT);
    const endDateMin = moment(startDate).add(1, 'hours').format(DATE_FORMAT);
    const endDateMax = moment(startDate).add(30, 'days').format(DATE_FORMAT);

    return (
      <Container>
        <ScrollView contentContainerStyle={styles.content} ref={scrollView => { this.scrollView = scrollView; }}>
          <ContainerCenter>
            <TextContent style={{ marginTop: 20 }} type="subtext">Add photo</TextContent>
            <View style={styles.imageContainer}>
              <ImageContainer
                editable
                square
                onPress={setImage}
                imageUrl={image.imageUrl}
              />
            </View>
            <View style={styles.titleContainer} onLayout={this._handleTitleLayout}>
              <Field
                label="Title"
                name="title"
                onEraseText={() => reduxFormClear('offer', { title: '' }, dispatch)}
                component={Input}
                validate={offerTitle}
              />
            </View>
            <TextContent
              style={styles.labelContainer}
              type="subtext"
            >
              Description
            </TextContent>
            <Content showsVerticalScrollIndicator contentContainerStyle={styles.inputContainer}>
              <TextInput
                style={styles.input}
                multiline={true}
                numberOfLines={5}
                underlineColorAndroid="transparent"
                placeholderTextColor="#ccc"
                placeholder="Your description goes here"
                onChangeText={text => onChangeDescription(text)}
                value={description}
                maxLength={1000}
              />
            </Content>
            <Text style={{ fontSize: 12 }}>30 - 1000 characters (optional)</Text>
            <Text style={{ fontSize: 12 }}>{`${description.length} characters used`}</Text>
            <TextContent type="subtext" style={{ marginVertical: 10 }}>Choose date</TextContent>
            <View style={styles.dateContainer}>
              <DatePicker
                style={styles.datePicker}
                customStyles={datePickerStyles}
                date={startDate}
                showIcon={false}
                mode="datetime"
                placeholder="select date"
                format={DATE_FORMAT}
                minDate={startDateMin}
                maxDate={startDateMax}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => onDateChange(date, 'startDate')}
              />
              <TextContent type="regular" color="dark" style={{ marginHorizontal: 20 }}>
                to
              </TextContent>
              <DatePicker
                style={styles.datePicker}
                customStyles={datePickerStyles}
                date={endDate}
                showIcon={false}
                mode="datetime"
                placeholder="select date"
                format={DATE_FORMAT}
                minDate={endDateMin}
                maxDate={endDateMax}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => onDateChange(date, 'endDate')}
              />
            </View>
            <Checkbox
              onPress={onToggleDateVisibility}
              checked={isDateHidden}
              title="Don't show a date"
              position="left"
            />
            <View style={styles.priceContainer}>
              <View style={styles.priceInput}>
                <Field
                  label="Full price"
                  name="fullPrice"
                  additionalUnit="$"
                  keyboardType="numeric"
                  onEraseText={() => reduxFormClear('offer', { fullPrice: '' }, dispatch)}
                  component={Input}
                  validate={priceValidation}
                  maxLength={8}
                />
              </View>
              <View style={styles.discountInput}>
                <Field
                  label="Discount"
                  additionalUnit="%"
                  name="discount"
                  keyboardType="numeric"
                  onEraseText={() => reduxFormClear('offer', { discount: '' }, dispatch)}
                  component={Input}
                  validate={discountValidation}
                  maxLength={2}
                />
              </View>
            </View>
            <View style={styles.dropDownContainer}>
              <TextContent style={{ marginBottom: 20 }} type="subtext" color="default">
                Select a category
              </TextContent>
              <DropDown
                items={categories}
                selectedItem={selectedCategory}
                onChangeItem={setCategory}
              />
            </View>
            <View style={styles.addressContainer}>
              {
                places && places.map((place, index) => (
                  <AddressField
                    key={index}
                    index={index}
                    label={index === 0 ? 'Address' : null}
                    editAddress={editAddress}
                    storeAddress={place.addressWithoutZIP}
                    setAddress={setPlace}
                    eraseAddress={eraseAddress}
                    onRemove={() => removePlace(index)}
                  />
                ))
              }
              {
                places.length > 0 &&
                <TextContent type="subtext">
                  Start typing and choose one from results.
                </TextContent>
              }
              {
                places.length < 100 &&
                <ButtonTransparent
                  position="right"
                  onPress={addPlace}
                >
                  + Add more addresses
                </ButtonTransparent>
              }
            </View>
            <View style={styles.buttonsContainer}>
            <ButtonSquare
              light
              onPress={handleSubmit(this._onPreview)}
            >
              View
            </ButtonSquare>
            <View style={{ marginVertical: 10 }} />
            <ButtonSquare
              primary
              onPress={handleSubmit(this._onSubmit)}
            >
              Save
            </ButtonSquare>
            {
              this.action === 'edit' &&
              <Fragment>
                <View style={{ marginVertical: 10 }} />
                <ButtonSquare
                  danger
                  onPress={this._toggleModalVisibility}
                >
                  Delete
                </ButtonSquare>
                <Confirm
                  visible={this.state.isModalVisible}
                  onClose={this._toggleModalVisibility}
                  onConfirm={this._onDeletePressHandler}
                >
                  Are you sure?
                </Confirm>
              </Fragment>
            }
          </View>
          </ContainerCenter>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  image: offerSelectors.image(state),
  places: offerSelectors.places(state),
  description: offerSelectors.description(state),
  startDate: offerSelectors.startDate(state),
  endDate: offerSelectors.endDate(state),
  isDateHidden: offerSelectors.isDateHidden(state),
  categories: offerSelectors.categories(state),
  selectedCategory: offerSelectors.selectedCategory(state),
  newOffer: offerSelectors.newOffer(state),
});

const mapDispatchToProps = dispatch => ({
  setImage: () => dispatch(offerActions.setImage()),
  onChangeDescription: text => dispatch(offerActions.onChangeDescription(text)),
  onDateChange: (date, selector) => dispatch(offerActions.onDateChange(date, selector)),
  onToggleDateVisibility: () => dispatch(offerActions.onToggleDateVisibility()),
  setDefaultPlace: () => dispatch(offerActions.setDefaultPlace()),
  removePlace: index => dispatch(offerActions.removePlace(index)),
  addPlace: () => dispatch(offerActions.addPlace()),
  eraseAddress: index => dispatch(offerActions.eraseAddress(index)),
  editAddress: (text, index) => dispatch(offerActions.editAddress(text, index)),
  setPlace: (location, index) => dispatch(offerActions.setPlace(location, index)),
  getCategories: () => dispatch(offerActions.getCategories()),
  setCategory: value => dispatch(offerActions.setCategory(value)),
  sendOffer: action => dispatch(offerActions.sendOffer(action)),
  resetOffer: () => dispatch(offerActions.resetOffer()),
  setOfferToEdit: offer => dispatch(offerActions.setOfferToEdit(offer)),
  deleteOffer: offerId => dispatch(businessOffersActions.deleteOffer(offerId)),
  updateOffer: () => dispatch(offerActions.updateOffer()),
});

OfferManagement.propTypes = {
  image: PropTypes.shape({
    data: PropTypes.shape({
      uri: PropTypes.string,
      type: PropTypes.string,
      name: PropTypes.string,
    }),
    imageUrl: PropTypes.string,
  }).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  isDateHidden: PropTypes.bool,
  selectedCategory: PropTypes.string.isRequired,
  places: PropTypes.arrayOf(PropTypes.shape({
    addressWithoutZIP: PropTypes.string.isRequired,
  })),
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,

  onChangeDescription: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onToggleDateVisibility: PropTypes.func.isRequired,
  removePlace: PropTypes.func,
  addPlace: PropTypes.func,
  eraseAddress: PropTypes.func,
  editAddress: PropTypes.func,
  setPlace: PropTypes.func,
  setCategory: PropTypes.func,
  deleteOffer: PropTypes.func,
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'offer' })(OfferManagement)
);
