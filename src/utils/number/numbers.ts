export const onlyNumber = (value: string | number): number => {
  return Number(value.toString().replace(/\D+/gi, ''));
};

export const currencyFormatterPTBR = (value: string | number): string => {
  if (!Number(value)) return '';

  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));

  return `${amount}`;
};
