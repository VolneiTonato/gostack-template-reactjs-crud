export const currencyFormatterPTBR = (value: string | number): string => {
  if (!Number(value)) return '';

  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value) / 100);

  return `${amount}`;
};
