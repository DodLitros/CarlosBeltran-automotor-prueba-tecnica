import { useState, useMemo, useCallback } from "react"

export function useSearch<T>(items: T[], searchFields: (keyof T)[]) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const lower = query.toLowerCase()
    return items.filter((item) =>
      searchFields.some((field) => {
        const val = item[field]
        return val != null && String(val).toLowerCase().includes(lower)
      })
    )
  }, [items, query, searchFields])

  const onSearch = useCallback((value: string) => {
    setQuery(value)
  }, [])

  return { query, filtered, onSearch }
}
