import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditEventCard from '../EditEventCard';
import { updateEvent, deleteEvent } from '../../../../features/events/events.client.api';
import { uploadImageToCloudinary } from '../../../../shared/utils/image';
import { useRouter } from 'next/navigation';

jest.mock('../../../../features/events/events.client.api');
jest.mock('../../../../shared/utils/image');
jest.mock('next/navigation');
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockUpdateEvent = updateEvent as jest.MockedFunction<typeof updateEvent>;
const mockDeleteEvent = deleteEvent as jest.MockedFunction<typeof deleteEvent>;
const mockUploadImageToCloudinary = uploadImageToCloudinary as jest.MockedFunction<typeof uploadImageToCloudinary>;
const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

// Mock event data
const mockEvent: any = {
  id: '1',
  name: 'Test Event',
  bannerPhotoUrl: 'https://example.com/image.jpg',
  isPublic: true,
  organizerId: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EditEventCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders the component with event data', () => {
    render(<EditEventCard event={mockEvent} />);
    
    expect(screen.getByTestId('edit-event-card')).toBeInTheDocument();
    expect(screen.getByTestId('event-name-input')).toHaveValue('Test Event');
    expect(screen.getByTestId('event-banner-image')).toHaveAttribute('src', mockEvent.bannerPhotoUrl);
    expect(screen.getByTestId('visibility-toggle')).toHaveTextContent('Público');
  });

  it('toggles event visibility when visibility button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditEventCard event={mockEvent} />);
    
    const visibilityToggle = screen.getByTestId('visibility-toggle');
    expect(visibilityToggle).toHaveTextContent('Público');
    
    await user.click(visibilityToggle);
    expect(visibilityToggle).toHaveTextContent('Privado');
    
    await user.click(visibilityToggle);
    expect(visibilityToggle).toHaveTextContent('Público');
  });

  it('updates event name when input changes', async () => {
    const user = userEvent.setup();
    render(<EditEventCard event={mockEvent} />);
    
    const nameInput = screen.getByTestId('event-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Event Name');
    
    expect(nameInput).toHaveValue('Updated Event Name');
  });

  it('enables update button when changes are made', async () => {
    const user = userEvent.setup();
    render(<EditEventCard event={mockEvent} />);
    
    const updateButton = screen.getByTestId('update-button');
    expect(updateButton).toBeDisabled();
    
    const nameInput = screen.getByTestId('event-name-input');
    await user.type(nameInput, ' Modified');
    
    expect(updateButton).toBeEnabled();
    expect(updateButton).toHaveTextContent('Guardar Cambios');
  });


  it('successfully updates event when form is valid', async () => {
    const user = userEvent.setup();
    mockUpdateEvent.mockResolvedValueOnce({} as any);
    
    render(<EditEventCard event={mockEvent} />);
    
    const nameInput = screen.getByTestId('event-name-input');
    await user.type(nameInput, ' Updated');
    
    const updateButton = screen.getByTestId('update-button');
    await user.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateEvent).toHaveBeenCalledWith('1', {
        name: 'Test Event Updated',
      });
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toHaveTextContent('Evento actualizado correctamente');
    });
  });

  it('handles update error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Error updating event';
    mockUpdateEvent.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    render(<EditEventCard event={mockEvent} />);
    
    const nameInput = screen.getByTestId('event-name-input');
    await user.type(nameInput, ' Updated');
    
    const updateButton = screen.getByTestId('update-button');
    await user.click(updateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

  it('opens delete modal when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditEventCard event={mockEvent} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);
    
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de que quieres eliminar el evento "Test Event"/)).toBeInTheDocument();
  });

  it('closes delete modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditEventCard event={mockEvent} />);
    
    // Open modal
    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);
    
    // Close modal
    const cancelButton = screen.getByTestId('cancel-delete-button');
    await user.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });
  });


  it('handles delete error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Error deleting event';
    mockDeleteEvent.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    render(<EditEventCard event={mockEvent} />);
    
    // Open modal
    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);
    
    // Confirm delete
    const confirmDeleteButton = screen.getByTestId('confirm-delete-button');
    await user.click(confirmDeleteButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });
  });

  it('handles image upload successfully', async () => {
    const user = userEvent.setup();
    const mockCloudinaryUrl = 'https://cloudinary.com/new-image.jpg';
    mockUploadImageToCloudinary.mockResolvedValueOnce(mockCloudinaryUrl);
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/jpeg;base64,mockbase64',
      onload: null as any,
      onerror: null as any,
    };
    
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    render(<EditEventCard event={mockEvent} />);
    
    const file = new File(['mock image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    
    await user.upload(fileInput, file);
    
    // Simulate FileReader onload
    act(() => {
      mockFileReader.onload();
    });
    
    await waitFor(() => {
      expect(mockUploadImageToCloudinary).toHaveBeenCalledWith('data:image/jpeg;base64,mockbase64');
    });
  });

  it('handles image upload error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Upload failed';
    mockUploadImageToCloudinary.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/jpeg;base64,mockbase64',
      onload: null as any,
      onerror: null as any,
    };
    
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    render(<EditEventCard event={mockEvent} />);
    
    const file = new File(['mock image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    
    await user.upload(fileInput, file);
    
    // Simulate FileReader onload
    act(() => {
      mockFileReader.onload();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

  it('shows uploading state during image upload', async () => {
    const user = userEvent.setup();
    
    // Mock a delayed upload
    mockUploadImageToCloudinary.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('https://example.com/uploaded.jpg'), 100))
    );
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/jpeg;base64,mockbase64',
      onload: null as any,
      onerror: null as any,
    };
    
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    render(<EditEventCard event={mockEvent} />);
    
    const file = new File(['mock image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    
    await user.upload(fileInput, file);
    
    // Simulate FileReader onload
    act(() => {
      mockFileReader.onload();
    });
    
    // Check uploading state
    expect(screen.getByTestId('uploading-overlay')).toBeInTheDocument();
    expect(screen.getByText('Subiendo imagen...')).toBeInTheDocument();
    
    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.queryByTestId('uploading-overlay')).toBeInTheDocument();
    }, { timeout: 200 });
  });
});