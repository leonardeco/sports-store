import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import Logo from "./Logo"

const navLinks = [
  { to: "/",         label: "Inicio"   },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/contacto", label: "Contacto" },
]

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [query, setQuery] = useState("")
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`)
      setMenuAbierto(false)
      setQuery("")
    }
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-brand-orange font-semibold border-b-2 border-brand-orange pb-0.5"
      : "text-gray-300 hover:text-brand-orange transition-colors duration-200"

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

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
          
          {/* Buscador de escritorio */}
          <form onSubmit={handleSearch} className="relative ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-brand-dark-3 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-brand-orange/60 transition-colors w-48 focus:w-64"
            />
          </form>
        </div>

        {/* ── Iconos derecha ──────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* Carrito con badge */}
          <button
            onClick={openCart}
            className="relative text-gray-300 hover:text-brand-orange transition-colors duration-200 cursor-pointer"
            aria-label="Ver carrito"
          >
            {/* Icono carrito SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {/* Badge con cantidad */}
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
          >
            {menuAbierto ? (
              // Icono X
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Icono hamburguesa
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Overlay oscuro detrás del menú mobile ───────────── */}
      {menuAbierto && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/60 z-40"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* ── Menú mobile ─────────────────────────────────────── */}
      {menuAbierto && (
        <div className="md:hidden relative z-50 bg-brand-dark-2 border-t border-white/5 animate-slide-up">
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Buscador mobile */}
            <form onSubmit={handleSearch} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                   className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-brand-dark-3 border border-white/10 rounded-full pl-10 pr-4 py-3 text-base text-white w-full focus:outline-none focus:border-brand-orange/60"
              />
            </form>
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
                onClick={() => setMenuAbierto(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
