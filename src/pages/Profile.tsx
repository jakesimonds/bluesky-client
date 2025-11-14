import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEngagementBadge } from '../context/EngagementBadgeContext';
import { EngagementBadge } from '../components/badge/EngagementBadge';
import { BadgeSettings } from '../components/badge/BadgeSettings';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { stats, tier, labels } = useEngagementBadge();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            ← Back to Feed
          </button>
        </div>
      </header>

      {/* Profile */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start space-x-4">
            <img
              src={profile.avatar || 'https://via.placeholder.com/100'}
              alt={profile.displayName || profile.handle}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.displayName || profile.handle}
              </h1>
              <p className="text-gray-600">@{profile.handle}</p>

              <div className="flex gap-4 mt-3 text-sm">
                <span>
                  <strong>{profile.followersCount || 0}</strong> followers
                </span>
                <span>
                  <strong>{profile.followsCount || 0}</strong> following
                </span>
                <span>
                  <strong>{profile.postsCount || 0}</strong> posts
                </span>
              </div>
            </div>
          </div>

          {profile.description && (
            <p className="mt-4 text-gray-700 whitespace-pre-wrap">{profile.description}</p>
          )}
        </div>

        {/* Apps Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">AT Protocol Apps Used</h2>

          {apps.length > 0 ? (
            <div className="space-y-3">
              {apps.map((app) => (
                <div
                  key={app.schema}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.appName}</h3>
                      <p className="text-xs text-gray-500 font-mono">{app.schema}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {app.recordCount > 0 ? 'Active' : 'No records'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No apps detected</p>
              <p className="text-sm text-gray-500 mt-2">
                This user primarily uses Bluesky
              </p>
            </div>
          )}

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This shows apps based on record schemas found in the user's PDS.
              The AT Protocol allows users to use the same identity across multiple apps.
=======
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-sm text-gray-600">@{authState.handle}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header with Badge */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-purple-200 p-8 mb-6 shadow-lg">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
              {authState.handle?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {authState.handle}
            </h2>
            <p className="text-gray-600 mb-4">{authState.did}</p>

            {/* Main Badge Display */}
            <div className="mb-6">
              <EngagementBadge
                stats={stats}
                tier={tier}
                style="detailed"
              />
            </div>

            {/* Achievement Labels */}
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {labels.map((label) => (
                  <div
                    key={label.val}
                    className="bg-white px-4 py-2 rounded-full text-sm font-medium border-2 border-purple-300 shadow-sm hover:shadow-md transition"
                    title={label.description}
                  >
                    🏆 {label.val.replace(/-/g, ' ')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl mb-1">❤️</div>
              <div className="text-2xl font-bold text-gray-900">{stats.likesGiven}</div>
              <div className="text-xs text-gray-600">Likes</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl mb-1">💬</div>
              <div className="text-2xl font-bold text-gray-900">{stats.repliesGiven}</div>
              <div className="text-xs text-gray-600">Replies</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl mb-1">🔄</div>
              <div className="text-2xl font-bold text-gray-900">{stats.repostsGiven}</div>
              <div className="text-xs text-gray-600">Reposts</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl mb-1">👥</div>
              <div className="text-2xl font-bold text-gray-900">{stats.followsGiven}</div>
              <div className="text-xs text-gray-600">Follows</div>
            </div>
          </div>
        </div>

        {/* Badge Settings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Badge Settings</h2>
          <BadgeSettings />
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">
            📖 About Engagement Badges
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Engagement badges</strong> are a unique feature that lets you share your
              social participation statistics as a public badge on your profile. This gamifies
              engagement and encourages authentic interaction over passive lurking.
            </p>
            <p>
              Your badge is stored in the <strong>AT Protocol</strong> network using the custom
              lexicon <code className="bg-blue-100 px-1 py-0.5 rounded">social.antiLurk.engagementBadge</code>.
              This means your badge is:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Portable across AT Protocol apps</li>
              <li>Stored in your own repository (you own your data)</li>
              <li>Verifiable and tamper-resistant</li>
              <li>Compatible with any client that reads this lexicon</li>
            </ul>
            <p className="mt-3">
              <strong>Tier System:</strong> Your badge tier (Bronze → Silver → Gold → Platinum → Diamond)
              is calculated based on your engagement score, which rewards active participation
              more than passive viewing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
