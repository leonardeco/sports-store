import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import productos from "../data/productos.json"

// Datos falsos estructurados para simular interacciones reales (Social Proof)
const FIRST_NAMES = ["Juan", "María", "Carlos", "Diego", "Flor", "Sofía", "Martín", "Ana", "Lucas", "Valentina", "Facundo", "Camila", "Esteban", "Julián", "Lucía"]
const CITIES = ["Córdoba", "Buenos Aires", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "Tucumán", "Salta", "Santa Fe", "Neuquén"]
const TIMES = ["Hace 2 minutos", "Hace 5 minutos", "Hace 14 minutos", "Acaba de comprar"]

export default function SalesPop() {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    let timeoutId;
    
    const triggerPop = () => {
      // Selección aleatoria
      const randomProduct = productos[Math.floor(Math.random() * productos.length)]
      const randomName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)]
      const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)]

      setData({ product: randomProduct, name: randomName, city: randomCity, time: randomTime })
      setVisible(true)

      // El cartel dura 6 segundos en pantalla antes de desaparecer
      timeoutId = setTimeout(() => {
        setVisible(false)
      }, 6000)
    }

    // Retardo inicial de 8 segundos antes del primer popup de prueba
    const initialDelay = setTimeout(triggerPop, 8000)

    // A partir de ahí, se repite cada 35 segundos (un ritmo psicológico comprobado)
    const interval = setInterval(triggerPop, 35000)

    return () => { 
      clearTimeout(initialDelay)
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  if (!visible || !data) return null

  return (
    <div className="fixed bottom-4 left-4 z-[40] sm:bottom-6 sm:left-6 animate-slide-up pointer-events-auto">
      <Link 
        to={`/producto/${data.product.id}`}
        className="bg-brand-dark-card border border-white/10 shadow-2xl rounded-xl p-3 sm:p-4 flex items-center gap-4 w-[280px] sm:w-[320px] group transition-all duration-300 hover:border-brand-orange/40 hover:scale-105 relative overflow-hidden"
      >
        {/* Imagen en pequeña resolución */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-brand-dark-3 rounded-lg overflow-hidden">
          <img 
            src={data.product.imagen} 
            alt={data.product.nombre} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        
        {/* Información del comprador fantasma */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 text-xs text-brand-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <strong>{data.name}</strong>
          </div>
          <p className="text-white font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-brand-orange transition-colors">
            {data.product.nombre}
          </p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">
            {data.time}
          </p>
        </div>
        
        {/* Botón cruz para cerrarlo, previene el bubble-up del Link */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVisible(false); }} 
          className="absolute top-2 right-2 text-white/20 hover:text-white p-1 transition-colors"
          aria-label="Cerrar notificación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </Link>
    </div>
  )
}
