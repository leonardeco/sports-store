import { useEffect } from "react"
import { CONFIG } from "../config"

export default function useSEO({ title, description }) {
  useEffect(() => {
    // Actualizar el título
    const previousTitle = document.title
    document.title = title ? `${title} — ${CONFIG.store.name}` : CONFIG.store.name

    // Actualizar la descripción
    let metaDescription = document.querySelector('meta[name="description"]')
    const previousDescription = metaDescription?.getAttribute("content")

    if (description) {
      if (metaDescription) {
        metaDescription.setAttribute("content", description)
      } else {
        metaDescription = document.createElement("meta")
        metaDescription.name = "description"
        metaDescription.content = description
        document.head.appendChild(metaDescription)
      }
    }

    // Cleanup (opcional, restaura el estado anterior si se desmonta)
    return () => {
      document.title = previousTitle
      if (metaDescription && previousDescription) {
        metaDescription.setAttribute("content", previousDescription)
      }
    }
  }, [title, description])
}
