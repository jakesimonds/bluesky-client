import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { budgetState, updateSettings, resetBudget } = useBudget();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(budgetState.settings);

  const handleSave = () => {
    updateSettings(settings);
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your budget? This will give you a fresh start.')) {
      resetBudget();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Anti-Lurk Settings</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Current Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Posts Remaining</p>
              <p className="text-3xl font-bold text-blue-600">{budgetState.postsRemaining}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Posts Viewed</p>
              <p className="text-3xl font-bold text-purple-600">{budgetState.postsViewed}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Likes Given</p>
              <p className="text-3xl font-bold text-red-600">{budgetState.likesGiven}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Reposts Given</p>
              <p className="text-3xl font-bold text-green-600">{budgetState.repostsGiven}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 col-span-2">
              <p className="text-sm text-gray-600">Follows Given</p>
              <p className="text-3xl font-bold text-indigo-600">{budgetState.followsGiven}</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Budget Configuration</h2>

          {/* Initial Budget */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700">Initial Posts Budget (on login)</span>
              <span className="ml-2 text-lg font-bold text-blue-600">{settings.initialBudget}</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.initialBudget}
              onChange={(e) => setSettings({ ...settings, initialBudget: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 posts</span>
              <span>50 posts</span>
            </div>
          </div>

          <hr className="my-6" />

          <h3 className="text-md font-semibold text-gray-900 mb-4">Earn More Posts By Engaging</h3>

          {/* Posts per Like */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700">Posts unlocked per Like</span>
              <span className="ml-2 text-lg font-bold text-red-600">+{settings.postsPerLike}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.postsPerLike}
              onChange={(e) => setSettings({ ...settings, postsPerLike: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>+1 post</span>
              <span>+10 posts</span>
            </div>
          </div>

          {/* Posts per Repost */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700">Posts unlocked per Repost</span>
              <span className="ml-2 text-lg font-bold text-green-600">+{settings.postsPerRepost}</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={settings.postsPerRepost}
              onChange={(e) => setSettings({ ...settings, postsPerRepost: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>+1 post</span>
              <span>+15 posts</span>
            </div>
          </div>

          {/* Posts per Follow */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700">Posts unlocked per Follow</span>
              <span className="ml-2 text-lg font-bold text-indigo-600">+{settings.postsPerFollow}</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={settings.postsPerFollow}
              onChange={(e) => setSettings({ ...settings, postsPerFollow: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>+1 post</span>
              <span>+20 posts</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-amber-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-amber-700 transition"
          >
            Reset Budget
          </button>
        </div>

        {/* Engagement Badge Promo */}
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🏆</div>
            <div className="flex-1">
              <h3 className="font-bold text-purple-900 mb-2 text-lg">
                Share Your Engagement Badge
              </h3>
              <p className="text-sm text-purple-800 mb-3">
                Turn your social participation into a badge you can share on your profile!
                Track likes, replies, reposts, and earn achievement tiers from Bronze to Diamond.
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
              >
                View Your Profile & Badge →
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How Anti-Lurk Works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You start with a limited number of posts you can view</li>
            <li>• To see more posts, engage by liking, reposting, or following</li>
            <li>• Each interaction unlocks additional posts based on your settings</li>
            <li>• Your budget resets when you log in again</li>
            <li>• Customize the sliders above to find your perfect balance</li>
          </ul>
        </div>
      </main>
    </div>
  );
};
