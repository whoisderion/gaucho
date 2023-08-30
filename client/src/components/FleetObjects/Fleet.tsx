type Truck = {
    name: string,
    licensePlate: string,
    VinNumber: string
}

type fleet = {
    name: string,
    vehicles: Truck[]
    id: number
}

type FleetProps = {
    fleet: fleet,
    currFleet: number
    handleNameChange: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    deleteFleet: (id: number) => void;
    deleteVehicle: (vehicleId: number, fleetId: number) => void;
    createNewVehicle: () => void;
}


const Fleet: React.FC<FleetProps> = ({ fleet, currFleet, handleNameChange, deleteFleet, deleteVehicle, createNewVehicle }) => {
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
            <h4 className="text-left text-xl my-4">Vehicles</h4>
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
                        <div>
                            <button onClick={e => { deleteVehicle(vehicleIndex, fleet.id) }}>Delete</button>
                        </div>
                    </li>
                ))}
                <button onClick={e => { createNewVehicle() }}>Add Vehicle</button>
            </ul>
        </div>
    )
}

export default Fleet