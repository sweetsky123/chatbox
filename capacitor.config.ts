import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor configuration for the Android build (see scripts/build-android.mjs
 * and .github/workflows/build.yml). The native android/ project is scaffolded
 * from this config by `cap add android` at build time; it is not checked in.
 */
const config: CapacitorConfig = {
  appId: 'xyz.chatboxapp.ce',
  appName: 'Chatbox',
  webDir: 'release/app/dist/renderer',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
}

export default config
