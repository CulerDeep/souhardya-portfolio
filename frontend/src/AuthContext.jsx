import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setReady(true)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      isAdmin: user?.role === 'admin',
      async signin(email, password) {
        const data = await api.signin(email, password)
        setToken(data.access_token)
        setUser(data.user)
        return data.user
      },
      async signup(name, email, password) {
        const data = await api.signup(name, email, password)
        setToken(data.access_token)
        setUser(data.user)
        return data.user
      },
      signout() {
        setToken(null)
        setUser(null)
      },
    }),
    [user, ready]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
