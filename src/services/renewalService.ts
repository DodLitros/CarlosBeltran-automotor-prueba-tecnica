import { supabase } from "../lib/supabase"
import type { PolicyRenewal, PolicyRenewalInsert } from "../types"

export async function getRenewalsByPolicyId(policyId: string): Promise<PolicyRenewal[]> {
  const { data, error } = await supabase
    .from("policy_renewals")
    .select("*")
    .eq("policy_id", policyId)
    .order("renewed_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createRenewal(renewal: PolicyRenewalInsert): Promise<PolicyRenewal> {
  const { data, error } = await supabase
    .from("policy_renewals")
    .insert(renewal)
    .select()
    .single()

  if (error) throw error
  return data
}
