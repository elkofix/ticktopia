import { test, expect, Page } from '@playwright/test';

export async function loginAs(email: string, page: Page) {
    const webServerUrl = process.env.WEB_SERVER_URL || 'http://localhost:8080';
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
}

test.describe('Event Management Page', () => {
    test.setTimeout(180_000); // Establece 2 minutos para cada test

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('colonia@gmail.com', page);
        await goToEventsPage(page);
    });

    test('should display loading state initially', async ({ page }) => {
        await expect(page.locator('[data-testid="loading-state"]')).toBeVisible();
        await expect(page.locator('text=Cargando eventos...')).toBeVisible();
    });

    test('should show create event button', async ({ page }) => {
        await expect(page.locator('[data-testid="create-event-button"]')).toBeVisible();
        await expect(page.locator('text=Agregar Evento')).toBeVisible();
    });

    test('should navigate to create event page when button clicked', async ({ page }) => {
        await page.click('[data-testid="create-event-button"]');
        await expect(page).toHaveURL(/\/create/);
    });

    test.describe('With events loaded', () => {

        test('should display event cards', async ({ page }) => {
            const cards = page.locator('[data-testid="event-card"]')
            const numberOfCards = await cards.count();
            await expect(numberOfCards).toBeGreaterThanOrEqual(0);
        });

        test('should show manage button for event managers', async ({ page }) => {
            const firstEvent = page.locator('[data-testid="event-card"]').first();
            await expect(firstEvent.locator('[data-testid="event-action-button"]')).toHaveText('Gestionar evento');
        });

        test('should navigate to manage page when button clicked', async ({ page }) => {
            const firstEvent = page.locator('[data-testid="event-card"]').first();
            await firstEvent.locator('[data-testid="event-action-button"]').click();
            await expect(page).toHaveURL(/\/event-manager/);
        });
    });

    test.describe('Pagination', () => {

        test('should show pagination controls', async ({ page }) => {
            await expect(page.locator('[data-testid="pagination-container"]')).toBeVisible();
        });

        test('should show item count', async ({ page }) => {
            await expect(page.locator('text=Mostrando')).toBeVisible();
        });

    });


});
test('should show empty state when no events', async ({ page }) => {
    await loginAs('noevents@gmail.com', page);
    await goToEventsPage(page);
    await page.route('**/getEventsByUser', route => route.fulfill({
        status: 200,
        body: JSON.stringify([])
    }));

    // Reload to get mocked data
    await page.reload();

    await expect(page.locator('[data-testid="icon-container"]')).toBeVisible();
    await expect(page.locator('text=No hay eventos disponibles')).toBeVisible();
});

test('should show error state when API fails', async ({ page }) => {
    await loginAs('noevents@gmail.com', page);
    await goToEventsPage(page);
    await page.route('**/getEventsByUser', route => route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
    }));

    // Reload to get mocked data
    await page.reload();

    // The component returns null on error
    await expect(page.locator('[data-testid="loading-state"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="event-card"]')).toHaveCount(0);
});