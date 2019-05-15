import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: -15,
  },
  discount: {
    flex: 1,
    marginLeft: -15,
    paddingTop: 7,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.danger,
  },
  discountText: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
    fontWeight: '900',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    paddingBottom: 10,
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
  newPriceText: {
    color: appTheme.danger,
    fontSize: appTheme.textSizes.regular,
    fontWeight: '700',
  },
});
