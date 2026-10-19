export function buildWhatsappLink(
  phoneNumber: string,
  message: string,
): string {
  const sanitized = phoneNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encoded}`;
}
