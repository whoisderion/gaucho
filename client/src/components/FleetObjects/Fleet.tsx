type Vehicle = {
	name: string
	licensePlate: string
	vinNumber: string
	id: number
	equipment: { equipmentTypeID: number; quantity: number }[]
}

type fleet = {
	name: string
	vehicles: Vehicle[]
	id: number
}

type Equipment = {
	name: string
	id: number
}

type FleetProps = {
	fleet: fleet
	currFleet: number
	handleFleetNameChange?: (
		id: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => void
	deleteFleet?: (id: number) => void
	deleteVehicle?: (vehicleId: number, fleetId: number) => void
	createNewVehicle?: (fleetId: number) => void
	handleVehicleChange?: (
		id: number,
		fleetId: number,
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
		type: string,
		currEquipmentTypeID?: number,
		equipmentQuantity?: number
	) => void
	equipmentTypes: Equipment[]
}

function findEquipmentByID(equipmentID: number, equipmentArr: Equipment[]) {
	const selectedEquipment = equipmentArr.find(
		(equipment) => equipment.id === equipmentID
	)
	if (selectedEquipment) {
		return selectedEquipment
	}
	return null
}

const Fleet: React.FC<FleetProps> = ({
	fleet,
	currFleet,
	handleFleetNameChange,
	deleteFleet,
	deleteVehicle,
	createNewVehicle,
	handleVehicleChange,
	equipmentTypes,
}) => {
	if (
		handleFleetNameChange &&
		deleteFleet &&
		deleteVehicle &&
		createNewVehicle &&
		handleVehicleChange
	) {
		return (
			<div className='pl-12'>
				<h3 className='text-left mb-8 text-3xl'>
					{/* TODO: find an alternative solution to autoFocus */}
					<input
						type='text'
						name='name'
						value={fleet.name}
						key={fleet.id}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							handleFleetNameChange(fleet.id, e)
						}}
						autoFocus
					/>
				</h3>
				<button
					onClick={() => {
						deleteFleet(currFleet)
					}}
				>
					Delete {fleet.name}
				</button>
				<hr />
				<h4 className='text-left text-xl my-4'>Vehicles</h4>
				<ul>
					{fleet.vehicles.map((vehicle) => (
						<div className='flex' key={vehicle.id}>
							<li className='border-solid border-[1px] mb-4 py-2 flex w-10/12'>
								<div className='vehicle-info'>
									<div className=' flex-auto flex-grow-[5]'>
										<input
											type='text'
											name='vehicleName'
											value={vehicle.name}
											key={vehicle.id + "Name"}
											onChange={(e) =>
												handleVehicleChange(vehicle.id, fleet.id, e, "name")
											}
											autoFocus
										/>
									</div>
									<div className='text-left flex-grow grid grid-rows-2 grid-cols-2'>
										<p>License Plate: </p>
										<input
											type='text'
											name='vehicleLicense'
											value={vehicle.licensePlate}
											key={vehicle.id + "License"}
											onChange={(e) =>
												handleVehicleChange(
													vehicle.id,
													fleet.id,
													e,
													"licensePlate"
												)
											}
											autoFocus
										/>
										<p>VIN Number: </p>
										<input
											type='text'
											name='vinNumber'
											value={vehicle.vinNumber}
											key={vehicle.id + "VIN"}
											onChange={(e) =>
												handleVehicleChange(
													vehicle.id,
													fleet.id,
													e,
													"vinNumber"
												)
											}
											autoFocus
										/>
									</div>
								</div>
								<div className='vehicle-equipment ml-8'>
									<p>{vehicle.name}'s Equipment: </p>
									{vehicle.equipment.map((equipment) => {
										if (equipment.equipmentTypeID) {
											const currEquipment = findEquipmentByID(
												equipment.equipmentTypeID,
												equipmentTypes
											)
											if (currEquipment) {
												return (
													<div key={equipment.equipmentTypeID}>
														<div>{currEquipment.name}</div>
														<input
															type='number'
															name={`equipmentName${equipment.equipmentTypeID}`}
															min={0}
															value={
																equipment.quantity === 0
																	? "0"
																	: equipment.quantity
															}
															onChange={(e) =>
																handleVehicleChange(
																	vehicle.id,
																	fleet.id,
																	e,
																	"changeEquipmentQuantity",
																	equipment.equipmentTypeID,
																	Number(e.target.value)
																)
															}
															autoFocus
														/>
														<button
															type='button'
															onClick={(e) =>
																handleVehicleChange(
																	vehicle.id,
																	fleet.id,
																	e,
																	"removeEquipmentType",
																	equipment.equipmentTypeID
																)
															}
														>
															X
														</button>
													</div>
												)
											}
										}
									})}
									<select
										onChange={(e) => {
											if (e.target.value === "Add Equipment") {
												e.preventDefault()
											} else {
												const equipment = equipmentTypes.filter((equipment) => {
													if (equipment.name === e.target.value) {
														return equipment
													}
												})
												const equipemntID = equipment[0].id
												handleVehicleChange(
													vehicle.id,
													fleet.id,
													e,
													"addEquipmentType",
													equipemntID
												)
											}
										}}
									>
										<option value={"Add Equipment"}>Add Equipment</option>
										{equipmentTypes.map((equipment) => {
											const inVehicleArr = vehicle.equipment.some(
												(item) => item.equipmentTypeID === equipment.id
											)
											if (!inVehicleArr) {
												return (
													<option
														value={equipment.name}
														id={`${vehicle.id + equipment.id}`}
														key={`${vehicle.id + equipment.id}`}
													>
														{equipment.name}
													</option>
												)
											}
										})}
									</select>
								</div>
							</li>

							<div>
								<button
									onClick={() => {
										deleteVehicle(vehicle.id, fleet.id)
									}}
								>
									Delete
								</button>
							</div>
						</div>
					))}
					<button
						onClick={() => {
							createNewVehicle(fleet.id)
						}}
					>
						Add Vehicle
					</button>
				</ul>
			</div>
		)
	} else if (fleet && currFleet) {
		return (
			<div className='pl-12'>
				<h3 className='text-left mb-8 text-3xl'>{fleet.name}</h3>
				<hr />
				<h4 className='text-left text-xl my-4'>Vehicles</h4>
				<ul className=' w-[60vw]'>
					{fleet.vehicles.map((vehicle) => (
						<li
							key={vehicle.id}
							className='border-solid border-[1px] mb-4 py-2 flex'
						>
							<div className=' flex-auto flex-grow-[5] w-1/2'>
								<p>{vehicle.name}</p>
							</div>
							<div className='text-left flex-grow grid grid-rows-2 grid-cols-2'>
								<p>2 Wheelers: 2</p>
								<p>4 Wheelers: 2</p>
								<p>Blankets: 100</p>
								<p>Straps: 6</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		)
	}
}

export default Fleet
