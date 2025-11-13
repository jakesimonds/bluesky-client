import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/auth';
import type { AppBskyActorDefs } from '@atproto/api';

interface AppUsage {
  schema: string;
  appName: string;
  recordCount: number;
}

export const Profile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AppBskyActorDefs.ProfileViewDetailed | null>(null);
  const [apps, setApps] = useState<AppUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!handle) return;

      try {
        const agent = authService.getAgent();

        // Get profile
        const profileResponse = await agent.getProfile({ actor: handle });
        setProfile(profileResponse.data);

        // Try to detect apps by listing repos
        try {
          const repoResponse = await agent.com.atproto.repo.listRecords({
            repo: profileResponse.data.did,
            collection: 'app.bsky.feed.post',
            limit: 1,
          });

          // Detect apps based on schemas
          const detectedApps: AppUsage[] = [];

          // Check for Bluesky posts
          if (repoResponse.data.records.length > 0) {
            detectedApps.push({
              schema: 'app.bsky.feed.post',
              appName: 'Bluesky',
              recordCount: repoResponse.data.records.length,
            });
          }

          // Try to detect other common schemas
          const schemasToCheck = [
            { schema: 'com.whtwnd.blog.entry', appName: 'WhiteWind (Blog)' },
            { schema: 'fyi.unravel.frontpage.post', appName: 'Frontpage' },
          ];

          for (const { schema, appName } of schemasToCheck) {
            try {
              const response = await agent.com.atproto.repo.listRecords({
                repo: profileResponse.data.did,
                collection: schema,
                limit: 1,
              });

              if (response.data.records.length > 0) {
                detectedApps.push({
                  schema,
                  appName,
                  recordCount: response.data.records.length,
                });
              }
            } catch (err) {
              // Schema doesn't exist for this user
            }
          }

          setApps(detectedApps);
        } catch (err) {
          console.error('Failed to detect apps:', err);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [handle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

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
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
