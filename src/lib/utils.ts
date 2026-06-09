export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr + "T00:00:00"))
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expirationDate + "T00:00:00")
  const diff = exp.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getExpirationLabel(days: number): string {
  if (days < 0) return `Vencida hace ${Math.abs(days)} días`
  if (days === 0) return "Vence hoy"
  if (days === 1) return "Vence mañana"
  return `Vence en ${days} días`
}

export function getExpirationClass(days: number): string {
  if (days < 0) return "expired"
  if (days <= 5) return "critical"
  if (days <= 15) return "warning"
  if (days <= 30) return "soon"
  return "safe"
}

export function getClientTenure(createdAt: string): string {
  const start = new Date(createdAt)
  const now = new Date()
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())

  if (months < 1) return "Menos de 1 mes"
  if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const yearStr = `${years} ${years === 1 ? "año" : "años"}`
  if (remMonths === 0) return yearStr
  return `${yearStr} y ${remMonths} ${remMonths === 1 ? "mes" : "meses"}`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
}
