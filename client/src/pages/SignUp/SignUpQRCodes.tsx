import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
import axios from "axios"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"

function SignUpQRCodes() {
	// make a request for the qr codes for every truck

	// make a print all QRs function

	// make a print selected QR function

	const currCompanyID = import.meta.env.VITE_COMPANY_ID
	const [QRData, setQRData] = useState<{ url: string; name: string }[]>([])
	const fleetsData = sessionStorage.getItem("fleetsData")
	const parsedData = fleetsData ? JSON.parse(fleetsData) : "Not Found"

	// fetch data
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (fleetsData) {
					// console.log(parsedData)

					axios
						.post(`${import.meta.env.VITE_SERVER_URL}/setup/fleets`, {
							fleets: parsedData.fleets,
							companyID: currCompanyID,
						})
						.then(() => {
							axios
								.post(`${import.meta.env.VITE_SERVER_URL}/setup/inventory`, {
									fleets: parsedData.fleets,
									equipmentTypes: parsedData.equipmentTypes,
									companyID: currCompanyID,
								})
								.then(() => {
									axios
										.get(
											`${
												import.meta.env.VITE_SERVER_URL
											}/print-qr-codes/${currCompanyID}`
										)
										.then((res) => {
											setQRData(res.data)
										})
										.catch((e) => console.error(e))
								})
								.catch((e) => console.error(e))
						})
						.catch((e) => console.error(e))
				}
			} catch (error) {
				console.log(error)
			}
		}

		fetchData()
	}, [])

	const listQRCodes = QRData.map((vehicle, index) => (
		<div key={index} className=' inline-block mx-8'>
			<h3>{vehicle.name}</h3>
			<QRCode value={vehicle.url} />
			<button>Print</button>
		</div>
	))

	return (
		// display the truck name, QR code, and a print button for every truck created
		<div>
			<div>QR Codes</div>
			<div>{listQRCodes}</div>
			<Link to={ROUTES.FLEET_OVERVIEW}>
				<button>View your compnay dashboard</button>
			</Link>
		</div>
	)
}

export default SignUpQRCodes
