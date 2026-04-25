export const normalizeRole = (role?: string | null) => (role || '').toLowerCase();

export const getRoleHomePath = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);
  if (
    normalizedRole.includes('system') ||
    normalizedRole.includes('super') ||
    normalizedRole.includes('platform')
  ) {
    return '/system-admin/dashboard';
  }
  if (normalizedRole.includes('agency')) {
    return '/agency/dashboard';
  }
  return '/dashboard';
};

export const isSystemRoleHome = (path: string) =>
  path.startsWith('/system-admin');

export const isAgencyRoleHome = (path: string) => path.startsWith('/agency');
