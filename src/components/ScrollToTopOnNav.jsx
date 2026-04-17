import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Scroll al top cada vez que cambia la ruta
export default function ScrollToTopOnNav() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  return null
}
