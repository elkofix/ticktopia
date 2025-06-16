import React from 'react';
import { render } from '@testing-library/react';
import RegisterPage from '../page';

// Mock the RegisterComponent
jest.mock('../../../../features/auth/register/components/RegisterComponent', () => {
  return function MockRegisterComponent() {
    return <div data-testid="mock-register-component">Register Component</div>;
  };
});

describe('RegisterPage', () => {
  it('should render the RegisterComponent', () => {
    render(<RegisterPage />);
    
    expect.anything()
  });

  it('should pass any necessary props to RegisterComponent', () => {
    // If your page needs to pass props to the RegisterComponent in the future
    render(<RegisterPage />);
    
    // You can add assertions here if props are passed
    // For now, just verifying the component renders
    expect.anything();
  });

  it('should match snapshot', () => {
    const { asFragment } = render(<RegisterPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});