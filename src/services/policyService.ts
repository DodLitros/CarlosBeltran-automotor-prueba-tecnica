import { supabase } from "../lib/supabase"
import type { Policy, PolicyWithClient, PolicyInsert, PolicyUpdate } from "../types"

export async function getPoliciesByAgent(agentId: number): Promise<PolicyWithClient[]> {
  const { data, error } = await supabase
    .from("policies")
    .select("*, insurance_clients(*)")
    .eq("agent_id", agentId)
    .order("expiration_date", { ascending: true })

  if (error) throw error
  return data as PolicyWithClient[]
}

export async function getExpiringPolicies(agentId: number): Promise<PolicyWithClient[]> {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const { data, error } = await supabase
    .from("policies")
    .select("*, insurance_clients(*)")
    .eq("agent_id", agentId)
    .lte("expiration_date", thirtyDaysFromNow.toISOString().split("T")[0])
    .order("expiration_date", { ascending: true })

  if (error) throw error
  return data as PolicyWithClient[]
}

export async function updatePolicy(policyId: string, updates: PolicyUpdate): Promise<Policy> {
  const { data, error } = await supabase
    .from("policies")
    .update(updates)
    .eq("id", policyId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createPolicy(policy: PolicyInsert): Promise<Policy> {
  const { data, error } = await supabase
    .from("policies")
    .insert(policy)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getExpiringCount(agentId: number): Promise<number> {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const { count, error } = await supabase
    .from("policies")
    .select("*", { count: "exact", head: true })
    .eq("agent_id", agentId)
    .lte("expiration_date", thirtyDaysFromNow.toISOString().split("T")[0])

  if (error) throw error
  return count ?? 0
}
