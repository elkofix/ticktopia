import { test, expect } from '@playwright/test';

test.describe('Presentation Detail Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.WEB_SERVER_URL || 'http://localhost:8080');
        const viewButton = page.locator('[data-testid="view-event-button"]').first();
        await viewButton.click();
        const initialPresentationButton = await page.locator('[data-testid="presentation-link"]').first();
        initialPresentationButton.click();

        await page.waitForLoadState('networkidle');
    });
    test('should load hero section correctly', async ({ page }) => {
        const heroSection = page.locator('[data-testid="hero-container"]');
        await expect(heroSection).toBeVisible();

        await expect(heroSection.locator('[data-testid="hero-image"]')).toBeVisible();
        await expect(heroSection.locator('h1')).not.toBeEmpty();
    });

    test('should display buy buttons correctly', async ({ page }) => {
        const buyButtons = page.locator('button:has-text("COMPRAR BOLETOS")');
        const count = await buyButtons.count();
        expect(count).toBeGreaterThanOrEqual(1);

        await expect(buyButtons.first()).toBeVisible();
        await expect(buyButtons.first()).toBeEnabled();
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

    test('should display description section', async ({ page }) => {
        const descriptionSection = page.locator('[data-testid="description-section"]');
        await expect(descriptionSection).toBeVisible();

        await expect(descriptionSection.locator('h2:text-is("Descripción")')).toBeVisible();
        await expect(descriptionSection.locator('[data-testid="description-content"]')).not.toBeEmpty();
    });

    test('should display payment methods section', async ({ page }) => {
        const paymentSection = page.locator('[data-testid="payment-methods-container"]');
        await expect(paymentSection).toBeVisible();

        await expect(paymentSection.locator('h2:text-is("Métodos de Pago")')).toBeVisible();
        await expect(paymentSection.locator('[data-testid="credit-card-icon"]')).toBeVisible();
        await expect(paymentSection.locator('[data-testid="security-notice"]')).toBeVisible();

        const creditCards = paymentSection.locator('[data-testid="credit-card"]');
        const count = await creditCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should display location map', async ({ page }) => {
        const mapContainer = page.locator('[data-testid="location-map-container"]');
        await expect(mapContainer).toBeVisible();

        await expect(mapContainer.locator('h2:text-is("Ubicación")')).toBeVisible();
        await expect(mapContainer.locator('[data-testid="map-iframe"]')).toBeVisible();
    });

    test('should navigate to buy page when clicking buy button', async ({ page }) => {
        // Mock the navigation to avoid actual page load
        await page.route('/buy/**', route => route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: '<html><body>Buy Page Mock</body></html>'
        }));

        const buyButton = page.locator('button:has-text("COMPRAR BOLETOS")').first();
        await buyButton.click();

        await expect(page).toHaveURL(/\/auth\//);
    });
});