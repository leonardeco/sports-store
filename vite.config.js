import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: "node",
  },
  plugins: [
    react(),
    {
      name: 'serve-pdf',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/catalogo.pdf') {
            const filePath = path.resolve(__dirname, 'public/catalogo.pdf')
            const stat = fs.statSync(filePath)
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="Catalogo_Suplementos_LEOFIT.pdf"',
              'Content-Length': stat.size,
            })
            fs.createReadStream(filePath).pipe(res)
            return
          }
          next()
        })
      },
    },
  ],
})
