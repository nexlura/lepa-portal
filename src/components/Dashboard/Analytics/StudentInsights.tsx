'use client';

import { useState } from 'react';
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
const GENDER_COLORS = ['#69C7D7', '#839CD2', '#ACF8A6'];

// Custom tooltip for pie chart
const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
                <p className="text-sm text-primary-600">
                    <span className="font-medium">{payload[0].value}</span> students
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {((payload[0].payload.percent ?? 0) * 100).toFixed(1)}% of total
                </p>
            </div>
        );
    }
    return null;
};

// Custom tooltip for bar chart
const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">{payload[0].payload.range}</p>
                <p className="text-sm text-primary-600">
                    <span className="font-medium">{payload[0].value}</span> students
                </p>
            </div>
        );
    }
    return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            fontSize={12}
            fontWeight="semibold"
        >
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

const StudentInsights = ({ genderDistribution, ageRanges }: StudentInsightsProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);

    // Prepare gender data for pie chart
    const genderData = [
        { name: 'Male', value: genderDistribution.male },
        { name: 'Female', value: genderDistribution.female },
        ...(genderDistribution.other && genderDistribution.other > 0
            ? [{ name: 'Other', value: genderDistribution.other }]
            : []),
    ].filter(item => item.value > 0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

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
                                outerRadius={activeIndex !== null ? 90 : 80}
                                innerRadius={activeIndex !== null ? 20 : 0}
                                fill="#8884d8"
                                dataKey="value"
                                animationDuration={600}
                                animationBegin={0}
                                onMouseEnter={onPieEnter}
                                onMouseLeave={onPieLeave}
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                            >
                                {genderData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${entry.name}`} 
                                        fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                                        style={{ 
                                            opacity: activeIndex === null || activeIndex === index ? 1 : 0.7,
                                            transition: 'opacity 0.3s ease'
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                iconSize={12}
                                wrapperStyle={{ paddingLeft: 20 }}
                                formatter={(value, entry) => (
                                    <span style={{ color: entry.color, fontSize: '14px' }}>{value}</span>
                                )}
                            />
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {genderData.map((item, index) => (
                            <div 
                                key={item.name} 
                                className={`flex justify-between text-sm p-2 rounded transition-colors ${
                                    activeIndex === index ? 'bg-primary-50' : ''
                                }`}
                            >
                                <span className="text-gray-600 flex items-center">
                                    <span 
                                        className="w-3 h-3 rounded-full mr-2" 
                                        style={{ backgroundColor: GENDER_COLORS[index % GENDER_COLORS.length] }}
                                    />
                                    {item.name}:
                                </span>
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
                                <BarChart 
                                    data={ageRanges} 
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    onMouseMove={(state) => {
                                        if (state?.activePayload?.[0]?.payload?.range) {
                                            setHoveredBar(state.activePayload[0].payload.range);
                                        }
                                    }}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="range" 
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                                    />
                                    <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(105, 199, 215, 0.1)' }} />
                                    <Bar 
                                        dataKey="count" 
                                        radius={[8, 8, 0, 0]}
                                        animationDuration={800}
                                        animationBegin={0}
                                    >
                                        {ageRanges.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={hoveredBar === entry.range ? '#4d9faf' : '#69C7D7'}
                                                style={{ transition: 'fill 0.2s ease' }}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {ageRanges.map((range) => (
                                    <div 
                                        key={range.range} 
                                        className={`flex justify-between text-sm p-2 rounded transition-colors ${
                                            hoveredBar === range.range ? 'bg-primary-50' : ''
                                        }`}
                                    >
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

