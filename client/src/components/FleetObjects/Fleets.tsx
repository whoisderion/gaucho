type Truck = {
    name: string,
    licensePlate: string,
    VinNumber: string,
    id: number
}

type Fleet = {
    name: string,
    vehicles: Truck[]
    id: number
}

type FleetsProps = {
    fleets: Fleet[],
    selectFleet: (fleet: Fleet) => void;
}


const Fleets: React.FC<FleetsProps> = ({ fleets, selectFleet }) => {
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
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Fleets