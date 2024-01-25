type Vehicle = {
	name: string
	licensePlate: string
	vinNumber: string
	id: number
	equipment: { equipmentTypeID: number; quantity: number }[]
}

type Fleet = {
	name: string
	vehicles: Vehicle[]
	id: number
}

type FleetsProps = {
	fleets: Fleet[]
	selectFleet: (fleet: Fleet) => void
}

const Fleets: React.FC<FleetsProps> = ({ fleets, selectFleet }) => {
	return (
		<div className='fleets-list text-left'>
			<h2>Fleets</h2>
			<ul>
				{fleets.map((fleet) => (
					<li
						key={fleet.id}
						onClick={() => {
							selectFleet(fleet)
						}}
						className='fleet mb-4'
					>
						<h4 className='fleet-name pt-2'>{fleet.name}</h4>
						<ul className='pl-6'>
							{fleet.vehicles.map((vehicle, vehicleIndex) => (
								<li key={vehicleIndex} className='pt-1'>
									<p>- {vehicle.name}</p>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Fleets
