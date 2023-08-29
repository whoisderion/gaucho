import axios from "axios"
import { useEffect, useState } from "react"
import Sidebar from "components/Sidebar"
import truckImage from "assets/image-placeholder.png"
import truckTireTread from "assets/tire-tread-placeholder.png"

// https://www.ascendfleet.com/hs-fs/hubfs/Web%20-%20Fleet%20Overview%20Summary%20Dashboard.jpeg?width=1200&name=Web%20-%20Fleet%20Overview%20Summary%20Dashboard.jpeg



// TODO: rename to fleet overview and fix url/routing
function Maintenance() {

    type Fleet = {
        companyId: string,
        id: string,
        name: string,
        vehicles: Vehicle[]
    }

    type Inventory = {
        date: Date,
        id: string,
        truckId: string
    }

    type Maintenance = {
        coolant: string,
        date: Date,
        frontDriverTread: string,
        frontPassengerTread: string,
        id: string,
        milage: number,
        notes: string,
        oil: string,
        rearDriverTread: string,
        rearPassangerTread: string,
        truckId: string
    }

    type Vehicle = {
        id: string,
        name: string,
        vin: string,
        license: string,
        year: number,
        fleetId: string,
        urlPath: string,
        inventory: Inventory,
        maintenance: Maintenance
    }

    type DashboardData = {
        fleets: Fleet[]
    }

    const [dashboardData, setDashboardData] = useState<DashboardData>()

    useEffect(() => {
        const fetchData = async () => {
            await axios.get("http://127.0.0.1:4474/dashboard", {
                params: {
                    "companyID": "clk7h1bi10000ztnbzju9lf02"
                }
            }).then((res) => {
                setDashboardData(res.data)
                console.log(res.data)
            }).catch((err) => {
                console.error(err)
            })
        }

        fetchData()
    }, [])

    // TODO: make an abstraction for reuse in other dashboards
    const listFleets = dashboardData && dashboardData.fleets.map((fleet: Fleet, fleetKey) =>
        <ul key={fleetKey} className="mb-4">
            <li className=" text-5xl" >{fleet.name}</li>
            <ul>
                {fleet.vehicles ?
                    fleet.vehicles.map((vehicle, vehicleKey) =>
                        <li key={vehicleKey} className=" p-8 mb-8 ml-12 border">
                            <div className=" flex mb-2">
                                <h5 className=" text-4xl pr-12 w-[40%]">{vehicle.name}</h5>
                                <div>
                                    <p className="">VIN: {vehicle.vin}</p>
                                    <p className="">License: {vehicle.license}</p>
                                </div>
                                <div>
                                    {/* <p>Last Updated: {vehicle.maintenance.date ? String(vehicle.maintenance.date) : "Never"}</p> */}
                                </div>
                            </div>
                            <div className=" flex py-2">
                                <div>
                                    <img src={truckImage}
                                        alt="Placeholder image for this vehicle's most recent photo"
                                        className=" w-32"></img>
                                </div>
                                <div className=" grow pl-24">
                                    <p className="mb-4">Milage: {vehicle.maintenance.milage}</p>
                                    <p className="mb-4">Oil: {vehicle.maintenance.oil}</p>
                                    <p className="mb-4">Coolant: {vehicle.maintenance.coolant}</p>
                                </div>
                                <div>
                                    <img src={truckTireTread}
                                        alt="Vehicle Tire Tread Placeholder"
                                        className=" w-32" />
                                    <h5 className=" text-center">Tire Tread</h5>
                                </div>
                            </div>
                            <div>
                                <h4>Notes:</h4>
                                <p>{vehicle.maintenance.notes}</p>
                            </div>
                        </li>) :
                    <></>}
            </ul>
        </ul>
    )

    if (dashboardData) {
        return (
            <div className="Contents">
                <Sidebar />
                <div className="Dashboard inline-flex flex-col">
                    <h3 className="text-2xl mb-8">Dashboard</h3>
                    <div className="fleetList">
                        <ul>{dashboardData && listFleets}</ul>
                    </div>

                </div>
            </div>
        )
    } else {
        return (
            <div>Loading Dashboard Data</div>
        )
    }
}

export default Maintenance