import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore()
  const location = useLocation()

  // Check if we have a token in localStorage that matches our store
  const localStorageToken = localStorage.getItem('token')
  const isValidAuth = isAuthenticated || (token && token === localStorageToken)

  if (!isValidAuth) {
    // Redirect to login with the current location saved for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute