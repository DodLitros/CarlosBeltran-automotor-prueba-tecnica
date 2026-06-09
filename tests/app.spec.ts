import { test, expect } from "@playwright/test"

test.describe("Login", () => {
  test("muestra la página de login", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toHaveText("SegurosPro")
    await expect(page.locator("#agentId")).toBeVisible()
  })

  test("rechaza ID de agente inválido", async ({ page }) => {
    await page.goto("/")
    await page.fill("#agentId", "999")
    await page.click('button[type="submit"]')
    await expect(page.locator(".form-error")).toBeVisible()
  })

  test("login exitoso con agente válido", async ({ page }) => {
    await page.goto("/")
    await page.fill("#agentId", "1")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/policies/)
  })
})

test.describe("Todas las pólizas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.fill("#agentId", "1")
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/policies/)
  })

  test("muestra la tabla de pólizas", async ({ page }) => {
    await expect(page.locator(".data-table")).toBeVisible()
    await expect(page.locator("h2")).toHaveText("Todas las pólizas")
  })

  test("buscador filtra resultados", async ({ page }) => {
    const searchInput = page.locator('.search-bar input[type="search"]')
    await searchInput.fill("xyznonexistent")
    await expect(page.locator(".empty-state")).toBeVisible()
  })

  test("campana de notificaciones visible", async ({ page }) => {
    await expect(page.locator(".notification-bell")).toBeVisible()
  })
})

test.describe("Pólizas por vencer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.fill("#agentId", "1")
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/policies/)
    await page.click('a[href="/expiring"]')
    await page.waitForURL(/\/expiring/)
  })

  test("muestra filtros de vencimiento", async ({ page }) => {
    await expect(page.locator(".filter-bar")).toBeVisible()
    const filterButtons = page.locator(".filter-btn")
    await expect(filterButtons).toHaveCount(6)
  })

  test("permite cambiar estado de póliza", async ({ page }) => {
    const selects = page.locator(".status-select")
    const count = await selects.count()
    if (count > 0) {
      await selects.first().selectOption("en_gestion")
    }
  })
})

test.describe("Navegación", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.fill("#agentId", "1")
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/policies/)
  })

  test("campana redirige a pólizas por vencer", async ({ page }) => {
    await page.click(".notification-bell")
    await expect(page).toHaveURL(/\/expiring/)
  })

  test("logout redirige al login", async ({ page }) => {
    await page.click(".btn-logout")
    await expect(page).toHaveURL("/")
  })
})
