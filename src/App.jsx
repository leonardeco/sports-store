import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { ToastProvider } from "./context/ToastContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import PromoBanner from "./components/PromoBanner"
import CartDrawer from "./components/CartDrawer"
import { WhatsAppFloat, ScrollToTop } from "./components/FloatingButtons"
import ScrollToTopOnNav from "./components/ScrollToTopOnNav"
import Home from "./pages/Home"
import Catalogo from "./pages/Catalogo"
import DetalleProducto from "./pages/DetalleProducto"
import Carrito from "./pages/Carrito"
import Contacto from "./pages/Contacto"

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
              <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/catalogo"     element={<Catalogo />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/carrito"      element={<Carrito />} />
                <Route path="/contacto"     element={<Contacto />} />
                <Route path="*"             element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Elementos Flotantes */}
            <WhatsAppFloat />
            <ScrollToTop />
            <CartDrawer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  )
}

