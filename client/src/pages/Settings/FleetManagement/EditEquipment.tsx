import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"

const serverURL = import.meta.env.VITE_SERVER_URL
const companyID = import.meta.env.VITE_COMPANY_ID

interface FetchedData {
	name: string
	id: string
	companyId: string
}

function EditEquipment({ stopEditing }: { stopEditing: () => void }) {
	const [fetchedData, setFetchedData] = useState<FetchedData[]>([])
	const [equipmentToDelete, setEquipmentToDelete] = useState<string[]>([])

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${serverURL}/equipment/types/${companyID}`)
				.then((res) => {
					setFetchedData(res.data)
					console.log("equipment:")
					console.log(res.data)
				})
				.catch((err) => {
					console.error(err)
				})
		}
		fetchData()
	}, [])

	const listEquipment =
		fetchedData &&
		fetchedData.map((equipmentType, index) => (
			<div className='flex' key={index}>
				<Input
					className='my-auto'
					value={equipmentType.name}
					onChange={(e) => {
						handleEquipmentRename(e, index)
					}}
				/>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant={"ghost"} className='mx-2'>
							<X />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								equipment type
								{equipmentType.name !== "" && `"${equipmentType.name}"`} and
								remove it's associated data.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => handleEquipmentDelete(index)}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		))

	const addEquipmentType = () => {
		if (
			fetchedData[0] === undefined ||
			fetchedData[fetchedData.length - 1].name !== ""
		) {
			setFetchedData([
				...fetchedData,
				{
					name: "",
					id: String(Date.now()),
					companyId: companyID,
				},
			])
			console.log(fetchedData)
		} else {
			console.warn("Please name the previous Equipment Type first!")
		}
	}

	const handleEquipmentRename = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const updatedEquipmentTypes = [...fetchedData]
		updatedEquipmentTypes[index].name = e.target.value
		setFetchedData(updatedEquipmentTypes)
	}

	const handleEquipmentDelete = (index: number) => {
		setEquipmentToDelete((prevData) => [...prevData, fetchedData[index].id])
		setFetchedData(fetchedData.filter((_, i) => i != index))
	}

	const handleSave = async () => {
		await axios
			.post(`${serverURL}/equipment/types/${companyID}`, {
				updatedEquipment: fetchedData,
				typesToDelete: equipmentToDelete,
			})
			.then((res) => console.log(res.data))
			.catch((err) => console.error(err))
		stopEditing()
	}

	return (
		<div>
			<h2>Edit Equipment</h2>
			<div>{listEquipment}</div>
			<Button className='block' onClick={addEquipmentType}>
				Add Equipment
			</Button>
			<div className=' space-x-3 my-3'>
				<Button onClick={stopEditing} variant={"secondary"}>
					Cancel
				</Button>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</div>
	)
}

export default EditEquipment
