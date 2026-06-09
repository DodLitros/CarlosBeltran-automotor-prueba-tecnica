import type { Tables, TablesInsert, TablesUpdate } from "./database"

export type Agent = Tables<"agents">
export type InsuranceClient = Tables<"insurance_clients">
export type Policy = Tables<"policies">

export type AgentInsert = TablesInsert<"agents">
export type InsuranceClientInsert = TablesInsert<"insurance_clients">
export type PolicyInsert = TablesInsert<"policies">

export type PolicyUpdate = TablesUpdate<"policies">
export type InsuranceClientUpdate = TablesUpdate<"insurance_clients">

export type PolicyStatus = "vigente" | "por_vencer" | "vencida" | "en_gestion"

export type PolicyType = "Automóvil" | "Moto" | "Hogar" | "Vida" | "Salud"

export type Insurer =
  | "Sura"
  | "Bolívar"
  | "Liberty"
  | "Mapfre"
  | "Allianz"
  | "AXA Colpatria"
  | "HDI"
  | "Seguros del Estado"
  | "Previsora"
  | "Positiva"

export type ExpiringFilter =
  | "all"
  | "less_30"
  | "less_15"
  | "less_5"
  | "expired_5"
  | "expired_20"

export type SortDirection = "asc" | "desc" | null

export interface SortConfig {
  key: string
  direction: SortDirection
}

export interface PolicyWithClient extends Policy {
  insurance_clients: InsuranceClient
}

export interface ClientWithPolicies extends InsuranceClient {
  policies: Policy[]
}
