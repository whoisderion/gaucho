import axios from "axios"
import QRCodes from "pages/QRCodes"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "./data-table"
import { Vehicle, columns } from "./columns"
import { EditVehicleMenu } from "./EditVehicleMenu"
import { X } from "lucide-react"
import { GripHorizontal } from "lucide-react"
import { Toaster, toast } from "sonner"
import EditEquipment from "./EditEquipment"

const companyId = import.meta.env.VITE_COMPANY_ID
const serverURL = import.meta.env.VITE_SERVER_URL

type Fleet = {
	companyId: string
	id: string
	name: string
	vehicles?: Vehicle[]
}

export type FetchedData = {
	fleets: Fleet[]
	vehicles: Vehicle[]
	photoAreas?: PhotoArea[]
}

type PhotoArea = {
	name: string
	companyId: string
	id: string
	position: number
}

function FleetManagement() {
	const [fleetData, setFleetData] = useState<FetchedData>()
	const [isEditingVehicle, setIsEditingVehicle] = useState<boolean>(false)
	const [editingVehicle, setEditingVehicle] = useState<Vehicle>()
	const [isEditingPhotoAreas, setIsEditingPhotoAreas] = useState<boolean>(false)
	const [isEditingFleets, setIsEditingFleets] = useState<boolean>(false)
	const [isPrintingQR, setIsPrintingQR] = useState<boolean>(false)
	const [isEditingEquipment, setIsEditingEquipment] = useState<boolean>(false)
	const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([])
	const [tempPhotoAreas, setTempPhotoAreas] = useState<PhotoArea[]>([])
	const [areasToDelete, setAreasToDelete] = useState<String[]>([])
	const [tempFleets, setTempFleets] = useState<Fleet[]>([])
	const [fleetsToDelete, setFleetsToDelete] = useState<String[]>([])
	const dragArea = useRef<number>(0)
	const draggedOverArea = useRef<number>(0)

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${serverURL}/account/fleet/${companyId}`)
				.then((res) => {
					setFleetData(res.data)
					setTempFleets(res.data.fleets)
					console.log("fleetData", res.data)
				})
				.catch((err) => {
					console.error(err)
				})
			await axios
				.get(`${serverURL}/account/company/photo-areas/${companyId}`)
				.then((res) => {
					setPhotoAreas(res.data)
					setTempPhotoAreas(res.data)
					console.log("photoAreas", res.data)
				})
				.catch((err) => {
					console.error(err)
				})
		}
		fetchData()
	}, [])

	const startEditing = (vehicle: Vehicle) => {
		setIsEditingVehicle(true)
		setEditingVehicle(vehicle)
	}

	const stopEditing = () => {
		setIsEditingVehicle(false)
		setEditingVehicle(undefined)
	}

	const listEditingFleets =
		tempFleets &&
		tempFleets.map((fleet, index) => (
			<div key={fleet.id} className=' flex my-4'>
				<Input
					type='text'
					value={fleet.name}
					onChange={(e) => {
						const newFleet: Fleet = { ...fleet, name: e.target.value }
						setTempFleets((prevData) =>
							prevData.map((prevFleet, currIndex) =>
								currIndex === index ? newFleet : prevFleet
							)
						)
					}}
				/>
				<Button
					className=' mx-4'
					variant={"ghost"}
					onClick={() => {
						handleDeleteFleet(fleet, index)
					}}
				>
					<X />
				</Button>
			</div>
		))

	const listPhotoAreas =
		tempPhotoAreas &&
		tempPhotoAreas.map((currArea, index) => (
			<div
				key={index}
				className=' m-2 py-1 border border-border rounded-lg flex'
				onDragStart={() => (dragArea.current = index)}
				onDragEnter={() => (draggedOverArea.current = index)}
				onDragEnd={handleMovePhotoArea}
				onDragOver={(e) => {
					e.preventDefault
				}}
				draggable
			>
				<GripHorizontal size={36} className=' my-auto mx-2' />
				<Input
					type='text'
					value={currArea.name}
					onChange={(e) => {
						handlePhotoAreaRename(e, index)
					}}
					className='inline-block my-auto'
				/>
				<Button
					className=' inline-block my-auto'
					variant={"ghost"}
					onClick={() => {
						handleDeletePhotoArea(index, currArea)
					}}
				>
					<X className='my-auto' />
				</Button>
			</div>
		))

	const handleDeleteFleet = (currFleet: Fleet, index: number) => {
		if (tempFleets && fleetData) {
			let isEmptyFleet = true
			for (const vehicle of fleetData.vehicles) {
				if (vehicle.Fleet.id == currFleet.id) {
					isEmptyFleet = false
				}
			}
			if (!isEmptyFleet) {
				toast.warning(`Remove all vehicles from ${currFleet.name} first!`)
			} else {
				const newArr = tempFleets.filter((fleet) => fleet.id != currFleet.id)
				setTempFleets(newArr)
				console.log("deleting:", tempFleets[index])
				setFleetsToDelete((prevData) => [...prevData, tempFleets[index].id])
			}
		} else {
			console.error("Failed to delete the selected fleet")
		}
	}

	const handleAddNewFleet = () => {
		if (tempFleets[tempFleets.length - 1].name !== "New Fleet") {
			setTempFleets([
				...tempFleets,
				{ name: "New Fleet", companyId: companyId, id: String(Date.now()) },
			])
		} else {
			console.warn("Please name previous fleet first")
		}
	}

	const handleEditFleetCancel = () => {
		if (fleetData) {
			setTempFleets(fleetData.fleets)
			setFleetsToDelete([])
			setIsEditingFleets(false)
		}
	}

	const handleEditFleetSubmit = async () => {
		await axios
			.post(serverURL + "/account/fleet", {
				tempFleets: tempFleets,
				fleetsToDelete: fleetsToDelete,
				companyId: companyId,
			})
			.then((res) => {
				setTempFleets(res.data),
					console.log(res.data),
					setIsEditingFleets(false)
			})
			.catch((err) => console.error(err))
	}

	function handleMovePhotoArea() {
		const areasClone = [...tempPhotoAreas]
		const draggedArea = areasClone.splice(dragArea.current, 1)[0]
		areasClone.splice(draggedOverArea.current, 0, draggedArea)
		setTempPhotoAreas(areasClone)
	}

	const handlePhotoAreaRename = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const updatedAreas = [...tempPhotoAreas]
		updatedAreas[index].name = e.target.value
		setTempPhotoAreas(updatedAreas)
	}

	const handleDeletePhotoArea = (index: number, currArea: PhotoArea) => {
		const newArr = tempPhotoAreas.filter((area) => area !== currArea)
		console.log("deleting:", tempPhotoAreas[index])
		console.log(newArr)
		setAreasToDelete([...areasToDelete, tempPhotoAreas[index].id])
		setTempPhotoAreas(newArr)
	}

	const handleAddNewPhotoArea = () => {
		if (
			tempPhotoAreas[0] === undefined ||
			tempPhotoAreas[tempPhotoAreas.length - 1].name !== ""
		) {
			setTempPhotoAreas([
				...tempPhotoAreas,
				{
					name: "",
					companyId: companyId,
					id: String(Date.now()),
					position: tempPhotoAreas.length,
				},
			])
		} else {
			console.warn("Please name the previous Photo Area first")
		}
	}

	const handlePhotoAreaCancel = () => {
		setTempPhotoAreas(photoAreas)
		setAreasToDelete([])
		setIsEditingPhotoAreas(false)
	}

	const handlePhotoAreaSubmit = async () => {
		const sortedPhotoAreas = tempPhotoAreas.map((area, index) => ({
			...area,
			position: index,
		}))
		await axios
			.post(serverURL + "/account/company/photo-areas", {
				tempPhotoAreas: sortedPhotoAreas,
				companyId: companyId,
				areasToDelete: areasToDelete,
			})
			.then((res) => {
				setPhotoAreas(res.data),
					console.log(res.data),
					setIsEditingPhotoAreas(false)
			})
			.catch((err) => {
				console.log(err), setIsEditingPhotoAreas(false)
			})
	}

	const handleAddNewVehicle = () => {
		// create a new editing vehicle
		// set is editing to true
		// if cancelled then remove the editing vehicle
		// if saved then add the editing vehicle to the fleetdata.vehicles

		setEditingVehicle({
			license: "",
			name: "",
			vin: "",
			year: null,
			id: "",
			Fleet: {
				name: "",
				id: "",
			},
		})

		setIsEditingVehicle(true)
	}

	const handleDeleteVehicle = async (idToFilter: String) => {
		if (fleetData?.vehicles) {
			const newVehicles = fleetData.vehicles.filter(
				(vehicle) => vehicle.id !== idToFilter
			)
			await axios
				.delete(serverURL + `/account/vehicle/${companyId}/${idToFilter}`)
				.then((res) => {
					console.log(res.data)
					setFleetData({ ...fleetData, vehicles: newVehicles })
				})
				.catch((err) => console.error(err))
		}
	}

	function stopEditingEquipment() {
		setIsEditingEquipment(false)
	}

	const isMobile = window.screen.width < 768

	if (isEditingPhotoAreas) {
		return (
			<div className='Contents flex mx-auto w-3/4 my-8'>
				<div>
					<h2 className=''>Fleet Management</h2>
					<h3 className=' my-3'>Edit Photo Areas</h3>
					<div className='PhotoAreas block'>
						{listPhotoAreas}
						<Button className='block' onClick={handleAddNewPhotoArea}>
							Add A New Area
						</Button>
					</div>
					<div className=' space-x-4 my-4'>
						<Button onClick={handlePhotoAreaCancel}>Cancel</Button>
						<Button onClick={handlePhotoAreaSubmit}>Save</Button>
					</div>
				</div>
			</div>
		)
	} else if (isEditingFleets) {
		return (
			<div className='Contents flex mx-auto w-3/4 my-8'>
				<div>
					<h2 className=''>Fleet Management</h2>
					<h3 className=' mt-2'>Edit Fleets</h3>
					<div>
						{listEditingFleets}
						<div>
							<Button className='p-2' onClick={handleAddNewFleet}>
								Add New Fleet
							</Button>
						</div>
					</div>
					<div className=' space-x-4 my-4'>
						<Button onClick={handleEditFleetCancel} variant={"secondary"}>
							Cancel
						</Button>
						<Button onClick={handleEditFleetSubmit}>Save</Button>
					</div>
					<Toaster />
				</div>
			</div>
		)
	} else if (isPrintingQR) {
		return (
			<div className='Contents flex mx-auto w-3/4 my-8'>
				<QRCodes closePrinting={() => setIsPrintingQR(false)} />
			</div>
		)
	} else if (isEditingEquipment) {
		return (
			<div className='Contents flex mx-auto w-3/4 my-8'>
				<EditEquipment stopEditing={() => stopEditingEquipment()} />
			</div>
		)
	} else if (fleetData) {
		return (
			<div className='Dashboard flex-col flex-1 mx-8 md:w-3/4 md:mx-auto my-8 md:mr-16'>
				<h2 className=''>Fleet Management</h2>
				<div className='Navigation flex flex-wrap justify-between md:space-x-4 md:block md:justify-normal md:flex-nowrap my-4 '>
					<Button
						className=' w-36 mb-4'
						onClick={() => {
							setIsEditingPhotoAreas(true)
						}}
					>
						Edit Photo Areas
					</Button>
					<Button
						className=' w-36  mb-4'
						onClick={() => {
							setIsEditingFleets(true)
						}}
					>
						Edit Fleets
					</Button>
					<Button className=' w-36  mb-4' onClick={handleAddNewVehicle}>
						Add New Vehicle
					</Button>
					<Button
						className=' w-36 mb-4'
						onClick={() => {
							setIsEditingEquipment(true)
						}}
					>
						Edit Equipment
					</Button>
					<Button
						className=' w-36 mb-4'
						onClick={() => {
							setIsPrintingQR(true)
						}}
					>
						Print QR Codes
					</Button>
				</div>
				<div className='Table mb-8'>
					<DataTable
						columns={
							isMobile
								? columns.filter(
										(header) =>
											header.header != "VIN" &&
											header.header != "Year" &&
											header.header != "License"
								  )
								: columns
						}
						data={fleetData.vehicles}
						startEditing={startEditing}
						deleteVehicle={handleDeleteVehicle}
					/>
				</div>
				{isEditingVehicle && editingVehicle && (
					<div className='overlay h-full w-full fixed z-20 top-0 left-0 right-0 bottom-0 bg-black/50'>
						<div className='overlay-contents bg-white w-full md:w-1/4 float-right h-full'>
							<EditVehicleMenu
								vehicle={editingVehicle}
								setVehicle={setEditingVehicle}
								fleetData={fleetData}
								setFleetData={setFleetData}
								stopEditing={stopEditing}
							/>
						</div>
					</div>
				)}
			</div>
		)
	} else {
		return (
			<div className='Dashboard inline-flex flex-col'>
				Loading Dashboard Data
			</div>
		)
	}
}

export default FleetManagement
