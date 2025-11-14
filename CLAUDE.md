# Claude AI Instructions - Bluesky Anti-Lurk Client

## Project Vision

This project aims to **gamify social media engagement** to encourage meaningful interaction over passive scrolling and lurking. The core philosophy is: social media should be social.

## Core Concept: Anti-Lurk System

The anti-lurk feature is a budget-based engagement system that:

1. **Limits passive consumption** - Users start with a limited "budget" of posts they can view
2. **Rewards active participation** - Engaging with content (likes, reposts, comments, follows) unlocks more posts
3. **Encourages reciprocity** - The more you give to the community, the more you can consume

### How It Works

- Users begin each session with a configurable initial budget (default: 10 posts)
- As they **scroll and view** posts, their budget **decreases**
- When they **engage** (like, repost, comment, follow), their budget **increases**
- Once budget reaches zero, they must interact to see more content

### Engagement Rewards (Configurable)

- **Like a post**: +3 posts
- **Repost content**: +5 posts
- **Comment/Reply**: +3 posts
- **Follow a user**: +10 posts

## Technical Implementation

### Current Features

- Budget tracking system with localStorage persistence
- IntersectionObserver to track post views
- Real-time budget display in header
- Interactive engagement buttons (like, repost, reply, follow)
- Settings page with sliders to customize engagement requirements
- Budget exhaustion screen with clear call-to-action

### Key Components

- `BudgetContext.tsx` - Manages budget state and engagement tracking
- `Feed.tsx` - Main feed with post viewing and interaction tracking
- `Settings.tsx` - User-configurable engagement requirements

## Working Independently

When working on this project:

1. **Explore thoroughly** - The codebase is designed for experimentation
2. **Make decisions** - Don't ask for permission on implementation details
3. **Iterate quickly** - Build, test, refine
4. **Stay focused** - Keep the core anti-lurk philosophy in mind
5. **Think long-term** - Consider scalability and user experience

You should work autonomously for extended periods, making architectural and UX decisions that align with the anti-lurk vision.

## Future Roadmap

### React Native App

The next major milestone is creating a **React Native version** for mobile devices (Android/iOS):

- Native mobile experience
- Same anti-lurk budget system
- Push notifications for engagement reminders
- Mobile-optimized UI/UX
- Offline budget tracking
- Cross-platform state sync

### Additional Features to Explore

- **Daily budget resets** - Fresh start each day
- **Streak system** - Reward consistent engagement
- **Achievement badges** - Gamification rewards
- **Social credit score** - Visual indicator of engagement level
- **Budget sharing** - Gift posts to friends
- **Time-based bonuses** - Extra budget during low-engagement periods
- **Content quality scoring** - Better rewards for thoughtful comments
- **Community challenges** - Group engagement goals

## Philosophy & Goals

This isn't about restricting access—it's about **reshaping behavior**:

- Combat doom scrolling
- Encourage authentic interaction
- Build healthier social media habits
- Foster reciprocal communities
- Make social media feel social again

The goal is to create a **self-regulating ecosystem** where users naturally balance consumption with contribution.

## Technical Notes

### State Management

Budget state is stored in localStorage and persists across sessions. Consider implementing:

- Daily/weekly reset mechanisms
- Server-side sync for cross-device experience
- Analytics on engagement patterns

### Performance

IntersectionObserver efficiently tracks post views without impacting performance. The current implementation:

- Uses 50% visibility threshold
- Tracks each post URI uniquely
- Only counts views when budget is available

### Customization

Everything is configurable via the Settings page:

- Initial budget amount
- Posts earned per engagement type
- Can be expanded to include time-based rules

## Android App Goal

The ultimate vision is a **native Android app** that:

- Provides the same anti-lurk experience on mobile
- Integrates seamlessly with Bluesky's AT Protocol
- Offers superior performance compared to web apps
- Can be published to Google Play Store
- Serves as the user's primary Bluesky client

This represents a complete custom social media experience where the user has full control over engagement mechanics and UI/UX.

---

## NEW FEATURE: Engagement Badge Lexicon System

### Overview

The **Engagement Badge** is a revolutionary feature that leverages AT Protocol's lexicon system to allow users to **publicly share their social participation statistics** as a verifiable badge. This takes the anti-lurk philosophy to the next level by turning engagement into a shareable social proof.

### What It Does

Users can opt-in to displaying an "engagement badge" on their profile that shows:
- **Posts Viewed** - Total posts scrolled
- **Likes Given** - Hearts sent to others
- **Reposts** - Content amplified
- **Replies** - Conversations started
- **Follows** - Connections made
- **Engagement Score** - Weighted calculation rewarding active participation
- **Streak Days** - Consecutive days of engagement

### The Lexicon Architecture

We've defined a custom AT Protocol lexicon under the namespace `social.antiLurk.*`:

#### 1. `social.antiLurk.engagementBadge` (Record Type)
The main record type that stores engagement statistics in the user's repository.

**Key Fields:**
- `postsViewed`, `likesGiven`, `repostsGiven`, `repliesGiven`, `followsGiven` - Engagement counters
- `engagementScore` - Calculated score (weighted formula)
- `streakDays` - Daily engagement streak tracker
- `visibility` - Privacy control: `public`, `followers`, or `private`
- `visibleMetrics` - Array of metrics the user wants to display
- `badgeStyle` - Visual preference: `compact`, `detailed`, or `minimal`
- `tier` - Achievement tier: `bronze`, `silver`, `gold`, `platinum`, `diamond`
- `createdAt`, `updatedAt` - Timestamps

**Storage Location:** The badge is stored in the user's own AT Protocol repository with `rkey: "self"`, meaning each user owns their engagement data.

#### 2. `social.antiLurk.labels` (Token Definitions)
Defines label values for self-labeling and achievements:

**Tier Labels:**
- `engagement-bronze` (< 100 points)
- `engagement-silver` (100-499)
- `engagement-gold` (500-1999)
- `engagement-platinum` (2000-4999)
- `engagement-diamond` (5000+)

**Achievement Labels:**
- `streak-champion` - 30+ day streak
- `reply-master` - 100+ replies
- `generous-liker` - 500+ likes
- `repost-king` - 100+ reposts
- `network-connector` - 50+ follows
- `super-engager` - High all-around engagement
- `conversation-starter` - High reply ratio

#### 3. `social.antiLurk.getEngagementBadge` (Query Endpoint)
API schema for fetching another user's badge (future implementation).

### Engagement Score Formula

The score uses **weighted values** to reward active participation over passive consumption:

```
engagementScore =
  (postsViewed × 1) +
  (likesGiven × 2) +
  (repostsGiven × 3) +
  (repliesGiven × 5) +
  (followsGiven × 10) +
  (streakDays × 20)
```

This formula intentionally values:
- **Replies** (5x) - Most valuable, shows meaningful conversation
- **Follows** (10x) - Network building, shows investment
- **Streaks** (20x per day) - Rewards consistency and habit formation
- **Likes** (2x) - Basic engagement, still counts
- **Views** (1x) - Minimal value, tracks consumption

### Technical Implementation

#### Core Components

1. **`EngagementBadgeContext.tsx`** - React context managing badge state
   - Tracks all engagement metrics in real-time
   - Persists to localStorage for offline resilience
   - Calculates tier and achievement labels automatically
   - Provides `publishBadge()` function to write to AT Protocol
   - Auto-publishes when `autoPublish` is enabled

2. **`EngagementBadge.tsx`** - Display component
   - Three visual styles: compact, detailed, minimal
   - Responsive tier colors and emojis
   - Customizable metric visibility
   - Streak highlights

3. **`BadgeSettings.tsx`** - Configuration UI
   - Visibility controls (public/followers/private)
   - Metric selection (show/hide individual stats)
   - Style preferences
   - Auto-publish toggle
   - Live preview
   - One-click publish to AT Protocol

4. **`Profile.tsx`** - New profile page
   - Showcases user's badge prominently
   - Displays achievement labels
   - Integrates badge settings
   - Educational content about the lexicon

#### Integration Points

**Feed.tsx** now tracks engagement:
- `incrementStat('postsViewed')` when posts scroll into view
- `incrementStat('likesGiven')` on like action
- `incrementStat('repostsGiven')` on repost
- `incrementStat('repliesGiven')` on reply
- `incrementStat('followsGiven')` on follow

**Streak Tracking:**
- Compares `lastActiveDate` in localStorage
- Increments streak for consecutive days
- Resets streak after 24+ hour gap

### Publishing to AT Protocol

When a user clicks "Publish Badge," the system:

1. Validates visibility settings (must be public or followers)
2. Calculates current engagement score and tier
3. Creates an `EngagementBadgeRecord` object
4. Calls `agent.com.atproto.repo.putRecord()` to write to the user's repository
5. Stores under collection `social.antiLurk.engagementBadge` with key `self`
6. Preserves original `createdAt` timestamp if updating

**Example API Call:**
```typescript
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
    visibility: 'public',
    visibleMetrics: ['likesGiven', 'repliesGiven', 'engagementScore'],
    badgeStyle: 'compact',
    tier: 'gold',
    createdAt: '2025-11-13T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
});
```

### Privacy & Opt-In Model

The badge system is **100% opt-in**:
- Default visibility is `private` (hidden)
- Users must explicitly change to `public` or `followers`
- Granular control over which metrics to display
- Can unpublish at any time by setting visibility to private

### Why This Matters

#### For Users:
- **Social Proof** - Demonstrate authentic engagement
- **Gamification** - Turn participation into achievements
- **Transparency** - Show you're a real contributor, not a bot
- **Motivation** - Visual progress encourages continued engagement

#### For the AT Protocol Ecosystem:
- **Custom Lexicon Example** - Demonstrates how to extend AT Protocol
- **Decentralized Data** - Badge data lives in user's own repository
- **Client Agnostic** - Any AT Protocol client can read/display these badges
- **Composable** - Other apps can build on this lexicon
- **No Central Authority** - No platform controls the badge system

#### For Anti-Lurk Philosophy:
- Makes engagement **visible and valuable**
- Creates **positive peer pressure** to participate
- Rewards **quality contributors** with recognition
- Turns **private stats into public badges of honor**

### Future Enhancements

#### Labeller Service (Planned)
Deploy a dedicated AT Protocol labeller that:
- Verifies badge authenticity (prevents gaming)
- Automatically applies tier labels to users
- Provides tamper-proof validation
- Creates leaderboards and rankings
- Offers "Official Anti-Lurk" certification

#### Cross-App Integration
Since badges use standard AT Protocol:
- Official Bluesky app could display badges
- Third-party clients can implement their own badge UI
- Bridges to other protocols (Mastodon, ActivityPub)
- Universal reputation system across apps

#### Advanced Features
- **Comparative Analytics** - "You're more engaged than 85% of users"
- **Badge NFTs** - Mint achievement badges as collectibles
- **Team Challenges** - Group engagement competitions
- **Sponsored Streaks** - Brands reward consistent engagers
- **Verified Badges** - Official badges for power contributors

### File Locations

```
lexicons/
  ├── README.md                          # Lexicon documentation
  └── social/
      └── antiLurk/
          ├── engagementBadge.json       # Main record schema
          ├── labels.json                # Label definitions
          └── getEngagementBadge.json    # Query schema

src/
  ├── types/
  │   └── engagementBadge.ts             # TypeScript types & utilities
  ├── context/
  │   └── EngagementBadgeContext.tsx     # State management
  ├── components/
  │   └── badge/
  │       ├── EngagementBadge.tsx        # Display component
  │       └── BadgeSettings.tsx          # Settings UI
  └── pages/
      └── Profile.tsx                    # Profile showcase page
```

### Developer Notes

- **LocalStorage Keys:**
  - `antiLurk_engagementStats` - Current statistics
  - `antiLurk_badgePreferences` - User preferences
  - `antiLurk_lastActiveDate` - For streak tracking

- **AT Protocol Collection:**
  - Collection: `social.antiLurk.engagementBadge`
  - Rkey: `self` (one badge per user)

- **Context Integration:**
  - `EngagementBadgeProvider` wraps the app in `App.tsx`
  - `useEngagementBadge()` hook provides access to stats and methods

### Testing the Feature

1. **View Profile:** Navigate to `/profile` to see your badge
2. **Track Stats:** Engage with posts in feed - watch counters update
3. **Customize:** Adjust visibility, metrics, and style in badge settings
4. **Publish:** Click "Publish Badge" to write to AT Protocol
5. **Verify:** Check developer console for successful API call
6. **Fetch:** Use AT Protocol tools to read your published badge from your repository

### Educational Value

This implementation serves as a **comprehensive example** of:
- ✅ Defining custom AT Protocol lexicons
- ✅ Storing records in user repositories
- ✅ Implementing self-labels
- ✅ Building opt-in privacy controls
- ✅ Creating client-side tracking systems
- ✅ Integrating React with AT Protocol SDK
- ✅ Designing gamification mechanics
- ✅ Building decentralized social features

### Experiment Budget

This feature was built as an experiment to push the boundaries of what a single Claude Code session can accomplish with extended autonomy. The goal: build a complete, production-ready custom lexicon system in one go.

**Deliverables:**
- ✅ 3 complete lexicon schema definitions (JSON)
- ✅ Full TypeScript type system
- ✅ React Context with state management
- ✅ 3 major UI components
- ✅ Complete profile page
- ✅ Integration with existing feed
- ✅ AT Protocol publishing logic
- ✅ Comprehensive documentation
- ✅ Privacy controls
- ✅ Achievement system

This represents a **substantial extension** to the anti-lurk system, proving that custom lexicons can enable entirely new social primitives on AT Protocol.

---

**Remember**: The goal isn't to punish lurking—it's to reward engagement and create a more balanced, reciprocal social experience. Every feature should reinforce this philosophy.
