import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../src/components/auth/LoginForm';

// Mock the auth service
jest.mock('../src/services/auth', () => ({
  authService: {
    login: jest.fn(() => Promise.resolve({ data: { access_token: 'mock-token', token_type: 'bearer', expires_in: 3600 } })),
    register: jest.fn(() => Promise.resolve({ data: { id: '1', fullname: 'Test User', email: 'test@example.com', created_at: new Date().toISOString() } }))
  }
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAuthStore hook
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockSetError = jest.fn();
const mockSetLoading = jest.fn();
const mockSetToken = jest.fn();
jest.mock('../src/store/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    login: mockLogin,
    logout: mockLogout,
    setError: mockSetError,
    setLoading: mockSetLoading,
    setToken: mockSetToken,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  })),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays error for invalid email format', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Wait for the error element to appear in the DOM
    await screen.findByRole('alert');
    
    // Then check that it contains the expected error message
    expect(screen.getByRole('alert')).toHaveTextContent(/Please enter a valid email address/i);
  });

  test('submits login form with valid credentials', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(mockLogin).toHaveBeenCalledWith('mock-token', { email: 'test@example.com' });
      expect(mockNavigate).toHaveBeenCalledWith('/app');
    });
  });
});