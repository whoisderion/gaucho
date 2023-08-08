import { useState } from "react"

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
    };

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

    const changeFleet = (fleet: Fleet) => {
        setCurrFleet(fleet)
    }

    // function createNewTruck() {
    //     return (
    //         <>
    //             <div>
    //                 <form action="">
    //                     <div>
    //                         <p>Truck Name</p>
    //                         <input type="text" name="truck-name" id="" />
    //                     </div>
    //                     <div>
    //                         <p>Liscense Plate</p>
    //                         <input type="text" name="liscense-plate" id="" />
    //                     </div>
    //                     <div>
    //                         <p>VIN Number</p>
    //                         <input type="text" name="vin-number" id="" />
    //                     </div>
    //                 </form>
    //             </div>
    //             <div id="other-vehicles">

    //             </div>
    //             <div id="add-another-vehicle">

    //             </div>
    //         </>
    //     )
    // }


    // create a new blank fleet object, setCurrFleet to this object and when saved add it to fleets[]
    function createNewFleet() {
        if (JSON.stringify(fleets.slice(-1)[0]) != JSON.stringify({ name: "New Fleet", vehicles: [] })) {
            console.log(typeof (fleets.slice(-1)[0]))
            console.log(typeof ({ name: "New Fleet", vehicles: [] }))
            setFleets([...fleets, newFleet])
        }
        setCurrFleet(newFleet)
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
                </ul>
            </div>
        )
    }

    const Fleet: React.FC<FleetProps> = ({ fleet }) => {
        if (currFleet == newFleet) {
            return (
                <>
                    <form action="">
                        <h4>
                            <input type="text" name="fleet-name" id="" defaultValue="Fleet Name" />
                        </h4>
                        <hr />
                        <div>
                            <div>
                                <h5>Trucks</h5>
                            </div>
                            <div>

                            </div>
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
                                    <p >Liscense Plate: </p><p>{vehicle.licensePlate}</p>
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
        <div className="flex">
            <div id="fleet-menu" className="w-[20%]">
                <h1>Fleets</h1>
                <button onClick={createNewFleet}>+ Create Fleet</button>
                <hr className="my-2" />
                <Fleets fleets={fleets} />
            </div>
            <div id="current-fleet" className="flex-auto">
                <Fleet fleet={currFleet} />
            </div>
        </div>
    )
}

export default CreateFleet