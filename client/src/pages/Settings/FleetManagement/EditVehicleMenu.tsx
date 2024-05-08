import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { FetchedData } from "./FleetManagement"
import { Vehicle } from "./columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import {
	Sheet,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"

import { Label } from "@/components/ui/label"

const serverURL = import.meta.env.VITE_SERVER_URL
const companyID = import.meta.env.VITE_COMPANY_ID

interface EditVehicleMenuProps {
	vehicle: Vehicle
	setVehicle: Dispatch<SetStateAction<Vehicle | undefined>>
	fleetData: FetchedData
	setFleetData: Dispatch<SetStateAction<FetchedData | undefined>>
	stopEditing: () => void
}

export function EditVehicleMenu({
	vehicle,
	setVehicle,
	fleetData,
	setFleetData,
	stopEditing,
}: EditVehicleMenuProps) {
	const handleSubmit = async (
		newVehicleData: EditVehicleMenuProps["vehicle"],
		setFleetData: EditVehicleMenuProps["setFleetData"]
	) => {
		console.log(newVehicleData)
		await axios
			.post(serverURL + `/account/vehicle/${companyID}`, newVehicleData)
			.then(() =>
				setFleetData((prevData) => {
					if (prevData) {
						if (newVehicleData.id === "") {
							const updatedVehicles = [...prevData.vehicles, newVehicleData]
							return { ...prevData, vehicles: updatedVehicles }
						} else {
							const updatedVehicles = prevData.vehicles.map((vehicle) =>
								vehicle.id === newVehicleData.id ? newVehicleData : vehicle
							)
							return { ...prevData, vehicles: updatedVehicles }
						}
					} else {
						console.error("Failed saving changes to vehicle!")
						return prevData
					}
				})
			)
			.catch((err) => console.log(err))
	}

	return (
		<Sheet>
			<SheetHeader className='p-6'>
				<SheetTitle>
					{vehicle.name ? vehicle.name : "New Vehicle"} Settings
				</SheetTitle>
				<SheetDescription>
					Make changes to {vehicle.name ? vehicle.name : "New Vehicle"} here.
					Click save when you're done.
				</SheetDescription>
			</SheetHeader>
			<div className='p-6'>
				<form action=''>
					<Label className=''>Name</Label>
					<Input
						type='text'
						className='mb-2'
						value={vehicle.name || ""}
						onChange={(e) => {
							setVehicle({ ...vehicle, name: e.target.value })
						}}
						autoComplete='off'
					/>
					<Label htmlFor='license'>License</Label>
					<Input
						type='text'
						value={vehicle.license || ""}
						className='mb-2'
						onChange={(e) => {
							setVehicle({ ...vehicle, license: e.target.value })
						}}
						autoComplete='off'
					/>
					<Label htmlFor='vin'>VIN</Label>
					<Input
						type='text'
						value={vehicle.vin || ""}
						className='mb-2'
						onChange={(e) => {
							setVehicle({ ...vehicle, vin: e.target.value })
						}}
						autoComplete='off'
					/>
					<Label htmlFor='year'>Year</Label>
					<Input
						type='number'
						value={vehicle.year || ""}
						className='mb-2'
						onChange={(e) => {
							setVehicle({
								...vehicle,
								year: e.target.value == "" ? null : parseInt(e.target.value),
							})
						}}
						autoComplete='off'
						min={1970}
					/>
					<Label htmlFor='fleet'>Fleet</Label>
					<Select
						onValueChange={(e) => {
							const newFleet = fleetData.fleets.filter(
								(fleet) => fleet.name === e.valueOf()
							)
							setVehicle({ ...vehicle, Fleet: newFleet[0] })
						}}
					>
						<SelectTrigger className=' mb-2'>
							<SelectValue placeholder={vehicle.Fleet.name || ""} />
						</SelectTrigger>
						<SelectContent>
							{fleetData?.fleets.map((fleet) => (
								<SelectItem key={fleet.name} value={fleet.name}>
									{fleet.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</form>
				<SheetFooter>
					<div className='mt-4 space-x-2'>
						<Button
							className=' inline-block'
							onClick={stopEditing}
							variant={"secondary"}
						>
							Cancel
						</Button>
						<Button
							className=' inline-block'
							onClick={() => {
								handleSubmit(vehicle, setFleetData).then(stopEditing)
							}}
						>
							Save
						</Button>
					</div>
				</SheetFooter>
			</div>
		</Sheet>
	)
}
