import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"
import Logo from "./Logo"

const navLinks = [
  { to: "/",         label: "Inicio"   },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/contacto", label: "Contacto" },
]

// ── Subcomponentes a NIVEL DE MÓDULO ────────────────────────────────────────
// Definirlos fuera del render evita que React los desmonte/remonte en cada
// pulsación de tecla (lo que provocaba la pérdida de foco del buscador).

function SearchBar({ isMobile, query, setQuery, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
           className={`absolute top-1/2 -translate-y-1/2 text-brand-muted ${isMobile ? "left-3 w-5 h-5" : "left-3 w-4 h-4 ml-4"}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        aria-label="Buscar productos"
        placeholder={isMobile ? "Buscar productos..." : "Buscar..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`bg-brand-dark-3 border border-white/10 rounded-full text-white focus:outline-none focus:border-brand-orange/60 transition-all duration-300 ${
          isMobile
            ? "pl-10 pr-10 py-3 text-base w-full"
            : "pl-9 pr-8 py-1.5 text-sm w-48 focus:w-64 ml-4"
        }`}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Limpiar búsqueda"
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 ${
            isMobile ? "right-4 w-5 h-5" : "right-3 w-4 h-4"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}

function DownloadPdfBtn({ isMobile, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        isMobile
          ? "mt-2 flex items-center justify-center gap-2 bg-brand-orange text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-brand-orange/20 cursor-pointer w-full hover:bg-brand-orange/90 transition-colors"
          : "flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full hover:bg-brand-orange hover:text-white transition-all text-sm font-bold border border-brand-orange/30 cursor-pointer"
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={isMobile ? "w-5 h-5" : "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      {isMobile ? "Descargar Catálogo (PDF)" : "Descargar PDF"}
    </button>
  )
}

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [query, setQuery] = useState("")
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Cerrar el menú móvil automáticamente al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  // Bloquear el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuAbierto])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`)
      setMenuAbierto(false)
      setQuery("")
    }
  }

  const forceDownloadPdf = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/catalogo.pdf")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "Catalogo_LEOFIT.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error descargando el PDF:", error)
      window.open("/catalogo.pdf", "_blank")
    }
    setMenuAbierto(false)
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-brand-orange font-semibold border-b-2 border-brand-orange pb-0.5"
      : "text-gray-300 hover:text-brand-orange transition-colors duration-200"

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">

        {/* ── Logo ───────────────────────────────────────────── */}
        <Link to="/" aria-label="LEOFIT - Inicio">
          <Logo size="md" />
        </Link>

        {/* ── Links de escritorio ─────────────────────────────── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}

          <DownloadPdfBtn isMobile={false} onClick={forceDownloadPdf} />
          <SearchBar isMobile={false} query={query} setQuery={setQuery} onSubmit={handleSearch} />
        </div>

        {/* ── Iconos derecha ──────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative text-gray-300 hover:text-brand-orange transition-colors duration-200 cursor-pointer"
            aria-label="Ver carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Botón hamburguesa (solo mobile) */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="mobile-menu"
          >
            {menuAbierto ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Overlay del menú mobile ─────────────────────────── */}
      {menuAbierto && (
        <div
          className="md:hidden fixed inset-0 top-20 bg-black/60 z-40"
          onClick={() => setMenuAbierto(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Menú mobile ─────────────────────────────────────── */}
      {menuAbierto && (
        <div id="mobile-menu" className="md:hidden relative z-50 bg-brand-dark-2 border-t border-white/5 animate-slide-up">
          <div className="px-6 py-5 flex flex-col gap-5">

            <SearchBar isMobile={true} query={query} setQuery={setQuery} onSubmit={handleSearch} />

            <hr className="border-white/5" />

            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-brand-orange" : "text-gray-300 hover:text-brand-orange"
                  }`
                }
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}

            <DownloadPdfBtn isMobile={true} onClick={forceDownloadPdf} />

          </div>
        </div>
      )}
    </nav>
  )
}
