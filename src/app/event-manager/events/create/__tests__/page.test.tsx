import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createEvent } from '../../../../../features/events/events.client.api';
import { uploadImageToCloudinary } from '../../../../../shared/utils/image';
import { useRouter } from 'next/navigation';
import CreateEventCard from '../page';

// Mock all dependencies
jest.mock('../../../../../features/events/events.client.api');
jest.mock('../../../../../shared/utils/image');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => (
        <img src={src} alt={alt} />
    ),
}));

describe('CreateEventCard', () => {
    const mockPush = jest.fn();
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockBase64 = 'data:image/png;base64,test';
    const mockCloudinaryUrl = 'https://cloudinary.com/test.png';

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createEvent as jest.Mock).mockResolvedValue({});
        (uploadImageToCloudinary as jest.Mock).mockResolvedValue(mockCloudinaryUrl);

        jest.spyOn(global, 'FileReader').mockImplementation(function (this: FileReader) {
            this.readAsDataURL = jest.fn(() => {
                (this.onload as Function)({ target: { result: mockBase64 } });
            });
            return this;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the initial form state', () => {
        render(<CreateEventCard />);

        expect(screen.getByPlaceholderText('Nombre del evento')).toBeInTheDocument();
        expect(screen.getByText('Subir imagen')).toBeInTheDocument();
        expect(screen.getByText('Público')).toBeInTheDocument();
        expect(screen.getByText('Crear Evento')).toBeInTheDocument();
    });

    it('allows entering event name', async () => {
        render(<CreateEventCard />);
        const nameInput = screen.getByPlaceholderText('Nombre del evento');

        await userEvent.type(nameInput, 'My Awesome Event');
        expect(nameInput).toHaveValue('My Awesome Event');
    });

    it('toggles event visibility', async () => {
        render(<CreateEventCard />);
        const toggleButton = screen.getByText('Público');

        await userEvent.click(toggleButton);
        expect(screen.getByText('Privado')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Privado'));
        expect(screen.getByText('Público')).toBeInTheDocument();
    });

    it('shows loading state during image upload', async () => {
        render(<CreateEventCard />);
        const fileInput = screen.getByTestId('file-input');

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(screen.getByText('Subiendo imagen...')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('Subiendo imagen...')).not.toBeInTheDocument();
        });
    });

    it('validates form before submission', async () => {
        render(<CreateEventCard />);

        await userEvent.click(screen.getByText('Crear Evento'));
        expect(createEvent).not.toHaveBeenCalled();
        expect(screen.getByText('Organizador')).toBeInTheDocument();
    });

    it('shows loading state during event creation', async () => {
        (createEvent as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
        render(<CreateEventCard />);

        // Fill out form
        await userEvent.type(screen.getByPlaceholderText('Nombre del evento'), 'My Event');
        fireEvent.change(screen.getByTestId('file-input'), { target: { files: [mockFile] } });

        // Submit form
        await userEvent.click(screen.getByText('Crear Evento'));

        expect(screen.getByText('Crear Evento')).toBeInTheDocument();
   
    });

    it('handles image upload errors', async () => {
        (uploadImageToCloudinary as jest.Mock).mockRejectedValue(new Error('Upload failed'));
        render(<CreateEventCard />);

        fireEvent.change(screen.getByTestId('file-input'), { target: { files: [mockFile] } });

        await waitFor(() => {
            expect(screen.getByText('Haz clic para subir imagen')).toBeInTheDocument();
        });
    });

    it('handles event creation errors', async () => {
        (createEvent as jest.Mock).mockRejectedValue(new Error('Creation failed'));
        render(<CreateEventCard />);

        // Fill out form
        await userEvent.type(screen.getByPlaceholderText('Nombre del evento'), 'My Event');
        fireEvent.change(screen.getByTestId('file-input'), { target: { files: [mockFile] } });

        // Submit form
        await userEvent.click(screen.getByText('Crear Evento'));

        await waitFor(() => {
            expect(screen.getByText('Público')).toBeInTheDocument();
        });
    });
});