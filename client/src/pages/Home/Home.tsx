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
        urlPath: string
    }

    type DashboardData = {
        fleet: Fleet[],
        inventory: Inventory[],
        maintenance: Maintenance[]
        vehicles: Vehicle[]
    }

    const [dashboardData, setDashboardData] = useState<DashboardData>({
        fleet: [],
        inventory: [],
        maintenance: [],
        vehicles: []
    })

    const [fleets, setFleets] = useState<Fleet[]>([])

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
        // create an object for each fleet
        let fetchedFleets: Fleet[] = []
        dashboardData.fleet.map((fleet) => {
            fetchedFleets.push(fleet)
        })
        setFleets([...fleets, ...fetchedFleets])
        console.log("Stage 1:")
        console.log(fleets)

        // attribute a truck to each fleet
        dashboardData.vehicles.map((vehicle) => {
            const fleet = fleets.find(fleet => fleet.id === vehicle.fleetId)

            if (fleet) {
                if (!fleet.vehicles) {
                    fleet.vehicles = []
                }
                fleet.vehicles.push(vehicle);
            } else {
                console.error(`No fleet found for vehicle with fleetId ${vehicle.fleetId}`);
            }

        })
        console.log("Stage 2:")
        console.log(fleets)
        // get the most recent inventory & maintenance for each truck

        // add everything to an element

        const dashboard = fleets.map((fleet) =>
            <ul>
                <li>{fleet.name}</li>
                <ul>
                    {fleet.vehicles.map((vehicle) =>
                        <li>
                            {vehicle.name}
                        </li>
                    )}
                </ul>
            </ul>
        )
        return (dashboard)
    }

    if (dashboardData.fleet.length != 0) {
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