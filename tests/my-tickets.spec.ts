import { test, expect, Page } from '@playwright/test';

async function goToMyTicketsPage(page: Page) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Mis Tickets")');
    await myTicketsButton.click();
    await page.waitForURL(/\/client/);
}

async function loginAs(email: string, password: string, page: Page) {
    const webServerUrl = process.env.WEB_SERVER_URL || 'http://localhost:8080';
    await page.goto(webServerUrl + "/auth/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\//);
}

test.describe('My Tickets Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });

    test.describe('When QR is unavailable', () => {
        test.beforeEach(async ({ page }) => {
            await loginAs('donney@gmail.com', 'password123', page);
            await goToMyTicketsPage(page);
        });

        test('should display the ticket list with unavailable QR message', async ({ page }) => {
            const ticketItems = page.locator('[data-testid="ticket-item"]');
            await expect(ticketItems).not.toHaveCount(0);
            
            const firstTicket = ticketItems.first();
            
            // Verify the availability message is shown
            const availabilityMessage = firstTicket.locator('[data-testid="availability-message"]');
            await expect(availabilityMessage).toBeVisible();
            
            // Verify the QR button is not present
            const qrButton = firstTicket.locator('[data-testid="qr-button"]');
            await expect(qrButton).not.toBeVisible();
            
            // Verify the days until available message
            const messageText = await availabilityMessage.locator('p').textContent();
            expect(messageText).toContain('Los tickets solo serán accesibles');
        });

        test('should display correct ticket information', async ({ page }) => {
            const firstTicket = page.locator('[data-testid="ticket-item"]').first();
            
            // Verify basic ticket info is displayed
            await expect(firstTicket.locator('[data-testid="ticket-folio"]')).toBeVisible();
            await expect(firstTicket.locator('[data-testid="event-name"]')).toBeVisible();
            await expect(firstTicket.locator('[data-testid="purchase-date"]')).toBeVisible();
            await expect(firstTicket.locator('[data-testid="ticket-quantity"]')).toBeVisible();
            await expect(firstTicket.locator('[data-testid="event-image"]')).toBeVisible();
            
            // Verify status badge
            await expect(firstTicket.locator('[data-testid="active-badge"], [data-testid="inactive-badge"], [data-testid="redeemed-badge"]')).toBeVisible();
        });
    });

    test.describe('When QR is available', () => {
        test.beforeEach(async ({ page }) => {
            await loginAs('guarro@gmail.com', 'password123', page);
            await goToMyTicketsPage(page);
        });

        test('should display the QR button for available tickets', async ({ page }) => {
            const ticketItems = page.locator('[data-testid="ticket-item"]');
            await expect(ticketItems).not.toHaveCount(0);
            
            const firstTicket = ticketItems.first();
            
            // Verify the QR button is visible
            const qrButton = firstTicket.locator('[data-testid="qr-button"]');
            await expect(qrButton).toBeVisible();
            
            // Verify the availability message is not present
            const availabilityMessage = firstTicket.locator('[data-testid="availability-message"]');
            await expect(availabilityMessage).not.toBeVisible();
        });

        test('should open QR modal when clicking the QR button', async ({ page }) => {
            const firstTicket = page.locator('[data-testid="ticket-item"]').first();
            const qrButton = firstTicket.locator('[data-testid="qr-button"]');
            
            // Get the ticket folio for verification
            const folio = await firstTicket.locator('[data-testid="ticket-folio"]').textContent();
            
            // Click the QR button
            await qrButton.click();
            
            // Verify the modal opens
            const qrModal = page.locator('[data-testid="qr-modal"]');
            await expect(qrModal).toBeVisible();
            
            // Verify the modal content
            await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Tu código QR');
            await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
            
            // Verify the folio in the modal matches the ticket
            const modalFolio = await page.locator('[data-testid="modal-folio"]').textContent();
            expect(modalFolio).toContain(folio);
            
            // Verify the instructions are shown
            await expect(page.locator('[data-testid="modal-instructions"]')).toBeVisible();
        });

        test('should close QR modal when clicking outside', async ({ page }) => {
            const firstTicket = page.locator('[data-testid="ticket-item"]').first();
            const qrButton = firstTicket.locator('[data-testid="qr-button"]');
            
            // Open the modal
            await qrButton.click();
            await expect(page.locator('[data-testid="qr-modal"]')).toBeVisible();
            
            // Click outside to close
            await page.locator('[data-testid="modal-backdrop"]').click({ position: { x: 10, y: 10 } });
            
            // Verify the modal is closed
            await expect(page.locator('[data-testid="qr-modal"]')).not.toBeVisible();
        });
    });

    test.describe('Common functionality', () => {
        test('should display empty state when no tickets are available', async ({ page }) => {
            // Mock the API response to return empty array
            await page.route('**/tickets/my-tickets', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([]),
                });
            });
            
            await loginAs('emptyuser@gmail.com', 'password123', page);
            await goToMyTicketsPage(page);
            
            // Verify empty state is shown
            await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
            await expect(page.locator('text="No tienes tickets disponibles"')).toBeVisible();
        });

        test('should display loading spinner while fetching tickets', async ({ page }) => {
            // Delay the API response to test loading state
            await page.route('**/tickets/my-tickets', route => {
                // Add delay to show loading state
                setTimeout(() => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify([]),
                    });
                }, 2000);
            });
            
            await loginAs('loadinguser@gmail.com', 'password123', page);
            await goToMyTicketsPage(page);
            
            // Verify loading spinner is shown
            await expect(page.locator('text="Loading..."')).toBeVisible();
            
            // Then verify it disappears
            await expect(page.locator('text="Loading..."')).not.toBeVisible();
        });

        test('should display error message when ticket fetch fails', async ({ page }) => {
            // Mock a failed API response
            await page.route('**/tickets/my-tickets', route => {
                route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: "Error fetching tickets" }),
                });
            });
            
            await loginAs('erroruser@gmail.com', 'password123', page);
            await goToMyTicketsPage(page);
            
            // Verify error message is shown
            await expect(page.locator('text="Error al cargar tus tickets"')).toBeVisible();
        });
    });
});