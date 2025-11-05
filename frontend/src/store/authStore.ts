import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthState {
  user: any | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Actions
  login: (token: string, user: any) => void
  logout: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        login: (token, user) =>
          set({ token, user, isAuthenticated: true, error: null }),
          
        logout: () =>
          set({ token: null, user: null, isAuthenticated: false, error: null }),
          
        setError: (error) => set({ error }),
        
        setLoading: (loading) => set({ loading }),
        
        setToken: (token) => set({ token, isAuthenticated: !!token }),
      }),
      {
        name: 'auth-storage', // unique name for localStorage key
      }
    )
  )
)