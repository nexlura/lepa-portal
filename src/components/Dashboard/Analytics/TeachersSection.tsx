'use client';

import { AcademicCapIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface TeacherData {
    id: string;
    name: string;
    hasClasses: boolean;
    studentCount: number;
}

interface TeachersSectionProps {
    teachers: TeacherData[];
    averageStudentsPerTeacher: number;
}

const TeachersSection = ({ teachers, averageStudentsPerTeacher }: TeachersSectionProps) => {
    const teachersWithClasses = teachers.filter(t => t.hasClasses);
    const teachersWithoutClasses = teachers.filter(t => !t.hasClasses);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Teachers</h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">Total Teachers</p>
                            <p className="text-2xl font-semibold text-gray-900">{teachers.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">With Classes</p>
                            <p className="text-2xl font-semibold text-gray-900">{teachersWithClasses.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-orange-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">Without Classes</p>
                            <p className="text-2xl font-semibold text-gray-900">{teachersWithoutClasses.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Average Students per Teacher */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Average Students per Teacher</span>
                    </div>
                    <span className="text-2xl font-semibold text-gray-900">
                        {averageStudentsPerTeacher > 0 ? averageStudentsPerTeacher.toFixed(1) : 'N/A'}
                    </span>
                </div>
            </div>

            {/* Teachers Table */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Teacher Assignment Status</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teacher Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Students
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teachers.slice(0, 10).map((teacher) => (
                                <tr key={teacher.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {teacher.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.hasClasses
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                }`}
                                        >
                                            {teacher.hasClasses ? 'Assigned' : 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {teacher.studentCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {teachers.length > 10 && (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            Showing 10 of {teachers.length} teachers
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeachersSection;

