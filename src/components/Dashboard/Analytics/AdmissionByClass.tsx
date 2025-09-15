import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
    { name: 'Class 1', value: 45 },
    { name: 'Class 2', value: 39 },
    { name: 'Class 3', value: 60 },
    { name: 'Class 4', value: 48 },
    { name: 'Class 5', value: 53 },
    { name: 'Class 6', value: 34 },


];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdmissionByClass = () => {
    return (
        <div className="bg-white h-72 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Admissions by Class</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="40%"   // shift slightly left for legend
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconSize={10}
                        wrapperStyle={{
                            paddingLeft: 20, // spacing between chart and legend
                            fontSize: '13px'
                        }}
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AdmissionByClass;
