import { auth } from '@/auth';
import SettingsPageClient from '@/components/Settings/SettingsPageClient';

export default async function SettingsPage() {
    const session = await auth();
    const userId = session?.user?.userId;
    const role = (session?.user?.role || '').toLowerCase();
    const canManageTenants =
        role.includes('system') ||
        role.includes('super') ||
        role.includes('agency') ||
        role.includes('platform');

    if (!userId) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences.</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-sm text-red-600">Unable to load account settings. Please sign in again.</p>
                </div>
            </div>
        );
    }

    return (
        <SettingsPageClient
            userId={userId}
            initialName={session?.user?.name}
            initialEmail={session?.user?.email}
        />
    );
} 