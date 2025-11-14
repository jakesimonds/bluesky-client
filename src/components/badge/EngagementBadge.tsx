import React from 'react';
import type { EngagementStats, BadgeTier, BadgeStyle, MetricKey } from '../../types/engagementBadge';
import { getTierColor, getTierEmoji } from '../../types/engagementBadge';

interface EngagementBadgeProps {
  stats: EngagementStats;
  tier: BadgeTier;
  style?: BadgeStyle;
  visibleMetrics?: MetricKey[];
  compact?: boolean;
}

export const EngagementBadge: React.FC<EngagementBadgeProps> = ({
  stats,
  tier,
  style = 'compact',
  visibleMetrics,
  compact = false,
}) => {
  const tierColor = getTierColor(tier);
  const tierEmoji = getTierEmoji(tier);

  // Determine which metrics to show
  const metricsToShow = visibleMetrics || [
    'likesGiven',
    'repliesGiven',
    'repostsGiven',
    'followsGiven',
    'postsViewed',
    'engagementScore',
    'streakDays',
  ];

  const metricLabels: Record<MetricKey, string> = {
    postsViewed: 'Posts Viewed',
    likesGiven: 'Likes',
    repostsGiven: 'Reposts',
    repliesGiven: 'Replies',
    followsGiven: 'Follows',
    engagementScore: 'Score',
    streakDays: 'Streak',
  };

  const metricEmojis: Record<MetricKey, string> = {
    postsViewed: '👀',
    likesGiven: '❤️',
    repostsGiven: '🔄',
    repliesGiven: '💬',
    followsGiven: '👥',
    engagementScore: '⭐',
    streakDays: '🔥',
  };

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${tierColor}20 0%, ${tierColor}40 100%)`,
          border: `2px solid ${tierColor}`,
          color: '#1f2937',
        }}
      >
        <span className="text-base">{tierEmoji}</span>
        <span className="capitalize">{tier}</span>
        <span className="text-gray-600">•</span>
        <span>{stats.engagementScore.toLocaleString()} pts</span>
      </div>
    );
  }

  if (style === 'minimal') {
    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2"
        style={{ borderColor: tierColor }}
      >
        <span className="text-xl">{tierEmoji}</span>
        <div className="text-left">
          <div className="text-xs text-gray-600 uppercase tracking-wide">Engagement</div>
          <div className="text-sm font-bold capitalize">{tier} Tier</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-lg border-2 p-6 max-w-md"
      style={{ borderColor: tierColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{tierEmoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">{tier} Tier</h3>
            <p className="text-sm text-gray-600">Engagement Badge</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: tierColor }}>
            {stats.engagementScore.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 uppercase">Points</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metricsToShow.map((metric) => {
          const value = stats[metric];
          if (value === undefined) return null;

          return (
            <div
              key={metric}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{metricEmojis[metric]}</span>
                <span className="text-xl font-bold text-gray-900">
                  {value.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-600">{metricLabels[metric]}</div>
            </div>
          );
        })}
      </div>

      {/* Streak Highlight */}
      {stats.streakDays > 0 && metricsToShow.includes('streakDays') && (
        <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {stats.streakDays} Day Streak!
                </div>
                <div className="text-xs text-gray-600">Keep engaging daily</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
