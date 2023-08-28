import axios from "axios"
import { useEffect, useState } from "react"
import Sidebar from "components/Sidebar"


// TODO: rename to fleet overview and fix url/routing
function Home() {

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
        liscense: string,
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

    const listFleets = dashboardData && dashboardData.fleets.map((fleet: Fleet, fleetKey) =>
        <ul key={fleetKey} className="mb-4">
            <li >{fleet.name}</li>
            <ul>
                {fleet.vehicles ?
                    fleet.vehicles.map((vehicle, vehicleKey) =>
                        <li key={vehicleKey} className=" pl-8">- {vehicle.name}</li>) :
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

export default Home