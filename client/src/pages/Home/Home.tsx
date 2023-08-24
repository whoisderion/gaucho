import axios from "axios"
import { useEffect, useState } from "react"

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
                console.log(err)
            })
        }

        fetchData()
    }, [])

    function makeFleets() {
        if (dashboardData) {
            console.log('data for making fleets...')
            console.log(dashboardData)
            const dashboard = dashboardData.fleets.map((fleet: Fleet, fleetKey) =>
                <ul key={fleetKey} className=" list-disc">
                    <li >{fleet.name}</li>
                    <ul className=" list-[circle]">
                        {fleet.vehicles ?
                            fleet.vehicles.map((vehicle, vehicleKey) =>
                                <li key={vehicleKey}>{vehicle.name}</li>) :
                            <></>}
                    </ul>
                </ul>
            )
            return dashboard
        } else {
            return null
        }
    }

    if (dashboardData) {
        return (
            <div>
                <div>Dashboard</div>
                <div className="Dashboard">
                    {makeFleets()}
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