import { readdirSync, readFileSync, unlinkSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const carpeta = join(root, 'public/img/productos')
const archivosEnDisco = readdirSync(carpeta)

const productos = JSON.parse(readFileSync(join(root, 'src/data/productos.json'), 'utf-8'))
const referenciadas = new Set(productos.map(p => basename(p.imagen)))

const noReferenciados = archivosEnDisco.filter(f => !referenciadas.has(f))

let eliminados = 0
for (const f of noReferenciados) {
  unlinkSync(join(carpeta, f))
  eliminados++
}

console.log(`✅ Eliminados ${eliminados} archivos no referenciados.`)
console.log(`   Quedan ${readdirSync(carpeta).length} archivos en public/img/productos/`)
