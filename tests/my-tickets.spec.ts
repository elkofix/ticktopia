import { test, expect, Page } from '@playwright/test';

async function goToMyTicketsPage(page: Page) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Mis Tickets")');
    await myTicketsButton.click();
    await page.waitForURL(/\/client/);
}

async function loginAs(email: string, page: Page) {
    const webServerUrl = process.env.WEB_SERVER_URL || 'http://localhost:8080';
    await page.goto(webServerUrl + "/auth/login");
    await page.fill('input[name="email"]', 'isahc221024@gmail.com');
    await page.fill('input[name="password"]', 'Hola1597!!!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\//);
}


test.describe('Buy ticket page components', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    })

    test('should load ticket selector correctly when qr is unavailable', async ({ page }) => {
        await loginAs('donney@gmail.com', page);
        await goToMyTicketsPage(page);
        const ticketSelector = page.locator('[data-testid="ticket-item"]').first();
    });

    test('should load ticket selector correctly when qr is available', async ({ page }) => {
        await loginAs('guarro@gmail.com', page);
        await goToMyTicketsPage(page);
        const ticketSelector = page.locator('[data-testid="ticket-item"]').first();
    });

});