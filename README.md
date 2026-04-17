<h1 align="center">
  <br>
  🏋️ LEOFIT — Tienda de Suplementos Deportivos
  <br>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-6.30-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
</p>

<p align="center">
  E-commerce moderno de suplementos deportivos con catálogo completo, carrito de compras y pedidos por WhatsApp.
  <br />
  Diseño oscuro premium · Mobile-first · Sin backend · Listo para producción
</p>

---

## Características

- **Catálogo completo** — +127 productos con filtros por marca, categoría y precio
- **Carrito de compras** — Persiste en `localStorage`, con drawer lateral animado
- **Pedido por WhatsApp** — Genera el mensaje automáticamente con todos los productos, cantidades y total
- **SalesPop** — Notificaciones de ventas recientes para generar urgencia
- **SEO dinámico** — Títulos y meta-descriptions únicos por página con hook `useSEO`
- **Diseño oscuro premium** — Paleta dark + naranja, tipografía Bebas Neue + Inter
- **Totalmente responsive** — Navbar + BottomNav optimizados para mobile
- **Animaciones CSS** — Fade-in, slide-up y transiciones suaves sin librerías externas
- **Zero backend** — Desplegable en cualquier hosting estático (Netlify, Vercel, GitHub Pages)

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **React 18** | UI con hooks y Context API |
| **Vite 5** | Bundler ultrarrápido + HMR |
| **Tailwind CSS 3** | Estilos utility-first con tema personalizado |
| **React Router 6** | Navegación SPA con rutas dinámicas |
| **Context API** | Estado global del carrito y toasts |
| **LocalStorage** | Persistencia del carrito sin backend |

---

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Hero banner, categorías, destacados, testimonios, CTA WhatsApp |
| `/catalogo` | Catálogo completo con filtros de marca, categoría y precio |
| `/producto/:id` | Detalle del producto con galería, info nutricional y botón de compra |
| `/carrito` | Resumen del pedido con totales y botón de envío por WhatsApp |
| `/contacto` | Información de contacto y formulario de WhatsApp directo |

---

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/leonardeco/sports-store.git
cd sports-store

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Build para producción

```bash
npm run build       # genera la carpeta /dist
npm run preview     # previsualiza el build localmente
```

---

## Configuración

Toda la configuración de la tienda está centralizada en [`src/config.js`](src/config.js):

```js
export const CONFIG = {
  whatsapp: {
    number:   "573226993891",     // Tu número de WhatsApp (con código de país)
    greeting: "¡Hola! Me gustaría hacer el siguiente pedido:",
  },
  store: {
    name:           "LEOFIT",
    currency:       "ARS",
    currencySymbol: "$",
    email:          "tu@email.com",
    instagram:      "",           // URL de Instagram (vacío = oculto)
  },
  // ...rangos de precio, categorías, marcas con colores y logos
}
```

Para agregar o editar productos, modificá [`src/data/productos.json`](src/data/productos.json).

---

## Estructura del proyecto

```
sports-store/
├── public/
│   ├── img/
│   │   ├── banners/          # Hero y banners de categoría
│   │   ├── marcas/           # Logos de marcas (.png / .svg)
│   │   └── productos/        # Imágenes de productos (.png / .svg)
│   └── _redirects            # Redirect para SPA en Netlify
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Header + menú mobile
│   │   ├── BottomNav.jsx     # Navegación inferior mobile
│   │   ├── CartDrawer.jsx    # Carrito lateral deslizable
│   │   ├── ProductCard.jsx   # Tarjeta de producto reutilizable
│   │   ├── PromoBanner.jsx   # Banner de promoción superior
│   │   ├── SalesPop.jsx      # Notificaciones de venta reciente
│   │   ├── FloatingButtons.jsx # Botón WhatsApp y scroll-to-top
│   │   ├── Footer.jsx
│   │   └── Logo.jsx
│   ├── context/
│   │   ├── CartContext.jsx   # Estado global del carrito
│   │   └── ToastContext.jsx  # Notificaciones toast
│   ├── data/
│   │   └── productos.json    # Base de datos de productos
│   ├── hooks/
│   │   └── useSEO.js         # Hook para títulos y meta dinámicos
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Catalogo.jsx
│   │   ├── DetalleProducto.jsx
│   │   ├── Carrito.jsx
│   │   └── Contacto.jsx
│   ├── App.jsx
│   ├── config.js             # Configuración centralizada
│   └── index.css             # Estilos globales y clases custom
└── vite.config.js
```

---

## Despliegue en Netlify (recomendado)

1. Conectá tu repo de GitHub en [app.netlify.com](https://app.netlify.com)
2. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. El archivo `public/_redirects` ya está configurado para que el router de React funcione correctamente

---

## Marcas disponibles

MuscleTech · Dymatize · Optimum Nutrition · BSN · Cellucor · Basic · Simply · Isopure · Sascha Fitness · Proscience · Nutreamerican · Ronnie Coleman · Angry Supplements · Graz Chemical

---

## Licencia

Este proyecto es de uso privado. Todos los derechos reservados © 2025 LEOFIT.
