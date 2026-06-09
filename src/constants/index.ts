import type { PolicyType } from "../types"

export const POLICY_TYPES: PolicyType[] = [
  "Automóvil",
  "Moto",
  "Hogar",
  "Vida",
  "Salud",
]

export const INSURERS = [
  "Sura",
  "Bolívar",
  "Liberty",
  "Mapfre",
  "Allianz",
  "AXA Colpatria",
  "HDI",
  "Seguros del Estado",
  "Previsora",
  "Positiva",
] as const

export const POLICY_STATUS_LABELS: Record<string, string> = {
  vigente: "Vigente",
  por_vencer: "Por vencer",
  vencida: "Vencida",
  en_gestion: "En gestión",
}

export const EXPIRING_FILTER_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "less_30", label: "Menos de 30 días" },
  { value: "less_15", label: "Menos de 15 días" },
  { value: "less_5", label: "Menos de 5 días" },
  { value: "expired_5", label: "Vencida hace 5+ días" },
  { value: "expired_20", label: "Vencida hace 20+ días" },
] as const
