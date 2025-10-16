export const formatCurrency = (value, locale = 'uk-UA', currency = 'USD') => {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(num);
};