// export const calculateDiscount = (dish) => {
//   return dish.sale?.type == "amount"
//     ? dish.sale.discount
//     : dish.sale?.type == "percent"
//     ? (dish.price / 100) * dish.sale.discount
//     : 0;
// };

export const calculatedPrice = (dish) => {
  // return getPreciseCurrency(dish.price - calculateDiscount(dish));
  return dish.price;
};

export const calculatedCartPrice = (dish) => {
  // return getPreciseCurrency(dish.price - calculateDiscount(dish));
  return dish.product.price;
};

export const getPreciseCurrency = (price) => {
  return parseFloat(price.toFixed(2));
};
