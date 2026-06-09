import { supabase } from "../lib/supabase"
import type { Agent } from "../types"

export async function getAgentById(id: number): Promise<Agent | null> {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("id")

  if (error) throw error
  return data
}
