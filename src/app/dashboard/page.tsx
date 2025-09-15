'use client';

import AdmissionTimeline from '@/components/Dashboard/AdmissionTimeline';
import Calendar from '@/components/Dashboard/Calender';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import DashboardStats from '@/components/Dashboard/Stats';

export default function AdminDashboard() {
    // Sample data for charts
    const admissionTimeline = [
        { month: 'Jan', applications: 45 },
        { month: 'Feb', applications: 67 },
        { month: 'Mar', applications: 89 },
        { month: 'Apr', applications: 123 },
        { month: 'May', applications: 156 },
        { month: 'Jun', applications: 134 },
    ];

    const genderData = [
        { label: 'Male', count: 678, percentage: 55 },
        { label: 'Female', count: 556, percentage: 45 },
    ];

    const applicationStatus = [
        { status: 'Pending', count: 156, color: 'bg-yellow-500', percentage: 34 },
        { status: 'Accepted', count: 234, color: 'bg-green-500', percentage: 51 },
        { status: 'Rejected', count: 66, color: 'bg-red-500', percentage: 15 },
    ];

    const classAdmissions = [
        { class: 'Class 1', students: 45, capacity: 50 },
        { class: 'Class 2', students: 42, capacity: 50 },
        { class: 'Class 3', students: 48, capacity: 50 },
        { class: 'Class 4', students: 38, capacity: 50 },
        { class: 'Class 5', students: 35, capacity: 50 },
        { class: 'Class 6', students: 40, capacity: 50 },
    ];

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
                <div className="lg:col-span-3 space-y-6">
                    {/* Stats grid */}
                    <DashboardStats />

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Admission Timeline Chart */}
                        <AdmissionTimeline />

                        {/* Students by Gender Chart */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Students by Gender</h3>
                            <div className="space-y-4">
                                {genderData.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                            <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                                        </div>
                                        <div className="bg-gray-200 rounded-full h-4">
                                            <div
                                                className={`h-4 rounded-full ${item.label === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                                                    }`}
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Application Status Chart */}
                        {/* <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
                            <div className="space-y-4">
                                {applicationStatus.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded ${item.color}`}></div>
                                            <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-gray-900">{item.count}</div>
                                            <div className="text-xs text-gray-500">{item.percentage}%</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 bg-gray-200 rounded-full h-3 flex overflow-hidden">
                                    {applicationStatus.map((item, index) => (
                                        <div
                                            key={item.status}
                                            className={item.color}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div> */}

                        {/* Admission by Class Chart */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Admission by Class</h3>
                            <div className="space-y-3">
                                {classAdmissions.map((item) => {
                                    const percentage = (item.students / item.capacity) * 100;
                                    return (
                                        <div key={item.class}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700">{item.class}</span>
                                                <span className="text-sm text-gray-500">
                                                    {item.students}/{item.capacity}
                                                </span>
                                            </div>
                                            <div className="bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-indigo-500 h-3 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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