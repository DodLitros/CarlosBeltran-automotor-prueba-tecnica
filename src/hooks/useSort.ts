import { useState, useCallback } from "react"
import type { SortConfig, SortDirection } from "../types"

export function useSort(defaultKey: string = "", defaultDirection: SortDirection = null) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey,
    direction: defaultDirection,
  })

  const toggleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      let direction: SortDirection = "asc"
      if (prev.key === key && prev.direction === "asc") direction = "desc"
      else if (prev.key === key && prev.direction === "desc") direction = null
      return { key: direction ? key : "", direction }
    })
  }, [])

  return { sortConfig, toggleSort }
}
