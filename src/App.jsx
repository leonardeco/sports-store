import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { ToastProvider } from "./context/ToastContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import PromoBanner from "./components/PromoBanner"
import CartDrawer from "./components/CartDrawer"
import { WhatsAppFloat, ScrollToTop } from "./components/FloatingButtons"
import ScrollToTopOnNav from "./components/ScrollToTopOnNav"
import InteractiveChatbot from "./components/InteractiveChatbot"
import ErrorBoundary from "./components/ErrorBoundary"

// ── Code-splitting por ruta: cada página es su propio chunk ──────────────────
const Home            = lazy(() => import("./pages/Home"))
const Catalogo        = lazy(() => import("./pages/Catalogo"))
const DetalleProducto = lazy(() => import("./pages/DetalleProducto"))
const Carrito         = lazy(() => import("./pages/Carrito"))
const Contacto        = lazy(() => import("./pages/Contacto"))

const PageLoader = () => (
  <div className="py-24 text-center text-brand-muted animate-fade-in">Cargando…</div>
)

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-brand-dark">
            <PromoBanner />
            <ScrollToTopOnNav />
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/"             element={<Home />} />
                    <Route path="/catalogo"     element={<Catalogo />} />
                    <Route path="/producto/:id" element={<DetalleProducto />} />
                    <Route path="/carrito"      element={<Carrito />} />
                    <Route path="/contacto"     element={<Contacto />} />
                    <Route path="*"             element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />

            {/* Elementos Flotantes */}
            <WhatsAppFloat />
            <ScrollToTop />
            <CartDrawer />
            <InteractiveChatbot />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  )
}
