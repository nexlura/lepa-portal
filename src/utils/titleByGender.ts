export function getTitleFromGender(gender: string | undefined): string {
  if (!gender) return '';

  const normalized = gender.trim().toLowerCase();

  switch (normalized) {
    case 'male':
    case 'm':
      return 'Mr';

    case 'female':
    case 'f':
      return 'Ms';

    default:
      return '';
  }
}
