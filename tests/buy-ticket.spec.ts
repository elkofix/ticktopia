import { test, expect } from '@playwright/test';

test.describe('Buy ticket page components', () => {

    test.setTimeout(120_000); // Establece 2 minutos para cada test

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        const webServerUrl = process.env.WEB_SERVER_URL || 'http://localhost:8080';
        await page.goto(webServerUrl + "/auth/login");
        await page.fill('input[name="email"]', 'isahc221024@gmail.com');
        await page.fill('input[name="password"]', 'Hola1597!!!');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\//);
        const viewButton = await page.locator('[data-testid="view-event-button"]').first();
        await viewButton.click();
        await page.waitForURL(/\/event/);
        await page.waitForLoadState('networkidle');
        const initialPresentationButton = await page.locator('[data-testid="presentation-link"]').first();
        initialPresentationButton.click();
        await page.waitForURL(/\/presentation/);
        await page.waitForLoadState('networkidle');
        const buyButton = page.locator('[data-testid="buy-button"]').first();
        buyButton.click();
        await page.waitForURL(/\/buy/);
    })

    test('should load ticket selector correctly', async ({ page }) => {
        const ticketSelector = page.locator('[data-testid="ticket-selector"]');
        await expect(ticketSelector).toBeVisible();

        // Verify basic elements
        await expect(ticketSelector.locator('h2:text("Seleccionar Boletos")')).toBeVisible();
        await expect(ticketSelector.locator('text=boletos disponibles')).toBeVisible();
        await expect(ticketSelector.locator('text=por boleto')).toBeVisible();
    });

    test('should handle ticket quantity changes', async ({ page }) => {
        const ticketSelector = page.locator('[data-testid="ticket-selector"]');
        const decreaseBtn = ticketSelector.locator('button:has-text("-")');
        const increaseBtn = ticketSelector.locator('button:has-text("+")');
        const quantityDisplay = ticketSelector.locator('[class*="min-w-8"]');

        // Initial state
        await expect(quantityDisplay).toHaveText('0');

        // Test increase
        await increaseBtn.click();
        await expect(quantityDisplay).toHaveText('1');

        // Test decrease
        await decreaseBtn.click();
        await expect(quantityDisplay).toHaveText('0');

        // Test decrease doesn't go below 0
        await expect(decreaseBtn).toBeDisabled();
    });

    test('should show total price when tickets selected', async ({ page }) => {
        const ticketSelector = page.locator('[data-testid="ticket-selector"]');
        const increaseBtn = ticketSelector.locator('button:has-text("+")');

        // Initially should not show total
        await expect(ticketSelector.locator('text=Total:')).not.toBeVisible();

        // Select one ticket
        await increaseBtn.click();

        // Should now show total
        await expect(ticketSelector.locator('text=Total:')).toBeVisible();
        await expect(ticketSelector.locator('[class*="text-blue-600"]')).toBeVisible();
    });

    test('should show confirm button only when tickets selected', async ({ page }) => {
        const ticketSelector = page.locator('[data-testid="ticket-selector"]');
        const increaseBtn = ticketSelector.locator('button:has-text("+")');
        const decreaseBtn = ticketSelector.locator('button:has-text("-")');
        const confirmBtn = ticketSelector.locator('button:has-text("Confirmar Compra")');

        // Initially should not show confirm button
        await expect(confirmBtn).not.toBeVisible();

        // Select one ticket
        await increaseBtn.click();
        await expect(confirmBtn).toBeVisible();

        // Deselect ticket
        await decreaseBtn.click();
        await expect(confirmBtn).not.toBeVisible();
    });

    test('should load description section correctly', async ({ page }) => {
        const descriptionSection = page.locator('[data-testid="description-section"]');
        await expect(descriptionSection).toBeVisible();

        await expect(descriptionSection.locator('h2:text("Descripción")')).toBeVisible();
        await expect(descriptionSection.locator('[data-testid="description-content"]')).toBeVisible();
    });

    test('should load payment methods section correctly', async ({ page }) => {
        const paymentMethods = page.locator('[data-testid="payment-methods-container"]');
        await expect(paymentMethods).toBeVisible();

        // Check main elements
        await expect(paymentMethods.locator('[data-testid="credit-card-icon"]')).toBeVisible();
        await expect(paymentMethods.locator('h2:text("Métodos de Pago")')).toBeVisible();

        // Check security notice
        const securityNotice = paymentMethods.locator('[data-testid="security-notice"]');
        await expect(securityNotice).toBeVisible();
        await expect(securityNotice.locator('[data-testid="shield-icon"]')).toBeVisible();

        // Check credit cards
        const creditCards = paymentMethods.locator('[data-testid="credit-card"]');
        await expect(creditCards).toHaveCount(2);
        await expect(creditCards.first().locator('[data-testid="check-circle-icon"]')).toBeVisible();
    });

    test('should load event sidebar correctly', async ({ page }) => {
        const eventSidebar = page.locator('[data-testid="event-sidebar"]');
        await expect(eventSidebar).toBeVisible();

        const eventCard = eventSidebar.locator('[data-testid="event-card"]');
        await expect(eventCard).toBeVisible();

        // Check image
        await expect(eventCard.locator('[data-testid="image-container"]')).toBeVisible();

        // Check content
        const contentSection = eventCard.locator('[data-testid="content-section"]');
        await expect(contentSection).toBeVisible();
        await expect(contentSection.locator('h3')).toBeVisible();

        // Check details
        await expect(contentSection.locator('text=Lugar').first()).toBeVisible();
        await expect(contentSection.locator('text=Ciudad').first()).toBeVisible();
        await expect(contentSection.locator('text=Fecha y Hora').first()).toBeVisible();
    });
});