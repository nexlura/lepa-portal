'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface ClassData {
    id: string;
    name: string;
    studentCount: number;
    hasTeacher: boolean;
}

interface ClassOverviewProps {
    classes: ClassData[];
}

const ClassOverview = ({ classes }: ClassOverviewProps) => {
    // Prepare data for bar chart
    const chartData = classes.map(cls => ({
        name: cls.name,
        students: cls.studentCount,
    }));

    // Separate classes with and without teachers
    const classesWithTeacher = classes.filter(cls => cls.hasTeacher);
    const classesWithoutTeacher = classes.filter(cls => !cls.hasTeacher);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Class Overview</h3>

            {/* Bar Chart: Students per class */}
            <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Students per Class</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#69C7D7" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Lists: Classes with/without teachers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Classes with assigned teacher */}
                <div>
                    <div className="flex items-center mb-3">
                        <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-700">
                            Classes with Teacher ({classesWithTeacher.length})
                        </h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {classesWithTeacher.length > 0 ? (
                            classesWithTeacher.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="flex items-center justify-between p-2 bg-green-50 rounded text-sm"
                                >
                                    <span className="text-gray-700">{cls.name}</span>
                                    <span className="text-gray-500">{cls.studentCount} students</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 p-2">No classes with assigned teachers</p>
                        )}
                    </div>
                </div>

                {/* Classes without teacher */}
                <div>
                    <div className="flex items-center mb-3">
                        <BookOpenIcon className="h-5 w-5 text-orange-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-700">
                            Classes without Teacher ({classesWithoutTeacher.length})
                        </h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {classesWithoutTeacher.length > 0 ? (
                            classesWithoutTeacher.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm"
                                >
                                    <span className="text-gray-700">{cls.name}</span>
                                    <span className="text-gray-500">{cls.studentCount} students</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 p-2">All classes have assigned teachers</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassOverview;

