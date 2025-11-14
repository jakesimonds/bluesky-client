# Installing Bluesky Anti-Lurk on Android

This guide will help you install the Bluesky Anti-Lurk client as a native Android app on your device.

## Prerequisites

### On Your Computer

1. **Node.js 18+** (already installed)
2. **Java Development Kit (JDK) 17**
   ```bash
   # Check if installed
   java -version

   # Install on Ubuntu/Debian
   sudo apt install openjdk-17-jdk

   # Install on macOS
   brew install openjdk@17
   ```

3. **Android Studio** (includes Android SDK)
   - Download from: https://developer.android.com/studio
   - During setup, make sure to install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (if you want an emulator)

4. **Android SDK Setup**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### On Your Android Device

1. **Enable Developer Options**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options

2. **Enable USB Debugging**
   - In Developer Options, enable "USB Debugging"

3. **Connect via USB**
   - Connect your phone to computer
   - Allow USB debugging when prompted

## Quick Setup with React Native CLI

### 1. Create React Native Project

```bash
# In parent directory (not in bluesky-client)
cd ..
npx @react-native-community/cli@latest init BlueskyAntiLurk --version 0.73.6
cd BlueskyAntiLurk
```

### 2. Install Dependencies

```bash
# Install AT Protocol SDK
npm install @atproto/api

# Install navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# Install async storage
npm install @react-native-async-storage/async-storage
```

### 3. Copy Budget Context and Logic

Copy the following files from the web app to your React Native project:

```bash
# From bluesky-client/src to BlueskyAntiLurk/src
cp ../bluesky-client/src/context/BudgetContext.tsx ./src/context/
cp ../bluesky-client/src/context/AuthContext.tsx ./src/context/
cp ../bluesky-client/src/services/auth.ts ./src/services/
```

### 4. Adapt for React Native

Update imports to use React Native components:
- Change `<div>` to `<View>`
- Change `<span>` to `<Text>`
- Change `<input>` to `<TextInput>`
- Change `<button>` to `<TouchableOpacity>` or `<Button>`
- Use `AsyncStorage` instead of `localStorage`
- Replace `IntersectionObserver` with `onScroll` events

### 5. Build and Run

```bash
# Check connected devices
adb devices

# Run on Android device
npx react-native run-android
```

The app will install and launch on your connected device!

## Alternative: Manual APK Build

### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Install APK on Device

```bash
# Install via ADB
adb install android/app/build/outputs/apk/release/app-release.apk

# Or copy APK to phone and install manually
```

## Simplified Approach: Use Expo

If React Native CLI is too complex, use Expo:

```bash
# Create Expo project
cd ..
npx create-expo-app BlueskyAntiLurkExpo
cd BlueskyAntiLurkExpo

# Install dependencies
npm install @atproto/api @react-navigation/native @react-navigation/native-stack
npx expo install expo-secure-store

# Copy your logic from bluesky-client
# Adapt for React Native components

# Run on device
npm start
# Scan QR code with Expo Go app on Android
```

## Key Differences for Mobile

### 1. Storage
Replace `localStorage` with `AsyncStorage`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('key', JSON.stringify(data));

// Load
const data = await AsyncStorage.getItem('key');
const parsed = JSON.parse(data);
```

### 2. Scroll Tracking
Replace `IntersectionObserver` with `onScroll`:

```tsx
<FlatList
  data={posts}
  onScroll={(event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Track viewed posts based on scroll position
  }}
  renderItem={({ item }) => <PostCard post={item} />}
/>
```

### 3. Styling
Use React Native StyleSheet:

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  post: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
});
```

## Project Structure

```
BlueskyAntiLurk/
├── android/                # Android native code
├── ios/                    # iOS native code (ignore for now)
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── BudgetContext.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── PostCard.tsx
│   │   └── BudgetDisplay.tsx
│   ├── services/
│   │   └── auth.ts
│   └── App.tsx
├── App.tsx                 # Entry point
└── package.json
```

## Testing on Your Device

### Via USB (Recommended)

1. Connect phone via USB
2. Enable USB debugging
3. Run `npx react-native run-android`
4. App installs and launches automatically

### Via APK Transfer

1. Build release APK (see above)
2. Transfer APK to phone (via USB, email, cloud storage)
3. Open APK on phone
4. Allow "Install from Unknown Sources" if prompted
5. Install and launch

## Troubleshooting

### "No devices found"
```bash
# Check ADB connection
adb devices

# Restart ADB server
adb kill-server
adb start-server
```

### Build Errors
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Metro Bundler Issues
```bash
# Clear cache
npx react-native start --reset-cache
```

## Next Steps

Once you have the basic React Native app running:

1. Port the BudgetContext logic
2. Implement scroll-based budget consumption
3. Add all engagement features (like, repost, follow, reply)
4. Style with React Native components
5. Test the anti-lurk budget system on mobile

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [AT Protocol API Docs](https://github.com/bluesky-social/atproto)
- [React Navigation](https://reactnavigation.org/)

---

**Note**: The React Native version will have the same anti-lurk mechanics as the web version, but optimized for mobile scrolling patterns and touch interactions.
