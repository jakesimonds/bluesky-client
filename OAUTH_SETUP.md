# OAuth Authentication Setup Guide

This project now uses **AT Protocol OAuth** for authentication instead of app passwords. This provides a more secure and user-friendly authentication experience.

## What Changed?

### Before: App Password Authentication
- Users had to create app passwords in Bluesky settings
- Required copying and pasting complex passwords (xxxx-xxxx-xxxx-xxxx)
- Less secure if passwords were leaked

### After: OAuth Authentication
- Users sign in with their **regular Bluesky username and password**
- No need to create or manage app passwords
- More secure with OAuth 2.0 standard and DPoP (Demonstrating Proof-of-Possession)
- Session management handled automatically

## How OAuth Works in AT Protocol

1. **User enters their handle** (e.g., alice.bsky.social)
2. **App redirects to Bluesky's authorization server**
3. **User signs in with their regular password** on the official Bluesky page
4. **User authorizes the app** to access their account
5. **Bluesky redirects back** to the app with an authorization code
6. **App exchanges code for tokens** and creates a session
7. **User is authenticated** and can use the app

## Technical Implementation

### Key Components

1. **OAuth Service** (`src/services/oauth.ts`)
   - Manages OAuth client initialization
   - Handles login flow and redirects
   - Provides authenticated Agent instance

2. **Client Metadata** (`public/client-metadata.json`)
   - Published JSON file that identifies your app
   - Contains redirect URIs, app name, and OAuth settings
   - Must be publicly accessible at the URL specified as `client_id`

3. **OAuth Callback** (`src/pages/OAuthCallback.tsx`)
   - Handles the redirect back from Bluesky after authorization
   - Processes OAuth callback and completes authentication

4. **Updated Auth Context** (`src/context/AuthContext.tsx`)
   - Initializes OAuth on app load
   - Manages authentication state
   - Provides Agent instance for API calls

### Dependencies

- `@atproto/oauth-client-browser` - Browser-based OAuth client
- `@atproto/api` (v0.17.7+) - AT Protocol API with Agent class

### Security Features

- **PKCE** (Proof Key for Code Exchange) - Required for all clients
- **DPoP** (Demonstrating Proof-of-Possession) - Binds tokens to client
- **PAR** (Pushed Authorization Requests) - Streamlines auth flow
- **Token rotation** - Automatic refresh of credentials
- **IndexedDB storage** - Secure browser storage for sessions

## Development Setup

### For Local Development (localhost:3000)

The current configuration in `public/client-metadata.json` is set up for local development:

```json
{
  "client_id": "http://localhost:3000/client-metadata.json",
  "redirect_uris": ["http://localhost:3000/oauth/callback"]
}
```

This works for testing on your local machine.

### For Production Deployment

When deploying to production, you **MUST** update the following:

1. **Update `public/client-metadata.json`:**
   ```json
   {
     "client_id": "https://yourdomain.com/client-metadata.json",
     "client_name": "Your App Name",
     "client_uri": "https://yourdomain.com",
     "redirect_uris": [
       "https://yourdomain.com/oauth/callback"
     ],
     "scope": "atproto transition:generic",
     "grant_types": ["authorization_code", "refresh_token"],
     "response_types": ["code"],
     "application_type": "web",
     "token_endpoint_auth_method": "none",
     "dpop_bound_access_tokens": true
   }
   ```

2. **Update `src/services/oauth.ts`:**
   ```typescript
   const CLIENT_ID = 'https://yourdomain.com/client-metadata.json';
   ```

3. **Ensure HTTPS:**
   - Production must use HTTPS (required by OAuth spec)
   - The client-metadata.json must be accessible at the exact URL specified in `client_id`
   - All redirect URIs must use HTTPS

### Environment-Based Configuration

For better flexibility, consider using environment variables:

```typescript
const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || 'http://localhost:3000/client-metadata.json';
```

Then create a `.env` file:
```
VITE_OAUTH_CLIENT_ID=https://yourdomain.com/client-metadata.json
```

## Testing the OAuth Flow

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the app:** Navigate to `http://localhost:3000`

3. **Click "Sign In with OAuth"**

4. **Enter your Bluesky handle** (e.g., yourname.bsky.social)

5. **You'll be redirected to Bluesky** to authorize the app

6. **Sign in with your regular password** on the Bluesky page

7. **Authorize the app** when prompted

8. **You'll be redirected back** to the app and automatically logged in

## Privacy Considerations

The current implementation uses Bluesky's handle resolver (`https://bsky.social`), which means:
- User IP addresses are visible to Bluesky
- Handle identifiers are sent to Bluesky for resolution

For better privacy in production:
- Consider self-hosting a handle resolver
- Or use your PDS URL directly if you run your own PDS

## Troubleshooting

### "OAuth client not initialized" error
- Make sure the OAuth service initializes before trying to log in
- Check browser console for initialization errors

### Redirect not working
- Verify `client-metadata.json` is accessible at the client_id URL
- Check that redirect URIs match exactly (including trailing slashes)
- Ensure you're using HTTPS in production

### "Failed to fetch profile" error
- This can happen if the session is invalid
- Try logging out and logging in again
- Check that you have the correct permissions

### Development on a different port
If you change the Vite port (default is 3000), update:
1. `public/client-metadata.json` - Update all URLs
2. `src/services/oauth.ts` - Update CLIENT_ID

## Migration from App Passwords

If you were previously using app passwords:

1. **Old code still exists** in `src/services/auth.ts` (not used)
2. **Sessions are not compatible** - users will need to log in again
3. **No data loss** - only authentication method changed
4. **More secure** - OAuth is the recommended approach

## Learn More

- [AT Protocol OAuth Specification](https://atproto.com/specs/oauth)
- [Bluesky OAuth Guide](https://docs.bsky.app/docs/advanced-guides/oauth-client)
- [OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749)
- [DPoP RFC](https://datatracker.ietf.org/doc/html/rfc9449)
