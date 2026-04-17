import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import productos from "../data/productos.json"
import useSEO from "../hooks/useSEO"

// Productos con badge = destacados en la home
const destacados = productos.filter(p => p.destacado)

// Categorías con imagen placeholder
// REEMPLAZAR: cambiá la URL de imagen por tus fotos reales
const categorias = [
  {
    nombre:    "Suplementos",
    descripcion: "Proteínas, creatina, pre-workout y más",
    imagen:    "/img/banners/cat-suplementos.png",
    link:      "/catalogo?categoria=Suplementos",
  }
]

export default function Home() {
  useSEO({ 
    title: "Inicio", 
    description: "Tienda online deportiva LEOFIT con los mejores suplementos y prendas técnicas." 
  })

  return (
    <div>
      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 1: HERO BANNER
          REEMPLAZAR: cambiá el fondo del hero por tu foto real.
          En el div de fondo, reemplazá el style background por:
            style={{ backgroundImage: "url('/tu-banner.jpg')" }}
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {/* Fondo placeholder
            REEMPLAZAR: background-image por tu banner real */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/img/banners/hero-banner.png')",
          }}
        >
          {/* Overlay degradado */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/20" />
        </div>

        {/* Contenido del hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-2xl">
            {/* Etiqueta superior */}
            <span
              className="inline-block text-brand-orange text-sm font-semibold uppercase tracking-widest mb-4 animate-fade-in"
              style={{ animationDelay: "0ms" }}
            >
              LEOFIT — Tu tienda deportiva online
            </span>

            {/* Titular principal */}
            <h1
              className="font-display text-[2.8rem] sm:text-7xl lg:text-9xl text-white leading-none mb-6 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              ENTRENA
              <br />
              <span className="text-brand-orange">EN SERIO</span>
            </h1>

            {/* Subtítulo */}
            <p
              className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              Suplementos deportivos de alta calidad.
              <br className="hidden sm:block" />
              Pedí por WhatsApp y recibí en tu puerta.
            </p>

            {/* Botones CTA */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link to="/catalogo" className="btn-primary text-center text-lg px-8 py-4">
                Ver Catálogo
              </Link>
              <Link to="/contacto" className="btn-secondary text-center text-lg px-8 py-4">
                Contactanos
              </Link>
            </div>

            {/* Stats rápidos */}
            <div
              className="flex flex-wrap gap-6 sm:gap-8 mt-10 sm:mt-12 animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              {[
                { valor: "+500",              label: "Clientes"  },
                { valor: `+${productos.length}`, label: "Productos" },
                { valor: "24hs",              label: "Envíos"    },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-brand-orange font-display text-3xl">{stat.valor}</div>
                  <div className="text-brand-muted text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 2: CATEGORÍAS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
            EXPLORÁ POR <span className="text-brand-orange">CATEGORÍA</span>
          </h2>
          <p className="text-brand-muted mt-2">Encontrá exactamente lo que necesitás</p>
        </div>

        <div className="grid grid-cols-1 md:max-w-4xl md:mx-auto gap-6">
          {categorias.map(cat => (
            <Link
              key={cat.nombre}
              to={cat.link}
              className="group relative overflow-hidden rounded-2xl aspect-video cursor-pointer"
            >
              {/* Imagen categoría
                  REEMPLAZAR: cambiá cat.imagen por tu foto real de cada categoría */}
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
              {/* Texto */}
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-display text-4xl text-white tracking-wide group-hover:text-brand-orange transition-colors duration-300">
                  {cat.nombre.toUpperCase()}
                </h3>
                <p className="text-gray-300 text-sm mt-1">{cat.descripcion}</p>
                <span className="inline-block mt-3 text-brand-orange text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200">
                  Ver productos →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3: PRODUCTOS DESTACADOS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
              PRODUCTOS <span className="text-brand-orange">DESTACADOS</span>
            </h2>
            <p className="text-brand-muted mt-1">Los favoritos de nuestra comunidad</p>
          </div>
          <Link to="/catalogo" className="hidden sm:block btn-secondary text-sm px-4 py-2">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destacados.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Botón ver todos (mobile) */}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/catalogo" className="btn-secondary">Ver todos los productos</Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3.5: PILARES DE CONFIANZA / GARANTÍAS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-dark-2 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="flex flex-col items-center gap-3">
               <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
               </div>
               <h4 className="text-white font-bold text-sm uppercase tracking-wide">Envíos Nacionales</h4>
               <p className="text-brand-muted text-xs">A todo el país garantizado</p>
            </div>

            <div className="flex flex-col items-center gap-3">
               <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
               </div>
               <h4 className="text-white font-bold text-sm uppercase tracking-wide">100% Originales</h4>
               <p className="text-brand-muted text-xs">Directo de laboratorios avalados</p>
            </div>

            <div className="flex flex-col items-center gap-3">
               <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
               </div>
               <h4 className="text-white font-bold text-sm uppercase tracking-wide">Pago Seguro</h4>
               <p className="text-brand-muted text-xs">Protección al comprador real</p>
            </div>

            <div className="flex flex-col items-center gap-3">
               <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
               </div>
               <h4 className="text-white font-bold text-sm uppercase tracking-wide">Soporte Express</h4>
               <p className="text-brand-muted text-xs">Resolvemos tus dudas al instante</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3.6: TESTIMONIOS (SOCIAL PROOF)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
            LO QUE DICEN <span className="text-brand-orange">LOS ATLETAS</span>
          </h2>
          <p className="text-brand-muted mt-2">Nuestras reseñas en vivo</p>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x">
          
          <div className="card p-6 min-w-[300px] max-w-[350px] snap-center flex-shrink-0 flex flex-col justify-between">
            <div>
              <div className="text-yellow-500 mb-3 tracking-tighter">★★★★★</div>
              <p className="text-gray-300 italic text-sm leading-relaxed">&quot;De 10. Pedí la Gold Standard y la Creatina y me llegaron selladitas al día siguiente. El chico del WhatsApp un crack para asesorarme porque no sabía bien qué llevar.&quot;</p>
            </div>
            <div className="flex items-center gap-3 mt-6">
               <div className="w-10 h-10 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center">M.R.</div>
               <div>
                 <h5 className="text-white text-sm font-bold">Marcos Riquelme</h5>
                 <p className="text-brand-muted text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compra Verificada</p>
               </div>
            </div>
          </div>

          <div className="card p-6 min-w-[300px] max-w-[350px] snap-center flex-shrink-0 flex flex-col justify-between">
            <div>
              <div className="text-yellow-500 mb-3 tracking-tighter">★★★★★</div>
              <p className="text-gray-300 italic text-sm leading-relaxed">&quot;Siempre compro mis pre-entrenos acá y me salvan. Súper rápido, 100% originales. Una vez necesité un cambio de sabor e hiper accesibles en todo.&quot;</p>
            </div>
            <div className="flex items-center gap-3 mt-6">
               <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">V.T.</div>
               <div>
                 <h5 className="text-white text-sm font-bold">Valeria Torres</h5>
                 <p className="text-brand-muted text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compra Verificada</p>
               </div>
            </div>
          </div>

          <div className="card p-6 min-w-[300px] max-w-[350px] snap-center flex-shrink-0 flex flex-col justify-between">
            <div>
              <div className="text-yellow-500 mb-3 tracking-tighter">★★★★☆</div>
              <p className="text-gray-300 italic text-sm leading-relaxed">&quot;Los precios más competitivos que encontré en la ciudad por lejos. Lástima que un finde se les agotó el Pump que yo uso, pero volvió a entrar rápido. Muy buenos.&quot;</p>
            </div>
            <div className="flex items-center gap-3 mt-6">
               <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">S.C.</div>
               <div>
                 <h5 className="text-white text-sm font-bold">Seba Colina</h5>
                 <p className="text-brand-muted text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compra Verificada</p>
               </div>
            </div>
          </div>

          <div className="card p-6 min-w-[300px] max-w-[350px] snap-center flex-shrink-0 flex flex-col justify-between hidden sm:flex">
            <div>
              <div className="text-yellow-500 mb-3 tracking-tighter">★★★★★</div>
              <p className="text-gray-300 italic text-sm leading-relaxed">&quot;Increíble plataforma, agregar el producto al carrito y pasarlo al WhatsApp fue lo más fluido del mundo, ya le pasé la página a todos en mi Box.&quot;</p>
            </div>
            <div className="flex items-center gap-3 mt-6">
               <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">J.H.</div>
               <div>
                 <h5 className="text-white text-sm font-bold">Julieta H.</h5>
                 <p className="text-brand-muted text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Cliente Frecuente</p>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4: BANNER WHATSAPP
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-orange py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-3">
            ¿TENÉS DUDAS?
          </h2>
          <p className="text-white/90 text-lg mb-6">
            Escribinos por WhatsApp y te asesoramos al instante.
          </p>
          <Link to="/contacto" className="inline-block bg-white text-brand-orange font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform duration-200">
            Hablar con nosotros
          </Link>
        </div>
      </section>
    </div>
  )
}
