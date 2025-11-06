import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../src/components/auth/RegisterForm';

// Mock the auth service
jest.mock('../src/services/auth', () => ({
  authService: {
    register: jest.fn(() => Promise.resolve({ 
      data: { 
        id: '1', 
        fullname: 'Test User', 
        email: 'test@example.com', 
        created_at: new Date().toISOString() 
      } 
    }))
  }
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAuthStore hook
const mockSetToken = jest.fn();
const mockSetError = jest.fn();
const mockSetLoading = jest.fn();
jest.mock('../src/store/authStore', () => ({
  useAuthStore: () => ({
    setToken: mockSetToken,
    setError: mockSetError,
    setLoading: mockSetLoading,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders registration form correctly', () => {
    render(<RegisterForm />);
    
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows validation errors for invalid inputs', async () => {
    render(<RegisterForm />);
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    // Wait for all validation error messages to appear
    // Errors appear as <p> elements with class text-sm text-red-600
    await screen.findByText(/Full name must be at least 2 characters long/i);
    await screen.findByText(/Please enter a valid email address/i);
    await screen.findByText(/Password must be at least 8 characters long/i);
    
    expect(screen.getByText(/Full name must be at least 2 characters long/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
  });

  test('shows validation error for weak password', async () => {
    render(<RegisterForm />);
    
    const fullNameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
  });

  test('submits registration form with valid credentials', async () => {
    render(<RegisterForm />);
    
    const fullNameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});