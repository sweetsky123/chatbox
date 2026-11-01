#!/usr/bin/env node
/**
 * Build the Android app from the Capacitor renderer bundle.
 *
 * The native android/ project is not checked in: it is scaffolded by
 * `cap add android` from capacitor.config.ts, patched for fork builds
 * (version, ABI splits, debug-signed release so APKs are installable),
 * synced, and built with gradle. Used by .github/workflows/build.yml.
 *
 * Environment:
 *   CHATBOX_TAG          tag being built (e.g. v1.24.0); optional
 *   CHATBOX_SKIP_BUILD   set to only scaffold + patch + sync (no gradle)
 */
const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '..')
const androidDir = path.join(repoRoot, 'android')
const tag = process.env.CHATBOX_TAG || ''

function sh(cmd, options = {}) {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: repoRoot, ...options })
}

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'release/app/package.json'), 'utf8'))
  if (tag && /^v?\d+\.\d+\.\d+/.test(tag)) {
    return tag.replace(/^v/, '').split('-')[0]
  }
  return pkg.version
}

function versionCodeFrom(version) {
  const parts = version.split('.').map((n) => parseInt(n, 10) || 0)
  const [major = 0, minor = 0, patch = 0] = parts
  return major * 1000000 + minor * 1000 + patch
}

function patchFile(file, replacements) {
  let text = fs.readFileSync(file, 'utf8')
  for (const [pattern, value] of replacements) {
    if (!pattern.test(text)) {
      throw new Error(`Pattern ${pattern} not found in ${file}`)
    }
    text = text.replace(pattern, value)
  }
  fs.writeFileSync(file, text)
  console.log(`patched ${path.relative(repoRoot, file)}`)
}

function main() {
  const version = readVersion()
  const code = versionCodeFrom(version)
  console.log(`Building Chatbox android ${version} (versionCode ${code})`)

  if (!fs.existsSync(androidDir)) {
    // cap add validates webDir, so the mobile renderer bundle must exist.
    sh(`node node_modules/@capacitor/cli/bin/capacitor add android`)
  }

  // Fork builds are unsigned by upstream keys: debug-sign the release build so
  // the APKs actually install, and emit per-ABI splits plus a universal APK.
  patchFile(path.join(androidDir, 'app', 'build.gradle'), [
    [
      /buildTypes \{\n(\s*)release \{/,
      'buildTypes {\n$1release {\n$1    signingConfig signingConfigs.debug',
    ],
    [
      /android \{\n/,
      [
        'android {',
        '    splits {',
        '        abi {',
        '            enable true',
        '            reset()',
        "            include 'arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'",
        '            universalApk true',
        '        }',
        '    }',
        '',
      ].join('\n'),
    ],
    [
      /    versionCode 1/,
      `    versionCode ${code}`,
    ],
    [
      /    versionName "1\.0"/,
      `    versionName "${version}"`,
    ],
  ])

  // Best effort app icon/splash from resources/; a failure must not block the build.
  try {
    sh(
      'node node_modules/@capacitor/assets/bin/capacitor-assets generate --android ' +
        '--assetPath resources --iconBackgroundColor "#1f2937" ' +
        '--iconBackgroundColorDark "#111827" --splashBackgroundColor "#1f2937" ' +
        '--splashBackgroundColorDark "#111827"'
    )
  } catch (error) {
    console.warn(`icon generation skipped: ${error.message}`)
  }

  sh(`node node_modules/@capacitor/cli/bin/capacitor sync android`)

  if (process.env.CHATBOX_SKIP_BUILD) {
    console.log('CHATBOX_SKIP_BUILD set — skipping gradle')
    return
  }
  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew'
  sh(`${gradlew} assembleRelease --no-daemon`, { cwd: androidDir })

  const outDir = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release')
  const apks = fs
    .readdirSync(outDir)
    .filter((f) => f.endsWith('.apk'))
    .map((f) => path.join(outDir, f))
  if (!apks.length) throw new Error('gradle produced no APKs')
  console.log(`\nAPK outputs:\n${apks.join('\n')}`)
}

main()
