#!/usr/bin/env node
/**
 * Collect the built APKs into release/build/android with release names:
 * Chatbox-<version>-<abi>.apk (arm64-v8a / armeabi-v7a / x86 / x86_64 /
 * universal). Used by .github/workflows/build.yml.
 */
const fs = require('node:fs')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '..')
const sourceDir = path.join(repoRoot, 'android', 'app', 'build', 'outputs', 'apk', 'release')
const targetDir = path.join(repoRoot, 'release', 'build', 'android')

const version = JSON.parse(fs.readFileSync(path.join(repoRoot, 'release', 'app', 'package.json'), 'utf8')).version
// Gradle ABI splits output app-<abi>-release.apk plus app-universal-release.apk.
const RENAMES = {
  'app-universal-release.apk': `Chatbox-${version}-universal.apk`,
  'app-arm64-v8a-release.apk': `Chatbox-${version}-arm64-v8a.apk`,
  'app-armeabi-v7a-release.apk': `Chatbox-${version}-armeabi-v7a.apk`,
  'app-x86-release.apk': `Chatbox-${version}-x86.apk`,
  'app-x86_64-release.apk': `Chatbox-${version}-x86_64.apk`,
}

fs.mkdirSync(targetDir, { recursive: true })
const apks = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.apk'))
if (!apks.length) throw new Error('no APKs found in ' + sourceDir)
for (const file of apks) {
  const target = RENAMES[file]
  if (!target) throw new Error(`unexpected APK name: ${file}`)
  fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, target))
  console.log(`${file} -> ${target}`)
}
