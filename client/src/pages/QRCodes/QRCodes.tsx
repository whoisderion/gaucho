import axios from "axios"
import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import Sidebar from "components/Sidebar"

function QRCodes() {

    // make a request for the qr codes for every truck

    // make a print all QRs function

    // make a print selected QR function

    const currCompanyID = import.meta.env.VITE_COMPANY_ID
    const [QRData, setQRData] = useState<{ url: string, name: string }[]>([])

    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_SERVER_URL}/print-qr-codes/${currCompanyID}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                })
                    .then(res => {
                        setQRData(res.data)
                        console.log(res.data)
                    })
                    .catch(e => console.error(e))
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    const listQRCodes = QRData.map((vehicle, index) => (
        <div key={index} className=" inline-block mx-8">
            <h3>{vehicle.name}</h3>
            <QRCode value={vehicle.url} />
            <button>Print</button>
        </div>
    ))


    return (
        // display the truck name, QR code, and a print button for every truck created
        <div className="Contents inline-flex">
            <Sidebar />
            <div className=" QR-Codes block">
                <div >
                    <h2>QR Codes</h2>
                </div>
                <div id="qr-codes-container" className="">{listQRCodes}</div>
            </div>
        </div>
    )
}
export default QRCodes