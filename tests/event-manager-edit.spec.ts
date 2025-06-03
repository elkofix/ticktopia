import { test, expect, Page } from '@playwright/test';
test.setTimeout(180_000); // Establece 2 minutos para cada test

export async function loginAs(email: string, page: Page) {
    const webServerUrl = process.env.NEXT_PUBLIC_WEB_SERVER_URL || 'https://www.ticktopia.shop';
    await page.goto(webServerUrl + "/auth/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Hola1597!!!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\//);
}

async function goToEventsPage(page: Page) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Eventos")');
    await myTicketsButton.click();
    await page.waitForURL(/\/event-manager/);
    await page.click('[data-testid="event-action-button"]');
    await page.waitForURL(/\/manage/);
}

test.describe('Event Edition Page', () => {
    test.setTimeout(180_000);

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('colonia@gmail.com', page);
        await goToEventsPage(page);
    });

    test('should display loading state initially', async ({ page }) => {
        // Verify loading state appears before mock response
        await expect(page.locator('text=Cargando datos del evento...')).toBeVisible();
    });

    test('should display event edit form with data', async ({ page }) => {
        await expect(page.locator('h1:text("Editar Evento")')).toBeVisible();
        await expect(page.locator('text=Modifica la información de tu evento')).toBeVisible();

        await expect(page.locator('text=Organizador')).toBeVisible();
    });

});


test.describe('Event Edition presentation Page', () => {

    test.setTimeout(180_000);

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('sebastian@gmail.com', page);
        await goToEventsPage(page);
    });

    test('should display presentations section', async ({ page }) => {
        await expect(page.locator('h2:text("Presentaciones")')).toBeVisible();

        // Verify presentation data
        await expect(page.locator('text=asientos').first()).toBeVisible();
        await expect(page.locator('text=$').first()).toBeVisible();
    });

});


test.describe('Event Deletion presentation Page', () => {

    test.setTimeout(180_000);

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('sergio@gmail.com', page);
        await goToEventsPage(page);
    });

    test('should show error when delete fails', async ({ page }) => {
        // Mock failed delete API
        await page.route('**/deletePresentation*', route => route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Delete failed' })
        }));

        // Hover and click delete
        await page.locator('[data-testid="presentation-card"]').first().hover();
        await page.locator('[data-testid="delete-button"]').nth(1).click();
        await page.locator('[data-testid="confirm-delete-button"]').click();

        await expect(page.locator('text=Error al Eliminar')).toBeVisible();
        await expect(page.locator('text=No se puede eliminar una presentación que tiene tickets asociados')).toBeVisible();
    });


});








test.describe('Event Edition Delete presentation Page', () => {

    test.setTimeout(180_000);

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('deletepresentation@gmail.com', page);
        await goToEventsPage(page);
    });
});

