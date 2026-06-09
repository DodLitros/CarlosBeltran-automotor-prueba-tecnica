import { useState, useEffect } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { NotificationBell } from "./NotificationBell"
import { useAuth } from "../context/AuthContext"

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark(!dark)}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  )
}

export function Layout() {
  const { agent, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="app-layout">
      <header className="app-header" role="banner">
        <div className="header-left">
          <h1 className="app-logo">SegurosPro</h1>
          <nav className="main-nav" aria-label="Navegación principal">
            <NavLink to="/policies" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Todas las pólizas
            </NavLink>
            <NavLink to="/expiring" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Por vencer
            </NavLink>
          </nav>
        </div>
        <div className="header-right">
          <ThemeToggle />
          <NotificationBell />
          <div className="agent-info">
            <span className="agent-name">{agent?.full_name}</span>
            <button className="btn-logout" onClick={handleLogout} aria-label="Cerrar sesión">
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="app-main" role="main">
        <Outlet />
      </main>
    </div>
  )
}
