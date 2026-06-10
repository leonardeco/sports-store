import { useEffect } from "react"
import { CONFIG } from "../config"

function setMeta(selector, value) {
  let el = document.querySelector(selector)
  if (!el) {
    const match = selector.match(/\[(.+?)="(.+?)"\]/)
    el = document.createElement("meta")
    el.setAttribute(match[1], match[2])
    document.head.appendChild(el)
  }
  const prev = el.getAttribute("content")
  el.setAttribute("content", value)
  return prev
}

export default function useSEO({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${CONFIG.store.name}` : CONFIG.store.name

    // ── <title> ───────────────────────────────────────────────
    const previousTitle = document.title
    document.title = fullTitle

    // ── meta description ──────────────────────────────────────
    const previousDescription = description
      ? setMeta('meta[name="description"]', description)
      : null

    // ── Open Graph ────────────────────────────────────────────
    const previousOGTitle       = setMeta('meta[property="og:title"]', fullTitle)
    const previousOGDescription = description
      ? setMeta('meta[property="og:description"]', description)
      : null
    const previousOGImage = image
      ? setMeta('meta[property="og:image"]', image)
      : null

    // ── Twitter Card ──────────────────────────────────────────
    const previousTWTitle       = setMeta('meta[name="twitter:title"]', fullTitle)
    const previousTWDescription = description
      ? setMeta('meta[name="twitter:description"]', description)
      : null
    const previousTWImage = image
      ? setMeta('meta[name="twitter:image"]', image)
      : null

    return () => {
      document.title = previousTitle
      if (previousDescription)    setMeta('meta[name="description"]',          previousDescription)
      if (previousOGTitle)        setMeta('meta[property="og:title"]',         previousOGTitle)
      if (previousOGDescription)  setMeta('meta[property="og:description"]',   previousOGDescription)
      if (previousOGImage)        setMeta('meta[property="og:image"]',         previousOGImage)
      if (previousTWTitle)        setMeta('meta[name="twitter:title"]',        previousTWTitle)
      if (previousTWDescription)  setMeta('meta[name="twitter:description"]',  previousTWDescription)
      if (previousTWImage)        setMeta('meta[name="twitter:image"]',        previousTWImage)
    }
  }, [title, description, image])
}
