import { render, screen, waitFor } from '@testing-library/react';
import Page from '../page';
import { getPresentationsByEventId } from '../../../../features/presentations/presentation.api';

jest.mock('../../../../features/presentations/presentation.api');
jest.mock('../../../../features/events/components/EventDetailBanner', () => ({
  EventDetailBanner: ({ event }: { event: any }) => (
    <div data-testid="event-banner">{event.name}</div>
  ),
}));

jest.mock('../../../../features/events/components/EventPresentationList', () => ({
  EventPresentationsList: ({ presentations }: { presentations: any }) => (
    <div data-testid="presentations-list">
      {presentations.map((p: any) => (
        <div key={p.idPresentation}>{p.name}</div>
      ))}
    </div>
  ),
}));

jest.mock('../../../../shared/components/ErrorHandler', () => ({
  __esModule: true,
  default: ({ message }: { message?: string }) => (
    <div data-testid="error-handler">{message || 'Error'}</div>
  ),
}));

describe('Event Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('shows error handler when API fails', async () => {
    const errorMessage = 'Failed to load presentations';
    (getPresentationsByEventId as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const PageComponent = await Page({ params: Promise.resolve({ id: 'event1' }) });
    render(PageComponent);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toHaveTextContent(errorMessage);
    });
  });


  it('handles undefined error responses', async () => {
    (getPresentationsByEventId as jest.Mock).mockRejectedValue(new Error('Network error'));

    const PageComponent = await Page({ params: Promise.resolve({ id: 'event1' }) });
    render(PageComponent);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toBeInTheDocument();
    });
  });
});