import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"

function Landing() {
	return (
		<div>
			<div className='text-emerald-700'>Welcome to Gaucho</div>
			<div>
				<Link to={ROUTES.SIGN_UP}>
					<button>Sign Up</button>
				</Link>

				<Link to={ROUTES.SIGN_IN}>
					<button>Sign In</button>
				</Link>
			</div>
		</div>
	)
}

export default Landing
