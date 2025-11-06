import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

// Mock the auth service
jest.mock('../src/services/auth', () => ({
  authService: {
    login: jest.fn(() => Promise.resolve({ data: { access_token: 'mock-token', token_type: 'bearer', expires_in: 3600 } })),
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

describe('App', () => {
  test('renders main page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/ai chat app/i)).toBeInTheDocument();
  });

  test('renders register page at /register route', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    });
  });

  test('renders login page at /login route', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    });
  });
});