'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { User } from '@/types/fitness'
import {
  signIn as serverSignIn,
  signUp as serverSignUp,
  signOut as serverSignOut,
  deleteAccount as serverDeleteAccount,
  fetchUserProfile,
} from '@/app/actions/auth-actions'
import { toast } from '@/components/ui/use-toast'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const AuthContext = createContext<
  | (AuthState & {
      login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
      register: (name: string, email: string, password: string) => Promise<{ success: boolean; error: string | null }>
      logout: () => Promise<void>
      deleteUserAccount: () => Promise<{ success: boolean; error: string | null }>
      demoLogin: () => Promise<void>
    })
  | undefined
>(undefined)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const supabase = getBrowserClient()

  const loadUserSession = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const userProfile = await fetchUserProfile(session.user.id)
        if (userProfile) {
          dispatch({ type: 'SET_USER', payload: userProfile })
        } else {
          // If no profile, but auth session exists, it means user just signed up
          // and needs to complete onboarding or profile creation.
          // For now, we'll set a minimal user.
          dispatch({
            type: 'SET_USER',
            payload: {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email || 'User',
              email: session.user.email || '',
            },
          })
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null })
      }
    } catch (err: any) {
      console.error('Error loading user session:', err)
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to load session' })
      dispatch({ type: 'SET_USER', payload: null })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [supabase])

  useEffect(() => {
    loadUserSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            const userProfile = await fetchUserProfile(session.user.id)
            if (userProfile) {
              dispatch({ type: 'SET_USER', payload: userProfile })
            } else {
              // Handle case where auth session exists but public.users profile doesn't
              // This might happen right after signup before profile is created
              dispatch({
                type: 'SET_USER',
                payload: {
                  id: session.user.id,
                  name: session.user.user_metadata?.name || session.user.email || 'User',
                  email: session.user.email || '',
                },
              })
            }
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' })
          toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
          })
        } else if (event === 'USER_DELETED') {
          dispatch({ type: 'LOGOUT' })
          toast({
            title: 'Account Deleted',
            description: 'Your account has been successfully deleted.',
          })
        }
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [supabase, loadUserSession])

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: 'LOGIN_START' })
      const result = await serverSignIn(new FormData(
        Object.entries({ email, password }).reduce((acc, [key, value]) => {
          acc.append(key, value);
          return acc;
        }, new FormData())
      ));

      if (result.success) {
        // Re-fetch session to update client-side state after server action
        await loadUserSession();
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        return { success: true, error: null };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: result.error || 'Login failed' });
        toast({
          title: 'Login Failed',
          description: result.error || 'Please check your credentials.',
          variant: 'destructive',
        });
        return { success: false, error: result.error };
      }
    },
    [loadUserSession]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      dispatch({ type: 'REGISTER_START' })
      const result = await serverSignUp(new FormData(
        Object.entries({ name, email, password }).reduce((acc, [key, value]) => {
          acc.append(key, value);
          return acc;
        }, new FormData())
      ));

      if (result.success) {
        // Re-fetch session to update client-side state after server action
        await loadUserSession();
        toast({
          title: 'Registration Successful',
          description: 'Welcome to the fitness tracker!',
        });
        return { success: true, error: null };
      } else {
        dispatch({ type: 'REGISTER_FAILURE', payload: result.error || 'Registration failed' });
        toast({
          title: 'Registration Failed',
          description: result.error || 'Please try again.',
          variant: 'destructive',
        });
        return { success: false, error: result.error };
      }
    },
    [loadUserSession]
  )

  const logout = useCallback(async () => {
    await serverSignOut()
    dispatch({ type: 'LOGOUT' })
  }, [])

  const deleteUserAccount = useCallback(async () => {
    if (!state.user?.id) {
      toast({
        title: 'Error',
        description: 'No user logged in to delete.',
        variant: 'destructive',
      });
      return { success: false, error: 'No user logged in' };
    }
    const result = await serverDeleteAccount(state.user.id);
    if (result.success) {
      dispatch({ type: 'LOGOUT' });
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });
      return { success: true, error: null };
    } else {
      toast({
        title: 'Deletion Failed',
        description: result.error || 'Could not delete account.',
        variant: 'destructive',
      });
      return { success: false, error: result.error };
    }
  }, [state.user?.id]);

  const demoLogin = useCallback(async () => {
    dispatch({ type: 'LOGIN_START' });
    // Simulate a demo user login without actual Supabase auth
    const demoUser: User = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      primaryGoal: 'general_fitness',
    };
    dispatch({ type: 'LOGIN_SUCCESS', payload: demoUser });
    toast({
      title: 'Demo Login Successful',
      description: 'Welcome to the demo!',
    });
  }, []);

  const value = React.useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      deleteUserAccount,
      demoLogin,
    }),
    [state, login, register, logout, deleteUserAccount, demoLogin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
