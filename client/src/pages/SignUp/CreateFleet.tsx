import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as ROUTES from 'data/routes'
import { Fleet, Fleets } from 'components/FleetObjects'

type Truck = {
    name: string,
    licensePlate: string,
    VinNumber: string,
    id: number
}

type fleet = {
    name: string,
    vehicles: Truck[]
    id: number
}

function CreateFleet() {

    // https://www.google.com/imgres?imgurl=https%3A%2F%2Fcentral.toasttab.com%2Fservlet%2FrtaImage%3Feid%3Dka24W0000004RQE%26feoid%3D00N3c000006fwBw%26refid%3D0EM4W000006548q&tbnid=fZ3mNf2Yfd8a7M&vet=12ahUKEwji_4eA28uAAxULJN4AHRDkBysQMygBegUIARDQAQ..i&imgrefurl=https%3A%2F%2Fcentral.toasttab.com%2Fs%2Farticle%2FCreating-Menus-Groups-and-Items-in-the-Menu-Builder&docid=dB-Pvq9SzciYOM&w=863&h=352&q=create%20items%20groups%20and%20subgroups&ved=2ahUKEwji_4eA28uAAxULJN4AHRDkBysQMygBegUIARDQAQ
    // https://react.dev/learn/keeping-components-pure
    // https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state

    const [fleets, setFleets] = useState<fleet[]>([
        {
            name: 'Fleet 1',
            vehicles: [
                { name: 'Vehicle 1', licensePlate: 'ABC123', VinNumber: '123456', id: 1 },
                { name: 'Vehicle 2', licensePlate: 'DEF456', VinNumber: '789012', id: 2 }
            ],
            id: 1
        },
        // {
        //     name: 'Fleet 2',
        //     vehicles: [
        //         { name: 'Vehicle 3', licensePlate: 'GHI789', VinNumber: '345678' },
        //         { name: 'Vehicle 4', licensePlate: 'JKL012', VinNumber: '901234' }
        //     ],
        //     id: 2
        // }
    ])
    const [currFleet, setCurrFleet] = useState<number>(1)
    const lastFleet = fleets.reduce(function (prev, curr) {
        return (prev.id > curr.id) ? prev : curr
    })
    const navigate = useNavigate()

    const selectFleet = (fleet: fleet) => {
        setCurrFleet(fleet.id)
    }

    const selectedFleet = fleets.find((fleet) =>
        fleet.id === currFleet
    )

    function createNewFleet() {
        setCurrFleet(lastFleet.id + 1)
        setFleets([...fleets, { name: `Fleet ${lastFleet.id + 1}`, vehicles: [], id: (lastFleet.id + 1) }])
    }

    function handleFleetNameChange(id: number, e: React.ChangeEvent<HTMLInputElement>) {
        setFleets(fleets.map(fleet => {
            if (fleet.id == id) {
                return {
                    ...fleet,
                    name: e.target.value
                }
            } else {
                return fleet
            }
        }))
    }

    function deleteFleet(id: number) {
        if (fleets.length != 1) {
            setFleets(fleets.filter((fleet) => fleet.id != id))
        } else {
            alert("Error: You can't delete the last fleet!")
        }
    }

    // https://react.dev/learn/choosing-the-state-structure#avoid-deeply-nested-state
    // I may have to change how data is structured in state

    function createNewVehicle(fleetId: number) {
        const oldFleet = fleets.find(fleet => fleet.id === fleetId)
        if (oldFleet?.vehicles.length === 0) {
            const newFleet = [...oldFleet!.vehicles, { name: "New Vehicle", licensePlate: "", VinNumber: "", id: 1 }]
            if (oldFleet) {
                setFleets(fleets.map((fleet) => {
                    if (fleet.id === fleetId) {
                        return {
                            ...oldFleet,
                            vehicles: newFleet
                        }
                    } else {
                        return fleet
                    }
                }))
            }
        } else {
            const lastVehicle = oldFleet!.vehicles[oldFleet!.vehicles.length - 1]
            // TODO: gray out the add vehicle button if the last vehicle has default values
            if (lastVehicle.name != "New Vehicle") {
                const newFleet = [...oldFleet!.vehicles, { name: "New Vehicle", licensePlate: "", VinNumber: "", id: (lastVehicle.id + 1) }]
                if (oldFleet) {
                    setFleets(fleets.map((fleet) => {
                        if (fleet.id === fleetId) {
                            return {
                                ...oldFleet,
                                vehicles: newFleet
                            }
                        } else {
                            return fleet
                        }
                    }))
                }
            }
        }
    }

    function deleteVehicle(vehicleId: number, fleetId: number) {
        const oldFleet = fleets.find(fleet => fleet.id === fleetId)
        const newFleet = oldFleet!.vehicles.filter((vehicle) => {
            return vehicle.id != vehicleId
        })
        if (newFleet) {
            setFleets(fleets.map((fleet) => {
                if (fleet.id === fleetId) {
                    return {
                        ...fleet,
                        vehicles: newFleet
                    }
                } else {
                    return fleet
                }
            }))
        }
    }

    function continueSignup() {
        navigate(ROUTES.PRINT_QR_CODES)
    }

    return (
        <div className="flex flex-wrap">
            <div id="fleet-menu" className="w-[20%]">
                <h1>Fleets</h1>
                <button onClick={createNewFleet}>+ Create Fleet</button>
                <hr className="my-2" />
                <Fleets fleets={fleets} selectFleet={selectFleet} />
            </div>
            <div id="current-fleet" className="flex-auto">
                {selectedFleet &&
                    <Fleet fleet={selectedFleet}
                        key={currFleet}
                        currFleet={currFleet}
                        handleFleetNameChange={handleFleetNameChange}
                        deleteFleet={deleteFleet}
                        deleteVehicle={deleteVehicle}
                        createNewVehicle={createNewVehicle} />}
            </div>
            <div className=" basis-full grow w-full text-center mt-12">
                <button onClick={continueSignup}>Print QR Codes</button>
            </div>
        </div>
    )
}

export default CreateFleet