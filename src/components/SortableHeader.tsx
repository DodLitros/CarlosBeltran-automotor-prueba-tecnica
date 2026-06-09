import type { SortDirection } from "../types"

interface SortableHeaderProps {
  label: string
  sortKey: string
  currentKey: string
  direction: SortDirection
  onSort: (key: string) => void
}

export function SortableHeader({
  label,
  sortKey,
  currentKey,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentKey === sortKey
  const ariaSort = isActive
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none"

  return (
    <th
      onClick={() => onSort(sortKey)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSort(sortKey)
        }
      }}
      tabIndex={0}
      role="columnheader"
      aria-sort={ariaSort}
      className="sortable-header"
    >
      <span>{label}</span>
      <span className="sort-icon" aria-hidden="true">
        {isActive && direction === "asc" && " ↑"}
        {isActive && direction === "desc" && " ↓"}
        {!isActive && " ↕"}
      </span>
    </th>
  )
}
