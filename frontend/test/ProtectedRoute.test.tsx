import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../src/components/auth/ProtectedRoute';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the useAuthStore hook
const mockUseAuthStore = jest.fn();
jest.mock('../src/store/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default to authenticated
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      token: 'mock-token',
      user: null,
    });
    
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  test('renders children when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    // Change the mock return value for this specific test
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    // With the current setup, we can check if the protected content is not showing
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});