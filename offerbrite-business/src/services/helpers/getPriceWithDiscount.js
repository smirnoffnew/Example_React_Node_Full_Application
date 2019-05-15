export default function getPriceWithDiscount(price, discount) {
  const newPrice = price - (price / 100 * discount);
  return newPrice.toFixed(2);
}
