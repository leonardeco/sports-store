// ============================================================
//  ARCHIVO DE CONFIGURACIÓN CENTRAL DE LA TIENDA
//  Edita este archivo para personalizar el comportamiento
// ============================================================

export const CONFIG = {
  // ─── WhatsApp ─────────────────────────────────────────────
  // IMPORTANTE: reemplaza este número por el tuyo
  // Formato: código de país + número SIN espacios ni "+"
  // Ejemplo Colombia: 573226993891
  whatsapp: {
    number:   "573226993891",    // Colombia: +57 322 699 3891
    greeting: "¡Hola! Me gustaría hacer el siguiente pedido:",
  },

  // ─── Datos de la tienda ───────────────────────────────────
  store: {
    name:           "LEOFIT",
    tagline:        "Entrenas en serio. Nosotros también.",
    currency:       "COP",
    currencySymbol: "$", // DEPRECATED: Usar formatoCOP de src/utils/moneda en su lugar
    // Cambia este mensaje por el que quieras mostrar en el footer
    description:    "Suplementos deportivos de las mejores marcas del mundo para los que van en serio.",
    // Redes sociales (deja vacío si no tienes)
    instagram:      "",  // Dejar vacío para ocultar el botón de Instagram
    facebook:       "",
    email:          "leonardecojt@gmail.com",
  },

  // ─── Categorías y filtros del catálogo ───────────────────
  catalog: {
    categories: ["Todos", "Creatinas", "Proteínas", "Preentrenos", "Otros Suplementos"],
    priceRanges: [
      { label: "Todos los precios",       min: 0,      max: Infinity },
      { label: "Hasta $100.000",          min: 0,      max: 100000   },
      { label: "$100.000 - $200.000",     min: 100000, max: 200000   },
      { label: "$200.000 - $350.000",     min: 200000, max: 350000   },
      { label: "Más de $350.000",         min: 350000, max: Infinity },
    ],
  },

  // ─── Configuración de Categorías (Acordeones) ────────────
  categoriesDef: {
    "Creatinas":         { color: "#7B2FF2", accent: "#FFFFFF", order: 1 },
    "Proteínas":         { color: "#003087", accent: "#FFFFFF", order: 2 },
    "Preentrenos":       { color: "#1A1A1A", accent: "#E5C100", order: 3 },
    "Otros Suplementos": { color: "#1E1E1E", accent: "#FF6B00", order: 4 },
  },

  // ─── Marcas con colores y logos ──────────────────────────
  brands: {
    "MuscleTech":         { color: "#7B2FF2", accent: "#FFFFFF", order: 1,  logo: "/img/marcas/muscletech.png"        },
    "Dymatize":           { color: "#003087", accent: "#FFFFFF", order: 2,  logo: null                                },
    "Optimum Nutrition":  { color: "#1A1A1A", accent: "#E5C100", order: 3,  logo: "/img/marcas/optimum-nutrition.svg" },
    "BSN":                { color: "#8B0000", accent: "#FFFFFF", order: 4,  logo: "/img/marcas/bsn.svg"               },
    "Cellucor":           { color: "#0047AB", accent: "#AAFF00", order: 5,  logo: "/img/marcas/cellucor.png"          },
    "Basic":              { color: "#1A3A1A", accent: "#AAFF00", order: 6,  logo: null                                },
    "Simply":             { color: "#7B3F00", accent: "#FFFFFF", order: 7,  logo: null                                },
    "Isopure":            { color: "#006400", accent: "#FFFFFF", order: 8,  logo: "/img/marcas/isopure.svg"           },
    "Sascha Fitness":     { color: "#1A1A2E", accent: "#FF6B00", order: 9,  logo: null                                },
    "Proscience":         { color: "#0D1B2A", accent: "#00E5FF", order: 10, logo: null                                },
    "Nutreamerican":      { color: "#1A0A2E", accent: "#FF6B35", order: 11, logo: null                                },
    "Ronnie Coleman":     { color: "#1A1A1A", accent: "#FFD700", order: 12, logo: "/img/marcas/ronnie-coleman.png"    },
    "Angry Supplements":  { color: "#1A0000", accent: "#FF4444", order: 13, logo: "/img/marcas/angry-supplements.png" },
    "Graz Chemical":      { color: "#2F4F4F", accent: "#00FFFF", order: 14, logo: null                                },
    "Varios":             { color: "#1E1E1E", accent: "#FF6B00", order: 15, logo: null                                },
  },
}
