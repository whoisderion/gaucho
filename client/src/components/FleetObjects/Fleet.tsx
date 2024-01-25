import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import { useState } from "react"

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
		vehicleId: number,
		fleetId: number,
		type: string,
		e?:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
		currEquipmentTypeID?: number | undefined,
		equipmentQuantity?: number | undefined
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
	const [key, setKey] = useState<number>(+new Date())

	if (
		handleFleetNameChange &&
		deleteFleet &&
		deleteVehicle &&
		createNewVehicle &&
		handleVehicleChange
	) {
		return (
			<div className='pl-8'>
				<h4>Fleet Name</h4>
				<div className='flex'>
					<h3 className='text-left mb-4 text-3xl'>
						<Input
							type='text'
							name='name'
							value={fleet.name}
							key={fleet.id}
							className=' w-96'
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								handleFleetNameChange(fleet.id, e)
							}}
						/>
					</h3>
					<Button
						onClick={() => {
							deleteFleet(currFleet)
						}}
						variant={"destructive"}
						className=' ml-4'
					>
						Delete {fleet.name}
					</Button>
				</div>
				<h4 className='text-left text-xl my-4'>Vehicles</h4>
				<ul>
					{fleet.vehicles.map((vehicle) => (
						<div className='flex' key={vehicle.id}>
							<li className='border-solid border-[1px] mb-4 py-2 flex w-10/12'>
								<div className='vehicle-info'>
									<div className=' flex-auto flex-grow-[5]'>
										<Input
											type='text'
											name='vehicleName'
											value={vehicle.name}
											key={vehicle.id + "Name"}
											placeholder='Vehicle Name'
											onChange={(e) =>
												handleVehicleChange(vehicle.id, fleet.id, "name", e)
											}
										/>
									</div>
									<div className='text-left flex-grow grid grid-rows-2 grid-cols-2'>
										<p className=' m-auto'>License Plate: </p>
										<Input
											type='text'
											name='vehicleLicense'
											value={vehicle.licensePlate}
											key={vehicle.id + "License"}
											onChange={(e) =>
												handleVehicleChange(
													vehicle.id,
													fleet.id,
													"licensePlate",
													e
												)
											}
										/>
										<p className='m-auto [&&]:mt-2'>VIN Number: </p>
										<Input
											type='text'
											name='vinNumber'
											value={vehicle.vinNumber}
											key={vehicle.id + "VIN"}
											onChange={(e) =>
												handleVehicleChange(
													vehicle.id,
													fleet.id,
													"vinNumber",
													e
												)
											}
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
														<p>{currEquipment.name}</p>
														<div className='flex'>
															<Input
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
																		"changeEquipmentQuantity",
																		e,
																		equipment.equipmentTypeID,
																		Number(e.target.value)
																	)
																}
															/>
															<Button
																onClick={(e) =>
																	handleVehicleChange(
																		vehicle.id,
																		fleet.id,
																		"removeEquipmentType",
																		e,
																		equipment.equipmentTypeID
																	)
																}
																variant={"ghost"}
															>
																X
															</Button>
														</div>
													</div>
												)
											}
										}
									})}
									<Select
										onValueChange={(e) => {
											if (e !== "Add Equipment") {
												const equipment = equipmentTypes.filter((equipment) => {
													if (equipment.name === e) {
														return equipment
													}
												})
												const equipmentID = equipment[0].id
												handleVehicleChange(
													vehicle.id,
													fleet.id,
													"addEquipmentType",
													undefined,
													equipmentID
												)
												setKey(+new Date())
												console.log(
													vehicle.equipment.length == equipmentTypes.length
												)
											}
										}}
										key={key}
									>
										<SelectTrigger
											className={
												vehicle.equipment.length == equipmentTypes.length
													? " mt-2 bg-muted"
													: " mt-2"
											}
										>
											<SelectValue placeholder={"Add Equipment"} />
										</SelectTrigger>
										<SelectContent>
											{equipmentTypes.map((equipment) => {
												const inVehicleArr = vehicle.equipment.some(
													(item) => item.equipmentTypeID === equipment.id
												)
												if (!inVehicleArr) {
													return (
														<SelectItem
															value={equipment.name}
															id={`${vehicle.id + equipment.id}`}
															key={`${vehicle.id + equipment.id}`}
														>
															{equipment.name}
														</SelectItem>
													)
												}
											})}
										</SelectContent>
									</Select>
								</div>
							</li>

							<div>
								<Button
									onClick={() => {
										deleteVehicle(vehicle.id, fleet.id)
									}}
									variant={"destructive"}
								>
									Delete
								</Button>
							</div>
						</div>
					))}
					<Button
						onClick={() => {
							createNewVehicle(fleet.id)
						}}
						variant={"outline"}
					>
						Add Vehicle
					</Button>
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
