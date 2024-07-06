import { UseAuth } from "hooks/Auth"
import { Link, LinkProps, useLocation } from "react-router-dom"
import * as ROUTES from "data/routes"
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu"
import { Menu } from "lucide-react"
import { forwardRef } from "react"
import { cn } from "../@/lib/utils"

function Navigation() {
	const { session, signOut } = UseAuth()

	const destinations: { title: string; to: string }[] = [
		{
			title: "Equipment",
			to: "/dashboards/equipment",
		},
		{
			title: "Maintenance",
			to: "/dashboards/maintenance",
		},
		{
			title: "Fleet Management",
			to: "/settings/fleet-management",
		},
		{
			title: "Account",
			to: "/account",
		},
	]

	// console.log("nav session auth:", session)

	// console.log("is this user is in?", session ? true : false)

	const location = String(useLocation().pathname)
	// console.log("nav location:", location)
	if (location === "/" || location.includes("/trucks/upload")) {
		return <></>
	} else {
		if (session !== null) {
			return (
				<nav className=' border-solid border-ternary border-b-2 w-full md:max-w-xs bg-secondary px-12 pt-8 md:mr-16'>
					<div className=' flex w-full justify-between'>
						<h2 className='[&&]: border-b-0'>Gaucho</h2>
						<NavigationMenu className=' overflow-hidden md:hidden'>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger className=' float-right'>
										<Menu />
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className=' flex flex-col'>
											{destinations.map((destination) => (
												<ListItem
													key={destination.title}
													title={destination.title}
													to={destination.to}
													children={""}
												/>
											))}
											<ListItem
												key={"signOut"}
												title={"Sign Out"}
												to={""}
												onClick={signOut}
												children={""}
											/>
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>
					<div className=' hidden md:block'>
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

interface ListItemProps extends LinkProps {
	className?: string
	title: string
	to: string
	action?: () => void
	children: React.ReactNode
}

const ListItem = forwardRef<HTMLAnchorElement, ListItemProps>(
	({ className, title, to, action, children, ...props }, ref) => {
		console.log("forwarded props:", props)
		return (
			<li>
				<NavigationMenuLink asChild>
					<Link
						ref={ref}
						to={to}
						onClick={action}
						className={cn(
							"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className
						)}
						{...props}
					>
						<div className='text-sm font-medium leading-none'>{title}</div>
						<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
							{children}
						</p>
					</Link>
				</NavigationMenuLink>
			</li>
		)
	}
)
ListItem.displayName = "ListItem"
