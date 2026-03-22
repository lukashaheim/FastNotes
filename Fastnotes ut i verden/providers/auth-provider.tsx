import { AuthContext } from '@/hooks/auth-context'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [claims, setClaims] = useState<Record<string, any> | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data, error } = await supabase.auth.getClaims()
        if (error) {
          console.error('Error fetching claims:', error)
        }
        setClaims(data?.claims ?? null)
      } else {
        setClaims(null)
      }

      setIsLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (!session) {
        setClaims(null)
        setProfile(null)
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.getClaims()
      if (error) {
        console.error('Error fetching claims:', error)
      }

      setClaims(data?.claims ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!claims?.sub) {
        setProfile(null)
        return
      }

      setIsLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', claims.sub)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setIsLoading(false)
    }

    fetchProfile()
  }, [claims])

  return (
    <AuthContext.Provider
      value={{
        claims,
        isLoading,
        profile,
        isLoggedIn: claims !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}