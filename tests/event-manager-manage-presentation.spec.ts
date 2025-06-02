import { test, expect, Page } from '@playwright/test';

export async function loginAs(email: string, page: Page) {
    const webServerUrl = process.env.WEB_SERVER_URL || 'http://localhost:8080';
    await page.goto(webServerUrl + "/auth/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Hola1597!!!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\//);
}

async function goToPresentationPage(page: Page, isEditMode = false) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Eventos")');
    await myTicketsButton.click();
    await page.waitForURL(/\/event-manager/);

    // Mock API responses before navigation
    await mockPresentationAPIs(page, isEditMode);

    await page.click('[data-testid="event-action-button"]');
    await page.waitForURL(/\/manage/);

    if (!isEditMode) {
        await page.click('text=Crear Presentación');
        await page.waitForURL(/\/presentation\/manage/);
    }
}

async function goToPresentationEditPage(page: Page, isEditMode = false) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Eventos")');
    await myTicketsButton.click();
    await page.waitForURL(/\/event-manager/);
    // Mock API responses before navigation
    await mockPresentationAPIs(page, isEditMode);
    await page.click('[data-testid="event-action-button"]');
    await page.waitForURL(/\/manage/);
    await page.click('[data-testid="edit-presentation-button"]');
    await page.waitForURL(/\/manage/);
}

async function mockPresentationAPIs(page: Page, isEditMode = false) {

    // Mock cities API
    await page.route('https://api-colombia.com/api/v1/City', route => route.fulfill({
        status: 200,
        body: JSON.stringify([
            { id: 1, name: 'Bogotá', description: 'Capital de Colombia' },
            { id: 2, name: 'Medellín', description: 'Ciudad de la eterna primavera' }
        ])
    }));

    if (isEditMode) {
        // Mock presentation data for edit mode
        await page.route('**/getPresentationForManagerById*', route => route.fulfill({
            status: 200,
            body: JSON.stringify({
                idPresentation: '1',
                place: 'Test Venue',
                capacity: 100,
                openDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                startDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
                ticketAvailabilityDate: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
                ticketSaleAvailabilityDate: new Date().toISOString(),
                price: 50000,
                latitude: 4.7110,
                longitude: -74.0721,
                description: 'Test description',
                city: 'Bogotá',
                event: { id: '1' }
            })
        }));
    }
}

test.describe('Presentation Management Page', () => {
    test.setTimeout(180000); // 3 minutes timeout for each test

    test.describe('Create Mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.context().clearCookies();
            await loginAs('samubar@gmail.com', page);
            await goToPresentationPage(page);
        });

        test('should display the create presentation form', async ({ page }) => {
            await expect(page.locator('h1:text("Crear Nueva Presentación")')).toBeVisible();
            });

        test('should show basic information section', async ({ page }) => {
            await expect(page.locator('h2:text("Información Básica")')).toBeVisible();
            await expect(page.getByPlaceholder('Ej: Teatro Nacional, Auditorio Central...')).toBeVisible();
        });

        test('should adjust capacity with buttons', async ({ page }) => {
            const capacityInput = page.locator('input[type="number"]').first();

            // Initial value
            await expect(capacityInput).toHaveValue('100');

            // Increase
            await page.click('button:has-text("+") >> nth=0');
            await expect(capacityInput).toHaveValue('110');

            // Decrease
            await page.click('button:has-text("-") >> nth=0');
            await expect(capacityInput).toHaveValue('100');
        });

        test('should adjust price with buttons', async ({ page }) => {
            const priceInput = page.locator('input[type="number"]').nth(1);

            // Initial value
            await expect(priceInput).toHaveValue('0');

            // Increase
            await page.click('button:has-text("+") >> nth=1');
            await expect(priceInput).toHaveValue('1000');

            // Decrease
            await page.click('button:has-text("-") >> nth=1');
            await expect(priceInput).toHaveValue('0');
        });

        test('should show important dates section', async ({ page }) => {
            await expect(page.locator('h2:text("Fechas Importantes")')).toBeVisible();

            // Verify all date pickers are present
            await expect(page.locator('text=Fecha de apertura *')).toBeVisible();
            await expect(page.locator('text=Fecha de inicio *')).toBeVisible();
            await expect(page.locator('text=Disponibilidad de boletos *')).toBeVisible();
            await expect(page.locator('text=Venta de boletos disponible *')).toBeVisible();
        });

        test('should show location section', async ({ page }) => {
            await expect(page.locator('h2:text("Ubicación")')).toBeVisible();
            await expect(page.locator('text=Cómo usar:')).toBeVisible();
        });

        test('should show description section', async ({ page }) => {
            await expect(page.locator('h2:text("Descripción")')).toBeVisible();
            await expect(page.locator('textarea')).toBeVisible();
        });

        test('should validate required fields', async ({ page }) => {
      
            // Verify error messages
            await expect(page.locator('text=El lugar no puede estar vacío')).toBeVisible();
        });

        test('should validate date order', async ({ page }) => {
            // Fill in some required fields
            await page.fill('input[placeholder="Ej: Teatro Nacional, Auditorio Central..."]', 'Test Venue');
            await page.fill('textarea', 'Test description');

            // Set invalid dates (reverse order)
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 86400000);

            await page.fill('input[type="datetime-local"] >> nth=0', tomorrow.toISOString().split('.')[0]);
            await page.fill('input[type="datetime-local"] >> nth=1', now.toISOString().split('.')[0]);

            // Verify date validation error
            await expect(page.locator('text=La fecha de apertura debe ser anterior')).toBeVisible();
        });

        test('should successfully create presentation', async ({ page }) => {
    

            // Fill form
            await fillPresentationForm(page);

            // Submit
            await page.click('text=Crear Presentación');

            // Verify navigation
            await page.waitForURL(/\/event-manager\/events\/manage/);
        });
    });

    test.describe('Edit Mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.context().clearCookies();
            await loginAs('deletepresentation@gmail.com', page);
            await goToPresentationEditPage(page, true);
        });

        test('should load existing presentation data', async ({ page }) => {
            await expect(page.locator('input[type="number"] >> nth=0')).toHaveValue('500');
            await expect(page.locator('input[type="number"] >> nth=1')).toHaveValue('50000');
            await expect(page.locator('textarea')).toHaveValue('A musical event in the main stadium.');
        });

        test('should update presentation successfully', async ({ page }) => {
            // Mock update API
            await page.route('**/updatePresentation*', route => route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true })
            }));

            // Make changes
            await page.fill('input[placeholder="Ej: Teatro Nacional, Auditorio Central..."]', 'Updated Venue');
            await page.fill('textarea', 'Updated description');

            // Submit
            await page.click('text=Actualizar Presentación');

            // Verify navigation
            await page.waitForURL(/\/event-manager\/events\/manage/);
        });

        test('should detect no changes', async ({ page }) => {
            // Mock API to verify no call is made
            let apiCalled = false;
            await page.route('**/updatePresentation*', route => {
                apiCalled = true;
                return route.fulfill({ status: 200 });
            });

            // Submit without changes
            await page.click('text=Actualizar Presentación');

            // Verify no API call was made
            expect(apiCalled).toBeFalsy();

            // Should still navigate back
            await page.waitForURL(/\/event-manager\/events\/manage/);
        });
    });
});

async function fillPresentationForm(page: Page) {
    // Fill basic info
    await page.fill('input[placeholder="Ej: Teatro Nacional, Auditorio Central..."]', 'Test Venue');
    const cityInput = await page.getByPlaceholder('Buscar ciudad...');
    await cityInput.click();
    await cityInput.fill('Bog');
    await page.click('[data-testid="city-item"] >> text=Bogotá'); 

    // Set capacity and price
    await page.click('button:has-text("+") >> nth=0');
    await page.click('button:has-text("+") >> nth=1');

    // Set dates (future dates)
    const now = new Date();
    const ticketSaleDate = new Date(now.getTime() + 3600000); // 1 hour from now
    const ticketAvailDate = new Date(now.getTime() + 7200000); // 2 hours from now
    const openDate = new Date(now.getTime() + 86400000); // 1 day from now
    const startDate = new Date(now.getTime() + 86400000 + 3600000); // 1 day + 1 hour from now

    await page.fill('input[type="datetime-local"] >> nth=0', openDate.toISOString().split('.')[0]);
    await page.fill('input[type="datetime-local"] >> nth=1', startDate.toISOString().split('.')[0]);
    await page.fill('input[type="datetime-local"] >> nth=2', ticketAvailDate.toISOString().split('.')[0]);
    await page.fill('input[type="datetime-local"] >> nth=3', ticketSaleDate.toISOString().split('.')[0]);

    // Set description
    await page.fill('textarea', 'Test description');

    // Set location (mock this if needed)
    // Note: Actual map interaction would require more complex testing
}