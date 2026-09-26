// Снимает снапшот ответов API в data/snapshot/ и скачивает картинки баннеров в public/snapshot/.
// Используется как фолбэк, если тестовый стенд недоступен (см. services/api.ts).
// Запуск: npm run snapshot:update
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'

// sharp приходит вместе с @nuxt/image; если его нет, картинки сохраняются как есть
const sharp = await import('sharp').then(m => m.default).catch(() => null)

const API_BASE = process.env.NUXT_PUBLIC_API_BASE || 'https://cms.test.ksfr.tech/api/v1/'
const ENDPOINTS = {
  mainpage: 'showcases/showcases/mainpage/web/',
  genres: 'metadata/genres/',
  labels: 'metadata/labels/',
}
const IMAGE_SIZE = '800x450'

async function fetchWithRetry(url, attempts = 5) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    }
    catch (error) {
      if (i >= attempts) throw new Error(`${url}: ${error.message}`)
      console.warn(`  повтор ${i}/${attempts - 1}: ${url} (${error.message})`)
    }
  }
}

await mkdir('data/snapshot', { recursive: true })
await rm('public/snapshot', { recursive: true, force: true })
await mkdir('public/snapshot', { recursive: true })

const data = {}
for (const [name, path] of Object.entries(ENDPOINTS)) {
  data[name] = await (await fetchWithRetry(API_BASE + path)).json()
  console.log(`✔ ${path}`)
}

// Картинки баннеров кладём локально и подменяем resize_url на путь в public/,
// чтобы демо работало и без CDN стенда. Остальные поля ответа не трогаем.
for (const slide of data.mainpage.slides) {
  const asset = slide.title?.assets?.find(a => a.asset_type === 'Banner')
  if (!asset) continue

  const image = await fetchWithRetry(asset.resize_url.replace('{w}x{h}', IMAGE_SIZE))
  const buffer = Buffer.from(await image.arrayBuffer())
  const name = asset.oid.replace(':', '-')
  const file = sharp ? `${name}.webp` : `${name}${extname(asset.resize_url).toLowerCase()}`
  await writeFile(`public/snapshot/${file}`, sharp ? await sharp(buffer).webp({ quality: 80 }).toBuffer() : buffer)
  asset.resize_url = `/snapshot/${file}`
  console.log(`✔ ${file}`)
}

for (const [name, json] of Object.entries(data)) {
  await writeFile(`data/snapshot/${name}.json`, JSON.stringify(json, null, 2) + '\n')
}
console.log('Снапшот обновлён')
