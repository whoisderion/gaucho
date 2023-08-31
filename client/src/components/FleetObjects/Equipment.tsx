type Equipment = {
    name: string,
    id: number
}

type EquipmentProps = {
    equipmentTypes: Equipment[],
    addEquipmentType: () => void,
    deleteEquipmentType: (id: number) => void,
    handleEquipmentEdit: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void,
    editEquipmentTypes: () => void,
    isEditingEquipment: boolean
}

const Equipment: React.FC<EquipmentProps> = ({ equipmentTypes, addEquipmentType, deleteEquipmentType, editEquipmentTypes, isEditingEquipment, handleEquipmentEdit }) => {
    if (isEditingEquipment) {
        return (
            <div>
                <h3>Equipment</h3>
                {equipmentTypes.map(equipment => {
                    return (
                        <div className="flex" key={equipment.id}>
                            <input
                                type="text"
                                value={equipment.name}
                                onChange={e => { handleEquipmentEdit(equipment.id, e) }}
                                autoFocus />
                            <button onClick={() => { deleteEquipmentType(equipment.id) }} className=" p-1 m-1">X</button>
                        </div>
                    )
                })}
                <button onClick={editEquipmentTypes}>Finish Editing</button>
                <button onClick={addEquipmentType} className="block">Add New Equipment</button>
            </div >
        )
    } else {
        // not editing equipment
        return (
            <div>
                <h3>Equipment</h3>
                {equipmentTypes.map(equipment => {
                    return (
                        <div className="flex" key={equipment.id}>
                            <p >- {equipment.name}</p>
                        </div>
                    )
                })}
                <button onClick={editEquipmentTypes}>Edit Equipment</button>
                <button onClick={addEquipmentType} className="block">Add New Equipment</button>
            </div >
        )
    }
}

export default Equipment