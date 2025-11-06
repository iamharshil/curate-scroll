 ## Copilot changelog

This file is maintained by AI coding agents (and humans) to record each substantive change, why it was done, and what the previous state was.

Append new entries to the top. Required fields:
- ISO timestamp
- Author (AI agent or human)
- Summary (1-line)
- Files changed
- Rationale (1-2 lines)
- Previous state (1 line)

---

2025-11-06T18:00:00Z — Copilot
- Summary: Replace WebView with react-native-youtube-iframe to fix YouTube error 153
- Files changed: src/components/feed/FeedCardItem.tsx, package.json
- Rationale: Installed and integrated react-native-youtube-iframe library (dedicated YouTube player component) to replace WebView approach. This library properly handles YouTube API authentication and avoids error 153 (missing HTTP Referer header). YoutubePlayer component has built-in features like state management, error handling, and no security header issues. Removed WebView dependency and unused webview styles.
- Previous state: Using react-native-webview with direct URI causing error 153 authentication issues

2025-11-06T17:55:00Z — Copilot
- Summary: Fix video player height and layout after clicking play
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Removed flex: 1 from videoWrapper that was causing videos to expand beyond screen. Reduced videoContainer height from 300 to 225 pixels for better proportions. Changed nested flex container back to using videoContainer style. Video now displays at fixed reasonable height like thumbnail (16:9 aspect ratio, ~225px tall).
- Previous state: Video player was taking full remaining screen height with flex: 1 layout

2025-11-06T17:50:00Z — Copilot
- Summary: Simplify YouTube embed using direct WebView URI and proven react-native-webview approach
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Replaced HTML source injection with direct URI to YouTube embed endpoint. Used proven pattern with `source={{ uri: 'https://www.youtube.com/embed/{videoId}' }}` and wrapped WebView in flex container. Removed complex HTML generation and unnecessary WebView props. Added Platform-specific marginTop for iOS. Much simpler and more reliable approach.
- Previous state: Using HTML source injection with generated iframe templates and complex WebView configuration

2025-11-06T17:45:00Z — Copilot
- Summary: Switch to official YouTube embed domain (www.youtube.com) per Google documentation
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Updated embed URL from youtube-nocookie.com to https://www.youtube.com/embed/VIDEO_ID following official YouTube iframe API docs. Removed deprecated modestbranding parameter and unnecessary WebView props (originWhitelist, mixedContentMode, allowFileAccess, etc.). Simplified HTML template and logging. Using controls=1&playsinline=1 params per official docs.
- Previous state: Using youtube-nocookie.com domain with deprecated parameters and overly complex WebView configuration

2025-11-06T17:35:00Z — Copilot
- Summary: Add HTTP Referrer-Policy headers to YouTube embed per YouTube documentation
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Added meta tags for Referrer-Policy in HTML head (both name and http-equiv variants) plus referrerpolicy attribute on iframe. Added injected JavaScript logging and enhanced console output to show all security headers being applied. Implements YouTube's required-minimum-functionality spec.
- Previous state: Only iframe referrerpolicy attribute without meta tags or HTTP header support

2025-11-06T17:30:00Z — Copilot
- Summary: Implement oEmbed validation and add referrerPolicy for YouTube embed security
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Added validateYoutubeVideo function using YouTube oEmbed API to pre-validate video embeddability. Changed embed domain to youtube-nocookie.com for privacy. Added referrerpolicy="strict-origin-when-cross-origin" attribute to iframe. Enhanced logging to show both primary and fallback embed URLs plus validation status.
- Previous state: Simple embed without validation or proper referrer policy security headers

2025-11-06T17:25:00Z — Copilot
- Summary: Add detailed logging for YouTube embed URLs in FeedCardItem
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Added comprehensive console logging to display video title, video ID, original URL, full embed URL, and HTML size for each YouTube video. Helps with debugging embed issues and verifying correct URL generation.
- Previous state: No logging for generated embed URLs

2025-11-06T17:20:00Z — Copilot
- Summary: Fix YouTube embed to use standard embed domain with proper WebView configuration
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Simplified HTML template and switched back to youtube.com/embed (standard domain). Fixed WebView props to allow file access and universal access for HTML content. Changed originWhitelist to '*' and mixedContentMode to 'always' for HTML source compatibility. Added detailed console logging for debugging embed issues.
- Previous state: Using youtube-nocookie domain with overly restrictive security settings causing embed failures

2025-11-06T17:15:00Z — Copilot
- Summary: Fix YouTube video domain configuration errors in WebView player
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Replaced youtube.com with youtube-nocookie.com domain for privacy compliance and fixed WebView security settings. Changed originWhitelist to proper https/http patterns. Adjusted mixedContentMode to 'compatibility' and disabled problematic cookie settings that caused domain errors.
- Previous state: WebView used youtube.com domain with overly permissive security settings causing configuration errors

2025-11-06T17:10:00Z — Copilot
- Summary: Implement embedded YouTube video player using WebView in FeedCardItem
- Files changed: src/components/feed/FeedCardItem.tsx
- Rationale: Replaced external YouTube links with fully functional embedded video player using react-native-webview. Videos now play directly in the app with full controls, similar to web experience. Added loading indicator and proper video header with close button.
- Previous state: FeedCardItem showed thumbnail with button to open YouTube externally

2025-11-06T17:00:00Z — Copilot
- Summary: Add YouTube video playback capability and debugging to FeedScreen
- Files changed: src/screens/FeedScreen.tsx, src/components/feed/FeedCardItem.tsx
- Rationale: Added console logging to debug video loading, error handling UI, loading states. Updated FeedCardItem with Linking API to open YouTube videos in app/browser. Added red "Watch on YouTube" button with proper error handling.
- Previous state: FeedScreen showed only text links without ability to open videos; no debugging or error states

2025-11-06T16:50:00Z — Copilot
- Summary: Replace expo-video player with embedded YouTube video display on FeedScreen
- Files changed: src/components/feed/FeedCardItem.tsx, src/services/youtube.service.ts
- Rationale: Removed dependency on expo-video player and replaced with native YouTube video embeds. Shows thumbnail with play button overlay; clicking opens YouTube link. Added thumbnail and description to YouTube video responses in service.
- Previous state: FeedCardItem used expo-video VideoView component to play videos

2025-11-06T16:45:00Z — Copilot
- Summary: Fix React hooks violation in FeedScreen by refactoring video player logic to child component
- Files changed: src/screens/FeedScreen.tsx, src/components/feed/FeedCardItem.tsx
- Rationale: Resolved "Rendered more hooks than during the previous render" error by moving `useVideoPlayer` hook from parent component (where it was called inside `.map()`) to individual FeedCardItem child component where it's called unconditionally at top level.
- Previous state: FeedScreen called `useVideoPlayer` inside `feed.map()`, violating React hooks rules and causing conditional hook calls

2025-11-06T14:30:00Z — Copilot
- Summary: Created initial copilot instructions and changelog file
- Files changed: .github/copilot-instructions.md, .github/copilot-changelog.md
- Rationale: Provide AI agents with repo-specific startup guidance and a place to record future changes.
- Previous state: No copilot instructions or changelog present in repo
