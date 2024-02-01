import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Vehicle } from "./columns"

import { LucideMoreVertical } from "lucide-react"

export const VehicleContextMenu = ({
	vehicleRow,
	startEditing,
}: {
	vehicleRow: Vehicle
	startEditing: (vehicle: Vehicle) => void
}) => {
	return (
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
				<DropdownMenuItem
					onClick={() => {
						alert(
							`Are you sure that you want to delete ${vehicleRow.name}? This action can not be reversed.`
						)
					}}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
