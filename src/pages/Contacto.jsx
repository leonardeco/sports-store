import { useState } from "react"
import { CONFIG } from "../config"

export default function Contacto() {
  const [form, setForm]     = useState({ nombre: "", email: "", mensaje: "" })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(false)
  const [errores, setErrores] = useState({})

  // ── Validación simple ─────────────────────────────────────────────────────
  const validar = () => {
    const e = {}
    if (!form.nombre.trim())   e.nombre  = "El nombre es obligatorio"
    if (!form.email.trim())    e.email   = "El email es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                               e.email   = "El email no es válido"
    if (!form.mensaje.trim())  e.mensaje = "El mensaje es obligatorio"
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const erroresValidados = validar()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }
    setEnviando(true)
    setErrorEnvio(false)
    setEnviado(false)
    
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": "contacto", ...form }).toString()
    })
      .then(res => {
        if (res.ok) {
          setEnviado(true)
          setForm({ nombre: "", email: "", mensaje: "" })
          setErrores({})
          setTimeout(() => setEnviado(false), 6000)
        } else {
          setErrorEnvio(true)
        }
      })
      .catch(() => {
        setErrorEnvio(true)
      })
      .finally(() => {
        setEnviando(false)
      })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide">
          CONTACTO
        </h1>
        <p className="text-brand-muted mt-2 text-lg">
          ¿Tenés alguna pregunta? Escribinos y te respondemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

        {/* ── Formulario ────────────────────────────────────────── */}
        <div>
          {/* Banner de éxito */}
          {enviado && (
            <div className="flex items-center gap-3 bg-green-900/40 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-6 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">
                ¡Tu mensaje fue enviado! Te contactaremos a la brevedad.
              </p>
            </div>
          )}

          {/* Banner de error */}
          {errorEnvio && (
            <div className="flex items-center gap-3 bg-red-900/40 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium">
                No pudimos enviar tu mensaje. <a href={`https://wa.me/${CONFIG.whatsapp.number}`} target="_blank" rel="noopener noreferrer" className="underline font-bold">Escribinos directo por WhatsApp</a>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Nombre */}
            <div>
              <label className="block text-white text-sm font-medium mb-1.5">
                Nombre completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className={`input-field ${errores.nombre ? "border-red-500/60 focus:border-red-500" : ""}`}
              />
              {errores.nombre && (
                <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-1.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={`input-field ${errores.email ? "border-red-500/60 focus:border-red-500" : ""}`}
              />
              {errores.email && (
                <p className="text-red-400 text-xs mt-1">{errores.email}</p>
              )}
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-white text-sm font-medium mb-1.5">
                Mensaje *
              </label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={5}
                placeholder="Escribí tu consulta aquí..."
                className={`input-field resize-none ${errores.mensaje ? "border-red-500/60 focus:border-red-500" : ""}`}
              />
              {errores.mensaje && (
                <p className="text-red-400 text-xs mt-1">{errores.mensaje}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className={`btn-primary w-full text-lg py-4 ${enviando ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </div>

        {/* ── Info de contacto ──────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Card WhatsApp */}
          <a
            href={`https://wa.me/${CONFIG.whatsapp.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 flex items-start gap-4 group hover:border-green-500/40"
          >
            <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
              <p className="text-brand-orange text-sm font-medium">+57 322 699 3891</p>
              <p className="text-brand-muted text-sm mt-0.5">
                La forma más rápida de contactarnos. Respondemos en minutos durante el horario comercial.
              </p>
              <span className="text-green-400 text-sm font-medium mt-2 inline-block group-hover:translate-x-1 transition-transform duration-200">
                Escribinos →
              </span>
            </div>
          </a>

          {/* Card Instagram (si está configurado) */}
          {CONFIG.store.instagram && (
            <a
              href={CONFIG.store.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex items-start gap-4 group hover:border-pink-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-600/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-500">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Instagram</h3>
                <p className="text-brand-muted text-sm">
                  Seguinos para novedades, promociones y contenido deportivo de calidad.
                </p>
                <span className="text-pink-400 text-sm font-medium mt-2 inline-block group-hover:translate-x-1 transition-transform duration-200">
                  Seguir →
                </span>
              </div>
            </a>
          )}

          {/* Card Email */}
          {CONFIG.store.email && (
            <a
              href={`mailto:${CONFIG.store.email}`}
              className="card p-6 flex items-start gap-4 group hover:border-blue-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <p className="text-brand-orange text-sm font-medium">{CONFIG.store.email}</p>
                <span className="text-blue-400 text-sm font-medium mt-2 inline-block group-hover:translate-x-1 transition-transform duration-200">
                  Escribir correo →
                </span>
              </div>
            </a>
          )}

          {/* Horarios */}
          <div className="card p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-brand-orange">🕐</span> Horarios de atención
            </h3>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Lun - Vie</span>
                <span className="text-white">9:00 - 20:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Sábado</span>
                <span className="text-white">9:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Domingo</span>
                <span className="text-red-400">Cerrado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACORDEÓN PREGUNTAS FRECUENTES (FAQ) ──────────────── */}
      <div className="mt-24 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl text-white tracking-wide">
            PREGUNTAS <span className="text-brand-orange">FRECUENTES</span>
          </h2>
          <p className="text-brand-muted mt-2">Todo lo que necesitás saber antes de comprar</p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              p: "¿Son productos originales?",
              r: "Sí, todos nuestros laboratorios, proteínas y suplementos son 100% originales, sellados de fábrica con todos los logos y cintas de autenticidad para tu total seguridad."
            },
            {
              p: "¿Qué métodos de pago manejan?",
              r: "Manejamos todas las modalidades online para tu comodidad. Transferencia, consignación o puedes arreglar pagos contraentrega en las zonas designadas."
            },
            {
              p: "¿Cuánto tiempo demora en llegar mi pedido?",
              r: "Si estás en la ciudad, te contactaremos por WhatsApp y coordinaremos una moto en el día. Los envíos nacionales se despachan en menos de 24 horas y suelen tardar entre 2 y 4 días hábiles dependiendo la provincia."
            },
            {
              p: "¿Cómo funciona la compra por WhatsApp?",
              r: "¡Es súper fácil! Vos elegís tus productos en esta web, tocás 'Mi Carrito' y le das al botón verde. Eso abrirá tu WhatsApp enviándonos tu orden lista y organizada para que concretemos el método de pago inmediatamente."
            }
          ].map((faq, i) => (
             <details key={i} className="group bg-brand-dark-card rounded-xl border border-white/5 overflow-hidden">
                <summary className="cursor-pointer p-6 font-bold text-white flex justify-between items-center group-open:text-brand-orange transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="text-brand-orange">P:</span> {faq.p}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform group-open:rotate-180 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-2 text-brand-muted leading-relaxed border-t border-white/5">
                  <span className="text-white/30 mr-2 font-bold">R:</span> {faq.r}
                </div>
              </details>
          ))}
        </div>
      </div>
    </div>
  )
}
