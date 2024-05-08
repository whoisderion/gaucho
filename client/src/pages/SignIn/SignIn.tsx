// import { Auth } from '@supabase/auth-ui-react'
import { UseAuth } from "../../hooks/Auth"
// import { supabaseClient } from 'config/supabase-client'
import * as ROUTES from "data/routes"
import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SignIn = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const { signIn } = UseAuth()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		signIn(email, password)
	}

	return (
		<div className=' w-full h-full flex items-center justify-center mx-auto bg-secondary'>
			<Card className=' max-w-xl md:w-1/3'>
				<CardHeader>
					<CardTitle>Sign in to your account</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						className=' space-y-3'
						onSubmit={(e) => {
							handleSubmit(e)
						}}
					>
						<div>
							<label htmlFor='email'>Email Address</label>
							<Input
								type='text'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor='password'>Password</label>
							<Input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<Button type='submit' className=' my-8 mx-auto bg-primary'>
							Sign In
						</Button>
					</form>
				</CardContent>
				<CardFooter className=' text-center'>
					<div className=' mx-auto'>
						<Link to='#'>
							<div className=' hover:text-primary'>Forgot your passowrd?</div>
						</Link>
						<Link to={ROUTES.SIGN_UP}>
							<div className=' hover:text-primary'>
								Don't have an account yet? Sign up
							</div>
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default SignIn
