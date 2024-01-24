import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
import { Button } from "@/components/ui/button"

function Landing() {
	return (
		<div>
			<div className='text-emerald-700'>Welcome to Gaucho</div>
			<div>
				<Button asChild>
					<Link to={ROUTES.SIGN_UP}>Sign Up</Link>
				</Button>

				<Button asChild>
					<Link to={ROUTES.SIGN_IN}>Sign In</Link>
				</Button>
			</div>
		</div>
	)
}

export default Landing
