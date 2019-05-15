import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.lightDark,
  },
  imageContainer: {
    flex: 1,
    minHeight: 300,
    position: 'relative',
    backgroundColor: appTheme.primaryLight,
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
  buttonContainer: {
    position: 'absolute',
    width: '42%',
    top: '5%',
    right: '5%',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: '5%',
    marginTop: '2%',
  },
  discount: {
    flex: 1,
    paddingVertical: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.danger,
    borderRadius: 5,
  },
  discountText: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular + 5,
    fontWeight: '900',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
    justifyContent: 'flex-end',
  },
  fullPrice: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPriceText: {
    color: appTheme.default,
    fontSize: appTheme.textSizes.subtext,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2%',
  },
  newPriceText: {
    color: appTheme.danger,
    fontSize: appTheme.textSizes.regular + 8,
    fontWeight: '900',
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
    marginVertical: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  tag: {
    paddingVertical: '1%',
    paddingHorizontal: '4%',
    borderWidth: 1,
    borderColor: appTheme.default,
    borderRadius: 5,
    marginRight: '2%',
    marginTop: '2%',
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
    borderRadius: 3,
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
});

export default styles;
