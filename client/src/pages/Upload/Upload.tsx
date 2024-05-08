import axios from "axios"
import { ChangeEvent, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const serverURL = import.meta.env.VITE_SERVER_URL
const companyId = import.meta.env.VITE_COMPANY_ID

const handleInputChange = (
	e: React.ChangeEvent<HTMLElement>,
	setFormData: React.Dispatch<React.SetStateAction<uploadFormData>>,
	section: keyof uploadFormData
) => {
	const { name, value, type } = e.target as HTMLInputElement
	const isEquipment = section === "equipment"
	setFormData((previousFormData: uploadFormData) => ({
		...previousFormData,
		[section]: {
			...previousFormData[section],
			...(isEquipment
				? {
						[name]: {
							...previousFormData[section][name],
							quantity: Number(value),
						},
				  }
				: {
						[name]:
							type === "checkbox"
								? (e.target as HTMLInputElement).checked
								: value,
				  }),
		},
	}))
}

const handleSubmit = async (e: React.FormEvent, formData: uploadFormData) => {
	e.preventDefault()
	const pathArray = window.location.pathname.split("/")
	const truckID = pathArray[pathArray.length - 1]

	const removedEmptyPhotos = formData.pictures.filter(
		(photo) => photo.previewSource !== ""
	)
	const dataToUpload = { ...formData, pictures: removedEmptyPhotos }
	console.log(dataToUpload)

	const uploadUpdate = await axios
		.post(`${import.meta.env.VITE_SERVER_URL}/upload/complete`, {
			formData: dataToUpload,
			truckID: truckID,
			companyID: import.meta.env.VITE_COMPANY_ID,
		})
		.then((res) => {
			console.log(res.data)
			alert("The upload was a success! Please close this window.")
			console.log("close")
		})
		.catch((err) => {
			console.log(err)
		})

	return uploadUpdate
}

const handleFileInputChange = (
	e: ChangeEvent<HTMLInputElement>,
	area: PhotoArea,
	setFormData: React.Dispatch<React.SetStateAction<uploadFormData>>,
	index: number
) => {
	if (e.target.files) {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () => {
			setFormData((prevFormData) => {
				const updatedPictures = [...prevFormData.pictures]
				updatedPictures[index] = {
					photoArea: area,
					previewSource: reader.result as string,
				}
				return { ...prevFormData, pictures: updatedPictures }
			})
		}
	}
}

function UploadMaintenace({
	setUploadingMaintenance,
	setUploadingInventory,
	formData,
	setFormData,
	vehicleName,
}: {
	setUploadingMaintenance: React.Dispatch<React.SetStateAction<boolean>>
	setUploadingInventory: React.Dispatch<React.SetStateAction<boolean>>
	formData: uploadFormData
	setFormData: React.Dispatch<React.SetStateAction<uploadFormData>>
	vehicleName: string
}) {
	return (
		<div className='Contents overflow-scroll bg-secondary '>
			<div className=' max-w-lg border mx-auto px-20 py-7 text-center mt-4 mb-6 bg-white'>
				<h3 className=' min-h-[2rem]'>{vehicleName}</h3>
				<h2>Upload Maintenance</h2>
				<div className=' text-left mb-8 '>
					<form className='maintenance flex flex-col space-y-2'>
						<div className='mileage mx-auto w-full max-w-2xl mt-4'>
							<Label htmlFor='mileage'>Mileage</Label>
							<Input
								type='number'
								// InputMode="numeric"
								// pattern="[0-9]+"
								name='mileage'
								value={formData.maintenance.mileage || ""}
								onChange={(e) =>
									handleInputChange(e, setFormData, "maintenance")
								}
								autoComplete='off'
							/>
						</div>
						<div className='oil mx-auto w-full max-w-2xl'>
							<Label htmlFor='oil'>Oil</Label>
							<Input
								type='text'
								name='oil'
								value={formData.maintenance.oil || ""}
								onChange={(e) =>
									handleInputChange(e, setFormData, "maintenance")
								}
								autoComplete='off'
							/>
						</div>
						<div className='coolant mx-auto w-full max-w-2xl'>
							<Label htmlFor='coolant'>Coolant</Label>
							<Input
								type='text'
								name='coolant'
								value={formData.maintenance.coolant || ""}
								onChange={(e) =>
									handleInputChange(e, setFormData, "maintenance")
								}
								autoComplete='off'
							/>
						</div>
						<div className='tire-tread mx-auto w-full max-w-2xl grid grid-cols-2'>
							<div>
								<Label
									htmlFor='rearPassengerTread'
									className=' mx-auto text-center block w-full mt-4 mb-2'
								>
									Front Driver Tread
								</Label>
								<Input
									type='checkbox'
									name='frontDriverTread'
									checked={formData.maintenance.frontDriverTread || false}
									onChange={(e) =>
										handleInputChange(e, setFormData, "maintenance")
									}
								/>
							</div>
							<div>
								<Label
									htmlFor='frontPassengerTread'
									className=' mx-auto text-center block w-full mt-4 mb-2'
								>
									Front Passenger Tread
								</Label>
								<Input
									type='checkbox'
									name='frontPassengerTread'
									checked={formData.maintenance.frontPassengerTread || false}
									onChange={(e) =>
										handleInputChange(e, setFormData, "maintenance")
									}
								/>
							</div>
							<div>
								<Label
									htmlFor='rearDriverTread'
									className=' mx-auto text-center block w-full mt-4 mb-2'
								>
									Rear Driver Tread
								</Label>
								<Input
									type='checkbox'
									name='rearDriverTread'
									checked={formData.maintenance.rearDriverTread || false}
									onChange={(e) =>
										handleInputChange(e, setFormData, "maintenance")
									}
								/>
							</div>
							<div>
								<Label
									htmlFor='rearPassengerTread'
									className=' mx-auto text-center block w-full mt-4 mb-2'
								>
									Rear Passenger Tread
								</Label>
								<Input
									type='checkbox'
									name='rearPassengerTread'
									checked={formData.maintenance.rearPassengerTread || false}
									onChange={(e) =>
										handleInputChange(e, setFormData, "maintenance")
									}
								/>
							</div>
						</div>
						<div className='notes mx-auto w-full max-w-2xl'>
							<Label htmlFor='notes'>Notes</Label>
							<Textarea
								name='notes'
								value={formData.maintenance.notes || ""}
								onChange={(e) =>
									handleInputChange(e, setFormData, "maintenance")
								}
							/>
						</div>
					</form>
				</div>
				<Button
					onClick={() => {
						setUploadingInventory(true)
						setUploadingMaintenance(false)
					}}
				>
					Continue
				</Button>
			</div>
		</div>
	)
}

function UploadInventory({
	formData,
	setFormData,
	equipmentFields,
	setUploadingMaintenance,
	setUploadingInventory,
	setUploadingPictures,
	vehicleName,
}: {
	formData: any
	setFormData: React.Dispatch<React.SetStateAction<any>>
	equipmentFields: any
	setUploadingMaintenance: React.Dispatch<React.SetStateAction<boolean>>
	setUploadingInventory: React.Dispatch<React.SetStateAction<boolean>>
	setUploadingPictures: React.Dispatch<React.SetStateAction<boolean>>
	vehicleName: string
}) {
	handleSubmit
	return (
		<div className='Contents'>
			<div className=' max-w-lg border mx-auto px-20 py-7 text-center '>
				<h3 className=' min-h-[2rem]'>{vehicleName}</h3>
				<h2>Upload Inventory</h2>
				<div className=' text-left mb-8'>
					<form className=' flex flex-col space-y-2'>
						{equipmentFields.map(
							(equipment: { name: string; id: string }, index: string) => {
								return (
									<div key={index} className='mx-auto '>
										<Label htmlFor={equipment.name}>{equipment.name}</Label>
										<Input
											type='text'
											inputMode='numeric'
											pattern='[0-9]+'
											name={equipment.name}
											value={formData.equipment[equipment.name].quantity || ""}
											onChange={(e) =>
												handleInputChange(e, setFormData, "equipment")
											}
											autoComplete='off'
										/>
									</div>
								)
							}
						)}
					</form>
				</div>
				<div className=' space-x-6'>
					<Button
						onClick={() => {
							setUploadingMaintenance(true)
							setUploadingInventory(false)
						}}
					>
						Back
					</Button>
					<Button
						onClick={() => {
							setUploadingPictures(true)
							setUploadingInventory(false)
						}}
					>
						Continue
					</Button>
				</div>
			</div>
		</div>
	)
}

function UploadPictures({
	formData,
	setFormData,
	setUploadingInventory,
	setUploadingPictures,
	photoAreas,
	vehicleName,
}: {
	formData: uploadFormData
	setFormData: React.Dispatch<React.SetStateAction<uploadFormData>>
	setUploadingInventory: React.Dispatch<React.SetStateAction<boolean>>
	setUploadingPictures: React.Dispatch<React.SetStateAction<boolean>>
	photoAreas: PhotoArea[]
	vehicleName: string
}) {
	const displayPhotoAreas = photoAreas.map((area: PhotoArea, index: number) => (
		<div key={index} className='border border-black my-2 p-2'>
			<p>{area.name}</p>
			<p>{}</p>
			<Input
				type='file'
				name='photo1'
				id=''
				accept='image/*'
				onChange={(e) => {
					handleFileInputChange(e, area, setFormData, index)
				}}
			/>
			<div className='mt-6'>
				<p>Preview</p>
				<img src={formData.pictures[index].previewSource} alt='' />
			</div>
		</div>
	))

	return (
		<div className='Contents overflow-auto bg-secondary'>
			<div className=' max-w-lg border mx-auto px-20 py-7 text-center '>
				<h3 className=' min-h-[2rem]'>{vehicleName}</h3>
				<h2>Upload Pictures</h2>
				<div>{displayPhotoAreas}</div>
				<div className=' space-x-6'>
					<Button
						onClick={() => {
							setUploadingInventory(true)
							setUploadingPictures(false)
						}}
					>
						Back
					</Button>
					<Button
						onClick={(e) => {
							handleSubmit(e, formData)
						}}
					>
						Submit
					</Button>
				</div>
			</div>
		</div>
	)
}

type uploadFormData = {
	maintenance: {
		mileage?: number
		oil?: string
		coolant?: string
		frontDriverTread?: boolean
		frontPassengerTread?: boolean
		rearDriverTread?: boolean
		rearPassengerTread?: boolean
		notes?: string
	}
	equipment: { [key: string]: { id: string; quantity: number } }
	pictures: {
		photoArea: PhotoArea
		previewSource: string
	}[]
}

const initialFormData: uploadFormData = {
	maintenance: {
		mileage: 0,
		oil: "",
		coolant: "",
		frontDriverTread: false,
		frontPassengerTread: false,
		rearDriverTread: false,
		rearPassengerTread: false,
		notes: "",
	},
	equipment: {},
	pictures: [],
}

type PhotoArea = {
	id: string
	name: string
	companyID: string
	position: number
}

type EquipmentType = {
	id: string
	name: string
}

function Upload() {
	const [uploadingMaintenance, setUploadingMaintenance] = useState(true)
	const [uploadingInventory, setUploadingInventory] = useState(false)
	const [uploadingPictures, setUploadingPictures] = useState(false)
	const [equipmentFields, setEquipmentFields] = useState<any>([])
	const [formData, setFormData] = useState<uploadFormData>(initialFormData)
	const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([])
	const [vehicleName, setVehicleName] = useState<string>("")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const equipmentFields = await axios.get(
					`${serverURL}/upload/equipment-fields/${companyId}`
				)
				const newEquipmentFields: EquipmentType[] =
					equipmentFields.data.equipmentFields.map(
						(equipmentType: EquipmentType) => ({
							name: equipmentType.name,
							id: equipmentType.id,
						})
					)
				setEquipmentFields(newEquipmentFields)
				const newEquipmentObj = newEquipmentFields.reduce(
					(acc: { [key: string]: { id: string; quantity: number } }, obj) => {
						acc[obj.name] = {
							id: obj.id,
							quantity: 0,
						}
						return acc
					},
					{}
				)
				setFormData((prevFormData) => ({
					...prevFormData,
					equipment: newEquipmentObj,
				}))
				await axios
					.get(`${serverURL}/account/company/photo-areas/${companyId}`)
					.then((res: any) => {
						setPhotoAreas(res.data)
						const picturesData = res.data.map((area: PhotoArea) => ({
							photoArea: area,
							previewSource: "",
						}))
						setFormData((prevFormData) => ({
							...prevFormData,
							pictures: picturesData,
						}))
					})

				const truckID = window.location.pathname.split("/").pop()
				await axios
					.get(`${serverURL}/vehicle-name/${companyId}/${truckID}`)
					.then((res) => setVehicleName(res.data.name))
					.catch((err) => console.error(err))
			} catch (err) {
				console.error(err)
			}
		}
		fetchData()
	}, [])

	if (uploadingMaintenance) {
		return (
			<UploadMaintenace
				setUploadingMaintenance={setUploadingMaintenance}
				setUploadingInventory={setUploadingInventory}
				formData={formData}
				setFormData={setFormData}
				vehicleName={vehicleName}
			/>
		)
	} else if (uploadingInventory) {
		return (
			<UploadInventory
				equipmentFields={equipmentFields}
				setUploadingMaintenance={setUploadingMaintenance}
				setUploadingInventory={setUploadingInventory}
				setUploadingPictures={setUploadingPictures}
				formData={formData}
				setFormData={setFormData}
				vehicleName={vehicleName}
			/>
		)
	} else if (uploadingPictures) {
		return (
			<UploadPictures
				setUploadingInventory={setUploadingInventory}
				setUploadingPictures={setUploadingPictures}
				formData={formData}
				setFormData={setFormData}
				photoAreas={photoAreas}
				vehicleName={vehicleName}
			/>
		)
	}
}

export default Upload
