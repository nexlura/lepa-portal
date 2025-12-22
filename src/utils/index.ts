export function formatPhoneNumber(input: string | number): string {
  const str = String(input).replace(/\D/g, ''); // remove non-digits

  // Expect Sierra Leone format: 232 + 8 digits
  // if (!str.startsWith('232') || str.length !== 11) {
  //   throw new Error('Invalid Sierra Leone phone number');
  // }

  const countryCode = str.slice(0, 3); // 232
  const areaCode = str.slice(3, 5); // 76
  const part1 = str.slice(5, 8); // 984
  const part2 = str.slice(8, 11); // 532

  return `+${countryCode} (${areaCode}) ${part1} ${part2}`;
}
