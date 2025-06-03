import { test, expect, Page } from '@playwright/test';
    test.setTimeout(180_000); // Establece 2 minutos para cada test

export async function loginAs(email: string, page: Page) {
    const webServerUrl = process.env.NEXT_PUBLIC_WEB_SERVER_URL || 'http://localhost:8080';
    await page.goto(webServerUrl + "/auth/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Hola1597!!!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\//);
}

async function goToMyHistoricPage(page: Page) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Mi Historial")');
    await myTicketsButton.click();
    await page.waitForURL(/\/client/);
}

test.describe('My Tickets Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });

    test.describe('When there is no ticket historic', () => {
        test.beforeEach(async ({ page }) => {
            await loginAs('guarros@gmail.com', page);
            await goToMyHistoricPage(page);
        });

        test('should display empty state for historic tickets', async ({ page }) => {
            // Switch to historic view
            await expect(page.locator('[data-testid="tickets-title"]')).toHaveText('Historial de Tickets');
            await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
            await expect(page.locator('text="No tienes historial de tickets"')).toBeVisible();
        });

        test('should display correct ticket information', async ({ page }) => {
            const firstTicket = page.locator('[data-testid="ticket-item"]').first();
            

            await expect(firstTicket.locator('[data-testid="ticket-folio"]')).not.toBeVisible();
            await expect(firstTicket.locator('[data-testid="event-name"]')).not.toBeVisible();
            await expect(firstTicket.locator('[data-testid="purchase-date"]')).not.toBeVisible();
            await expect(firstTicket.locator('[data-testid="ticket-quantity"]')).not.toBeVisible();
            await expect(firstTicket.locator('[data-testid="event-image"]')).not.toBeVisible();
            
            // Verify status badge exists
            await expect(firstTicket.locator('[data-testid="active-badge"], [data-testid="inactive-badge"], [data-testid="redeemed-badge"]')).not.toBeVisible();
        });
    });

    test.describe('When there is ticket historic', () => {
        test.beforeEach(async ({ page }) => {
            await loginAs('donneys@gmail.com', page);
            await goToMyHistoricPage(page);
        });

        test('should display both current and historic tickets', async ({ page }) => {
     
            await expect(page.locator('[data-testid="tickets-title"]')).toHaveText('Historial de Tickets');
            const historicTickets = page.locator('[data-testid="ticket-item"]');
            await expect(historicTickets).not.toHaveCount(0);
            
            // Verify QR buttons are not present in historic view
            await expect(historicTickets.first().locator('[data-testid="qr-button"]')).not.toBeVisible();
        });

        test('should display different UI for historic tickets', async ({ page }) => {

            const firstHistoricTicket = page.locator('[data-testid="ticket-item"]').first();
            
            // Verify all expected data is present
            await expect(firstHistoricTicket.locator('[data-testid="ticket-folio"]')).toBeVisible();
            await expect(firstHistoricTicket.locator('[data-testid="event-name"]')).toBeVisible();
            await expect(firstHistoricTicket.locator('[data-testid="purchase-date"]')).toBeVisible();
            await expect(firstHistoricTicket.locator('[data-testid="ticket-quantity"]')).toBeVisible();
            
            // Verify QR section is not present
            await expect(firstHistoricTicket.locator('[data-testid="qr-button"]')).not.toBeVisible();
            await expect(firstHistoricTicket.locator('[data-testid="availability-message"]')).not.toBeVisible();
            
            // Check for redeemed status more likely in historic tickets
            await expect(firstHistoricTicket.locator('[data-testid="redeemed-badge"]')).toBeVisible();
        });
    });
});