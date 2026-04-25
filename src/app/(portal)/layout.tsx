import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

/** Portal uses `headers()` + session; avoid static prerender (and connector `headers()` during SSG). */
export const dynamic = 'force-dynamic';

const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST || 'app.lepa.cc';
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'lepa.cc';

const normalizeRole = (role?: string | null) => (role || '').toLowerCase();
const isLocalHost = (host?: string | null) =>
    host === 'localhost' || host === '127.0.0.1';
const isSystemRole = (role?: string | null) => {
    const r = normalizeRole(role);
    return r.includes('system') || r.includes('super') || r.includes('platform');
};
const isAgencyRole = (role?: string | null) => normalizeRole(role).includes('agency');
const isTenantRole = (role?: string | null) => !isSystemRole(role) && !isAgencyRole(role);
const getRoleHomePath = (role?: string | null) => {
    if (isSystemRole(role)) return '/system-admin/dashboard';
    if (isAgencyRole(role)) return '/agency/dashboard';
    return '/dashboard';
};
const slugifySubdomain = (value?: string | null) =>
    (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/^-+|-+$/g, '');

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const headerList = await headers();
    const proto = headerList.get('x-forwarded-proto') || 'https';
    const currentHost = (headerList.get('x-forwarded-host') || headerList.get('host') || '')
        .split(':')[0];

    if (!session?.user) {
        redirect('/auth/verify?phone=');
    }

    const role = session.user.role || '';
    const tenantHint = slugifySubdomain(session.user.hostHeader || session.user.schoolName);

    // Tenant users should remain on tenant subdomains.
    if (isTenantRole(role) && currentHost === APP_HOST && tenantHint && tenantHint !== 'app') {
        redirect(`${proto}://${tenantHint}.${BASE_DOMAIN}/dashboard`);
    }

    // System/agency users should remain on the app host.
    if ((isSystemRole(role) || isAgencyRole(role)) && currentHost && currentHost !== APP_HOST) {
        // Keep local development sessions on localhost instead of forcing app host.
        if (!isLocalHost(currentHost)) {
            redirect(`${proto}://${APP_HOST}${getRoleHomePath(role)}`);
        }
    }

    return <DashboardLayout>{children}</DashboardLayout>;
} 