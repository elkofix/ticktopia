import { test, expect } from '@playwright/test';
    test.setTimeout(180_000); // Establece 2 minutos para cada test

test.describe('Presentation Detail Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await page.goto(process.env.NEXT_PUBLIC_WEB_SERVER_URL || 'http://localhost:8080');
        const viewButton = page.locator('[data-testid="view-event-button"]').first();
        await viewButton.click();
        const initialPresentationButton = await page.locator('[data-testid="presentation-link"]').first();
        initialPresentationButton.click();

        await page.waitForLoadState('networkidle');
    });

    test('should display event info card with correct data', async ({ page }) => {
        const infoCard = page.locator('[data-testid="event-info-card"]');
        await expect(infoCard).toBeVisible();

        await expect(infoCard.locator('[data-testid="event-name"]')).not.toBeEmpty();
        await expect(infoCard.locator('[data-testid="event-date"]')).not.toBeEmpty();
        await expect(infoCard.locator('[data-testid="event-place"]')).not.toBeEmpty();
        await expect(infoCard.locator('[data-testid="event-city"]')).not.toBeEmpty();
    });

    test('should display price card correctly', async ({ page }) => {
        const priceCard = page.locator('[data-testid="price-card"]');
        await expect(priceCard).toBeVisible();

        await expect(priceCard.locator('[data-testid=presentation-price]')).toBeVisible();
        const priceText = await priceCard.locator('data-testid=presentation-price').textContent();
        expect(priceText).toMatch(/\$\d+\.\d{2}/); // Matches price format like $99.99
    });

});