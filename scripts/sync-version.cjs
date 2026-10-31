#!/usr/bin/env node
/**
 * Sync release/app/package.json version with the tag being built so packaged
 * artifacts carry the tag's version. Used by .github/workflows/build.yml.
 */
const fs = require('node:fs')
const path = require('node:path')

const tag = process.argv[2] || ''
const version = tag.replace(/^v/, '')
if (!/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error(`Tag must look like v1.2.3 (got "${tag}")`)
}
const file = path.join(__dirname, '..', 'release', 'app', 'package.json')
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
pkg.version = version
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
console.log(`${path.relative(process.cwd(), file)} -> ${version}`)
