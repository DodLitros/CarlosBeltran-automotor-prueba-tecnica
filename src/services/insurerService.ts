import { supabase } from "../lib/supabase"
import type { Insurer } from "../types"

export async function getInsurers(): Promise<Insurer[]> {
  const { data, error } = await supabase
    .from("insurers")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) throw error
  return data
}
