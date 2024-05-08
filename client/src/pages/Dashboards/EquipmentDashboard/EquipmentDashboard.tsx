import { useEffect, useState } from "react"
import axios from "axios"

function EquipmentDashboard() {
	type EquipmentData = {
		label: string
		inventoryRecord: {
			name: string
			inventory: Inventory[]
		}[]
	}[]

	type Inventory = {
		equipmentItems: {
			equipment: {
				name: string
			}
			quantity: number
		}[]
		date: string
	}

	const [equipmentData, setEquipmentData] = useState<EquipmentData>([])
	const [selectedTimeframe, setSelectedTimeframe] = useState("oneMonthAgo")
	const [selectedRecord, setSelectedRecord] = useState<EquipmentData[0] | null>(
		null
	)

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(
					import.meta.env.VITE_SERVER_URL +
						"/account/equipment-complete/" +
						import.meta.env.VITE_COMPANY_ID,
					{
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					setEquipmentData(res.data)
					console.log(res.data)
					const defaultRecord = res.data.find(
						(record: { label: string }) => record.label === "oneMonthAgo"
					)
					setSelectedRecord(defaultRecord || null)
				})
				.catch((err) => {
					console.error(err)
				})
		}
		fetchData()
	}, [])

	const handleTimeframeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedValue = event.target.value
		setSelectedTimeframe(selectedValue)

		const record = equipmentData.find((rec) => rec.label === selectedValue)
		setSelectedRecord(record || null)
	}

	function compareInventoryRecords(
		lastRecord: Inventory,
		secondToLastRecord: Inventory
	) {
		for (const item of lastRecord.equipmentItems) {
			const matchingItem = secondToLastRecord.equipmentItems.find(
				(equipment) => equipment.equipment.name === item.equipment.name
			)

			if (matchingItem) {
				const quantityDifference = item.quantity - matchingItem.quantity
				if (quantityDifference !== 0) {
					console.log(
						`Item: ${item.equipment.name}, Quantity Difference: ${quantityDifference}`
					)
				}
			} else {
				// Item is new in the last record
				console.log(
					`Item: ${item.equipment.name}, Quantity Difference: +${item.quantity}`
				)
			}
		}
	}

	function getLocaleString(date: Date) {
		return date.toLocaleString("en-US", {
			weekday: "short",
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		})
	}

	function renderInventoryRecord() {
		if (selectedRecord) {
			return selectedRecord.inventoryRecord.map((vehicle) => {
				const lastRecord = vehicle.inventory[vehicle.inventory.length - 1]
				const secondToLastRecord =
					vehicle.inventory[vehicle.inventory.length - 2]

				// compare the quantity in each record to display the difference if there is one
				if (lastRecord && secondToLastRecord) {
					console.log("LR:", lastRecord, "StLR:", secondToLastRecord)
					compareInventoryRecords(lastRecord, secondToLastRecord)
				}

				return (
					<div key={vehicle.name}>
						<h4 className='mt-4'>{vehicle.name}</h4>
						<div>
							<p>
								{lastRecord &&
									`Last Updated: ${getLocaleString(new Date(lastRecord.date))}`}
							</p>
							<ul>
								{lastRecord &&
									lastRecord.equipmentItems.map((item, i) => (
										<li key={i} className='ml-6'>
											{item.equipment.name}: {item.quantity}{" "}
											{/* add the change from */}
										</li>
									))}
							</ul>
						</div>
					</div>
				)
			})
		} else if (equipmentData.length !== 0) {
			return <div>No data available for the selected timeframe.</div>
		} else {
			return <div>Error loading inventory record data.</div>
		}
	}

	if (equipmentData.length !== 0) {
		return (
			<div className='Contents'>
				<div className='Dashboard flex-col w-3/4 mx-auto my-4'>
					<nav className='Dashboard-Nav'>
						<h2 className=' mb-8 flex'>Equipment Dashboard</h2>
						<div className=' inline-flex'>
							<div className='flex'>
								<label htmlFor='Filters' className='block mr-2'>
									Filter
								</label>
								<select name='Filter' id=''>
									<option value=''></option>
									<option value=''>Only show changes</option>
									<option value=''>Only Inactive</option>
									{/* <option value="">Ungroup Vehicles</option> */}
								</select>
							</div>
							<div className='flex ml-8'>
								<label htmlFor='Timeframe' className='block mr-2'>
									Timeframe
								</label>
								<select
									name='Timeframe'
									id=''
									defaultValue={selectedTimeframe}
									onChange={handleTimeframeChange}
								>
									<option value='oneDayAgo'>1 Day</option>
									<option value='threeDaysAgo'>3 Days</option>
									<option value='oneWeekAgo'>1 Week</option>
									<option value='twoWeeksAgo'>2 Weeks</option>
									<option value='oneMonthAgo'>Month</option>
								</select>
							</div>
						</div>
					</nav>
					<section className='vehicle-display grid grid-cols-2'>
						{renderInventoryRecord()}
					</section>
				</div>
			</div>
		)
	} else {
		return (
			<div className='Dashboard inline-flex flex-col'>
				Loading Equipment Data
			</div>
		)
	}
}

export default EquipmentDashboard
