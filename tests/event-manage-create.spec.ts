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

async function goToEventsPage(page: Page) {
    const menuButton = page.locator('[data-testid="menu-button"]');
    await menuButton.click();
    const myTicketsButton = page.locator('button:text("Eventos")');
    await myTicketsButton.click();
    await page.waitForURL(/\/event-manager/);
    await page.click('[data-testid="create-event-button"]');
    await page.waitForURL(/\/create/);
}

test.describe('Event Creation Page', () => {
    test.setTimeout(180_000); // 2 minutes timeout for each test

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await loginAs('colonia@gmail.com', page);
        await goToEventsPage(page);
    });

    test('should display the create event form', async ({ page }) => {
        await expect(page.locator('text=Crear Evento')).toBeVisible();
        await expect(page.getByPlaceholder('Nombre del evento')).toBeVisible();
        await expect(page.locator('text=Organizador')).toBeVisible();
    });

    test('should show image upload placeholder', async ({ page }) => {
        const uploadPlaceholder = page.locator('text=Haz clic para subir imagen');
        await expect(uploadPlaceholder).toBeVisible();
    });

    test('should allow selecting an image', async ({ page }) => {
        // Mock the image upload response
        await page.route('**/uploadImageToCloudinary', route => route.fulfill({
            status: 200,
            body: JSON.stringify('https://res.cloudinary.com/demo/image/upload/sample.jpg')
        }));

        // Create a dummy file
        const filePath = 'tests/fixtures/test-image.jpg';

        // Trigger file input
        await page.locator('div[class*="bg-gray-100"]').click();
        await page.locator('[data-testid="file-input"]').setInputFiles(filePath);

        // Verify preview appears
        await expect(page.locator('img[alt="Preview del evento"]')).toBeVisible();
    });

    test('should show loading state during image upload', async ({ page }) => {
        // Add delay to simulate upload
        await page.route('**/uploadImageToCloudinary', async route => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await route.fulfill({
                status: 200,
                body: JSON.stringify('https://res.cloudinary.com/demo/image/upload/sample.jpg')
            });
        });

        // Trigger file input
        const filePath = 'tests/fixtures/test-image.jpg';
        await page.locator('[data-testid="file-input"]').setInputFiles(filePath);

        // Verify loading state
        await expect(page.locator('text=Subiendo imagen...')).toBeVisible();
    });

    test('should toggle event visibility', async ({ page }) => {
        let toggleButton = page.locator('button:has-text("Público")');

        // Initial state
        await expect(toggleButton).toHaveText('Público');

        // Toggle to private
        await toggleButton.click();
        toggleButton = page.locator('button:has-text("Privado")');
        await expect(toggleButton).toHaveText('Privado');
    });

    test('should create event with valid data', async ({ page }) => {
        // Mock all required API calls
        await page.route('**/uploadImageToCloudinary', route => route.fulfill({
            status: 200,
            body: JSON.stringify('https://res.cloudinary.com/demo/image/upload/sample.jpg')
        }));

        await page.route('**/createEvent', route => route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true })
        }));

        // Fill out the form
        const filePath = 'tests/fixtures/test-image.jpg';
        await page.locator('[data-testid="file-input"]').setInputFiles(filePath);

        await page.fill('input[placeholder="Nombre del evento"]', 'Test Event');

        // Submit the form
        await page.locator('text=Crear Evento').click();

        // Verify loading state
        await expect(page.locator('text=Creando evento...')).toBeVisible();

        // Verify navigation after creation
        await page.waitForURL(/\/event-manager\/events/);
    });


    test('should disable submit button during creation', async ({ page }) => {
        // Mock API with delay
        await page.route('**/uploadImageToCloudinary', route => route.fulfill({
            status: 200,
            body: JSON.stringify('https://res.cloudinary.com/demo/image/upload/sample.jpg')
        }));

        await page.route('**/createEvent', async route => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await route.fulfill({ status: 200 });
        });

        // Fill out the form
        const filePath = 'tests/fixtures/test-image.jpg';
        await page.locator('[data-testid="file-input"]').setInputFiles(filePath);
        await page.fill('input[placeholder="Nombre del evento"]', 'Test Event');

        // Submit the form
        const submitButton = page.locator('text=Crear Evento');
        await submitButton.click();
        const creatingButton = page.locator('text=Creando evento...');

        // Verify button is disabled during submission
        await expect(creatingButton).toBeDisabled();
        await expect(creatingButton).toHaveText('Creando evento...');
    });
});