import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as ROUTES from 'data/routes'

function CreateFleet() {

    // https://www.google.com/imgres?imgurl=https%3A%2F%2Fcentral.toasttab.com%2Fservlet%2FrtaImage%3Feid%3Dka24W0000004RQE%26feoid%3D00N3c000006fwBw%26refid%3D0EM4W000006548q&tbnid=fZ3mNf2Yfd8a7M&vet=12ahUKEwji_4eA28uAAxULJN4AHRDkBysQMygBegUIARDQAQ..i&imgrefurl=https%3A%2F%2Fcentral.toasttab.com%2Fs%2Farticle%2FCreating-Menus-Groups-and-Items-in-the-Menu-Builder&docid=dB-Pvq9SzciYOM&w=863&h=352&q=create%20items%20groups%20and%20subgroups&ved=2ahUKEwji_4eA28uAAxULJN4AHRDkBysQMygBegUIARDQAQ

    type Truck = {
        name: string,
        licensePlate: string,
        VinNumber: string
    }

    type Fleet = {
        name: string,
        vehicles: Truck[]
    }

    type FleetsProps = {
        fleets: Fleet[]
    }

    type FleetProps = {
        fleet: Fleet
    }

    type TruckProps = {
        truck: Truck
    }

    // const [showCreateFleet, setShowCreateFleet] = useState(false)
    const [fleets, setFleets] = useState<Fleet[]>([
        {
            name: 'Fleet 1',
            vehicles: [
                { name: 'Truck 1', licensePlate: 'ABC123', VinNumber: '123456' },
                { name: 'Truck 2', licensePlate: 'DEF456', VinNumber: '789012' }
            ]
        },
        {
            name: 'Fleet 2',
            vehicles: [
                { name: 'Truck 3', licensePlate: 'GHI789', VinNumber: '345678' },
                { name: 'Truck 4', licensePlate: 'JKL012', VinNumber: '901234' }
            ]
        }
    ])
    const [currFleet, setCurrFleet] = useState<Fleet>({ name: "", vehicles: [] })
    const [newFleet, setNewFleet] = useState<Fleet>({ name: "New Fleet", vehicles: [] })
    const [newFleetIsActive, setNewFleetIsActice] = useState(false)
    const [newFleetIsSelected, setNewFleetIsSelected] = useState(false)

    const navigate = useNavigate()

    if (newFleetIsSelected && (currFleet != newFleet)) {
        setCurrFleet(newFleet)
    }

    const changeFleet = (fleet: Fleet) => {
        setCurrFleet(fleet)
        if (fleet == newFleet) {
            console.log('now selecting the new fleet')
            setNewFleetIsSelected(true)
        } else {
            setNewFleetIsSelected(false)
        }
    }

    // create a new blank fleet object, setCurrFleet to this object and when saved add it to fleets[]
    function createNewFleet() {
        //if (JSON.stringify(fleets.slice(-1)[0]) != JSON.stringify({ name: "New Fleet", vehicles: [] })) {
        if (newFleetIsActive == false) {
            setCurrFleet(newFleet)
            setNewFleetIsActice(true)
            setNewFleetIsSelected(true)
        }
    }

    const isFleet = (obj: Fleet | Truck): obj is Fleet => {
        return (obj as Fleet).vehicles !== undefined
    }

    const changeName = (currObj: Fleet | Truck, newName: string) => {
        if (isFleet(currObj)) {
            if (currFleet == newFleet) {
                //
                // I need to chang the value of the current fleet but react state is immutable meaning that I am copying the data
                // how do I do this and keep the current fleet value as the new fleet
                const updatedFleet = { ...currObj, name: newName }
                setNewFleet(updatedFleet)
                console.log('changing the name for the new fleet: ' + newName)
            } else {
                // const updatedFleets = fleets.map(fleet =>
                //     fleet === currObj ? { ...fleet, name: newName } : fleet
                // );
                // setFleets(updatedFleets);

                // or???

                // setCurrFleet({ ...currObj, name: newName })
                console.log('changing the name for an existing fleet')
            }
        } else {
            console.log('trying to change truck name')
        }
    }

    const addNewTruck = (fleet: Fleet) => {
        console.log(fleet)
    }

    function createNewTruck() {
        return (
            <>
                <div>
                    <form action="">
                        <div>
                            <p>Truck Name</p>
                            <input type="text" name="truck-name" id="" />
                        </div>
                        <div>
                            <p>Liscense Plate</p>
                            <input type="text" name="liscense-plate" id="" />
                        </div>
                        <div>
                            <p>VIN Number</p>
                            <input type="text" name="vin-number" id="" />
                        </div>
                    </form>
                </div>
                <div id="other-vehicles">

                </div>
                <div id="add-another-vehicle">

                </div>
            </>
        )
    }

    function continueSignup() {
        navigate(ROUTES.PRINT_QR_CODES)
    }

    const Fleets: React.FC<FleetsProps> = ({ fleets }) => {
        return (
            <div className="fleets-list text-left">
                <ul > {/* make this list collapsable  */}
                    {fleets.map((fleet, index) => (
                        <li key={index} onClick={() => { changeFleet(fleet) }} className="fleet mb-4">
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
                    { //if new fleet is an active component show the new fleet
                        <li onClick={() => { changeFleet(newFleet) }}>
                            {newFleetIsActive == true ? <p>{newFleet.name}</p> : <></>}
                        </li>
                    }
                </ul>
            </div>
        )
    }

    const Fleet: React.FC<FleetProps> = ({ fleet }) => {
        if (newFleetIsSelected == true) {
            return (
                <>
                    <form action="" className="pl-12">
                        <h4 className=" text-4xl text-left pb-6 pl-8" >
                            <input type="text" name="name" value={newFleet.name} onChange={(e) => { changeName(fleet, e.target.value) }} />
                        </h4>
                        <p>{newFleet.name}</p>
                        <hr />
                        <div>
                            <h4 className="text-left text-xl my-4">Trucks</h4>
                            <ul>
                                {newFleet.vehicles.map((vehicle, vehicleIndex) => (
                                    <li key={vehicleIndex} className="border-solid border-[1px] mb-4 py-2 flex">
                                        {vehicle.name}
                                    </li>
                                ))}
                                <li>
                                    <div onClick={() => { addNewTruck(newFleet) }} className="border-solid border-[1px] mb-4 py-2 flex justify-center">+ Add Truck</div>
                                </li>
                            </ul>
                        </div>
                    </form>
                </>
            )
        } else {
            return (
                <div className="pl-12">
                    <h3 className="text-left mb-8 text-3xl">{fleet.name}</h3>
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
                {newFleetIsActive && newFleetIsSelected ? <Fleet fleet={newFleet} /> : <Fleet fleet={currFleet} />}
            </div>
            <div className=" basis-full grow w-full">
                <button onClick={continueSignup}>Print QR Codes</button>
            </div>
        </div>
    )
}

export default CreateFleet