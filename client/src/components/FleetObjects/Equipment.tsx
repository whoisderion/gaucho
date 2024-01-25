import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Equipment = {
	name: string
	id: number
}

type EquipmentProps = {
	equipmentTypes: Equipment[]
	addEquipmentType: () => void
	deleteEquipmentType: (id: number) => void
	handleEquipmentEdit: (
		id: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => void
	editEquipmentTypes: () => void
	isEditingEquipment: boolean
}

const Equipment: React.FC<EquipmentProps> = ({
	equipmentTypes,
	addEquipmentType,
	deleteEquipmentType,
	editEquipmentTypes,
	isEditingEquipment,
	handleEquipmentEdit,
}) => {
	if (isEditingEquipment) {
		return (
			<div>
				<h2>Equipment</h2>
				{equipmentTypes.map((equipment) => {
					return (
						<div className='flex py-1' key={equipment.id}>
							<Input
								type='text'
								value={equipment.name}
								onChange={(e) => {
									handleEquipmentEdit(equipment.id, e)
								}}
							/>
							<Button
								onClick={() => {
									deleteEquipmentType(equipment.id)
								}}
								// className=' p-1 m-1'
								variant={"ghost"}
								className=' hover:bg-destructive hover:opacity-90'
							>
								X
							</Button>
						</div>
					)
				})}
				<Button
					onClick={addEquipmentType}
					className='block my-2'
					variant='outline'
				>
					Add New Equipment
				</Button>
				<Button onClick={editEquipmentTypes} className='block my-2'>
					Finish Editing
				</Button>
			</div>
		)
	} else {
		// not editing equipment
		return (
			<div>
				<h2>Equipment</h2>
				{equipmentTypes.map((equipment) => {
					return (
						<div className='flex pl-6 ' key={equipment.id} draggable>
							<p className='py-3'>- {equipment.name}</p>
						</div>
					)
				})}
				<Button onClick={editEquipmentTypes}>Edit Equipment</Button>
			</div>
		)
	}
}

export default Equipment
