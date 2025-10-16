'use client'

import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={isSidebarCollapsed}
                onDesktopToggleSidebar={() => setIsSidebarCollapsed(v => !v)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 