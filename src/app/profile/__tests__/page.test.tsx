import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../page';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { updateProfile, closeProfile } from '../../../features/users/users.client.api';

jest.mock('../../../features/auth/hooks/useAuth');
jest.mock('../../../features/users/users.client.api');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock child components
jest.mock('../../../features/auth/login/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../shared/components/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../shared/components/Alert', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../features/users/components/ProfileView', () => ({
  ProfileView: ({ onEdit, onOpenModal }: { onEdit: () => void, onOpenModal: () => void }) => (
    <div>
      <button onClick={onEdit}>Edit Profile</button>
      <button onClick={onOpenModal}>Delete Account</button>
    </div>
  ),
}));

jest.mock('../../../features/users/components/ProfileEditForm', () => ({
  ProfileEditForm: ({ 
    formData, 
    onChange, 
    onSubmit, 
    onCancel 
  }: { 
    formData: any, 
    onChange: () => void, 
    onSubmit: () => void, 
    onCancel: () => void 
  }) => (
    <form onSubmit={onSubmit}>
      <input name="name" value={formData.name} onChange={onChange} />
      <input name="lastname" value={formData.lastname} onChange={onChange} />
      <input name="email" value={formData.email} onChange={onChange} />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  ),
}));

jest.mock('../../../features/users/components/ConfirmationModal', () => ({
  ConfirmationModal: ({ 
    isOpen, 
    onClose, 
    onConfirm 
  }: { 
    isOpen: boolean, 
    onClose: () => void, 
    onConfirm: () => void 
  }) => (
    isOpen ? (
      <div>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null
  ),
}));

const mockUser = {
  id: '123',
  name: 'John',
  lastname: 'Doe',
  email: 'john@example.com',
  isActive: true,
  roles: ['client'],
};

describe('ProfilePage', () => {
  beforeEach(() => {
    // Mock auth hook
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: jest.fn(),
      updateUserProfile: jest.fn(),
    });
  });

  it('renders profile view by default', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    render(<ProfilePage />);
    await userEvent.click(screen.getByText('Edit Profile'));
    
    const nameInput = screen.getByDisplayValue('John');
    fireEvent.change(nameInput, { target: { value: 'Johnny' } });
    expect(nameInput).toHaveValue('Johnny');
  });

  it('submits updated profile data', async () => {
    (updateProfile as jest.Mock).mockResolvedValue({
      ...mockUser,
      name: 'Johnny'
    });

    render(<ProfilePage />);
    await userEvent.click(screen.getByText('Edit Profile'));
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'John' }),
        '123'
      );
    });
  });

  it('shows error when profile update fails', async () => {
    (updateProfile as jest.Mock).mockRejectedValue(new Error('Update failed'));

    render(<ProfilePage />);
    await userEvent.click(screen.getByText('Edit Profile'));
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });

  it('opens confirmation modal when delete is clicked', async () => {
    render(<ProfilePage />);
    await userEvent.click(screen.getByText('Delete Account'));
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('handles account closure', async () => {
    (closeProfile as jest.Mock).mockResolvedValue({});
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: mockLogout,
      updateUserProfile: jest.fn(),
    });

    render(<ProfilePage />);
    await userEvent.click(screen.getByText('Delete Account'));
    await userEvent.click(screen.getByText('Confirm Delete'));

    await waitFor(() => {
      expect(closeProfile).toHaveBeenCalledWith('123');
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('shows loading state when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      updateUserProfile: jest.fn(),
    });

    render(<ProfilePage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});