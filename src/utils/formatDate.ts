export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
