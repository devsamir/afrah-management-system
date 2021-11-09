export const getValueNumber = (number: string) => {
  return number.split("Rp. ").reverse()[0];
};
export const currencyUi = new Intl.NumberFormat("id", {
  style: "currency",
  currency: "IDR",
});
export const numberUi = new Intl.NumberFormat("id-ID", {});
export const formatCurrency = (number: number) => {
  return currencyUi.format(number).replace(/\D00(?=\D*$)/, "");
};
export const formatNumber = (number: number) => {
  return numberUi.format(number).replace(/\D00(?=\D*$)/, "");
};
