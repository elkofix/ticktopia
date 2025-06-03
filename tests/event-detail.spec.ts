import { test, expect } from '@playwright/test';
    test.setTimeout(180_000); // Establece 2 minutos para cada test

test.describe('Event Detail Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.NEXT_PUBLIC_WEB_SERVER_URL || 'http://localhost:8080');
        const viewButton = page.locator('[data-testid="view-event-button"]').first();
        await viewButton.click();
        await page.waitForLoadState('networkidle');
    });

    test('should load event banner with all elements', async ({ page }) => {
        // Verificar que el banner principal está visible
        const banner = page.locator('[data-testid="event-detail-banner"]');
        await expect(banner).toBeVisible();

        // Verificar elementos dentro del banner
        await expect(banner.locator('[data-testid="event-banner-image"]')).toBeVisible();
        await expect(banner.locator('[data-testid="banner-overlay"]')).toBeVisible();
        await expect(banner.locator('[data-testid="event-title"]')).not.toBeEmpty();

        // Verificar información del organizador
        await expect(banner.locator('[data-testid="organizer-name"]')).not.toBeEmpty();
        await expect(banner.locator('[data-testid="organizer-label"]')).toHaveText('Organizador');

        // Verificar estado del evento
        const statusBadge = banner.locator('[data-testid="event-status-badge"]');
        await expect(statusBadge).toBeVisible();
        await expect(statusBadge).toHaveText(/Público|Privado/);
    });

    test('should display presentations section correctly', async ({ page }) => {
        const presentationsSection = page.locator('[data-testid="presentations-container"]').first();
        await expect(presentationsSection).toBeVisible();

        // Verificar título de la sección - más específico buscando el h2
        await expect(presentationsSection.locator('h2:text-is("Presentaciones")')).toBeVisible();

        // Verificar contador de presentaciones - más específico
        const countBadge = presentationsSection.locator('span:text-matches("presentación|presentaciones")');
        await expect(countBadge).toBeVisible();

        // Verificar si muestra presentaciones o estado vacío
        const presentations = page.locator('[data-testid^="presentation-card"]');
        const count = await presentations.count();

        if (count > 0) {
            await expect(presentations.first()).toBeVisible();
        } else {
            await expect(page.getByText('No hay presentaciones disponibles')).toBeVisible();
        }
    });

    test('should display all presentation details correctly', async ({ page }) => {
        // Solo ejecutar si hay presentaciones
        const presentations = page.locator('[data-testid^="presentation-card"]');
        const count = await presentations.count();

        test.skip(count === 0, 'No hay presentaciones para probar');

        const firstPresentation = presentations.first();

        await expect(firstPresentation.locator('[data-testid="presentation-date"]')).not.toBeEmpty();
        await expect(firstPresentation.locator('[data-testid="presentation-location"]')).not.toBeEmpty();
    });

});