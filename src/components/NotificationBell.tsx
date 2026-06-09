import { useNotifications } from "../context/NotificationContext"
import { useNavigate } from "react-router-dom"

export function NotificationBell() {
  const { expiringCount } = useNotifications()
  const navigate = useNavigate()

  return (
    <button
      className="notification-bell"
      onClick={() => navigate("/expiring")}
      aria-label={`Notificaciones: ${expiringCount} pólizas por vencer`}
      title={`${expiringCount} pólizas por vencer o vencidas`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {expiringCount > 0 && (
        <span className="notification-badge" aria-hidden="true">
          {expiringCount > 99 ? "99+" : expiringCount}
        </span>
      )}
    </button>
  )
}
