import sharp from 'sharp'
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const CALIDAD = 80
const MAX_PX = 800

// Carpeta de originales fuera de public/
const originalesDir = join(root, '_originales')
mkdirSync(originalesDir, { recursive: true })
mkdirSync(join(originalesDir, 'productos'), { recursive: true })
mkdirSync(join(originalesDir, 'banners'), { recursive: true })
mkdirSync(join(originalesDir, 'marcas'), { recursive: true })

let totalOriginalBytes = 0
let totalWebpBytes = 0
let convertidos = 0

async function convertirImagen(srcPath, destPath, carpetaOriginal) {
  const ext = extname(srcPath).toLowerCase()
  if (ext === '.svg') return // los SVG se quedan como están

  const inputBytes = readFileSync(srcPath).length
  totalOriginalBytes += inputBytes

  // Guardar original
  copyFileSync(srcPath, join(carpetaOriginal, basename(srcPath)))

  // Convertir a webp
  await sharp(srcPath)
    .resize(MAX_PX, MAX_PX, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: CALIDAD })
    .toFile(destPath)

  const outputBytes = readFileSync(destPath).length
  totalWebpBytes += outputBytes
  convertidos++

  const ahorro = (((inputBytes - outputBytes) / inputBytes) * 100).toFixed(1)
  console.log(`  ✓ ${basename(srcPath)} → ${basename(destPath)} (${(inputBytes/1024).toFixed(0)}KB → ${(outputBytes/1024).toFixed(0)}KB, -${ahorro}%)`)
}

// ─── 1. Productos referenciados en productos.json ─────────────────────
console.log('\n📦 Convirtiendo imágenes de productos...')
const productosPath = join(root, 'src/data/productos.json')
const productos = JSON.parse(readFileSync(productosPath, 'utf-8'))

for (const producto of productos) {
  const rutaRelativa = producto.imagen // ej: /img/productos/1-nitro-tech-2-lbs.png
  const srcPath = join(root, 'public', rutaRelativa)
  const ext = extname(rutaRelativa).toLowerCase()

  if (ext === '.svg' || !existsSync(srcPath)) continue

  const webpRelativa = rutaRelativa.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  const destPath = join(root, 'public', webpRelativa)

  await convertirImagen(srcPath, destPath, join(originalesDir, 'productos'))
  producto.imagen = webpRelativa
}

// Actualizar productos.json
writeFileSync(productosPath, JSON.stringify(productos, null, 2))
console.log(`  → productos.json actualizado con rutas .webp`)

// ─── 2. Banners ──────────────────────────────────────────────────────
console.log('\n🖼  Convirtiendo banners...')
const bannersDir = join(root, 'public/img/banners')
for (const f of readdirSync(bannersDir)) {
  const ext = extname(f).toLowerCase()
  if (ext === '.svg') continue
  const srcPath = join(bannersDir, f)
  const destPath = join(bannersDir, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'))
  await convertirImagen(srcPath, destPath, join(originalesDir, 'banners'))
}

// ─── 3. Marcas ───────────────────────────────────────────────────────
console.log('\n🏷  Convirtiendo logos de marcas...')
const marcasDir = join(root, 'public/img/marcas')
for (const f of readdirSync(marcasDir)) {
  const ext = extname(f).toLowerCase()
  if (ext === '.svg') continue
  const srcPath = join(marcasDir, f)
  const destPath = join(marcasDir, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'))
  await convertirImagen(srcPath, destPath, join(originalesDir, 'marcas'))
}

// ─── Resumen ─────────────────────────────────────────────────────────
const ahorroMB = ((totalOriginalBytes - totalWebpBytes) / 1024 / 1024).toFixed(2)
const ahorroPorc = (((totalOriginalBytes - totalWebpBytes) / totalOriginalBytes) * 100).toFixed(1)

console.log('\n' + '═'.repeat(55))
console.log(`✅ Conversión completada`)
console.log(`   Archivos convertidos: ${convertidos}`)
console.log(`   Peso original:        ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Peso WebP:            ${(totalWebpBytes / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Ahorro total:         ${ahorroMB} MB (-${ahorroPorc}%)`)
console.log(`   Originales guardados en: _originales/`)
console.log('═'.repeat(55))
