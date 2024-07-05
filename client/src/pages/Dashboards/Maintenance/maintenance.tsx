import axios from "axios"
import { useEffect, useState } from "react"
// import Sidebar from "components/Sidebar"
import { Label } from "@/components/ui/label"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

// https://www.ascendfleet.com/hs-fs/hubfs/Web%20-%20Fleet%20Overview%20Summary%20Dashboard.jpeg?width=1200&name=Web%20-%20Fleet%20Overview%20Summary%20Dashboard.jpeg

// TODO: rename to fleet overview and fix url/routing
function Maintenance() {
	type Fleet = {
		companyId: string
		id: string
		name: string
		vehicles: Vehicle[]
	}

	type Inventory = {
		date: Date
		id: string
		truckId: string
	}

	type Maintenance = {
		coolant: string
		date: Date
		frontDriverTread: string
		frontPassengerTread: string
		id: string
		milage: number
		notes: string
		oil: string
		rearDriverTread: string
		rearPassengerTread: string
		truckId: string
	}

	type Vehicle = {
		id: string
		name: string
		vin: string
		license: string
		year: number
		fleetId: string
		urlPath: string
		inventory: Inventory
		maintenance: Maintenance
	}

	type DashboardData = {
		fleets: Fleet[]
	}

	const [dashboardData, setDashboardData] = useState<DashboardData>()

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(
					import.meta.env.VITE_SERVER_URL +
						"/dashboard/" +
						import.meta.env.VITE_COMPANY_ID,
					{
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					setDashboardData(res.data)
					console.log(res.data)
				})
				.catch((err) => {
					console.error(err)
				})
		}

		fetchData()
	}, [])

	// TODO: make an abstraction for reuse in other dashboards
	const listFleets =
		dashboardData &&
		dashboardData.fleets.map((fleet: Fleet, fleetKey) => (
			<AccordionItem value={fleet.name} key={fleetKey}>
				<AccordionTrigger>{fleet.name}</AccordionTrigger>
				<AccordionContent>
					<ul className='fleet-group mb-4'>
						<ul className=' flex flex-col md:flex-row'>
							{fleet.vehicles ? (
								fleet.vehicles.map((vehicle, vehicleKey) => (
									<li
										key={vehicleKey}
										className=' p-8 mb-8 border w-full md:w-1/2'
									>
										<div className=' vehicle-info mb-2'>
											<h4>{vehicle.name}</h4>
											<Label>{vehicle.license}</Label>
											<div>
												{/* <p>Last Updated: {vehicle.maintenance.date ? String(vehicle.maintenance.date) : "Never"}</p> */}
											</div>
										</div>
										<div className='maintenance-data block py-2'>
											<div className='levels flex space-x-[40%] mb-2'>
												<div>
													<p className='mb-4'>
														Milage: {vehicle.maintenance.milage}
													</p>
													<p className='mb-4'>Oil: {vehicle.maintenance.oil}</p>
													<p className='mb-4'>
														Coolant: {vehicle.maintenance.coolant}
													</p>
													<div className=' w-60'>
														<p className=' underline'>Tire Tread:</p>

														<ul className=' min-w-max'>
															<li>
																Front Driver:
																{vehicle.maintenance.frontDriverTread
																	? " " + vehicle.maintenance.frontDriverTread
																	: " "}
															</li>
															<li>
																Front Passenger:
																{vehicle.maintenance.frontPassengerTread
																	? " " +
																	  vehicle.maintenance.frontPassengerTread
																	: ""}
															</li>
															<li>
																Rear Driver:
																{vehicle.maintenance.rearDriverTread
																	? " " + vehicle.maintenance.rearDriverTread
																	: ""}
															</li>
															<li>
																Rear Passenger:
																{vehicle.maintenance.rearPassengerTread
																	? " " + vehicle.maintenance.rearPassengerTread
																	: ""}
															</li>
														</ul>
													</div>
												</div>
											</div>
											<div className='notes'>
												<h4>Notes:</h4>
												<p>{vehicle.maintenance.notes}</p>
											</div>
										</div>
									</li>
								))
							) : (
								<></>
							)}
						</ul>
					</ul>
				</AccordionContent>
			</AccordionItem>
		))

	// used as a value for the radix accordionItem and passed to the defaultValue in the root accordion component
	const fleetNames =
		dashboardData && dashboardData.fleets.map((fleet: Fleet) => fleet.name)

	if (dashboardData) {
		return (
			<div className='Dashboard flex-col w-full px-8 md:max-w-6xl my-8'>
				<h2 className=' mb-8'>Maintenance Dashboard</h2>
				<div className='fleetList'>
					<Accordion type='multiple' defaultValue={fleetNames}>
						{dashboardData && listFleets}
					</Accordion>
				</div>
			</div>
		)
	} else {
		return (
			<div>
				<div className='Dashboard inline-flex flex-col'>
					Loading Dashboard Data
				</div>
			</div>
		)
	}
}

export default Maintenance
