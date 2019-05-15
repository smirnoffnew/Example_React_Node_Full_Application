import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 6,
    paddingTop: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 4,
  },
  image: {
    flex: 1,
    width: null,
    resizeMode: 'cover',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,

  },
  discount: {
    flex: 1,
    height: appTheme.windowSize * 0.08,
    marginLeft: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountLive: { backgroundColor: appTheme.primary },
  discountPast: { backgroundColor: appTheme.default },
  discountText: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
    fontWeight: '900',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  fullPrice: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPriceText: {
    color: appTheme.default,
    fontSize: appTheme.textSizes.small,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  newPriceTextLive: {
    color: appTheme.primary,
    fontSize: appTheme.textSizes.regular,
    fontWeight: '900',
  },
  newPriceTextPast: {
    color: appTheme.default,
    fontSize: appTheme.textSizes.regular,
    fontWeight: '900',
  },
  endDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
    fontSize: appTheme.textSizes.regular + 4,
    color: appTheme.default,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonColumn: {
    width: '48%',
  },
  buttonRow: {
    width: '100%',
  },
});

export default styles;
