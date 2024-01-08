import Sidebar from "components/Sidebar"
import { useEffect, useState } from "react"
import axios from "axios"

function EquipmentDashboard() {

    type EquipmentData = {
        label: string;
        inventoryRecord: {
            name: string;
            inventory: {
                equipmentItems: {
                    equipment: {
                        name: string;
                    };
                    quantity: number;
                }[];
                date: string;
            }[];
        }[];
    }[];

    const [equipmentData, setEquipmentData] = useState<EquipmentData>([])
    const [selectedTimeframe, setSelectedTimeframe] = useState("threeDaysAgo")
    const [selectedRecord, setSelectedRecord] = useState<EquipmentData[0] | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(import.meta.env.VITE_SERVER_URL + "api/account/equipment-complete/" + import.meta.env.VITE_COMPANY_ID, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  }
            }).then((res) => {
                setEquipmentData(res.data)
                console.log(res.data)
                const defaultRecord = res.data.find((record: { label: string; }) => record.label === "threeDaysAgo");
                setSelectedRecord(defaultRecord || null);
            }).catch((err) => {
                console.error(err)
            })
        }
        fetchData()
    }, [])

    const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        setSelectedTimeframe(selectedValue)

        const record = equipmentData.find((rec) => rec.label === selectedValue);
        setSelectedRecord(record || null);
    }

    const renderInventoryRecord = () => {
        if (selectedRecord) {
            return selectedRecord.inventoryRecord.map(vehicle => (
                <div key={vehicle.name}>
                    <h4 className="mt-4">{vehicle.name}</h4>
                    {vehicle.inventory.map((equipmentItem, index) => {
                        if (equipmentItem.equipmentItems.length !== 0) {
                            return (
                                <div key={index} className="ml-6">
                                    <p>{equipmentItem.date}</p>
                                    {equipmentItem.equipmentItems.map((item, i) => (
                                        <p key={i} className="ml-6">{item.equipment.name}: {item.quantity}</p>
                                    ))}
                                </div>
                            )
                        }
                    })}
                </div>
            ))
        } else if (equipmentData.length !== 0) {
            return (<div>No data available for the selected timeframe.</div>)
        } else {
            return (<div>Error loading inventory record data.</div>)
        }
    }

    if (equipmentData.length !== 0) {
        return (
            <div className="Contents">
                <Sidebar />
                <div className="Dashboard inline-flex flex-col" >
                    <nav className="Dashboard-Nav">
                        <h2 className=" mb-8 flex">Equipment Dashboard</h2>
                        <div className=" inline-flex">
                            <div className="flex">
                                <label htmlFor="Filters" className="block mr-2">Filter</label>
                                <select name="Filter" id="" >
                                    <option value=""></option>
                                    <option value="">Only show changes</option>
                                    <option value="">Only Inactive</option>
                                    {/* <option value="">Ungroup Vehicles</option> */}
                                </select>
                            </div>
                            <div className="flex ml-8">
                                <label htmlFor="Timeframe" className="block mr-2">Timeframe</label>
                                <select name="Timeframe" id="" defaultValue={selectedTimeframe} onChange={handleTimeframeChange}>
                                    <option value="oneDayAgo">1 Day</option>
                                    <option value="threeDaysAgo">3 Days</option>
                                    <option value="oneWeekAgo">1 Week</option>
                                    <option value="twoWeeksAgo">2 Weeks</option>
                                    <option value="oneMonthAgo">Month</option>
                                </select>
                            </div>
                        </div>
                    </nav>
                    <section className="vehicle-display">
                        {renderInventoryRecord()}
                    </section>
                </div>
            </div>
        )
    } else {
        return (
            <div className="Contents">
                <Sidebar />
                <div className="Dashboard inline-flex flex-col">
                    Loading Equipment Data
                </div>
            </div>
        )
    }
}

export default EquipmentDashboard