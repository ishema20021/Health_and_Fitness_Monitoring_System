import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import achievementService from '../services/achievementService';
import { useLanguage } from '../hooks/useLanguage';

const Achievements = () => {
    const { t } = useLanguage();
    const [allAchievements, setAllAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // First get initial data
            const [allRes, userRes] = await Promise.all([
                achievementService.getAll(),
                achievementService.getUserAchievements()
            ]);

            if (allRes?.success) setAllAchievements(allRes.data);
            if (userRes?.success) setUserAchievements(userRes.data);

            // Check for NEW achievements
            await achievementService.checkAchievements();

            // Reload user achievements to get any newly unlocked ones
            const updatedUserRes = await achievementService.getUserAchievements();
            if (updatedUserRes?.success) {
                setUserAchievements(updatedUserRes.data);
            }

        } catch (error) {
            console.error('Failed to load achievements', error);
        } finally {
            setLoading(false);
        }
    };

    const isUnlocked = (achievementId) => {
        return userAchievements.some(ua => ua.achievementId === achievementId);
    };

    const getUnlockedDate = (achievementId) => {
        const ua = userAchievements.find(ua => ua.achievementId === achievementId);
        return ua ? new Date(ua.earnedDate).toLocaleDateString() : null;
    };

    const getAchievementIcon = (iconString) => {
        const iconMap = {
            'bi-flag-fill': '🚩',
            'bi-hand-thumbs-up-fill': '👍',
            'bi-fire': '🔥',
            'bi-lightning-charge-fill': '⚡',
            'bi-trophy-fill': '🏆',
            'bi-star-fill': '⭐',
            'bi-heart-fill': '❤️',
            'bi-award-fill': '🎖️'
        };
        return iconMap[iconString] || '🏆';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('achievements')}</h1>
                    <p className="text-gray-500 mt-1">
                        UNLOCKED: <span className="text-primary-600 font-bold">{userAchievements.length}</span> / {allAchievements.length}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading your trophies...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allAchievements.map(achievement => {
                        const unlocked = isUnlocked(achievement.id);
                        return (
                            <div
                                key={achievement.id}
                                className={`relative p-6 rounded-xl border-2 transition-all ${unlocked
                                    ? 'bg-white border-yellow-400 shadow-sm'
                                    : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl ${unlocked
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-gray-200 text-gray-400 grayscale'
                                        }`}>
                                        {getAchievementIcon(achievement.icon)}
                                    </div>
                                    {unlocked && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                            Unlocked
                                        </span>
                                    )}
                                    {!unlocked && (
                                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                            Locked
                                        </span>
                                    )}
                                </div>

                                <h3 className={`text-lg font-bold mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {achievement.name}
                                </h3>
                                <p className={`text-sm mb-4 h-10 overflow-hidden text-ellipsis ${unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {achievement.description}
                                </p>

                                <div className="flex items-center justify-between text-xs mt-auto pt-4 border-t border-gray-100">
                                    <span className={`font-medium ${unlocked ? 'text-primary-600' : 'text-gray-400'}`}>
                                        +{achievement.points} Points
                                    </span>
                                    {unlocked && (
                                        <span className="text-gray-400">Earned {getUnlockedDate(achievement.id)}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Achievements;
