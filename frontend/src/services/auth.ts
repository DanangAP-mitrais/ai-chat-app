import axios, { AxiosResponse } from 'axios'
import { RegisterRequest, LoginRequest, TokenResponse, UserResponse } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear auth state
      localStorage.removeItem('token')
      window.location.href = '/login' // Redirect to login
    }
    return Promise.reject(error)
  }
)

export interface RegisterResponse {
  id: string
  fullname: string
  email: string
  created_at: string
}

export const authService = {
  async register(data: RegisterRequest): Promise<AxiosResponse<UserResponse>> {
    return api.post('/auth/register', data)
  },

  async login(data: LoginRequest): Promise<AxiosResponse<TokenResponse>> {
    return api.post('/auth/login', data)
  },

  async logout(): Promise<AxiosResponse<{ message: string }>> {
    return api.post('/auth/logout')
  },

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.get('/auth/verify')
      return response.status === 200
    } catch (error) {
      return false
    }
  },
}