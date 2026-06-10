import { CONFIG } from "../config"
import { formatoCOP } from "./moneda"

export function generarLinkWhatsApp(items, total, nombre, pago, envio, orderId) {
  const lineas = items.map(
    item =>
      `- ${item.cantidad}x ${item.nombre} ${item.variante && item.variante !== "Única" ? `[${item.variante}]` : ""} - ${formatoCOP(item.precio * item.cantidad)}`
  )

  const fecha = new Date().toLocaleDateString("es-CO")

  const mensaje = [
    `*NUEVA ORDEN: LEOFIT #ORD-${orderId}*`,
    `- Fecha: ${fecha}`,
    nombre ? `- Cliente: *${nombre}*` : `- Cliente: (Sin especificar)`,
    "------------------------",
    "*PRODUCTOS:*",
    ...lineas,
    "",
    `- Envío: ${envio || "A coordinar"}`,
    `- Pago: ${pago || "A coordinar"}`,
    "------------------------",
    `*TOTAL ESTIMADO: ${formatoCOP(total)}*`,
  ].join("\n")

  return `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(mensaje)}`
}
