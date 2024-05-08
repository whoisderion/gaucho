import {
	CellContext,
	ColumnDef,
	createColumnHelper,
} from "@tanstack/react-table"
import { VehicleContextMenu } from "./ContextMenu"

export type Vehicle = {
	license: string
	name: string
	vin: string
	year: number | null
	id: string
	Fleet: {
		name: string
		id: string
	}
}
interface CellContextWithStartEditing<TData, TValue>
	extends CellContext<TData, TValue> {
	startEditing: (vehicle: Vehicle) => void
	deleteVehicle: (idToFilter: string) => void
}

const columnHelper = createColumnHelper<Vehicle>()

export const columns: ColumnDef<Vehicle>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "license",
		header: "License",
	},
	{
		accessorKey: "vin",
		header: "VIN",
	},
	{
		accessorKey: "year",
		header: "Year",
	},
	{
		accessorKey: "Fleet.name",
		header: "Fleet",
	},
	columnHelper.display({
		id: "context-menu",
		cell: ({ row, ...otherProps }: CellContext<Vehicle, unknown>) => {
			const contextWithStartEditing = otherProps as CellContextWithStartEditing<
				Vehicle,
				unknown
			>

			const vehicleRow = row.original
			return (
				<VehicleContextMenu
					vehicleRow={vehicleRow}
					startEditing={contextWithStartEditing.startEditing}
					deleteVehicle={contextWithStartEditing.deleteVehicle}
				/>
			)
		},
	}),
]
