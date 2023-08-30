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

type FleetProps = {
    fleet: fleet,
    currFleet: number
    handleFleetNameChange: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    deleteFleet: (id: number) => void;
    deleteVehicle: (vehicleId: number, fleetId: number) => void;
    createNewVehicle: (fleetId: number) => void;
    handleVehicleChange: (id: number, fleetId: number, e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}


const Fleet: React.FC<FleetProps> = ({ fleet, currFleet, handleFleetNameChange, deleteFleet, deleteVehicle, createNewVehicle, handleVehicleChange }) => {
    return (
        <div className="pl-12">
            <h3 className="text-left mb-8 text-3xl">
                {/* TODO: find an alternative solution to autoFocus */}
                <input
                    type="text"
                    name="name"
                    value={fleet.name}
                    key={fleet.id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleFleetNameChange(fleet.id, e) }}
                    autoFocus />
            </h3>
            <button onClick={e => { deleteFleet(currFleet) }}>Delete {fleet.name}</button>
            <hr />
            <h4 className="text-left text-xl my-4">Vehicles</h4>
            <ul>
                {fleet.vehicles.map((vehicle) => (
                    <li key={vehicle.id} className="border-solid border-[1px] mb-4 py-2 flex">
                        <div className=" flex-auto flex-grow-[5]">
                            <input
                                type="text"
                                name="vehicleName"
                                value={vehicle.name}
                                key={vehicle.id + "Name"}
                                onChange={e => handleVehicleChange(vehicle.id, fleet.id, e, "name")}
                                autoFocus />
                        </div>
                        <div className="text-left flex-grow grid grid-rows-2 grid-cols-2">
                            <p>License Plate: </p>
                            <input
                                type="text"
                                name="vehicleLicense"
                                value={vehicle.licensePlate}
                                key={vehicle.id + "License"}
                                onChange={e => handleVehicleChange(vehicle.id, fleet.id, e, "licensePlate")}
                                autoFocus />
                            <p>VIN Number: </p>
                            <input type="text"
                                name="vinNumber"
                                value={vehicle.vinNumber}
                                key={vehicle.id + "VIN"}
                                onChange={e => handleVehicleChange(vehicle.id, fleet.id, e, "vinNumber")}
                                autoFocus />
                        </div>
                        <div>
                            <button onClick={e => { deleteVehicle(vehicle.id, fleet.id) }}>Delete</button>
                        </div>
                    </li>
                ))}
                <button onClick={e => { createNewVehicle(fleet.id) }}>Add Vehicle</button>
            </ul>
        </div>
    )
}

export default Fleet