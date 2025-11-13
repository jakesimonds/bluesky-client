# Anti-Lurk Engagement Badge Lexicons

This directory contains custom AT Protocol lexicon definitions for the Anti-Lurk engagement badge system.

## Overview

The engagement badge system allows users to **opt-in to publicly sharing their social media engagement statistics** as a badge that can be displayed on their profile. This gamifies social participation and encourages authentic interaction over passive lurking.

## Lexicon Namespace

All schemas use the `social.antiLurk.*` namespace:

- `social.antiLurk.engagementBadge` - Main record type for storing engagement statistics
- `social.antiLurk.labels` - Token definitions for engagement-based labels
- `social.antiLurk.getEngagementBadge` - Query endpoint for fetching user badges

## Architecture

### Record Storage

Engagement badges are stored as **records in the user's own repository** under the `social.antiLurk.engagementBadge` collection. Each user can have one badge record with key "self".

### Self-Labeling

Users can apply self-labels to their account based on their engagement tier:
- `engagement-bronze` - New participants (< 100 engagements)
- `engagement-silver` - Active users (100-500 engagements)
- `engagement-gold` - Highly engaged (500-2000 engagements)
- `engagement-platinum` - Power users (2000-5000 engagements)
- `engagement-diamond` - Elite contributors (5000+ engagements)

Additional style labels include:
- `super-engager` - High across all metrics
- `content-creator` - High posts/replies ratio
- `community-builder` - High follows given
- `conversation-starter` - High reply rate
- `generous-liker` - High like count
- `repost-king` - High repost activity

### Privacy Controls

The `visibility` field supports three levels:
- **public** - Anyone can view the badge
- **followers** - Only followers can see engagement stats
- **private** - Badge is hidden from everyone (opt-out)

The `visibleMetrics` array allows granular control over which specific stats to display.

## Implementation

### Creating a Badge

```typescript
import { BskyAgent } from '@atproto/api';

const agent = new BskyAgent({ service: 'https://bsky.social' });
await agent.login({ identifier: 'user.bsky.social', password: 'app-password' });

// Create engagement badge record
await agent.com.atproto.repo.putRecord({
  repo: agent.session.did,
  collection: 'social.antiLurk.engagementBadge',
  rkey: 'self',
  record: {
    $type: 'social.antiLurk.engagementBadge',
    postsViewed: 1523,
    likesGiven: 487,
    repostsGiven: 142,
    repliesGiven: 93,
    followsGiven: 67,
    engagementScore: 2312,
    streakDays: 14,
    lastEngagementAt: new Date().toISOString(),
    visibility: 'public',
    visibleMetrics: ['likesGiven', 'repliesGiven', 'engagementScore'],
    badgeStyle: 'compact',
    tier: 'gold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
});
```

### Fetching Another User's Badge

```typescript
// Fetch engagement badge from user's repository
const response = await agent.com.atproto.repo.getRecord({
  repo: 'other-user.bsky.social',
  collection: 'social.antiLurk.engagementBadge',
  rkey: 'self'
});

const badge = response.data.value;
console.log(`${badge.tier} tier - ${badge.engagementScore} points`);
```

### Applying Self-Labels

```typescript
// Apply engagement tier label
await agent.com.atproto.repo.putRecord({
  repo: agent.session.did,
  collection: 'app.bsky.actor.profile',
  rkey: 'self',
  record: {
    ...existingProfile,
    labels: {
      $type: 'com.atproto.label.defs#selfLabels',
      values: [
        { val: 'engagement-gold' },
        { val: 'super-engager' }
      ]
    }
  }
});
```

## Engagement Score Calculation

The engagement score is calculated using weighted values:

```
engagementScore =
  (postsViewed × 1) +
  (likesGiven × 2) +
  (repostsGiven × 3) +
  (repliesGiven × 5) +
  (followsGiven × 10) +
  (streakDays × 20)
```

This formula rewards active participation (replies, follows) more than passive consumption (views).

## Badge Tiers

Tiers are automatically assigned based on engagement score:

| Tier | Score Range | Description |
|------|-------------|-------------|
| Bronze | 0 - 99 | New participant |
| Silver | 100 - 499 | Active user |
| Gold | 500 - 1,999 | Highly engaged |
| Platinum | 2,000 - 4,999 | Power user |
| Diamond | 5,000+ | Elite contributor |

## Future Enhancements

### Labeller Service

In the future, we could deploy a dedicated labeller service that:
- Verifies engagement statistics authenticity
- Automatically applies tier labels
- Provides tamper-proof badge validation
- Offers leaderboards and community rankings

### Cross-Client Compatibility

These lexicons are designed to be client-agnostic. Any AT Protocol client can:
- Read engagement badge records from user repositories
- Display badges in their own custom UI
- Implement their own engagement tracking
- Use alternative scoring algorithms

### Interoperability

The lexicon design follows AT Protocol best practices:
- ✅ Simple, flat data structure
- ✅ No nested complexity
- ✅ Uses standard datetime formats
- ✅ Immutable schema (constraints won't change)
- ✅ Extensible through self-labels
- ✅ Privacy-respecting opt-in model

## License

These lexicon definitions are released into the public domain for use by the AT Protocol community.

## Contact

For questions or suggestions about this lexicon design, please open an issue in the repository.
