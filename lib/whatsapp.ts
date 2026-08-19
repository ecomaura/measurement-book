// Builds a wa.me deep link from whatever format the contact number was
// typed in (with/without +91, spaces, dashes, etc.)
export function whatsappLink(contact: string | null | undefined): string | null {
  if (!contact) return null;

  const digits = contact.replace(/[^\d]/g, "");
  if (!digits) return null;

  // Assume India (91) when a bare 10-digit number was entered.
  // Otherwise trust whatever country code the user already included.
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits;

  return `https://wa.me/${withCountryCode}`;
}
