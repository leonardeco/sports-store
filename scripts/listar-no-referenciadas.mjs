import { readdirSync, readFileSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Archivos en public/img/productos/
const carpeta = join(root, 'public/img/productos')
const archivosEnDisco = readdirSync(carpeta)

// Rutas referenciadas en productos.json
const productos = JSON.parse(readFileSync(join(root, 'src/data/productos.json'), 'utf-8'))
const referenciadas = new Set(productos.map(p => basename(p.imagen)))

// Archivos NO referenciados
const noReferenciados = archivosEnDisco.filter(f => !referenciadas.has(f))

console.log(`\nArchivos en disco:        ${archivosEnDisco.length}`)
console.log(`Rutas en productos.json:  ${referenciadas.size}`)
console.log(`No referenciados:         ${noReferenciados.length}\n`)
console.log('─'.repeat(60))
noReferenciados.forEach(f => console.log(' ', f))
console.log('─'.repeat(60))
console.log(`\nTotal a eliminar: ${noReferenciados.length} archivos`)
