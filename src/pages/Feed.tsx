import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import type { AppBskyFeedDefs } from '@atproto/api';

export const Feed: React.FC = () => {
  const { authState, logout } = useAuth();
  const { budgetState, recordLike, recordRepost, recordFollow, canViewMorePosts } = useBudget();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [repostedPosts, setRepostedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const agent = authService.getAgent();
        const response = await agent.getTimeline({ limit: 50 });
        setPosts(response.data.feed);
      } catch (err) {
        setError('Failed to load feed');
        console.error('Feed error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async (uri: string, cid: string) => {
    if (likedPosts.has(uri)) return;

    try {
      const agent = authService.getAgent();
      await agent.like(uri, cid);
      setLikedPosts(prev => new Set(prev).add(uri));
      recordLike();

      // Update post like count locally
      setPosts(prev => prev.map(item =>
        item.post.uri === uri
          ? { ...item, post: { ...item.post, likeCount: (item.post.likeCount || 0) + 1 } }
          : item
      ));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleRepost = async (uri: string, cid: string) => {
    if (repostedPosts.has(uri)) return;

    try {
      const agent = authService.getAgent();
      await agent.repost(uri, cid);
      setRepostedPosts(prev => new Set(prev).add(uri));
      recordRepost();

      // Update post repost count locally
      setPosts(prev => prev.map(item =>
        item.post.uri === uri
          ? { ...item, post: { ...item.post, repostCount: (item.post.repostCount || 0) + 1 } }
          : item
      ));
    } catch (err) {
      console.error('Failed to repost:', err);
    }
  };

  const handleFollow = async (did: string) => {
    if (followedUsers.has(did)) return;

    try {
      const agent = authService.getAgent();
      await agent.follow(did);
      setFollowedUsers(prev => new Set(prev).add(did));
      recordFollow();
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bluesky</h1>
              <p className="text-sm text-gray-600">@{authState.handle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/messages')}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
              >
                Messages
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                Settings
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Budget Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Posts Remaining</p>
                <p className="text-2xl font-bold text-blue-600">{budgetState.postsRemaining}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Engagement Today</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-sm">
                    <span className="font-semibold">{budgetState.likesGiven}</span> likes
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{budgetState.repostsGiven}</span> reposts
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{budgetState.followsGiven}</span> follows
                  </span>
                </div>
              </div>
            </div>
            {!canViewMorePosts && (
              <div className="mt-2 text-sm text-amber-700 font-medium">
                Engage with posts to unlock more! Like (+{budgetState.settings.postsPerLike}), Repost (+{budgetState.settings.postsPerRepost}), or Follow (+{budgetState.settings.postsPerFollow})
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your feed...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {posts.slice(0, budgetState.postsViewed + budgetState.postsRemaining).map((item, index) => {
              const post = item.post;
              const author = post.author;
              const record = post.record as any;
              const isLocked = index >= budgetState.postsViewed + budgetState.postsRemaining;
              const isLiked = likedPosts.has(post.uri);
              const isReposted = repostedPosts.has(post.uri);
              const isFollowing = followedUsers.has(author.did);

              return (
                <article
                  key={post.uri}
                  className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition ${
                    isLocked ? 'opacity-50 blur-sm pointer-events-none' : ''
                  }`}
                >
                  {/* Author info */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={author.avatar || 'https://via.placeholder.com/40'}
                      alt={author.displayName || author.handle}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="font-semibold text-gray-900 truncate">
                            {author.displayName || author.handle}
                          </span>
                          <span className="text-gray-500 text-sm truncate">
                            @{author.handle}
                          </span>
                          <span className="text-gray-400 text-sm">·</span>
                          <span className="text-gray-500 text-sm">
                            {formatDate(post.indexedAt)}
                          </span>
                        </div>
                        {author.did !== authState.did && (
                          <button
                            onClick={() => handleFollow(author.did)}
                            disabled={isFollowing}
                            className={`ml-2 px-3 py-1 text-xs font-medium rounded-full transition ${
                              isFollowing
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                          </button>
                        )}
                      </div>

                      {/* Post content */}
                      <div className="mt-2 text-gray-900 whitespace-pre-wrap break-words">
                        {record.text}
                      </div>

                      {/* Engagement buttons */}
                      <div className="mt-3 flex items-center space-x-6">
                        <span className="flex items-center space-x-1 text-gray-500 text-sm">
                          <span>💬</span>
                          <span>{post.replyCount || 0}</span>
                        </span>

                        <button
                          onClick={() => handleRepost(post.uri, post.cid)}
                          disabled={isReposted}
                          className={`flex items-center space-x-1 text-sm transition ${
                            isReposted
                              ? 'text-green-600 font-semibold'
                              : 'text-gray-500 hover:text-green-600'
                          }`}
                        >
                          <span>{isReposted ? '✅' : '🔄'}</span>
                          <span>{post.repostCount || 0}</span>
                        </button>

                        <button
                          onClick={() => handleLike(post.uri, post.cid)}
                          disabled={isLiked}
                          className={`flex items-center space-x-1 text-sm transition ${
                            isLiked
                              ? 'text-red-600 font-semibold'
                              : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <span>{isLiked ? '💖' : '❤️'}</span>
                          <span>{post.likeCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Budget exhausted message */}
            {!canViewMorePosts && posts.length > budgetState.postsViewed + budgetState.postsRemaining && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🚫</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Post Budget Exhausted!</h3>
                <p className="text-gray-700 mb-4">
                  You've reached your post viewing limit. Engage with posts above to unlock more!
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="bg-white px-4 py-2 rounded-lg border border-amber-200">
                    Like a post: <span className="font-bold text-blue-600">+{budgetState.settings.postsPerLike} posts</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border border-amber-200">
                    Repost: <span className="font-bold text-green-600">+{budgetState.settings.postsPerRepost} posts</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border border-amber-200">
                    Follow: <span className="font-bold text-purple-600">+{budgetState.settings.postsPerFollow} posts</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts to display</p>
            <p className="text-sm text-gray-500 mt-2">
              Follow some accounts to see their posts here
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
