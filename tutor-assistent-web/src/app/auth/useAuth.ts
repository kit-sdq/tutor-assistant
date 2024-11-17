import { useContext } from 'react'
import { AuthContext } from './Auth.tsx'

export function useAuth() {
  return useContext(AuthContext)
}
