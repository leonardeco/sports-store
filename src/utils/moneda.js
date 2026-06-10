const fmt = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
})

export const formatoCOP = (valor) => fmt.format(valor)
