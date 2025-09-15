"use client";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { month: "Jan", admissions: 80 },
    { month: "Feb", admissions: 90 },
    { month: "Mar", admissions: 120 },
    { month: "Apr", admissions: 110 },
    { month: "May", admissions: 150 },
    { month: "Jun", admissions: 100 },
    { month: "Jul", admissions: 180 },
    { month: "Aug", admissions: 200 },
    { month: "Sep", admissions: 190 },
    { month: "Oct", admissions: 170 },
    { month: "Nov", admissions: 160 },
    { month: "Dec", admissions: 130 },
];


const AdmissionTimeline = () => {
    return (
        <div className="w-full h-80 p-4 bg-white rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Admission Timeline</h2>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    width={400}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="admissions" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AdmissionTimeline