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
        await page.waitForLoadState('networkidle');
        await page.waitForURL(/\/buy/);
        const ticketSelector = page.locator('[data-testid="ticket-selector"]');
        const increaseBtn = ticketSelector.locator('button:has-text("+")');
        const confirmBtn = ticketSelector.locator('button:has-text("Confirmar Compra")');
        await increaseBtn.click();
        await confirmBtn.click();
        await page.waitForURL(/\/pay/);
        await page.locator('#email').waitFor({ state: 'visible' });
        await page.fill('#email', 'alejitocordoba@hotmail.es');
        await page.fill('#cardNumber', '4242424242424242');
        await page.fill('#cardExpiry', '11/30');
        await page.fill('#cardCvc', '123');
        await page.fill('#billingName', 'ALEJANDRO CORDOBA ERAZO');
        await page.click('[data-testid="hosted-payment-submit-button"]');
        await page.waitForURL(/\/success/, { timeout: 60_000 });

    })
    test('should display the main confirmation container', async ({ page }) => {
        await expect(page.getByTestId('payment-confirmation-container')).toBeVisible();
    });

    test('should display the check icon', async ({ page }) => {
        await expect(page.getByTestId('check-icon')).toBeVisible();
        await expect(page.getByTestId('check-icon')).toHaveClass(/text-green-600/);
    });

    test('should display the congratulations title', async ({ page }) => {
        await expect(page.getByRole('heading', { name: '¡Felicidades!' })).toBeVisible();
    });

    test('should display the payment confirmation message', async ({ page }) => {
        const confirmationMessage = page.locator('text=Tu pago ha sido confirmado');
        await expect(confirmationMessage).toBeVisible();
        await expect(confirmationMessage).toHaveClass(/text-green-600/);
        await expect(confirmationMessage).toHaveClass(/font-semibold/);
    });

    test('should display the processing information', async ({ page }) => {
        const processingInfo = page.getByTestId('processing-info-box');
        await expect(processingInfo).toBeVisible();
        await expect(processingInfo).toHaveText(
            'Cuando sea aceptado por tu entidad podrás ver tu(s) ticket(s) en tu perfil'
        );
    });

    test('should display the payment processing status box', async ({ page }) => {
        const statusBox = page.locator('text=Procesando pago').first();
        await expect(statusBox).toBeVisible();
        await expect(statusBox).toHaveClass(/text-blue-800/);

        const statusDescription = page.locator('text=El proceso de confirmación puede tomar entre 5-10 minutos');
        await expect(statusDescription).toBeVisible();
        await expect(statusDescription).toHaveClass(/text-blue-700/);
    });

    test('should have a working "My Tickets" button', async ({ page }) => {
        const myTicketsButton = page.getByRole('link', { name: 'Ir a Mis Tickets' });
        await expect(myTicketsButton).toBeVisible();
        await expect(myTicketsButton).toHaveAttribute('href', '/client/my-tickets');

        // Test the button style
        await expect(myTicketsButton).toHaveClass(/bg-gradient-to-r/);
        await expect(myTicketsButton).toHaveClass(/from-blue-600/);
        await expect(myTicketsButton).toHaveClass(/to-purple-600/);
    });

});


