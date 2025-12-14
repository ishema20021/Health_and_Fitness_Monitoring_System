import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import socialService from '../services/socialService';
import { useLanguage } from '../hooks/useLanguage';

const Social = () => {
    const { t } = useLanguage();
    const [feed, setFeed] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // For Instagram-style discover
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('discover');

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const feedPromise = socialService.getFeed();
            const lbPromise = socialService.getLeaderboard();
            const friendsPromise = socialService.getFriends();
            const requestsPromise = socialService.getPendingRequests();
            const allUsersPromise = socialService.getAllUsers();

            const [feedRes, lbRes, friendsRes, requestsRes, usersRes] = await Promise.all([
                feedPromise, lbPromise, friendsPromise, requestsPromise, allUsersPromise
            ]);

            if (feedRes?.success) setFeed(feedRes.data);
            if (lbRes?.success) setLeaderboard(Array.isArray(lbRes.data) ? lbRes.data : []);
            if (friendsRes?.success) setFriends(friendsRes.data);
            if (requestsRes?.success) setPendingRequests(requestsRes.data || []);
            if (usersRes?.success) setAllUsers(usersRes.data || []);

        } catch (error) {
            console.error('❌ Failed to load social data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const response = await socialService.acceptRequest(requestId);
            if (response.success) {
                toast.success('Friend accepted!');
                loadData(); // Reload to update friends list and remove request
            } else {
                toast.error('Failed to accept request');
            }
        } catch (error) {
            toast.error('Error accepting request');
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            const response = await socialService.declineRequest(requestId);
            if (response.success) {
                toast.success('Request declined');
                setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            } else {
                toast.error('Failed to decline request');
            }
        } catch (error) {
            toast.error('Error declining request');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            setSearching(true);
            const response = await socialService.searchUsers(searchTerm);
            if (response.success) {
                // Filter out existing friends
                const friendIds = new Set(friends.map(f => f.id));
                const filtered = response.data.filter(u => !friendIds.has(u.id));
                setSearchResults(filtered);
                if (filtered.length === 0) toast('No new users found');
            }
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setSearching(false);
        }
    };

    const handleAddFriend = async (userId) => {
        try {
            const response = await socialService.addFriend(userId);
            if (response.success) {
                toast.success('Friend request sent!');
                // Remove from search results locally
                setSearchResults(prev => prev.filter(u => u.id !== userId));
            } else {
                toast.error(response.message || 'Failed to send request');
            }
        } catch (error) {
            toast.error('Error sending friend request');
        }
    };

    const handleRemoveFriend = async (userId) => {
        try {
            const response = await socialService.removeFriend(userId);
            if (response.success) {
                toast.success('Unfollowed');
                setFriends(prev => prev.filter(f => f.id !== userId));
            } else {
                toast.error(response.message || 'Failed to unfollow');
            }
        } catch (error) {
            toast.error('Error unfollowing user');
        }
    };

    const isFollowing = (userId) => {
        return friends.some(f => f.id === userId);
    };

    const formatFollowerCount = (count) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    const getActivityIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'running': return '🏃';
            case 'cycling': return '🚴';
            case 'yoga': return '🧘';
            case 'swimming': return '🏊';
            case 'strength': return '🏋️';
            default: return '⚡';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

                {/* Centered & Polished Tabs */}
                <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 overflow-x-auto">
                    {['discover', 'feed', 'leaderboard', 'friends', 'requests'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                ? 'bg-gradient-to-r from-icon-indigo-600 to-purple-600 bg-indigo-600 text-white shadow-md transform scale-105'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-gray-400'
                                }`}
                        >
                            {tab === 'discover' && '✨ '}
                            {tab === 'feed' && '📢 '}
                            {tab === 'leaderboard' && '🏆 '}
                            {tab === 'friends' && '👥 '}
                            {tab === 'requests' && '📩 '}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'requests' && pendingRequests.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[500px] transition-all duration-300 ease-in-out">{loading ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-400 animate-pulse">Syncing community data...</p>
                </div>
            ) : (
                <>
                    {/* DISCOVER TAB - Instagram Style */}
                    {activeTab === 'discover' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {allUsers.map(user => {
                                    const following = isFollowing(user.id);

                                    return (
                                        <div key={user.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                            {/* Profile Header */}
                                            <div className="flex flex-col items-center mb-4">
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3 ring-4 ring-white dark:ring-slate-800">
                                                    {user.profilePic || user.userName?.[0]?.toUpperCase()}
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg text-center">{user.userName}</h3>
                                                <p className="text-xs text-gray-500 mb-3">{user.email}</p>

                                                {/* Stats Row */}
                                                <div className="flex gap-6 mb-4">
                                                    <div className="text-center">
                                                        <p className="font-bold text-gray-900 dark:text-white">{formatFollowerCount(user.stats?.posts || 0)}</p>
                                                        <p className="text-xs text-gray-500">posts</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-gray-900 dark:text-white">{formatFollowerCount(user.stats?.followers || 0)}</p>
                                                        <p className="text-xs text-gray-500">followers</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-gray-900 dark:text-white">{formatFollowerCount(user.stats?.following || 0)}</p>
                                                        <p className="text-xs text-gray-500">following</p>
                                                    </div>
                                                </div>

                                                {/* Follow Button */}
                                                <button
                                                    onClick={() => following ? handleRemoveFriend(user.id) : handleAddFriend(user.id)}
                                                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${following
                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
                                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                                                        }`}
                                                >
                                                    {following ? 'Connected ✓' : 'Connect'}
                                                </button>
                                            </div>

                                            {/* Bio */}
                                            {user.bio && (
                                                <div className="mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                                                        {user.bio}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Recent Activities */}
                                            {user.recentActivities && user.recentActivities.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Activities</p>
                                                    <div className="space-y-2">
                                                        {user.recentActivities.slice(0, 2).map((activity, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.type}</p>
                                                                        <p className="text-xs text-gray-500">{activity.duration}min • {activity.calories} kcal</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xl">🔥</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {allUsers.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">👥</div>
                                    <p className="text-gray-500 text-lg">No users found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIVITY FEED */}
                    {activeTab === 'feed' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {feed.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 text-center px-6">
                                    <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm">
                                        📡
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Activity Feed is Quiet</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto mb-6">
                                        It seems you or your friends haven't logged any activities recently.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('friends')}
                                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                                    >
                                        Find Friends
                                    </button>
                                </div>
                            ) : (
                                feed.map((activity, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                                        <div className="flex gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-md">
                                                {getActivityIcon(activity.activityType)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                                            {activity.userName || 'Unknown Athlete'}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                                                            did a <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activity.activityType}</span> workout
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-full">
                                                        {formatDate(activity.date)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3 mt-4">
                                                    {activity.duration > 0 && (
                                                        <div className="bg-gray-50 dark:bg-slate-700/30 p-3 rounded-xl text-center">
                                                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</span>
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{activity.duration}m</span>
                                                        </div>
                                                    )}
                                                    {activity.caloriesBurned > 0 && (
                                                        <div className="bg-gray-50 dark:bg-slate-700/30 p-3 rounded-xl text-center">
                                                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Calories</span>
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.floor(activity.caloriesBurned)}</span>
                                                        </div>
                                                    )}
                                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl flex items-center justify-center text-orange-500">
                                                        <span className="text-xl">🔥</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* LEADERBOARD */}
                    {activeTab === 'leaderboard' && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-slate-700 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-3"></div>
                                    <h3 className="font-extrabold text-white text-3xl relative z-10">
                                        Weekly Champions 🏆
                                    </h3>
                                    <p className="text-indigo-100 font-medium mt-2 relative z-10">
                                        Top calorie burners of the week
                                    </p>
                                </div>

                                {leaderboard.length === 0 ? (
                                    <div className="p-16 text-center">
                                        <div className="text-5xl mb-4">🍂</div>
                                        <p className="text-gray-500 text-lg">No champions yet this week.</p>
                                        <p className="text-gray-400 text-sm">Log an activity to be the first!</p>
                                    </div>
                                ) : (
                                    <div className="px-4 py-2">
                                        <table className="w-full">
                                            <thead className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 text-left">#</th>
                                                    <th className="px-6 py-4 text-left">Athlete</th>
                                                    <th className="px-6 py-4 text-right">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                                                {leaderboard.map((entry, index) => (
                                                    <tr key={index} className="group hover:bg-indigo-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className={`
                                                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm
                                                                    ${index === 0 ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200' :
                                                                    index === 1 ? 'bg-slate-100 text-slate-600 ring-2 ring-slate-200' :
                                                                        index === 2 ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'text-gray-400 bg-gray-50'}
                                                                `}>
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-900 dark:text-white text-lg">{entry.userName || 'Unknown'}</span>
                                                                <span className="text-xs text-indigo-500 font-medium hidden group-hover:block transition animate-fade-in">
                                                                    {entry.totalActivities} activities logged
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-lg border border-indigo-100">
                                                                {Math.floor(entry.totalCaloriesBurned)} <span className="text-xs text-indigo-400 font-normal">kcal</span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FRIENDS */}
                    {activeTab === 'friends' && (
                        <div className="max-w-4xl mx-auto space-y-10">
                            {/* Search Section - Styled as a "Connect" card */}
                            <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-2">Expand Your Circle</h3>
                                        <p className="text-indigo-200 mb-6">Find your friends to compete on the leaderboard and see their progress.</p>

                                        <form onSubmit={handleSearch} className="relative max-w-md mx-auto md:mx-0">
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-5 pr-32 py-4 rounded-xl text-gray-900 bg-white/95 backdrop-blur shadow-lg border-0 focus:ring-4 focus:ring-indigo-500/30 transition-all placeholder:text-gray-400"
                                            />
                                            <button
                                                type="submit"
                                                disabled={searching}
                                                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-lg font-bold transition disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {searching ? 'Finding...' : 'Search'}
                                            </button>
                                        </form>
                                    </div>
                                    <div className="hidden md:block text-8xl opacity-80">
                                        🤝
                                    </div>
                                </div>

                                {/* Search Results Dropdown-like area */}
                                {searchResults.length > 0 && (
                                    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-fade-in">
                                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3 ml-2">Found Users</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {searchResults.map(user => (
                                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/90 hover:bg-white transition text-gray-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                            {user.userName?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-bold leading-tight">{user.userName}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddFriend(user.id)}
                                                        className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition shadow-sm uppercase tracking-wide"
                                                    >
                                                        Connect
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Following List - Instagram Style */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                {friends.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-5xl shadow-xl mx-auto mb-6">
                                            👥
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Start Building Your Network</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            Follow athletes to see their workouts and get inspired
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('discover')}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                                        >
                                            <span>✨</span>
                                            Discover Athletes
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Search bar */}
                                        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg border-0 outline-none placeholder-gray-500"
                                            />
                                        </div>

                                        {/* Following list */}
                                        <div className="divide-y divide-gray-200 dark:divide-slate-700">
                                            {friends.map(friend => (
                                                <div key={friend.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        {/* Avatar */}
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                                            {friend.profilePic || friend.userName?.[0]?.toUpperCase()}
                                                        </div>

                                                        {/* User info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                                {friend.userName}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                {friend.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Following button */}
                                                    <button
                                                        onClick={() => handleRemoveFriend(friend.id)}
                                                        className="px-6 py-1.5 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 text-gray-900 dark:text-white font-semibold text-sm rounded-lg transition-all flex-shrink-0"
                                                    >
                                                        Following
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* REQUESTS TAB */}
                    {activeTab === 'requests' && (
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                Friend Requests
                                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                    {pendingRequests.length} pending
                                </span>
                            </h3>

                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                                    <div className="text-5xl mb-4">📭</div>
                                    <p className="text-gray-500 text-lg">No pending requests</p>
                                    <p className="text-gray-400 text-sm">Check back later!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRequests.map(request => (
                                        <div key={request.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                    {request.requester?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{request.requester?.name || 'Unknown User'}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Sent {formatDate(request.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineRequest(request.id)}
                                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
};

export default Social;
