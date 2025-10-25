'use client'

import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                collapsed={isSidebarCollapsed}
                onDesktopToggleSidebar={() => setIsSidebarCollapsed(v => !v)}
            />

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    onMenuClick={() => setIsMenuOpen(true)}
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

export default DashboardLayout