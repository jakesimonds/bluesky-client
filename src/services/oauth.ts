import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import { Agent } from '@atproto/api';

const CLIENT_ID = 'http://localhost:3000/client-metadata.json';
const HANDLE_RESOLVER = 'https://bsky.social';

export class OAuthService {
  private oauthClient: BrowserOAuthClient | null = null;
  private agent: Agent | null = null;

  async init(): Promise<{ isAuthenticated: boolean; agent: Agent | null }> {
    try {
      // Initialize the OAuth client
      this.oauthClient = await BrowserOAuthClient.load({
        clientId: CLIENT_ID,
        handleResolver: HANDLE_RESOLVER,
      });

      // Check if we're returning from OAuth callback
      const result = await this.oauthClient.init();

      if (result?.session) {
        // User is authenticated
        this.agent = new Agent(result.session);
        return { isAuthenticated: true, agent: this.agent };
      }

      return { isAuthenticated: false, agent: null };
    } catch (error) {
      console.error('OAuth initialization failed:', error);
      return { isAuthenticated: false, agent: null };
    }
  }

  async login(handle: string): Promise<void> {
    if (!this.oauthClient) {
      throw new Error('OAuth client not initialized');
    }

    try {
      // Start the OAuth authorization flow
      const url = await this.oauthClient.authorize(handle);

      // Redirect to the authorization URL
      window.location.href = url.toString();

      // Prevent back-cache issues by waiting
      await new Promise((_resolve, reject) => {
        setTimeout(reject, 10000, new Error('Navigation back detected'));
      });
    } catch (error) {
      console.error('OAuth login failed:', error);
      throw new Error('Failed to start OAuth login flow');
    }
  }

  async logout(): Promise<void> {
    if (this.agent && 'signOut' in this.agent) {
      try {
        await (this.agent as any).signOut();
      } catch (error) {
        console.error('Sign out failed:', error);
      }
    }
    this.agent = null;
    // Clear any stored session data
    window.location.href = '/';
  }

  getAgent(): Agent | null {
    return this.agent;
  }

  async getUserProfile() {
    if (!this.agent) {
      throw new Error('Not authenticated');
    }

    try {
      const profile = await this.agent.getProfile({ actor: this.agent.did! });
      return profile.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }
}

export const oauthService = new OAuthService();
