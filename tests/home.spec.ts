import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.WEB_SERVER_URL || 'http://localhost:8080');
});

test.describe('Home page', () => {
  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Ticktopia/);
  });

  test('should display hero section with event banner', async ({ page }) => {
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    const firstBanner = page.locator('[data-testid="event-banner"]').first();
    await expect(firstBanner).toBeVisible();
    const overlay = page.locator('[data-testid="banner-overlay"]');
    await expect(overlay).toBeVisible();
  });

  test('should display event information in hero section', async ({ page }) => {
    const eventTitle = page.locator('[data-testid="event-title"]').first();
    await expect(eventTitle).toBeVisible();
    await expect(eventTitle).not.toBeEmpty();

    const eventOrganizer = page.locator('[data-testid="event-organizer"]').first();
    await expect(eventOrganizer).toBeVisible();
    await expect(eventOrganizer).not.toBeEmpty();

    const viewButton = page.locator('[data-testid="view-event-button"]').first();
    await expect(viewButton).toBeVisible();
    await expect(viewButton).toHaveText('Ver Evento');
  });

  test('should navigate to event details when clicking view button', async ({ page }) => {
    const viewButton = page.locator('[data-testid="view-event-button"]').first();
    await viewButton.click();

    await expect(page).toHaveURL(/\/event\/.+/);
  });

  test('should display events list section', async ({ page }) => {
    const eventsListHeader = page.getByRole('heading', { name: 'Eventos Disponibles' });
    await expect(eventsListHeader).toBeVisible();

    const eventsDescription = page.getByText('Descubre los mejores eventos cerca de ti');
    await expect(eventsDescription).toBeVisible();
  });

  test('should display event cards in the list with correct content', async ({ page }) => {
    // Verificar que hay al menos una tarjeta de evento
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards).not.toHaveCount(0);

    // Tomar la primera tarjeta para hacer assertions más específicas
    const firstCard = eventCards.first();

    // Verificar elementos del banner
    await expect(firstCard.locator('[data-testid="event-banner"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="event-image"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="event-status"]')).toBeVisible();

    // Verificar contenido principal
    await expect(firstCard.locator('[data-testid="event-title"]')).not.toBeEmpty();
    await expect(firstCard.locator('[data-testid="organizer-info"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="organizer-name"]')).not.toBeEmpty();

    // Verificar botón de acción
    const actionButton = firstCard.locator('[data-testid="event-action-button"]');
    await expect(actionButton).toBeVisible();
    await expect(actionButton).toHaveText(/Ver Evento|Gestionar evento/);

    // Verificar que el badge de estado muestra "Público" o "Privado"
    const statusBadge = firstCard.locator('[data-testid="event-status-badge"]');
    await expect(statusBadge).toHaveText(/Público|Privado/);
  });

  test('should navigate to event details when clicking on an event card', async ({ page }) => {
    // Obtener la primera tarjeta de evento
    const firstEventCard = page.locator('[data-testid="event-card"]').first();

    // Obtener el título del evento desde la tarjeta (usando el testid correcto)
    const eventTitle = await firstEventCard.locator('[data-testid="event-title"]').textContent();

    const actionButton = firstEventCard.locator('[data-testid="event-action-button"]');
    await expect(actionButton).toBeVisible();
    await expect(actionButton).toHaveText(/Ver Evento|Gestionar evento/);
    // Hacer click en la tarjeta (esto debería redirigir a los detalles)
    await actionButton.click();

    // Verificar que la URL cambió al patrón de detalles de evento
    await expect(page).toHaveURL(/\/event\/.+/); // o /\/event\/\d+/ para coincidir con ID numérico

    // Verificar que el título en la página de detalles coincide
    const detailTitle = page.locator('[data-testid="event-title"]');
    await expect(detailTitle).toHaveText(eventTitle!.trim()); // Usamos ! para asegurar que no es null
  });

  test('should navigate to event details when clicking on banner', async ({ page }) => {
    // Obtener la primera tarjeta de evento
    const initialEventTitle = await page.locator('[data-testid="event-title"]').first().textContent();

    const eventButton = page.locator('[data-testid="view-event-button"]').first();

    // Obtener el título del evento desde la tarjeta (usando el testid correcto)

    await expect(eventButton).toBeVisible();
    await expect(eventButton).toHaveText(/Ver Evento|Gestionar evento/);
    eventButton.click();

    // Verificar que la URL cambió al patrón de detalles de evento
    await expect(page).toHaveURL(/\/event\/.+/); // o /\/event\/\d+/ para coincidir con ID numérico

    // Verificar que el título en la página de detalles coincide
    const detailTitle = page.locator('[data-testid="event-title"]');
    await expect(detailTitle).toHaveText(initialEventTitle!.trim()); // Usamos ! para asegurar que no es null
  });

  test('should display pagination controls when there are multiple pages', async ({ page }) => {
    const pagination = page.locator('[data-testid="pagination-controls"]');
    const isPaginationVisible = await pagination.isVisible();

    if (isPaginationVisible) {
      await expect(pagination).toBeVisible();
      await expect(pagination.getByRole('button', { name: /Anterior|Siguiente/ })).toHaveCount(2);
    } else {
      // Si no hay paginación visible, verificar que hay pocos eventos
      const eventCards = page.locator('[data-testid="event-card"]');
      const count = await eventCards.count();
      expect(count).toBeLessThanOrEqual(10);
    }
  });

  test('should change hero banner automatically every 5 seconds', async ({ page }) => {
    test.slow(); // Marcar este test como lento ya que requiere esperas

    const initialEventTitle = await page.locator('[data-testid="event-title"]').first().textContent();

    // Esperar un poco más de 5 segundos para permitir el cambio
    await page.waitForTimeout(5500);

    const newEventTitle = await page.locator('[data-testid="event-title"]').first().textContent();

    // Verificar que el título ha cambiado (asumiendo que hay al menos 2 eventos)
    expect(newEventTitle).not.toBe(initialEventTitle);
  });
});