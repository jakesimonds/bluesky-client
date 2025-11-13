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

**Remember**: The goal isn't to punish lurking—it's to reward engagement and create a more balanced, reciprocal social experience. Every feature should reinforce this philosophy.
