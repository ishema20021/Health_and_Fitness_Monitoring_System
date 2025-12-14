import { useState } from 'react';

export default function Moderation() {
    const [reports, setReports] = useState([
        { id: 1, type: 'Comment', content: 'You are so bad at this! Give up!', reporter: 'user1', reportedUser: 'bully123', status: 'Pending', timestamp: '2 mins ago' },
        { id: 2, type: 'Post', content: 'Buy my illegal supplements here!', reporter: 'concerned_mom', reportedUser: 'spambot', status: 'Pending', timestamp: '1 hour ago' },
        { id: 3, type: 'Photo', content: '[Inappropriate Image Placeholder]', reporter: 'gym_bro', reportedUser: 'troll', status: 'Reviewed', timestamp: '1 day ago' },
    ]);

    const handleAction = (id, action) => {
        setReports(reports.map(report =>
            report.id === id ? { ...report, status: action === 'approve' ? 'Dismissed' : 'Removed' } : report
        ));
    };

    return (
        <div className="animate-fade-in p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Moderation Queue ⚖️</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Content</th>
                            <th className="p-4 font-semibold text-gray-700">Type</th>
                            <th className="p-4 font-semibold text-gray-700">Reported User</th>
                            <th className="p-4 font-semibold text-gray-700">Status</th>
                            <th className="p-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reports.filter(r => r.status === 'Pending').length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No pending reports! Good job. 🎉
                                </td>
                            </tr>
                        )}
                        {reports.map(report => (
                            <tr key={report.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 max-w-xs truncate">
                                    <span className="font-medium text-gray-800">"{report.content}"</span>
                                    <p className="text-xs text-gray-500">Reported by: {report.reporter}</p>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">{report.type}</span>
                                </td>
                                <td className="p-4 text-red-600 font-semibold">{report.reportedUser}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    {report.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(report.id, 'approve')}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-semibold"
                                            >
                                                Dismiss
                                            </button>
                                            <button
                                                onClick={() => handleAction(report.id, 'remove')}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                                            >
                                                Remove Content
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
