import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import ProtectedAppPage from './pages/ProtectedApp'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<div>AI Chat App</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <ProtectedAppPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

export default App