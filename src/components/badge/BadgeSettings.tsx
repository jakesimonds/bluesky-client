import React, { useState } from 'react';
import { useEngagementBadge } from '../../context/EngagementBadgeContext';
import type { BadgeVisibility, BadgeStyle, MetricKey } from '../../types/engagementBadge';
import { EngagementBadge } from './EngagementBadge';

export const BadgeSettings: React.FC = () => {
  const {
    stats,
    preferences,
    tier,
    labels,
    isPublished,
    isPublishing,
    updatePreferences,
    publishBadge,
  } = useEngagementBadge();

  const [showPreview, setShowPreview] = useState(false);

  const allMetrics: MetricKey[] = [
    'postsViewed',
    'likesGiven',
    'repostsGiven',
    'repliesGiven',
    'followsGiven',
    'engagementScore',
    'streakDays',
  ];

  const metricLabels: Record<MetricKey, string> = {
    postsViewed: 'Posts Viewed',
    likesGiven: 'Likes Given',
    repostsGiven: 'Reposts',
    repliesGiven: 'Replies',
    followsGiven: 'Follows',
    engagementScore: 'Engagement Score',
    streakDays: 'Streak Days',
  };

  const handleVisibilityChange = (visibility: BadgeVisibility) => {
    updatePreferences({ visibility });
  };

  const handleStyleChange = (badgeStyle: BadgeStyle) => {
    updatePreferences({ badgeStyle });
  };

  const handleMetricToggle = (metric: MetricKey) => {
    const current = preferences.visibleMetrics || [];
    const updated = current.includes(metric)
      ? current.filter((m) => m !== metric)
      : [...current, metric];
    updatePreferences({ visibleMetrics: updated });
  };

  const handleAutoPublishToggle = () => {
    updatePreferences({ autoPublish: !preferences.autoPublish });
  };

  const handlePublish = async () => {
    try {
      await publishBadge();
      alert('✅ Badge published successfully to AT Protocol!');
    } catch (error) {
      alert('❌ Failed to publish badge. Check console for details.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Visibility Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">
          Control who can see your engagement statistics on your profile.
        </p>

        <div className="space-y-2">
          {(['public', 'followers', 'private'] as BadgeVisibility[]).map((vis) => (
            <label
              key={vis}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="radio"
                name="visibility"
                value={vis}
                checked={preferences.visibility === vis}
                onChange={() => handleVisibilityChange(vis)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 capitalize">{vis}</div>
                <div className="text-xs text-gray-500">
                  {vis === 'public' && 'Anyone can view your engagement badge'}
                  {vis === 'followers' && 'Only your followers can see your badge'}
                  {vis === 'private' && 'Badge is hidden from everyone (opt-out)'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Visible Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visible Metrics</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose which engagement statistics to display on your badge.
        </p>

        <div className="space-y-2">
          {allMetrics.map((metric) => (
            <label
              key={metric}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={preferences.visibleMetrics?.includes(metric) || false}
                onChange={() => handleMetricToggle(metric)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{metricLabels[metric]}</div>
                <div className="text-sm text-gray-600">{stats[metric]?.toLocaleString() || 0}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Badge Style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Style</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose how your badge appears on your profile.
        </p>

        <div className="space-y-2">
          {(['compact', 'detailed', 'minimal'] as BadgeStyle[]).map((st) => (
            <label
              key={st}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="radio"
                name="badgeStyle"
                value={st}
                checked={preferences.badgeStyle === st}
                onChange={() => handleStyleChange(st)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="font-medium text-gray-900 capitalize">{st}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Auto-Publish */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Publish</h3>
            <p className="text-sm text-gray-600">
              Automatically publish your badge to AT Protocol when your stats change.
            </p>
          </div>
          <button
            onClick={handleAutoPublishToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              preferences.autoPublish ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.autoPublish ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Achievement Labels */}
      {labels.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Your Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <div
                key={label.val}
                className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border border-purple-300 shadow-sm"
                title={label.description}
              >
                {label.val.replace(/-/g, ' ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview & Publish */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Preview & Publish</h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {showPreview && (
          <div className="mb-6 flex justify-center">
            <EngagementBadge
              stats={stats}
              tier={tier}
              style={preferences.badgeStyle}
              visibleMetrics={preferences.visibleMetrics}
            />
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handlePublish}
            disabled={isPublishing || preferences.visibility === 'private'}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isPublishing ? 'Publishing...' : 'Publish Badge to AT Protocol'}
          </button>

          {isPublished && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <span className="text-green-800 text-sm font-medium">
                ✅ Badge published successfully!
              </span>
            </div>
          )}

          {preferences.visibility === 'private' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <span className="text-amber-800 text-sm">
                ⚠️ Set visibility to Public or Followers to publish
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
