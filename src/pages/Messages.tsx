import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  id: string;
  participant: {
    handle: string;
    displayName: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [conversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConvo) return;

    try {
      // This would use the AT Protocol chat API
      // For now, this is a placeholder
      console.log('Sending message:', messageText);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
          {/* Conversations List */}
          <div className="col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-gray-600 font-medium">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start engaging with the community to receive messages!
                  </p>
                </div>
              ) : (
                conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedConvo(convo.id)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                      selectedConvo === convo.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={convo.participant.avatar || 'https://via.placeholder.com/40'}
                        alt={convo.participant.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 truncate">
                            {convo.participant.displayName}
                          </p>
                          {convo.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">@{convo.participant.handle}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">{convo.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col">
            {selectedConvo ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">Conversation</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="text-center text-gray-500 text-sm">
                    No messages yet. Start the conversation!
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">📨</div>
                  <p className="text-gray-600 font-medium">Select a conversation</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Direct messaging functionality is in development. The AT Protocol supports
            DMs through the chat/conversation API. This interface is ready to integrate with the full messaging system.
          </p>
        </div>
      </main>
    </div>
  );
};
