import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

function SignUpQRCodes() {

    // make a request for the qr codes for every truck

    // make a print all QRs function

    // make a print selected QR function

    const currCompanyID = "clpw9jgxd0000ztvheigeqjgf"
    const [QRData, setQRData] = useState<string[]>([])

    const canvasRef = useRef(null)
    const fleetsData = sessionStorage.getItem("fleetsData")
    const parsedData = fleetsData ? JSON.parse(fleetsData) : "Not Found"

    // fetch data
    useEffect(() => {

        const fetchData = async () => {
            try {
                if (fleetsData) {
                    // console.log(parsedData)

                    const fleet = axios.post(`${import.meta.env.VITE_SERVER_URL}setup/fleets`, {
                        fleets: parsedData.fleets,
                        companyID: currCompanyID
                    })
                        .then(fleetData => {
                            const inventory = axios.post(`${import.meta.env.VITE_SERVER_URL}setup/inventory`, {
                                fleets: parsedData.fleets,
                                equipmentTypes: parsedData.equipmentTypes,
                                companyID: currCompanyID
                            })
                                .then(inventoryData => {
                                    const retreiveQRCodes = axios.get(`${import.meta.env.VITE_SERVER_URL}print-qr-codes/${currCompanyID}`)
                                        .then(res => {
                                            setQRData(res.data)
                                        })
                                        .catch(e => console.error(e))
                                })
                                .catch(e => console.error(e))
                        })
                        .catch(e => console.error(e))
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    // create elements for qr codes
    useEffect(() => {
        const vehicleNames: string[] = []
        if (fleetsData) {
            for (const fleet of parsedData.fleets) {
                for (const vehicle of fleet.vehicles) {
                    vehicleNames.push(vehicle.name)
                }
            }
        }

        if (QRData.length > 0 && canvasRef.current && canvasRef.current != null) {
            QRData.forEach((data, index) => {
                const containerDiv = document.createElement("div")
                // containerDiv.className = " flex"
                const canvas = document.createElement("canvas")

                QRCode.toCanvas(canvas, data, function (error) {
                    if (error) console.error(error)
                    // console.log(`QR Code ${index + 1} generated successfully!`)
                })

                const QRLabel = document.createElement("p")
                QRLabel.textContent = vehicleNames[index]
                QRLabel.className = ""

                const printButton = document.createElement("button")
                printButton.textContent = "Print"
                printButton.className = ""

                containerDiv.appendChild(QRLabel)
                containerDiv.appendChild(canvas)
                containerDiv.appendChild(printButton)
                canvasRef.current.appendChild(containerDiv)
            })
        }

    }, [QRData])

    return (
        // display the truck name, QR code, and a print button for every truck created
        <div>
            <div>QR Codes</div>
            <div ref={canvasRef} id="qr-codes-container" className="flex" />
            <Link to={ROUTES.FLEET_OVERVIEW}><button>View your compnay dashboard</button></Link>
        </div>
    )
}

export default SignUpQRCodes