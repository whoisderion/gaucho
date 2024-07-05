import { UseAuth } from "hooks/Auth"
import { Link, useLocation } from "react-router-dom"
import * as ROUTES from "data/routes"

function Navigation() {
	const { session, signOut } = UseAuth()

	console.log("session auth:", session)

	const location = String(useLocation().pathname)
	console.log(location)
	if (location === "/" || location.includes("/trucks/upload")) {
		return <></>
	} else {
		if (session !== null) {
			return (
				<nav className=' border-solid border-ternary border-b-2 w-full md:max-w-xs bg-secondary px-12 pt-8 md:mr-16'>
					<div className=' border-b-[1px] flex w-full '>
						<h2 className='[&&]: border-b-0'>Gaucho</h2>
					</div>

					<div>
						<ul className='flex flex-col gap-3 p-4  md:grid-cols-2 '>
							<li>
								<Link to={ROUTES.EQUIPMENT}>Equipment</Link>
							</li>
							<li>
								<Link to={ROUTES.MAINTENANCE}>Maintenance</Link>
							</li>
							<li>
								<Link to={ROUTES.FLEET_MANAGEMENT}>Fleet Management</Link>
							</li>

							<li>
								<Link to={ROUTES.ACCOUNT}>Account</Link>
							</li>
							<li>
								<Link onClick={signOut} to={""}>
									Sign Out
								</Link>
							</li>
						</ul>
					</div>
				</nav>
			)
		}
	}
}

export default Navigation
