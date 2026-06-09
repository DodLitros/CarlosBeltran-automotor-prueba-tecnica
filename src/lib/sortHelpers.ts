import type { PolicyWithClient } from "../types"

export function getSortValue(policy: PolicyWithClient, key: string): string | number {
  switch (key) {
    case "full_name":
      return policy.insurance_clients.full_name
    case "document_id":
      return policy.insurance_clients.document_id
    case "phone":
      return policy.insurance_clients.phone
    case "policy_type":
      return policy.policy_type
    case "insurer":
      return policy.insurer
    case "expiration_date":
      return policy.expiration_date
    case "status":
      return policy.status
    case "start_date":
      return policy.start_date
    case "price":
      return policy.price
    default:
      return ""
  }
}

export function sortPolicies(
  policies: PolicyWithClient[],
  key: string,
  direction: "asc" | "desc"
): PolicyWithClient[] {
  return [...policies].sort((a, b) => {
    const aVal = getSortValue(a, key)
    const bVal = getSortValue(b, key)
    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })
}
