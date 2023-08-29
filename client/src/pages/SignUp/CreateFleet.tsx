import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as ROUTES from 'data/routes'

function CreateFleet() {

    // https://www.google.com/imgres?imgurl=https%3A%2F%2Fcentral.toasttab.com%2Fservlet%2FrtaImage%3Feid%3Dka24W0000004RQE%26feoid%3D00N3c000006fwBw%26refid%3D0EM4W000006548q&tbnid=fZ3mNf2Yfd8a7M&vet=12ahUKEwji_4eA28uAAxULJN4AHRDkBysQMygBegUIARDQAQ..i&imgrefurl=https%3A%2F%2Fcentral.toasttab.com%2Fs%2Farticle%2FCreating-Menus-Groups-and-Items-in-the-Menu-Builder&docid=dB-Pvq9SzciYOM&w=863&h=352&q=create%20items%20groups%20and%20subgroups&ved=2ahUKEwji_4eA28uAAxULJN4AHRDkBysQMygBegUIARDQAQ
    // https://react.dev/learn/keeping-components-pure
    // https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state

    type Truck = {
        name: string,
        licensePlate: string,
        VinNumber: string
    }

    type Fleet = {
        name: string,
        vehicles: Truck[]
        id: number
    }

    type FleetsProps = {
        fleets: Fleet[]
    }

    type FleetProps = {
        fleet: Fleet
    }

    // const [showCreateFleet, setShowCreateFleet] = useState(false)
    const [fleets, setFleets] = useState<Fleet[]>([
        {
            name: 'Fleet 1',
            vehicles: [
                // { name: 'Truck 1', licensePlate: 'ABC123', VinNumber: '123456' },
                // { name: 'Truck 2', licensePlate: 'DEF456', VinNumber: '789012' }
            ],
            id: 1
        },
        // {
        //     name: 'Fleet 2',
        //     vehicles: [
        //         { name: 'Truck 3', licensePlate: 'GHI789', VinNumber: '345678' },
        //         { name: 'Truck 4', licensePlate: 'JKL012', VinNumber: '901234' }
        //     ],
        //     id: 2
        // }
    ])
    const [currFleet, setCurrFleet] = useState<number>(1)
    const lastFleet = fleets.reduce(function (prev, curr) {
        return (prev.id > curr.id) ? prev : curr
    })

    const navigate = useNavigate()

    const selectFleet = (fleet: Fleet) => {
        setCurrFleet(fleet.id)
    }

    const selectedFleet = fleets.find((fleet) =>
        fleet.id === currFleet
    )

    function createNewFleet() {
        setCurrFleet(lastFleet.id + 1)
        setFleets([...fleets, { name: `Fleet ${lastFleet.id + 1}`, vehicles: [], id: (lastFleet.id + 1) }])
    }

    function handleNameChange(id: number, e: React.ChangeEvent<HTMLInputElement>) {
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

    function continueSignup() {
        navigate(ROUTES.PRINT_QR_CODES)
    }

    const Fleets: React.FC<FleetsProps> = ({ fleets }) => {
        return (
            <div className="fleets-list text-left">
                <ul >
                    {fleets.map((fleet) => (
                        <li key={fleet.id} onClick={() => { selectFleet(fleet) }} className="fleet mb-4">
                            <h3 className="fleet-name">{fleet.name}</h3>
                            <ul className="pl-6">
                                {fleet.vehicles.map((vehicle, vehicleIndex) => (
                                    <li key={vehicleIndex}>
                                        <p>- {vehicle.name}</p>
                                    </li>
                                    // add a list item for adding a new truck
                                    // when clicked, set the selected fleet as the currFleet
                                    // and open the new truck modal
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    const Fleet: React.FC<FleetProps> = ({ fleet }) => {
        return (
            <div className="pl-12">
                <h3 className="text-left mb-8 text-3xl">
                    {/* TODO: find an alternative solution to autoFocus */}
                    <input
                        type="text"
                        name="name"
                        value={fleet.name}
                        key={fleet.id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleNameChange(fleet.id, e) }}
                        autoFocus />
                </h3>
                <button onClick={e => { deleteFleet(currFleet) }}>Delete {fleet.name}</button>
                <hr />
                <h4 className="text-left text-xl my-4">Trucks</h4>
                <ul>
                    {fleet.vehicles.map((vehicle, vehicleIndex) => (
                        <li key={vehicleIndex} className="border-solid border-[1px] mb-4 py-2 flex">
                            <div className=" flex-auto flex-grow-[5]">
                                <h5 className="text-xl">{vehicle.name}</h5>
                            </div>
                            <div className="text-left flex-grow grid grid-rows-2 grid-cols-2">
                                <p>Liscense Plate: </p><p>{vehicle.licensePlate}</p>
                                <p>VIN Number: </p><p>{vehicle.VinNumber}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap">
            <div id="fleet-menu" className="w-[20%]">
                <h1>Fleets</h1>
                <button onClick={createNewFleet}>+ Create Fleet</button>
                <hr className="my-2" />
                <Fleets fleets={fleets} />
            </div>
            <div id="current-fleet" className="flex-auto">
                {selectedFleet ? <Fleet fleet={selectedFleet} key={currFleet} /> : <></>}
            </div>
            <div className=" basis-full grow w-full text-center">
                <button onClick={continueSignup}>Print QR Codes</button>
            </div>
        </div>
    )
}

export default CreateFleet