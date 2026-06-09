import { supabase } from "../lib/supabase"
import type { Policy, PolicyWithClient, PolicyInsert, PolicyUpdate, CreateClientWithPolicyData } from "../types"

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

export async function createClientWithPolicy(
  agentId: number,
  data: CreateClientWithPolicyData
): Promise<{ clientId: string; policyId: string }> {
  const { data: client, error: clientError } = await supabase
    .from("insurance_clients")
    .insert({
      agent_id: agentId,
      full_name: data.client.full_name,
      document_id: data.client.document_id,
      phone: data.client.phone,
    })
    .select()
    .single()

  if (clientError) throw clientError

  const { data: policy, error: policyError } = await supabase
    .from("policies")
    .insert({
      agent_id: agentId,
      client_id: client.id,
      policy_type: data.policy.policy_type,
      insurer: data.policy.insurer_name,
      insurer_id: data.policy.insurer_id,
      start_date: data.policy.start_date,
      expiration_date: data.policy.expiration_date,
      price: data.policy.price,
      status: "vigente",
      notes: data.policy.notes,
    })
    .select()
    .single()

  if (policyError) throw policyError

  return { clientId: client.id, policyId: policy.id }
}
