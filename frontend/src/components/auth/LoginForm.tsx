import React, { useState } from 'react'
import { authService } from '../../services/auth'
import { LoginRequest } from '../../types/auth'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { validateEmail } from '../../utils/validators'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate email format before submitting
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await authService.login(formData)
      const { access_token } = response.data
      
      // Store token in localStorage and update auth store
      localStorage.setItem('token', access_token)
      // Note: We don't have user data in the token response, so we'll set a placeholder
      // In a real implementation, you might want to fetch user details after login
      login(access_token, { email: formData.email })
      
      // Redirect to main app
      navigate('/app')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}
        
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label
              className="block text-sm font-medium leading-5 text-gray-700"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label
              className="block text-sm font-medium leading-5 text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <a 
            href="/register" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm