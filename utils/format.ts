export const formatToman = (amount: bigint) =>
  new Intl.NumberFormat("fa-IR").format(amount);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
