import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLanguage } from '../hooks/useLanguage';

export default function Reports() {
    const { t } = useLanguage();
    const data = [
        { name: 'Mon', active: 400, newUsers: 240 },
        { name: 'Tue', active: 300, newUsers: 139 },
        { name: 'Wed', active: 200, newUsers: 980 },
        { name: 'Thu', active: 278, newUsers: 390 },
        { name: 'Fri', active: 189, newUsers: 480 },
        { name: 'Sat', active: 239, newUsers: 380 },
        { name: 'Sun', active: 349, newUsers: 430 },
    ];

    return (
        <div className="animate-fade-in p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('reports')} 📈</h1>
            <p className="text-gray-600">{t('systemOverview')}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">User Activity Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="active" stroke="#8884d8" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">New Sign-ups</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="newUsers" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
