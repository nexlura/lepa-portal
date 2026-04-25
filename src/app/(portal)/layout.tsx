import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/** Portal uses `headers()` + session; avoid static prerender (and connector `headers()` during SSG). */
export const dynamic = 'force-dynamic';

const normalizeRole = (role?: string | null) => (role || '').toLowerCase();
const isSystemRole = (role?: string | null) => {
    const r = normalizeRole(role);
    return r.includes('system') || r.includes('super') || r.includes('platform');
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/auth/verify?phone=');
    }

    return <DashboardLayout>{children}</DashboardLayout>;
} 