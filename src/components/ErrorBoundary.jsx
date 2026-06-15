import { Component } from "react"
import { Link } from "react-router-dom"

// Captura errores de render para que un fallo no deje la pantalla en blanco.
// Uso: envolver <Routes> (o toda la App) con <ErrorBoundary>.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Punto de enganche para enviar a un servicio (Sentry, etc.)
    console.error("ErrorBoundary atrapó:", error, info)
  }

  handleReset = () => this.setState({ hasError: false })

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="font-display text-4xl text-white tracking-wide mb-3">
          ALGO SALIÓ MAL
        </h1>
        <p className="text-brand-muted mb-8 max-w-md">
          Tuvimos un problema cargando esta sección. Puedes volver al inicio o
          reintentar.
        </p>
        <div className="flex gap-3">
          <Link to="/" onClick={this.handleReset} className="btn-primary">
            Volver al inicio
          </Link>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }
}
