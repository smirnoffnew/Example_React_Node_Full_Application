import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    flex: 1,
    minHeight: 300,
    position: 'relative',
  },
  image: {
    width: null,
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: '100%',
    height: appTheme.windowSize * 0.2,
  },
  buttonBack: {
    position: 'absolute',
    top: '5%',
    left: '2%',
    zIndex: 2,
  },
  buttonBackIcon: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
  },
  buttonsContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    zIndex: 400,
  },
  priceContainer: {
    flex: 1,
    paddingHorizontal: '5%',
    marginLeft: 15,
    marginVertical: '2%',
  },
  content: {
    paddingHorizontal: '5%',
  },
  endDateContainer: {
    marginTop: '2%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: '4%',
    fontSize: appTheme.textSizes.regular + 4,
    color: appTheme.default,
  },
  tagsContainer: {
    marginBottom: '4%',
    marginTop: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sectionTitleContainer: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    backgroundColor: appTheme.lightDark,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#ccc',
    borderBottomColor: '#ccc',
  },
  descriptionContainer: {
    paddingHorizontal: '5%',
    paddingVertical: '4%',
  },
  contactsContainer: {
    alignItems: 'center',
    paddingVertical: '2%',
  },
  logoContainer: {
    paddingVertical: '2%',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '1%',
    paddingBottom: '2%',
    paddingHorizontal: '2%',
    borderRadius: 4,
  },
  badgeVerified: {
    backgroundColor: appTheme.primary,
  },
  badgeIcon: {
    marginRight: '2%',
    fontSize: appTheme.textSizes.regular,
    color: appTheme.light,
  },
  badgeTextVerified: {
    fontSize: appTheme.textSizes.subtext,
    color: appTheme.light,
  },
  badgeUnverified: {
    backgroundColor: appTheme.lightDark,
  },
  badgeTextUnverified: {
    fontSize: appTheme.textSizes.subtext,
    color: appTheme.default,
  },
  textUnderlined: {
    fontSize: appTheme.textSizes.small,
    color: appTheme.danger,
    textDecorationLine: 'underline',
  },
  mapContainer: {
    flex: 1,
  },
  locationContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  location: {
    marginBottom: 20,
  },
});

export default styles;
