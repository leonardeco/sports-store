import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function InteractiveChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: "bot", 
      text: "¡Hola! 👋 Soy tu asesor inteligente de LEOFIT. ¿En qué puedo ayudarte a mejorar tu entrenamiento hoy?" 
    }
  ])
  const [options, setOptions] = useState([
    { label: "🏋️ Ayúdame a elegir equipo", id: "elegir_equipo" },
    { label: "🎯 Análisis de mis objetivos", id: "analisis_objetivos" },
    { label: "📦 Dudas sobre envíos", id: "envios" }
  ])
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  // Tooltip inicial paramostrar a los usuarios que hay un chat
  useEffect(() => {
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 4000)
    return () => clearTimeout(tooltipTimer)
  }, [])

  // Auto-scroll hacia el final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleOpenChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setShowTooltip(false)
    }
  }

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text }])
  }

  const handleOptionClick = (optionId, optionLabel) => {
    // Añadimos el mensaje del usuario
    addMessage("user", optionLabel)
    
    // Quitamos las opciones temporales mientras "piensa"
    setOptions([])

    setTimeout(() => {
      // Lógica de respuesta basada en la opción
      if (optionId === "elegir_equipo") {
        addMessage("bot", "¡Perfecto! El equipo adecuado es clave. ¿Qué tipo de actividad física realizas con más frecuencia?")
        setOptions([
          { label: "Levantamiento de Pesas", id: "pesas" },
          { label: "Cardio y Running", id: "cardio" },
          { label: "Yoga / Pilates", id: "yoga" },
          { label: "Hogar / General", id: "general" }
        ])
      } else if (optionId === "analisis_objetivos") {
        addMessage("bot", "Excelente iniciativa. Analicemos juntos tu plan. ¿Cuál es tu meta principal este mes?")
        setOptions([
          { label: "Ganar masa muscular", id: "masa_muscular" },
          { label: "Tonificar y perder peso", id: "perder_peso" },
          { label: "Mejorar mi resistencia", id: "resistencia" }
        ])
      } else if (optionId === "envios") {
        addMessage("bot", "Hacemos envíos nacionales con la máxima seguridad. El tiempo aproximado es de 3 a 5 días hábiles. ¿Quieres ver nuestro catálogo de productos?")
        setOptions([
          { label: "Sí, vamos al catálogo", id: "ir_catalogo" },
          { label: "Volver al inicio", id: "inicio" }
        ])
      } 
      // Opciones subsecuentes - Equipo
      else if (["pesas", "cardio", "yoga", "general"].includes(optionId)) {
        addMessage("bot", "¡Genial! Basado en esa actividad, tenemos accesorios especializados en la sección de accesorios o ropa de compresión. Te invito a explorar el catálogo con estos filtros.")
        setOptions([
          { label: "Ver productos sugeridos", id: "ir_catalogo" },
          { label: "Otra consulta", id: "inicio" }
        ])
      }
      // Opciones subsecuentes - Objetivos
      else if (["masa_muscular", "perder_peso", "resistencia"].includes(optionId)) {
        addMessage("bot", "¡Esa es una gran meta! Para llegar ahí necesitas consistencia y la indumentaria que te permita moverte al 100%. Te sugiero elegir telas transpirables y accesorios de apoyo. ¿Qué deseas hacer ahora?")
        setOptions([
          { label: "Llévame a comprar ropa", id: "ir_catalogo" },
          { label: "Hablar de otra cosa", id: "inicio" }
        ])
      }
      // Direccionamientos
      else if (optionId === "ir_catalogo") {
        addMessage("bot", "¡Vámonos al catálogo! Redirigiendo...")
        setTimeout(() => { navigate("/catalogo"); handleOpenChat() }, 1500)
      } else if (optionId === "inicio") {
        addMessage("bot", "¿En qué más puedo ayudarte a mejorar?")
        setOptions([
          { label: "🏋️ Ayúdame a elegir equipo", id: "elegir_equipo" },
          { label: "🎯 Análisis de mis objetivos", id: "analisis_objetivos" },
          { label: "📦 Dudas sobre envíos", id: "envios" }
        ])
      }
      else {
        // Fallback genérico
        addMessage("bot", "Entendido. ¿En qué más te sirvo?")
        setOptions([
          { label: "Volver al inicio", id: "inicio" }
        ])
      }
    }, 600) // ligero retraso para sentir más "natural" la charla
  }

  const handleSendText = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const text = inputText.trim()
    addMessage("user", text)
    setInputText("")
    setOptions([])

    setTimeout(() => {
      addMessage("bot", "Soy un asistente automatizado. Según lo que mencionas, la mejor opción es realizar un análisis guiado o explorar el catálogo. ¿Qué prefieres?")
      setOptions([
        { label: "Analizar mi necesidad", id: "analisis_objetivos" },
        { label: "Ir al Catálogo", id: "ir_catalogo" }
      ])
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* ── Tooltip animado inicial ─────────────────────────────────────── */}
      {showTooltip && !isOpen && (
        <div
          className="bg-brand-dark-2 border border-white/10 text-white px-5 py-3 rounded-2xl rounded-br-sm shadow-2xl text-sm font-semibold animate-slide-up pointer-events-auto cursor-pointer absolute right-[75px] bottom-2 whitespace-nowrap bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-70"
          onClick={handleOpenChat}
          onKeyDown={e => e.key === "Enter" && handleOpenChat()}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange"></span>
            </span>
            ¡Hola! ¿Necesitas ayuda con tu entrenamiento?
          </div>
        </div>
      )}
      
      {/* ── Botón Redondo del Chatbot ───────────────────────────────────── */}
      <button
        onClick={handleOpenChat}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto ${
          isOpen 
            ? 'bg-brand-dark-3 text-white border border-white/20' 
            : 'bg-brand-orange text-white shadow-brand-orange/40 hover:shadow-brand-orange/60 shadow-lg'
        }`}
        aria-label="Asistente Virtual"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* ── Ventana del Chat ────────────────────────────────────────────── */}
      <div 
        className={`absolute bottom-24 right-0 w-[340px] sm:w-[380px] h-[500px] max-h-[75vh] flex flex-col bg-brand-dark-2 border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto origin-bottom-right transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header Chat */}
        <div className="bg-brand-dark px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-orange-400 rounded-full flex items-center justify-center font-display text-lg text-white font-bold shadow-lg shadow-brand-orange/20">
              L
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">LEO-Bot</h4>
              <p className="text-brand-orange text-xs flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange inline-block animate-pulse"></span> 
                Asistente Virtual
              </p>
            </div>
          </div>
          <button onClick={handleOpenChat} className="text-gray-400 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
        </div>

        {/* Zona de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-brand-dark-card/30 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div 
                className={`max-w-[85%] p-3 text-[14px] leading-relaxed shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-brand-orange text-white rounded-2xl rounded-tr-sm" 
                    : "bg-brand-dark-3 text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Botones de sugerencias (cuando el bot pregunta) */}
          {options.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 animate-fade-in items-end">
              {options.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => handleOptionClick(opt.id, opt.label)}
                  className="bg-brand-orange/10 text-brand-orange border border-brand-orange/30 hover:bg-brand-orange hover:text-white transition-all text-right px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-medium ml-8"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de texto manual */}
        <div className="p-4 bg-brand-dark border-t border-white/5 shrink-0">
          <form onSubmit={handleSendText} className="relative d-flex items-center">
            <input 
              type="text" 
              placeholder="Escribe tu mensaje..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-brand-dark-3 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-brand-orange text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    {/* Estilos locales para el scrollbar solo del chat */}
    <style dangerouslySetInnerHTML={{__html: `
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
    `}} />
    </div>
  )
}
