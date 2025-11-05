import React from 'react'
import { useAuthStore } from '../store/authStore'

const ProtectedAppPage: React.FC = () => {
  const { user } = useAuthStore()
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Chat Application</h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">Welcome to the AI Chat App!</h2>
                <p className="mt-2 text-gray-500">
                  {user ? `Signed in as: ${user.email || 'User'}` : 'User data not available'}
                </p>
                <p className="mt-4 text-gray-600">
                  This is a protected page that requires authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProtectedAppPage