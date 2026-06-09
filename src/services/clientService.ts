import { supabase } from "../lib/supabase"
import type { InsuranceClient, InsuranceClientInsert, InsuranceClientUpdate, ClientWithPolicies } from "../types"

export async function getClientsByAgent(agentId: number): Promise<InsuranceClient[]> {
  const { data, error } = await supabase
    .from("insurance_clients")
    .select("*")
    .eq("agent_id", agentId)
    .order("full_name")

  if (error) throw error
  return data
}

export async function getClientById(clientId: string): Promise<ClientWithPolicies | null> {
  const { data, error } = await supabase
    .from("insurance_clients")
    .select("*, policies(*)")
    .eq("id", clientId)
    .single()

  if (error) throw error
  return data as ClientWithPolicies
}

export async function createClient(client: InsuranceClientInsert): Promise<InsuranceClient> {
  const { data, error } = await supabase
    .from("insurance_clients")
    .insert(client)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateClient(clientId: string, updates: InsuranceClientUpdate): Promise<InsuranceClient> {
  const { data, error } = await supabase
    .from("insurance_clients")
    .update(updates)
    .eq("id", clientId)
    .select()
    .single()

  if (error) throw error
  return data
}
