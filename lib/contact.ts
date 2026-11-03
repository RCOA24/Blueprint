export const contactAddress = {
  unit: 'Unit 3C',
  building: 'Amerigo House',
  street: '80 Shedden Road',
  square: 'Elizabethan Square',
  city: 'Grand Cayman',
  postalCode: 'KY1-1503',
  country: 'Cayman Islands'
} as const;

export const addressLines = [
  `${contactAddress.unit}, ${contactAddress.city}, ${contactAddress.street},`,
  `${contactAddress.square}, ${contactAddress.building},`,
  `${contactAddress.postalCode}, ${contactAddress.country}`
];

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLines.join(', '))}`;
