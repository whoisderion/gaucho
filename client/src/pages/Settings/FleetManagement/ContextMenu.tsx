import { Vehicle } from "./columns"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LucideMoreVertical } from "lucide-react"
import { useState } from "react"

export const VehicleContextMenu = ({
	vehicleRow,
	startEditing,
	deleteVehicle,
}: {
	vehicleRow: Vehicle
	startEditing: (vehicle: Vehicle) => void
	deleteVehicle: (idToFilter: string) => void
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	function cancelDelete() {
		console.log("cancelled")
		console.log(vehicleRow.id)
		setIsOpen(false)
	}
	function handleDeleteVehicle() {
		console.log("deleted")
		setIsOpen(false)
		deleteVehicle(vehicleRow.id)
	}

	return (
		<>
			<DropdownMenu key={vehicleRow.id}>
				<DropdownMenuTrigger className='px-3 py-2'>
					<LucideMoreVertical />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							startEditing(vehicleRow)
						}}
					>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsOpen(true)}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={isOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							vehicle and its data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteVehicle}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
