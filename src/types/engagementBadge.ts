/**
 * TypeScript types for the Anti-Lurk Engagement Badge system
 * Based on the social.antiLurk.engagementBadge lexicon
 */

export type BadgeVisibility = 'public' | 'followers' | 'private';
export type BadgeStyle = 'compact' | 'detailed' | 'minimal';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type MetricKey =
  | 'postsViewed'
  | 'likesGiven'
  | 'repostsGiven'
  | 'repliesGiven'
  | 'followsGiven'
  | 'engagementScore'
  | 'streakDays';

export interface EngagementBadgeRecord {
  $type: 'social.antiLurk.engagementBadge';
  postsViewed?: number;
  likesGiven?: number;
  repostsGiven?: number;
  repliesGiven?: number;
  followsGiven?: number;
  engagementScore?: number;
  streakDays?: number;
  lastEngagementAt?: string;
  visibility: BadgeVisibility;
  visibleMetrics?: MetricKey[];
  badgeStyle?: BadgeStyle;
  tier?: BadgeTier;
  createdAt: string;
  updatedAt: string;
}

export interface EngagementStats {
  postsViewed: number;
  likesGiven: number;
  repostsGiven: number;
  repliesGiven: number;
  followsGiven: number;
  engagementScore: number;
  streakDays: number;
  lastEngagementAt: Date | null;
}

export interface BadgePreferences {
  visibility: BadgeVisibility;
  visibleMetrics: MetricKey[];
  badgeStyle: BadgeStyle;
  autoPublish: boolean;
}

export interface EngagementLabel {
  val: string;
  description: string;
}

/**
 * Calculate engagement tier based on total score
 */
export function calculateTier(score: number): BadgeTier {
  if (score >= 5000) return 'diamond';
  if (score >= 2000) return 'platinum';
  if (score >= 500) return 'gold';
  if (score >= 100) return 'silver';
  return 'bronze';
}

/**
 * Calculate engagement score with weighted values
 */
export function calculateEngagementScore(stats: EngagementStats): number {
  return (
    stats.postsViewed * 1 +
    stats.likesGiven * 2 +
    stats.repostsGiven * 3 +
    stats.repliesGiven * 5 +
    stats.followsGiven * 10 +
    stats.streakDays * 20
  );
}

/**
 * Get tier label value for self-labeling
 */
export function getTierLabel(tier: BadgeTier): string {
  return `engagement-${tier}`;
}

/**
 * Get achievement labels based on stats
 */
export function getAchievementLabels(stats: EngagementStats): EngagementLabel[] {
  const labels: EngagementLabel[] = [];

  if (stats.streakDays >= 30) {
    labels.push({ val: 'streak-champion', description: '30+ day streak' });
  }

  if (stats.repliesGiven >= 100) {
    labels.push({ val: 'reply-master', description: '100+ replies' });
  }

  if (stats.likesGiven >= 500) {
    labels.push({ val: 'generous-liker', description: '500+ likes' });
  }

  if (stats.repostsGiven >= 100) {
    labels.push({ val: 'repost-king', description: '100+ reposts' });
  }

  if (stats.followsGiven >= 50) {
    labels.push({ val: 'network-connector', description: '50+ follows' });
  }

  // Determine participation style
  if (stats.engagementScore >= 1000) {
    labels.push({ val: 'super-engager', description: 'Highly active participant' });
  }

  if (stats.repliesGiven > stats.likesGiven) {
    labels.push({ val: 'conversation-starter', description: 'Prefers meaningful discussions' });
  }

  return labels;
}

/**
 * Get tier color for UI display
 */
export function getTierColor(tier: BadgeTier): string {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
  };
  return colors[tier];
}

/**
 * Get tier emoji for UI display
 */
export function getTierEmoji(tier: BadgeTier): string {
  const emojis = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '💠',
  };
  return emojis[tier];
}
