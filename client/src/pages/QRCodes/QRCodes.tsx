import axios from "axios"
import { useState, useRef, useEffect } from "react"
import QRCode from "react-qr-code"
import Sidebar from "components/Sidebar"

function QRCodes() {

    // make a request for the qr codes for every truck

    // make a print all QRs function

    // make a print selected QR function

    const currCompanyID = import.meta.env.VITE_COMPANY_ID
    const [QRData, setQRData] = useState<string[]>([])
    const [fleetsData, setFleetsData] = useState<any>()

    const canvasRef = useRef<any>(null)

    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_SERVER_URL}account/fleet/${currCompanyID}`)
                    .then(res => {
                        setFleetsData(res.data)
                    })
                await axios.get(`${import.meta.env.VITE_SERVER_URL}print-qr-codes/${currCompanyID}`)
                    .then(res => {
                        setQRData(res.data)
                    })
                    .catch(e => console.error(e))
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
            for (const vehicle of fleetsData.vehicles) {
                vehicleNames.push(vehicle.name)
            }
        }

        if (QRData.length > 0 && canvasRef.current && canvasRef.current != null) {
            QRData.forEach((data, index) => {
                const containerDiv = document.createElement("div")
                containerDiv.className = " inline-block mx-4"
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
                if (canvasRef.current !== null) {
                    canvasRef.current.appendChild(containerDiv)
                } else {
                    console.error('Failed to append QR Codes to containerDiv')
                }
            })
        }

    }, [QRData])

    return (
        // display the truck name, QR code, and a print button for every truck created
        <div className="Contents inline-flex">
            <Sidebar />
            <div className=" QR-Codes block">
                <div >
                    <h2>QR Codes</h2>
                </div>
                <div ref={canvasRef} id="qr-codes-container" className="" />
            </div>
        </div>
    )
}
export default QRCodes