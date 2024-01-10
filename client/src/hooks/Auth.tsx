import {createContext, useContext, useEffect, useState} from 'react'
import { Session, User } from '@supabase/supabase-js'
import {supabaseClient} from 'config/supabase-client'

type AuthContext = {
  session: Session | null | undefined, 
  user: User | null | undefined, 
  signIn: (email: string, passowrd: string) => void,
  signOut: () => void
}

const AuthContext = createContext<AuthContext>({session: null, user: null, signIn: () => {}, signOut: () => {}})

export const AuthProvider = ({children} : any) => {
    const [user, setUser] = useState<User>()
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      const setData = async() => {
        const { data: { session }, error } = await supabaseClient.auth.getSession()
        if (error) throw error
        setSession(session)
        setUser(session?.user)
        setLoading(false)
      }
  
      const { data: { subscription }} = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      setData()
  
      return () => subscription.unsubscribe()
    }, [])

    const signIn = (email: string, password: string) => {
      supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    })
      console.log(email,password)
    }

    const value = {
      session, 
      user, 
      signIn: (email: string, password: string) => signIn(email, password),
      signOut: () => supabaseClient.auth.signOut()
    }
      
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}

export const UseAuth = () => {
  return useContext(AuthContext)
}