import React from 'react';

interface ATProtoApp {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  color: string;
}

interface ATProtoAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const atprotoApps: ATProtoApp[] = [
  {
    name: 'Bluesky',
    description: 'Decentralized social network - Twitter/X alternative',
    url: 'https://bsky.app',
    icon: '🦋',
    category: 'Social Network',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    name: 'Frontpage',
    description: 'Link aggregator and discussion platform - Reddit alternative',
    url: 'https://frontpage.fyi',
    icon: '📰',
    category: 'Discussion',
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: 'WhiteWind',
    description: 'Long-form blogging platform built on AT Protocol',
    url: 'https://whtwnd.com',
    icon: '✍️',
    category: 'Blogging',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: 'SmokeSignal',
    description: 'Video sharing platform on the AT Protocol',
    url: 'https://smokesignal.events',
    icon: '📹',
    category: 'Video',
    color: 'bg-red-50 border-red-200',
  },
  {
    name: 'Skeets',
    description: 'Alternative Bluesky client with enhanced features',
    url: 'https://skeets.app',
    icon: '🎯',
    category: 'Social Client',
    color: 'bg-green-50 border-green-200',
  },
  {
    name: 'Graysky',
    description: 'Mobile-first Bluesky client for iOS and Android',
    url: 'https://graysky.app',
    icon: '📱',
    category: 'Mobile Client',
    color: 'bg-gray-50 border-gray-300',
  },
];

export const ATProtoAppsModal: React.FC<ATProtoAppsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">AT Protocol Ecosystem</h2>
              <p className="text-sm text-blue-100 mt-1">
                Explore apps built on the decentralized AT Protocol
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atprotoApps.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${app.color} border-2 rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 group`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-4xl flex-shrink-0">{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-900">{app.name}</h3>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mb-2">{app.category}</p>
                    <p className="text-sm text-gray-700">{app.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-xl mr-2">🌐</span>
              What is AT Protocol?
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              The AT Protocol (Authenticated Transfer Protocol) is an open, decentralized social networking protocol.
              Your identity and data belong to you, not any single app.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>✓ <strong>Portable Identity</strong> - Your handle works across all AT Protocol apps</li>
              <li>✓ <strong>Own Your Data</strong> - Take your posts, followers, and content anywhere</li>
              <li>✓ <strong>Interoperable</strong> - Different apps can interact with the same network</li>
              <li>✓ <strong>No Lock-in</strong> - Switch between apps without losing your social graph</li>
            </ul>
          </div>

          {/* Current Status */}
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-xl mr-2">🔗</span>
              Your AT Protocol Identity
            </h3>
            <p className="text-sm text-gray-700">
              You're currently signed in with your AT Protocol identity. This same identity can be used
              across all the apps listed above. Try visiting them with your credentials!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <a
            href="https://atproto.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Learn more about AT Protocol →
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
