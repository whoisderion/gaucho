// import { Auth } from '@supabase/auth-ui-react'
import {UseAuth} from '../../hooks/Auth'
// import { supabaseClient } from 'config/supabase-client'
import * as ROUTES from 'data/routes'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {signIn} = UseAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signIn(email,password)
    console.log("signed in")
    navigate(ROUTES.FLEET_MANAGEMENT)
  }

  return (
    <div className=' max-w-5xl mx-20 justify-center'>
      <h2>Sign in to your account</h2>

      <form onSubmit={(e) => {handleSubmit(e)}}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type='submit'>Sign In</button>
      </form>

      <div>
        <Link to='#'><div>Forgot your passowrd?</div></Link>
        <Link to={ROUTES.SIGN_UP}><div>Don't have an account yet? Sign up</div></Link>
      </div>
    </div>
  )
}

export default SignIn