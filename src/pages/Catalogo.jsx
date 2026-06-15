import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import productos from "../data/productos.json"
import { CONFIG } from "../config"
import useSEO from "../hooks/useSEO"

// ── Agrupar productos por categoria ─────────────────────────────
function agruparPorCategoria(prods) {
  const grupos = {}
  prods.forEach(p => {
    if (!grupos[p.categoria]) grupos[p.categoria] = []
    grupos[p.categoria].push(p)
  })
  return Object.entries(grupos).sort(([a], [b]) => {
    const orderA = CONFIG.categoriesDef[a]?.order ?? 99
    const orderB = CONFIG.categoriesDef[b]?.order ?? 99
    return orderA - orderB
  })
}

// ── Componente Acordeón de Categoria ────────────────────────────
function CategoryAccordion({ categoria, prods, isOpen, onToggle }) {
  const catConfig = CONFIG.categoriesDef[categoria] || { color: "#1E1E1E", accent: "#FF6B00" }
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, prods.length])

  return (
    <div className="mb-4 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 transition-all duration-300 cursor-pointer group"
        style={{ background: `linear-gradient(135deg, ${catConfig.color}CC, ${catConfig.color}99)` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0"
            style={{ backgroundColor: catConfig.accent + "22", border: `1px solid ${catConfig.accent}44` }}
          >
            {catConfig.logo ? (
              <img src={catConfig.logo} alt={categoria} className="w-10 h-10 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            ) : (
              <span className="font-display text-2xl font-bold" style={{ color: catConfig.accent }}>{categoria.charAt(0)}</span>
            )}
          </div>
          <div className="text-left">
            <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wider">{categoria.toUpperCase()}</h3>
            <p className="text-white/60 text-xs sm:text-sm mt-0.5">
              {prods.length} {prods.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block" style={{ color: catConfig.accent }}>
            {isOpen ? "Cerrar" : "Ver productos"}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-500 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
            style={{ color: catConfig.accent }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      <div className="overflow-hidden transition-all duration-500 ease-in-out" style={{ maxHeight: `${height}px` }}>
        <div ref={contentRef} className="p-4 sm:p-6 bg-brand-dark-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {prods.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Chip de filtro activo ────────────────────────────────────
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-semibold px-3 py-1.5 rounded-full animate-fade-in">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors cursor-pointer leading-none"
        aria-label={`Quitar filtro ${label}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </span>
  )
}

// ══════════════════════════════════════════════════════════════
//  PÁGINA DE CATÁLOGO
// ══════════════════════════════════════════════════════════════
export default function Catalogo() {
  const [searchParams] = useSearchParams()
  const [busqueda, setBusqueda]          = useState("")
  const [categoriaActiva, setCategoria]  = useState("Todos")
  const [precioIdx, setPrecioIdx]        = useState(0)
  const [vistaCategorias, setVistaCategorias]    = useState(true)
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({})
  const [marcaFiltro, setMarcaFiltro]    = useState("Todas")
  const [ordenar, setOrdenar]            = useState("marca")
  const [filtrosMobileAbierto, setFiltrosMobileAbierto] = useState(false)

  const resultadosRef = useRef(null)

  useSEO({
    title: busqueda ? `Resultados de "${busqueda}"` : "Catálogo Completo",
    description: "Explora todo el catálogo de suplementación deportiva de LEOFIT: proteínas, creatinas, pre-entrenos y más."
  })

  // Leer categoría o búsqueda desde URL al montar o cambiar
  useEffect(() => {
    const cat = searchParams.get("categoria")
    if (cat && CONFIG.catalog.categories.includes(cat)) {
      setCategoria(cat)
    }
    const q = searchParams.get("q")
    if (q) {
      setBusqueda(decodeURIComponent(q))
    }
  }, [searchParams])

  // Abrir todas las marcas por defecto
  useEffect(() => {
    const todasAbiertas = {}
    Object.keys(CONFIG.categoriesDef).forEach(m => { todasAbiertas[m] = true })
    setCategoriasAbiertas(todasAbiertas)
  }, [])

  // ── Pipeline de filtros ───────────────────────────────────
  const rango = CONFIG.catalog.priceRanges[precioIdx]

  const productosFiltrados = productos
    .filter(p => categoriaActiva === "Todos" || p.categoria === categoriaActiva)
    .filter(p => marcaFiltro === "Todas" || p.marca === marcaFiltro)
    .filter(p => p.precio >= rango.min && p.precio <= rango.max)
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      switch (ordenar) {
        case "precio-asc":  return a.precio - b.precio
        case "precio-desc": return b.precio - a.precio
        case "nombre-asc":  return a.nombre.localeCompare(b.nombre)
        case "nombre-desc": return b.nombre.localeCompare(a.nombre)
        default:            return 0
      }
    })

  const gruposCategoria = agruparPorCategoria(productosFiltrados)

  const marcasUnicas = [...new Set(productos.map(p => p.marca))].sort((a, b) => {
    const orderA = CONFIG.categoriesDef[a]?.order ?? 99
    const orderB = CONFIG.categoriesDef[b]?.order ?? 99
    return orderA - orderB
  })

  // Contar productos por categoría
  const contarCategoria = (cat) =>
    cat === "Todos" ? productos.length : productos.filter(p => p.categoria === cat).length

  // ── Chips de filtros activos ──────────────────────────────
  const chipsActivos = []
  if (busqueda)                chipsActivos.push({ id: "busqueda",  label: `"${busqueda}"`,                      onRemove: () => setBusqueda("") })
  if (categoriaActiva !== "Todos") chipsActivos.push({ id: "categoria", label: categoriaActiva,                  onRemove: () => setCategoria("Todos") })
  if (marcaFiltro !== "Todas")     chipsActivos.push({ id: "marca",     label: marcaFiltro,                      onRemove: () => setMarcaFiltro("Todas") })
  if (precioIdx !== 0)             chipsActivos.push({ id: "precio",    label: CONFIG.catalog.priceRanges[precioIdx].label, onRemove: () => setPrecioIdx(0) })


  // ── Toggle acordeón ──────────────────────────────────────
  const toggleCategoria = (cat) => setCategoriasAbiertas(prev => ({ ...prev, [cat]: !prev[cat] }))
  const abrirTodas  = () => { const all = {}; gruposCategoria.forEach(([c]) => { all[c] = true }); setCategoriasAbiertas(all) }
  const cerrarTodas = () => setCategoriasAbiertas({})

  // ── Resetear filtros ──────────────────────────────────────
  const resetFiltros = () => {
    setBusqueda("")
    setCategoria("Todos")
    setPrecioIdx(0)
    setMarcaFiltro("Todas")
    setOrdenar("marca")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide">
            CATÁLOGO
          </h1>
          <p className="text-brand-muted mt-1">
            <span className="text-brand-orange font-semibold">{productos.length}</span> productos disponibles
          </p>
        </div>

        {/* Toggle vista */}
        <div className="flex items-center bg-brand-dark-card rounded-xl border border-white/10 p-1">
          <button
            onClick={() => { setVistaCategorias(false); setOrdenar("precio-asc") }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2
              ${!vistaCategorias ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "text-brand-muted hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Todos
          </button>
          <button
            onClick={() => { setVistaCategorias(true); setOrdenar("marca") }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2
              ${vistaCategorias ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "text-brand-muted hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Por Categoría
          </button>
        </div>
      </div>

      {/* ── Barra de filtros sticky ──────────────────────────── */}
      <div className="sticky top-16 z-40 bg-brand-dark/95 backdrop-blur-md py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-white/5 mb-6">

        {/* Fila superior: buscador + botón filtros mobile */}
        <div className="flex gap-3 mb-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="input-field pl-9"
            />
            {/* Botón limpiar búsqueda */}
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>

          {/* Botón filtros (mobile) */}
          <button
            onClick={() => setFiltrosMobileAbierto(prev => !prev)}
            className={`sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 cursor-pointer flex-shrink-0
              ${filtrosMobileAbierto || chipsActivos.length > 0
                ? "bg-brand-orange text-white border-brand-orange"
                : "border-white/20 text-brand-muted"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filtros
            {chipsActivos.length > 0 && (
              <span className="bg-white text-brand-orange text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {chipsActivos.length}
              </span>
            )}
          </button>
        </div>

        {/* Selects — siempre visibles en desktop, colapsables en mobile */}
        <div className={`${filtrosMobileAbierto ? "block" : "hidden"} sm:block`}>
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 mb-3">
            <select
              value={marcaFiltro}
              onChange={e => setMarcaFiltro(e.target.value)}
              className="input-field sm:w-48 bg-brand-dark-3 cursor-pointer text-sm"
            >
              <option value="Todas">Todas las marcas</option>
              {marcasUnicas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select
              value={precioIdx}
              onChange={e => setPrecioIdx(Number(e.target.value))}
              className="input-field sm:w-48 bg-brand-dark-3 cursor-pointer text-sm"
            >
              {CONFIG.catalog.priceRanges.map((rng, idx) => (
                <option key={idx} value={idx}>{rng.label}</option>
              ))}
            </select>

            <select
              value={ordenar}
              onChange={e => {
                const val = e.target.value
                setOrdenar(val)
                if (val !== "marca") setVistaCategorias(false)
                else setVistaCategorias(true)
              }}
              className="input-field col-span-2 sm:col-span-1 sm:w-52 bg-brand-dark-3 cursor-pointer text-sm"
            >
              <option value="marca">Por categoría</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre-asc">Nombre: A → Z</option>
              <option value="nombre-desc">Nombre: Z → A</option>
            </select>
          </div>
        </div>

        {/* Chips de categorías con contador */}
        <div className="flex flex-wrap gap-2">
          {CONFIG.catalog.categories.map(cat => {
            const count = contarCategoria(cat)
            return (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5
                  ${categoriaActiva === cat
                    ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                    : "bg-brand-dark-card text-brand-muted hover:text-white border border-white/10 hover:border-brand-orange/40"
                  }`}
              >
                {cat}
                <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 leading-none
                  ${categoriaActiva === cat ? "bg-white/20 text-white" : "bg-white/5 text-brand-muted"}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Chips de filtros activos ─────────────────────────── */}
      {chipsActivos.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-brand-muted text-xs font-medium">Filtros activos:</span>
          {chipsActivos.map(chip => (
            <FilterChip key={chip.id} label={chip.label} onRemove={chip.onRemove} />
          ))}
          <button
            onClick={resetFiltros}
            className="text-xs text-brand-muted hover:text-white underline transition-colors cursor-pointer"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* ── Contador de resultados ────────────────────────────── */}
      <div ref={resultadosRef} className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <p className="text-brand-muted text-sm">
          <span className="text-white font-semibold">{productosFiltrados.length}</span> productos encontrados
          {vistaCategorias && gruposCategoria.length > 0 && (
            <span className="text-brand-orange ml-1">· {gruposCategoria.length} {gruposCategoria.length === 1 ? "marca" : "marcas"}</span>
          )}
        </p>
        {vistaCategorias && gruposCategoria.length > 0 && (
          <div className="flex gap-3">
            <button onClick={abrirTodas} className="text-xs text-brand-muted hover:text-white transition-colors cursor-pointer">
              Expandir todas
            </button>
            <span className="text-white/20">|</span>
            <button onClick={cerrarTodas} className="text-xs text-brand-muted hover:text-white transition-colors cursor-pointer">
              Colapsar todas
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          VISTA NORMAL (grid plana)
      ══════════════════════════════════════════════════════ */}
      {!vistaCategorias && (
        productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {productosFiltrados.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-brand-dark-card border border-white/10 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-brand-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No encontramos productos</h3>
            <p className="text-brand-muted mb-6">Prueba con otros filtros o busca algo diferente.</p>
            <button onClick={resetFiltros} className="btn-primary">Ver todos los productos</button>
          </div>
        )
      )}

      {/* ══════════════════════════════════════════════════════
          VISTA POR MARCAS (acordeón)
      ══════════════════════════════════════════════════════ */}
      {vistaCategorias && (
        gruposCategoria.length > 0 ? (
          <div className="space-y-0">
            {gruposCategoria.map(([categoria, prods]) => (
              <CategoryAccordion
                key={categoria}
                categoria={categoria}
                prods={prods}
                isOpen={!!categoriasAbiertas[categoria]}
                onToggle={() => toggleCategoria(categoria)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-brand-dark-card border border-white/10 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-brand-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No hay marcas con esos filtros</h3>
            <p className="text-brand-muted mb-6">Prueba con otros filtros o busca algo diferente.</p>
            <button onClick={resetFiltros} className="btn-primary">Ver todas las marcas</button>
          </div>
        )
      )}
    </div>
  )
}
