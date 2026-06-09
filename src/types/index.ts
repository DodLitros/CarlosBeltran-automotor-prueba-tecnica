import type { Tables, TablesInsert, TablesUpdate, Enums } from "./database"

export type Agent = Tables<"agents">
export type InsuranceClient = Tables<"insurance_clients">
export type Policy = Tables<"policies">
export type Insurer = Tables<"insurers">

export type AgentInsert = TablesInsert<"agents">
export type InsuranceClientInsert = TablesInsert<"insurance_clients">
export type PolicyInsert = TablesInsert<"policies">
export type InsurerInsert = TablesInsert<"insurers">

export type PolicyUpdate = TablesUpdate<"policies">
export type InsuranceClientUpdate = TablesUpdate<"insurance_clients">

export type PolicyStatus = "vigente" | "por_vencer" | "vencida" | "en_gestion"

export type PolicyType = Enums<"policy_type_enum">

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

export interface CreateClientWithPolicyData {
  client: {
    full_name: string
    document_id: string
    phone: string
  }
  policy: {
    policy_type: PolicyType
    insurer_id: string
    insurer_name: string
    start_date: string
    expiration_date: string
    price: number
    notes: string
  }
}
