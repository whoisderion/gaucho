import { useNavigate } from "react-router-dom"
import * as ROUTES from 'data/routes'
import { useEffect, useState } from "react"
import { Equipment, Fleet, Fleets } from "components/FleetObjects"

type Vehicle = {
    name: string,
    licensePlate: string,
    vinNumber: string
    id: number
}

type fleet = {
    name: string,
    vehicles: Vehicle[]
    id: number
}

function CreateInventory() {
    useEffect(() => {
        const fleetsData = sessionStorage.getItem("fleetsData")
        if (fleetsData) {
            let parsedData = JSON.parse(fleetsData)["fleets"]
            setFleets(parsedData)
        }
    }, [])

    const [fleets, setFleets] = useState<fleet[]>([
        // dummy data
        {
            name: 'Fleet 1',
            vehicles: [
                { name: 'Vehicle 1', licensePlate: 'ABC123', vinNumber: '123456', id: 1 },
                { name: 'Vehicle 2', licensePlate: 'DEF456', vinNumber: '789012', id: 2 }
            ],
            id: 1
        },
        {
            name: 'Fleet 2',
            vehicles: [
                { name: 'Vehicle 3', licensePlate: 'GHI789', vinNumber: '345678', id: 1 },
                { name: 'Vehicle 4', licensePlate: 'JKL012', vinNumber: '901234', id: 2 }
            ],
            id: 2
        }
    ])
    const [currFleet, setCurrFleet] = useState(1)
    const [equipmentTypes, setEquipmentTypes] = useState<Equipment[]>([{ name: "2 Wheeler", id: 1 }, { name: "Blankets", id: 2 }])
    const [isEditingEquipment, setIsEditingEquipment] = useState(false)
    const navigate = useNavigate()

    const selectFleet = (fleet: fleet) => {
        setCurrFleet(fleet.id)
    }

    const selectedFleet = fleets.find((fleet) =>
        fleet.id === currFleet
    )

    const lastEqupment = equipmentTypes.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr)

    function addEquipmentType() {
        setEquipmentTypes([...equipmentTypes, { name: `New Equipment ${lastEqupment.id + 1}`, id: (lastEqupment.id + 1) }])
    }

    function deleteEquipmentType(equipmentID: number) {
        setEquipmentTypes(equipmentTypes.filter((equipment) => equipment.id != equipmentID))
        // add a confirmation for deleting equipment types
    }

    function editEquipmentTypes() {
        setIsEditingEquipment(!isEditingEquipment)
    }

    function handleEquipmentEdit(id: number, e: React.ChangeEvent<HTMLInputElement>) {
        setEquipmentTypes(equipmentTypes.map((equipment) => {
            if (equipment.id === id) {
                return { ...equipment, name: e.target.value }
            } else {
                return equipment
            }
        }))
    }

    function continueSignup() {
        navigate(ROUTES.PRINT_QR_CODES)
    }

    if (selectedFleet) {
        return (
            <>
                <div>
                    <h3 className=" text-4xl mb8">Create Inventory</h3>
                    <div className=" flex">
                        <div className="flex">
                            <Fleets fleets={fleets} selectFleet={selectFleet} />
                            <Equipment
                                equipmentTypes={equipmentTypes}
                                addEquipmentType={addEquipmentType}
                                deleteEquipmentType={deleteEquipmentType}
                                editEquipmentTypes={editEquipmentTypes}
                                isEditingEquipment={isEditingEquipment}
                                handleEquipmentEdit={handleEquipmentEdit} />
                        </div>
                        <Fleet fleet={selectedFleet} currFleet={currFleet} />
                    </div>
                </div>
                <button onClick={continueSignup}>Complete</button>
            </>
        )
    }
}

export default CreateInventory