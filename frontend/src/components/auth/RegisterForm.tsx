import React, { useState } from 'react'
import { authService } from '../../services/auth'
import { RegisterRequest } from '../../types/auth'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { validateEmail, validatePassword, validateFullName } from '../../utils/validators'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    fullname: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    fullname: '',
    email: '',
    password: '',
  })
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const setToken = useAuthStore(state => state.setToken)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear the error for the field being edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = { fullname: '', email: '', password: '' }

    // Validate full name
    const nameValidation = validateFullName(formData.fullname)
    if (!nameValidation.isValid) {
      newErrors.fullname = nameValidation.message
      isValid = false
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setGeneralError(null)

    try {
      const response = await authService.register(formData)
      // Store the token in the auth store
      // Note: The register endpoint doesn't return a token, login is required separately
      alert('Registration successful! Please log in.')
      navigate('/login')
    } catch (err: any) {
      console.error('Registration error:', err)
      setGeneralError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {generalError}
          </div>
        )}
        
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              type="text"
              required
              value={formData.fullname}
              onChange={handleChange}
              placeholder="John Doe"
              className={`mt-1 ${errors.fullname ? 'border-red-500' : ''}`}
            />
            {errors.fullname && (
              <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm