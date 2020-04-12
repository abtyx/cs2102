export function toReadable(moneyCents) {
  const dollars = moneyCents / 100;
  return `$${dollars.toFixed(2)}`;
}
