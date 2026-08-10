// One-off pipeline: raw Wikimedia Commons downloads -> resized/optimized webp
// at the exact paths the React components already reference.
//
// Source images live outside the repo (scratchpad); this script only ever
// reads from RAW_DIR and writes into public/assets/**. Nothing here touches
// color/duotone — that treatment is applied at runtime by the components.
import sharp from 'sharp'
import { mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const RAW_DIR = process.env.RAW_DIR
if (!RAW_DIR) {
  throw new Error('Set RAW_DIR to the folder holding the downloaded source images')
}

const MAX_WIDTH = 1600
const WEBP_QUALITY = 80

// raw filename (inside RAW_DIR) -> destination path (inside public/assets).
// A plain string uses the defaults above; an object overrides width/quality
// per entry (e.g. the trophy room backdrop wants a wider max + slightly
// leaner quality since it's a full-bleed background, not a portrait).
const MAP = {
  '1902.jpg': 'assets/legacy/1902.webp',
  '1956.jpg': 'assets/legacy/1956.webp',
  '1998.jpg': 'assets/legacy/1998.webp',
  '2002.jpg': 'assets/legacy/2002.webp',
  '2014.jpg': 'assets/legacy/2014.webp',
  '2024.jpg': 'assets/legacy/2024.webp',
  'p01_mbappe.jpg': 'assets/squad/p01.webp',
  'p02_vini.jpg': 'assets/squad/p02.webp',
  'p03_bellingham.jpg': 'assets/squad/p03.webp',
  'p04_valverde.jpg': 'assets/squad/p04.webp',
  'p05_bernardo.jpg': 'assets/squad/p05.webp',
  'p06_courtois.jpg': 'assets/squad/p06.webp',
  'bernabeu_aerial.jpg': 'assets/bernabeu/aerial.webp',
  '1960.jpg': 'assets/legacy/1960.webp',
  '1986.jpg': 'assets/legacy/1986.webp',
  '2018.jpg': 'assets/legacy/2018.webp',
  'room.jpg': { dest: 'assets/trophies/room.webp', width: 1920, quality: 78 },
  'european-cup.jpg': { dest: 'assets/trophies/european-cup.webp', width: 1920, quality: 78 },
}

// RAW_DIR only needs to hold the source files for the slots being
// (re)processed in a given run — entries whose source is absent are skipped
// rather than treated as an error, so this script stays reusable for partial
// (e.g. new-eras-only) sourcing passes.
for (const [srcName, entry] of Object.entries(MAP)) {
  const srcPath = path.join(RAW_DIR, srcName)
  try {
    await access(srcPath)
  } catch {
    console.log(`${srcName} -> (skipped, not present in RAW_DIR)`)
    continue
  }

  const destRel = typeof entry === 'string' ? entry : entry.dest
  const width = typeof entry === 'string' ? MAX_WIDTH : entry.width
  const quality = typeof entry === 'string' ? WEBP_QUALITY : entry.quality

  const destPath = path.join(REPO_ROOT, 'public', destRel)
  await mkdir(path.dirname(destPath), { recursive: true })

  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath)

  console.log(`${srcName} -> ${destRel}`)
}
