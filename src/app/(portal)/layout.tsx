import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

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