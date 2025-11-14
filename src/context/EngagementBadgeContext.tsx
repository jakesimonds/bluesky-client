import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import type {
  EngagementStats,
  BadgePreferences,
  BadgeTier,
  EngagementBadgeRecord,
  EngagementLabel,
} from '../types/engagementBadge';
import {
  calculateEngagementScore,
  calculateTier,
  getAchievementLabels,
} from '../types/engagementBadge';

interface EngagementBadgeContextType {
  stats: EngagementStats;
  preferences: BadgePreferences;
  tier: BadgeTier;
  labels: EngagementLabel[];
  isPublished: boolean;
  isPublishing: boolean;
  updateStats: (updates: Partial<EngagementStats>) => void;
  updatePreferences: (updates: Partial<BadgePreferences>) => void;
  publishBadge: () => Promise<void>;
  fetchBadge: (did?: string) => Promise<EngagementBadgeRecord | null>;
  incrementStat: (stat: keyof Omit<EngagementStats, 'engagementScore' | 'lastEngagementAt' | 'streakDays'>) => void;
}

const STATS_STORAGE_KEY = 'antiLurk_engagementStats';
const PREFS_STORAGE_KEY = 'antiLurk_badgePreferences';
const LAST_ACTIVE_KEY = 'antiLurk_lastActiveDate';

const defaultStats: EngagementStats = {
  postsViewed: 0,
  likesGiven: 0,
  repostsGiven: 0,
  repliesGiven: 0,
  followsGiven: 0,
  engagementScore: 0,
  streakDays: 0,
  lastEngagementAt: null,
};

const defaultPreferences: BadgePreferences = {
  visibility: 'private',
  visibleMetrics: ['likesGiven', 'repliesGiven', 'engagementScore'],
  badgeStyle: 'compact',
  autoPublish: false,
};

const EngagementBadgeContext = createContext<EngagementBadgeContextType | undefined>(undefined);

export const EngagementBadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<EngagementStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastEngagementAt: parsed.lastEngagementAt ? new Date(parsed.lastEngagementAt) : null,
      };
    }
    return defaultStats;
  });

  const [preferences, setPreferences] = useState<BadgePreferences>(() => {
    const saved = localStorage.getItem(PREFS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Calculate derived values
  const engagementScore = calculateEngagementScore(stats);
  const tier = calculateTier(engagementScore);
  const labels = getAchievementLabels({ ...stats, engagementScore });

  // Update streak on mount
  useEffect(() => {
    const updateStreak = () => {
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      const today = new Date().toDateString();

      if (lastActive) {
        const lastDate = new Date(lastActive);
        const daysDiff = Math.floor(
          (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day - increment streak
          setStats((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
        } else if (daysDiff > 1) {
          // Streak broken - reset
          setStats((prev) => ({ ...prev, streakDays: 1 }));
        }
        // Same day - no change
      } else {
        // First time
        setStats((prev) => ({ ...prev, streakDays: 1 }));
      }

      localStorage.setItem(LAST_ACTIVE_KEY, today);
    };

    updateStreak();
  }, []);

  // Persist stats to localStorage
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Persist preferences to localStorage
  useEffect(() => {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Auto-publish if enabled
  useEffect(() => {
    if (preferences.autoPublish && preferences.visibility !== 'private') {
      const autoPublishTimeout = setTimeout(() => {
        publishBadge();
      }, 5000); // Debounce auto-publish

      return () => clearTimeout(autoPublishTimeout);
    }
  }, [stats, preferences]);

  const updateStats = useCallback((updates: Partial<EngagementStats>) => {
    setStats((prev) => ({
      ...prev,
      ...updates,
      lastEngagementAt: new Date(),
    }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<BadgePreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const incrementStat = useCallback(
    (stat: keyof Omit<EngagementStats, 'engagementScore' | 'lastEngagementAt' | 'streakDays'>) => {
      setStats((prev) => ({
        ...prev,
        [stat]: prev[stat] + 1,
        lastEngagementAt: new Date(),
      }));
    },
    []
  );

  const publishBadge = useCallback(async () => {
    if (preferences.visibility === 'private') {
      console.log('Badge is private, not publishing');
      return;
    }

    setIsPublishing(true);

    try {
      const agent = authService.getAgent();
      const now = new Date().toISOString();

      // Calculate current score
      const currentScore = calculateEngagementScore(stats);
      const currentTier = calculateTier(currentScore);

      // Prepare badge record
      const badgeRecord: EngagementBadgeRecord = {
        $type: 'social.antiLurk.engagementBadge',
        postsViewed: stats.postsViewed,
        likesGiven: stats.likesGiven,
        repostsGiven: stats.repostsGiven,
        repliesGiven: stats.repliesGiven,
        followsGiven: stats.followsGiven,
        engagementScore: currentScore,
        streakDays: stats.streakDays,
        lastEngagementAt: stats.lastEngagementAt?.toISOString(),
        visibility: preferences.visibility,
        visibleMetrics: preferences.visibleMetrics,
        badgeStyle: preferences.badgeStyle,
        tier: currentTier,
        createdAt: now,
        updatedAt: now,
      };

      // Check if badge already exists
      let existingCreatedAt: string | null = null;
      try {
        const existing = await agent.com.atproto.repo.getRecord({
          repo: agent.session?.did || '',
          collection: 'social.antiLurk.engagementBadge',
          rkey: 'self',
        });

        if (existing.data.value && typeof existing.data.value === 'object' && 'createdAt' in existing.data.value) {
          existingCreatedAt = existing.data.value.createdAt as string;
        }
      } catch (error) {
        // Badge doesn't exist yet, that's fine
        console.log('No existing badge found, creating new one');
      }

      // Preserve original createdAt if updating
      if (existingCreatedAt) {
        badgeRecord.createdAt = existingCreatedAt;
      }

      // Publish badge record to repository
      await agent.com.atproto.repo.putRecord({
        repo: agent.session?.did || '',
        collection: 'social.antiLurk.engagementBadge',
        rkey: 'self',
        record: badgeRecord,
      });

      console.log('✅ Badge published successfully:', badgeRecord);
      setIsPublished(true);
    } catch (error) {
      console.error('❌ Failed to publish badge:', error);
      throw error;
    } finally {
      setIsPublishing(false);
    }
  }, [stats, preferences]);

  const fetchBadge = useCallback(async (did?: string): Promise<EngagementBadgeRecord | null> => {
    try {
      const agent = authService.getAgent();
      const targetDid = did || agent.session?.did || '';

      const response = await agent.com.atproto.repo.getRecord({
        repo: targetDid,
        collection: 'social.antiLurk.engagementBadge',
        rkey: 'self',
      });

      return response.data.value as EngagementBadgeRecord;
    } catch (error) {
      console.error('Failed to fetch badge:', error);
      return null;
    }
  }, []);

  const value: EngagementBadgeContextType = {
    stats: { ...stats, engagementScore },
    preferences,
    tier,
    labels,
    isPublished,
    isPublishing,
    updateStats,
    updatePreferences,
    publishBadge,
    fetchBadge,
    incrementStat,
  };

  return (
    <EngagementBadgeContext.Provider value={value}>
      {children}
    </EngagementBadgeContext.Provider>
  );
};

export const useEngagementBadge = () => {
  const context = useContext(EngagementBadgeContext);
  if (!context) {
    throw new Error('useEngagementBadge must be used within an EngagementBadgeProvider');
  }
  return context;
};
