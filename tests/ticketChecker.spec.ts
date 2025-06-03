import { test, expect, Page } from '@playwright/test';

export async function loginAs(email: string, page: Page) {
    const webServerUrl = process.env.NEXT_PUBLIC_WEB_SERVER_URL || 'http://localhost:8080';
    await page.goto(webServerUrl + "/auth/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Hola1597!!!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\//);
}

async function goToCheckerPage(page: Page) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Checker")');
    await myTicketsButton.click();
    await page.waitForURL(/\/ticket-checker/);
}

test.describe('QR Ticket Scanner', () => {
    test.setTimeout(180000); // 3 minutes timeout for each test

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('ticketchecker@gmail.com', page);
        await goToCheckerPage(page);
    });

    test('should display the scanner page correctly', async ({ page }) => {
        await expect(page.locator('h2:text("Escáner de Tickets QR")')).toBeVisible();
        await expect(page.locator('text=Iniciar Escaneo')).toBeVisible();
        await expect(page.locator('[data-testid="scanner-video"]')).not.toBeVisible();
    });

    test('should show camera placeholder initially', async ({ page }) => {
        const placeholder = page.locator('text=Iniciar Escaneo');
        await expect(placeholder).toBeVisible();
        await expect(page.locator('[data-testid="camera"]')).toBeVisible();
    });
  
});