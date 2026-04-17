import { Link } from "react-router-dom"
import { CONFIG } from "../config"
import Logo from "./Logo"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-dark-2 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Col 1: Logo y descripción ─────────────────────── */}
          <div>
            <Link to="/" className="inline-block mb-3" aria-label="LEOFIT - Inicio">
              <Logo size="md" />
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed">
              {CONFIG.store.description}
            </p>
          </div>

          {/* ── Col 2: Navegación ─────────────────────────────── */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">
              Navegación
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { to: "/",         label: "Inicio"   },
                { to: "/catalogo", label: "Catálogo" },
                { to: "/carrito",  label: "Carrito"  },
                { to: "/contacto", label: "Contacto" },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-brand-muted hover:text-brand-orange transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Contacto ───────────────────────────────── */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">
              Contacto
            </h4>
            <div className="flex flex-col gap-3">
              {/* Botón WhatsApp */}
              <a
                href={`https://wa.me/${CONFIG.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-muted hover:text-green-400 transition-colors duration-200 text-sm"
              >
                {/* Icono WhatsApp SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              {/* Instagram (si está configurado) */}
              {CONFIG.store.instagram && (
                <a
                  href={CONFIG.store.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-muted hover:text-pink-400 transition-colors duration-200 text-sm"
                >
                  {/* Icono Instagram SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink-500">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Barra inferior ────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-brand-muted text-xs">
          <p>© {year} {CONFIG.store.name}. Todos los derechos reservados.</p>
          <p className="italic">{CONFIG.store.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
