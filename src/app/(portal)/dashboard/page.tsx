'use client';

import Calendar from '@/components/Dashboard/Calender';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import DashboardStats from '@/components/Dashboard/Analytics/Stats';
import AdmissionByClass from '@/components/Dashboard/Analytics/AdmissionByClass';
import AdmissionTimeline from '@/components/Dashboard/Analytics/AdmissionTimeline';
import AdmissionsByGender from '@/components/Dashboard/Analytics/AdmissionByGender';

export default function AdminDashboard() {
    // Sample data for charts

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome to your Lepa admin dashboard. Here&apos;s an overview of your school&apos;s data.
                </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main content - Left column (3/4 width) */}
                <div className="lg:col-span-3 space-y-6 ">
                    {/* Stats grid */}
                    <DashboardStats />

                    <div className="grid grid-cols-1 gap-6 ">
                        {/* Admission Timeline Chart */}
                        <AdmissionTimeline />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Admission by Class Chart */}
                        <AdmissionByClass />
                        <AdmissionsByGender />
                    </div>
                </div>

                {/* Sidebar - Right column (1/4 width) */}
                <div className="space-y-6">
                    {/* Calendar */}
                    <Calendar />

                    {/* Recent Activity */}
                    <RecentActivities />
                </div>
            </div>
        </div>
    );
}