export function formatPriceXof(value: number): string {
  const rounded = Math.round(value);
  return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} XOF`;
}

export function formatMileage(value: number): string {
  if (value === 0) return "0 km";

  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1);
    return `${formatted.replace(".", ",")} k km`;
  }

  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km`;
}
