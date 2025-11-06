// __mocks__/authService.js
export const authService = {
  async register(data) {
    return Promise.resolve({ 
      data: { 
        id: '1', 
        fullname: data.fullname, 
        email: data.email, 
        created_at: new Date().toISOString() 
      } 
    });
  },
  async login(data) {
    return Promise.resolve({ 
      data: { 
        access_token: 'mock-token', 
        token_type: 'bearer',
        expires_in: 3600
      } 
    });
  },
  async logout() {
    return Promise.resolve({ data: { message: 'Logged out successfully' } });
  },
  async verifyToken(token) {
    return Promise.resolve(token === 'mock-token');
  },
};