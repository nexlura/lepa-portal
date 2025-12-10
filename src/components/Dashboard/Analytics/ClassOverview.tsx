'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface ClassData {
    id: string;
    name: string;
    studentCount: number;
    hasTeacher: boolean;
}

interface TeacherWithClasses {
    teacherId: string;
    teacherName: string;
    classCount: number;
    classNames: string[];
}

interface ClassOverviewProps {
    classes: ClassData[];
    teachersWithClasses?: TeacherWithClasses[];
    classesWithTeacherCount?: number;
    classesWithoutTeacherCount?: number;
    classesWithoutTeachers?: ClassData[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
                <p className="text-sm text-primary-600">
                    <span className="font-medium">{payload[0].value}</span> students
                </p>
            </div>
        );
    }
    return null;
};

const ClassOverview = ({ 
    classes, 
    teachersWithClasses = [], 
    classesWithTeacherCount = 0,
    classesWithoutTeacherCount = 0,
    classesWithoutTeachers = []
}: ClassOverviewProps) => {
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);

    // Prepare data for bar chart
    const chartData = classes.map(cls => ({
        name: cls.name,
        students: cls.studentCount,
        hasTeacher: cls.hasTeacher,
    }));

    // Use provided counts or calculate from classes
    const classesWithTeacher = classesWithTeacherCount || classes.filter(cls => cls.hasTeacher).length;
    const classesWithoutTeacher = classesWithoutTeacherCount || classes.filter(cls => !cls.hasTeacher).length;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Class Overview</h3>

            {/* Bar Chart: Students per class */}
            <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Students per Class</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                        data={chartData} 
                        margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                        onMouseMove={(state) => {
                            if (state?.activePayload?.[0]?.payload?.name) {
                                setHoveredBar(state.activePayload[0].payload.name);
                            }
                        }}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={80}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(105, 199, 215, 0.1)' }} />
                        <Bar 
                            dataKey="students" 
                            radius={[8, 8, 0, 0]}
                            animationDuration={800}
                            animationBegin={0}
                        >
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={hoveredBar === entry.name ? '#4d9faf' : entry.hasTeacher ? '#69C7D7' : '#b3e5ef'}
                                    style={{ transition: 'fill 0.2s ease' }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Lists: Teachers with classes / Classes without teachers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teachers with assigned classes */}
                <div>
                    <div className="flex items-center mb-3">
                        <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-700">
                            Classes with Teacher ({classesWithTeacher})
                        </h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {teachersWithClasses.length > 0 ? (
                            teachersWithClasses.map((teacher) => {
                                // Format class names: show first 2, then "+X more" if more than 2
                                const displayClasses = teacher.classNames.length <= 2
                                    ? teacher.classNames.join(', ')
                                    : `${teacher.classNames.slice(0, 2).join(', ')}, +${teacher.classNames.length - 2} more`;
                                
                                return (
                                    <div
                                        key={teacher.teacherId}
                                        className="p-2 bg-green-50 rounded text-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <span className="text-gray-700 font-medium">{teacher.teacherName}</span>
                                        </div>
                                        <div className="mt-1 text-gray-600 text-xs">
                                            {displayClasses}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-500 p-2">No teachers with assigned classes</p>
                        )}
                    </div>
                </div>

                {/* Classes without teacher */}
                <div>
                    <div className="flex items-center mb-3">
                        <BookOpenIcon className="h-5 w-5 text-orange-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-700">
                            Classes without Teacher ({classesWithoutTeacher})
                        </h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {classesWithoutTeachers.length > 0 ? (
                            classesWithoutTeachers.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm"
                                >
                                    <span className="text-gray-700">{cls.name}</span>
                                    <span className="text-gray-500">{cls.studentCount} {cls.studentCount === 1 ? 'student' : 'students'}</span>
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

