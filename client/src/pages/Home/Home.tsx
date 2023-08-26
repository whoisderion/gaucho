import axios from "axios"
import { useEffect, useState } from "react"


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

    function Sidebar() {
        return (
            <div className="Sidebar inline-flex flex-col w-64 border-r-1 border-cyan-50">
                <h2 className=" text-3xl">Gaucho</h2>
                <ul className="pl-4 mt-8">
                    <h4 className="mb-2">Dashboards</h4>
                    {/* the following should be links to their respectice components */}
                    <li className="pl-8 mb-2">Fleet Overview</li>
                    <li className="pl-8 mb-2">Maintenance</li>
                    <li className="pl-8 mb-2">Equipment</li>
                    <li className="pl-8 mb-2">User Activity</li>
                </ul>
            </div>
        )
    }

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