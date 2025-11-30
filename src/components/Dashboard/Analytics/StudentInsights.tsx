'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface StudentInsightsProps {
    genderDistribution: {
        male: number;
        female: number;
        other?: number;
    };
    ageRanges?: {
        range: string;
        count: number;
    }[];
}

const RADIAN = Math.PI / 180;
const COLORS = ['#67cbdf', '#317787', '#1a3d44'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

const StudentInsights = ({ genderDistribution, ageRanges }: StudentInsightsProps) => {
    // Prepare gender data for pie chart
    const genderData = [
        { name: 'Male', value: genderDistribution.male },
        { name: 'Female', value: genderDistribution.female },
        ...(genderDistribution.other && genderDistribution.other > 0
            ? [{ name: 'Other', value: genderDistribution.other }]
            : []),
    ].filter(item => item.value > 0);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Student Insights</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Gender Distribution</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                iconSize={10}
                                wrapperStyle={{ paddingLeft: 20 }}
                            />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {genderData.map((item) => (
                            <div key={item.name} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name}:</span>
                                <span className="font-medium text-gray-900">{item.value} students</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Age Ranges */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Age Distribution</h4>
                    {ageRanges && ageRanges.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={ageRanges} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#69C7D7" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {ageRanges.map((range) => (
                                    <div key={range.range} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{range.range}:</span>
                                        <span className="font-medium text-gray-900">{range.count} students</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            <p>Age range data not available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentInsights;

