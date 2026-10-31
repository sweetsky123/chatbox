#!/usr/bin/env node
/**
 * Smoke-test the APKs produced by scripts/build-android.cjs: every APK must
 * declare the fork's package id, and the split APKs must carry their own ABI
 * while the universal APK carries all of them. Used by build.yml.
 */
const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '..')
const outDir = path.join(repoRoot, 'android', 'app', 'build', 'outputs', 'apk', 'release')
const PACKAGE = 'xyz.chatboxapp.ce'
const ALL_ABIS = ['armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64']

function latestAapt2() {
  const home = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
  if (!home) throw new Error('ANDROID_HOME is not set')
  const root = path.join(home, 'build-tools')
  const version = fs.readdirSync(root).sort().at(-1)
  const aapt2 = path.join(root, version, 'aapt2')
  if (!fs.existsSync(aapt2)) throw new Error(`aapt2 not found under ${root}`)
  return aapt2
}

function badging(aapt2, apk) {
  return execSync(`"${aapt2}" dump badging "${apk}"`, { encoding: 'utf8' })
}

function main() {
  const aapt2 = latestAapt2()
  const apks = fs.readdirSync(outDir).filter((f) => f.endsWith('.apk'))
  console.log('APKs:', apks.join(', '))
  if (!apks.length) throw new Error('no APKs found')

  const expected = new Set([...ALL_ABIS.map((abi) => `Chatbox-${abi}.apk`), 'Chatbox-universal.apk'])
  for (const file of apks) {
    if (!expected.has(file)) throw new Error(`unexpected APK name: ${file}`)
    expected.delete(file)
    const info = badging(aapt2, path.join(outDir, file))
    if (!info.includes(`package: name='${PACKAGE}'`)) {
      throw new Error(`${file}: wrong package id:\n${info.split('\n')[0]}`)
    }
    const nativeCode = [...info.matchAll(/native-code: '([^']+)'/g)].map((m) => m[1])
    const universal = file === 'Chatbox-universal.apk'
    if (universal && nativeCode.length < ALL_ABIS.length) {
      throw new Error(`${file}: universal APK misses ABIs: ${nativeCode.join(', ')}`)
    }
    if (!universal) {
      const abi = file.replace(/^Chatbox-|\.apk$/g, '')
      if (!nativeCode.includes(abi)) {
        throw new Error(`${file}: split APK does not carry ${abi} (has ${nativeCode.join(', ')})`)
      }
      if (nativeCode.length !== 1) {
        throw new Error(`${file}: split APK unexpectedly carries multiple ABIs: ${nativeCode.join(', ')}`)
      }
    }
    console.log(`OK ${file} (native-code: ${nativeCode.join(', ') || 'none'})`)
  }
  if (expected.size) throw new Error(`missing APKs: ${[...expected].join(', ')}`)
  console.log('All APK smoke checks passed.')
}

main()
