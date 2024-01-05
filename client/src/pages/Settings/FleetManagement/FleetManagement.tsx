import axios from "axios";
import Sidebar from "components/Sidebar";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const companyId = import.meta.env.VITE_COMPANY_ID
const serverURL = import.meta.env.VITE_SERVER_URL

type Fleet = {
    companyId: string,
    id: string,
    name: string,
    vehicles?: Vehicle[]
}

type Vehicle = {
    license: string,
    name: string,
    vin: string,
    year: number | null,
    id: string,
    Fleet: {
        name: string,
        id: string
    }
}

type FetchedData = {
    fleets: Fleet[],
    vehicles: Vehicle[]
    photoAreas?: PhotoArea[]
}

type PhotoArea = {
    name: string,
    companyId: string,
    id: string,
    position: number
}

interface EditVehicleMenuProps {
    vehicle: Vehicle
    setVehicle: Dispatch<SetStateAction<Vehicle | undefined>>
    fleetData: FetchedData
    setFleetData: Dispatch<SetStateAction<FetchedData | undefined>>
    stopEditing: () => void
}

function EditVehicleMenu({ vehicle, setVehicle, fleetData, setFleetData, stopEditing }: EditVehicleMenuProps) {

    const handleSubmit = async (newVehicleData: EditVehicleMenuProps["vehicle"], setFleetData: EditVehicleMenuProps["setFleetData"]) => {
        console.log(newVehicleData)
        await axios.post(serverURL + 'account/vehicle', newVehicleData)
            .then(() => setFleetData((prevData) => {
                if (prevData) {
                    const updatedVehicles = prevData.vehicles.map((vehicle) =>
                        vehicle.id === newVehicleData.id ? newVehicleData : vehicle
                    )
                    return { ...prevData, vehicles: updatedVehicles }
                } else {
                    console.error("Failed saving changes to vehicle!")
                    return prevData
                }
            }))
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <div className="bg-primary text-white py-6">
                <h3>{vehicle.name} Settings</h3>
            </div>
            <div className="p-6">
                <form action="">
                    <label>Name:</label>
                    <input
                        type="text"
                        className=" bg-white border-2 border-slate-500"
                        value={vehicle.name || ""}
                        onChange={(e) => { setVehicle({ ...vehicle, 'name': e.target.value }) }}
                        autoComplete="off" />
                    <label htmlFor="license">License</label>
                    <input
                        type="text"
                        value={vehicle.license || ""}
                        className=""
                        onChange={(e) => { setVehicle({ ...vehicle, 'license': e.target.value }) }}
                        autoComplete="off" />
                    <label htmlFor="vin">VIN</label>
                    <input
                        type="text"
                        value={vehicle.vin || ""}
                        className=""
                        onChange={(e) => { setVehicle({ ...vehicle, 'vin': e.target.value }) }}
                        autoComplete="off" />
                    <label htmlFor="year">Year</label>
                    <input
                        type="number"
                        value={vehicle.year || ""}
                        className=""
                        onChange={(e) => { setVehicle({ ...vehicle, 'year': e.target.value == "" ? null : parseInt(e.target.value) }) }}
                        autoComplete="off" />
                    <label htmlFor="fleet">Fleet</label>
                    <select
                        name="fleet"
                        id="fleet"
                        value={vehicle.Fleet.name || ""}
                        onChange={(e) => {
                            const newFleet = fleetData.fleets.filter((fleet) => fleet.name === e.target.value)
                            setVehicle({ ...vehicle, 'Fleet': newFleet[0] })
                        }}>
                        {fleetData?.fleets.map((fleet) => (
                            <option key={fleet.name} value={fleet.name}>
                                {fleet.name}
                            </option>
                        ))}
                    </select>
                </form>
                <div className="mt-4 space-x-2">
                    <button className=" inline-block" onClick={stopEditing}>Cancel</button>
                    <button className=" inline-block" onClick={() => { handleSubmit(vehicle, setFleetData) }}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}

function FleetManagement() {

    const [fleetData, setFleetData] = useState<FetchedData>()
    const [isEditingVehicle, setIsEditingVehicle] = useState<boolean>(false)
    const [editingVehicle, setEditingVehicle] = useState(null)
    const [isEditingPhotoAreas, setIsEditingPhotoAreas] = useState(false)
    const [isEditingFleets, setIsEditingFleets] = useState(false)
    const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([])
    const [tempPhotoAreas, setTempPhotoAreas] = useState<PhotoArea[]>([])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}account/fleet/${import.meta.env.VITE_COMPANY_ID}`)
                .then((res) => {
                    setFleetData(res.data)
                    console.log("fleetData", res.data)
                }).catch((err) => {
                    console.error(err)
                })
            await axios.get(`${import.meta.env.VITE_SERVER_URL}account/company/photo-areas/${import.meta.env.VITE_COMPANY_ID}`)
                .then((res) => {
                    setPhotoAreas(res.data)
                    setTempPhotoAreas(res.data)
                    console.log("photoAreas", res.data)
                }).catch((err) => {
                    console.error(err)
                })
        }
        fetchData()
    }, [])

    const startEditing = (vehicle) => {
        setIsEditingVehicle(true);
        setEditingVehicle(vehicle);
    };

    const stopEditing = () => {
        setIsEditingVehicle(false);
        setEditingVehicle(null);
    };

    function Dropdown({ vehicle }) {
        return (
            <div className="dropdown relative inline-block group">
                <button className="dropbtn">⋮</button>
                <div className="dropdown-content hidden absolute bg-slate-300 min-w-160px shadow-sm z-10 group-hover:block">
                    <span
                        className="px-3 py-4 block cursor-pointer hover:bg-slate-400"
                        onClick={() => startEditing(vehicle)}>
                        Edit</span>
                    <span
                        className="px-3 py-4 block cursor-pointer hover:bg-slate-400">
                        Delete</span>
                </div>
            </div>
        )
    }

    const listVehicles = fleetData && fleetData.vehicles.map((vehicle) =>
        <tr key={vehicle.name} >
            <td className="py-4">{vehicle.name}</td>
            <td>{vehicle.license}</td>
            <td>{vehicle.vin}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.Fleet.name}</td>
            <td><ul>{vehicle.photoArea &&
                vehicle.photoAreas.map((photoArea) => {
                    <li>{photoArea.name}</li>
                })}</ul></td>
            <td><Dropdown vehicle={vehicle}></Dropdown></td>
        </tr>
    )

    const listEditingFleets = fleetData && fleetData.fleets.map((fleet) => (
        <input
            type="text"
            value={fleet.name}
            key={fleet.id} // Added unique key to prevent React warnings
            onChange={(e) => {
                setFleetData((prevData) => ({
                    ...prevData,
                    fleets: prevData.fleets.map((f) =>
                        f.id === fleet.id ? { ...f, name: e.target.value } : f
                    ),
                    vehicles: prevData.vehicles || [] // Ensure vehicles is always an array
                }));
            }}
            autoComplete="off"
        />
    ))

    const listPhotoAreas = tempPhotoAreas && tempPhotoAreas.map((area, index) => (
        <input
            type="text"
            value={area.name}
            onChange={(e) => {
                const updatedAreas = [...tempPhotoAreas];
                updatedAreas[index].name = e.target.value;
                setTempPhotoAreas(updatedAreas);
            }}
            autoComplete="off"
            key={index}
            className="block"
        />
    ));

    const handlePASubmit = async () => {
        console.log(tempPhotoAreas)
        await axios.post(import.meta.env.VITE_SERVER_URL + 'account/company/photo-areas', { tempPhotoAreas: tempPhotoAreas, companyID: import.meta.env.VITE_COMPANY_ID })
        // .then((res) => { setPhotoAreas(tempPhotoAreas), console.log(photoAreas) })
        // .catch((err) => console.log(err))
    }

    if (isEditingPhotoAreas) {
        return (
            <div className="Contents flex">
                <Sidebar />
                <div>
                    <div>
                        <h2 className="">Fleet Management</h2>
                    </div>
                    <div className="PhotoAreas block">
                        <label>Edit Photo Areas</label>
                        {listPhotoAreas}
                        <button
                            onClick={(e) => {
                                if (tempPhotoAreas[0] === undefined || tempPhotoAreas[tempPhotoAreas.length - 1].name !== "") {
                                    setTempPhotoAreas([...tempPhotoAreas, { name: "", companyId: import.meta.env.VITE_COMPANY_ID, id: String(Date.now()) }]);
                                }
                                e.preventDefault();
                            }}
                        >Add A New Area</button>
                    </div>
                    <div className=" space-x-4 my-4">
                        <button onClick={() => { setIsEditingPhotoAreas(false) }}>Cancel</button>
                        <button
                            onClick={(e) => {
                                console.log(tempPhotoAreas)
                                handlePASubmit()
                            }}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
    if (isEditingFleets) {
        return (
            <div className="Contents flex">
                <Sidebar />
                <div>
                    <h2 className="">Fleet Management</h2>
                    <h3>Edit Fleets</h3>
                    <div>
                        {listEditingFleets}
                    </div>
                    <div className=" space-x-4 my-4">
                        <button onClick={() => { setIsEditingFleets(false) }}>Cancel</button>
                        <button>Save</button>
                    </div>
                </div>
            </div>
        )
    }
    if (fleetData) {
        return (
            <div className="Contents flex">
                <Sidebar />
                <div className="Dashboard inline-flex flex-col flex-1">
                    <h2 className="">Fleet Management</h2>
                    <div className="">
                        <div className=" space-x-4 my-4">
                            <button onClick={() => { setIsEditingPhotoAreas(true) }}>Edit Photo Areas</button>
                            <button onClick={() => { setIsEditingFleets(true) }}> Edit Fleets</button>
                        </div>
                        <table className="vehicles table-auto text-left min-w-[80%]">
                            <thead>
                                <tr >
                                    <th scope="col">Name</th>
                                    <th scope="col">License</th>
                                    <th scope="col">VIN</th>
                                    <th scope="col">Year</th>
                                    <th scope="col">Fleet</th>
                                    <th scope="col">Photo Areas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listVehicles}
                            </tbody>
                        </table>
                    </div>

                </div>
                {isEditingVehicle && editingVehicle && (
                    <div className="overlay h-full w-full fixed z-20 top-0 left-0 right-0 bottom-0 bg-black/50">
                        <div className="overlay-contents bg-white w-[600px] float-right">
                            <EditVehicleMenu vehicle={editingVehicle} setVehicle={setEditingVehicle} fleetData={fleetData} setFleetData={setFleetData} stopEditing={stopEditing} />
                        </div>
                    </div>
                )}
            </div>
        )
    } else {
        return (
            <div>
                <Sidebar />
                <div className="Dashboard inline-flex flex-col">
                    Loading Dashboard Data
                </div>
            </div>
        )
    }
}

export default FleetManagement