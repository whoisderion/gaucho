import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
import axios from "axios"
import { useEffect } from "react"

function QRCodes() {

    // make a request for the qr codes for every truck

    // make a print all QRs function

    // make a print selected QR function

    const currCompanyID = "clpw9jgxd0000ztvheigeqjgf"

    useEffect(() => {
        const fleetsData = sessionStorage.getItem("fleetsData")
        if (fleetsData) {
            const parsedData = JSON.parse(fleetsData)
            console.log(parsedData)

            const fleet = axios.post(`${import.meta.env.VITE_SERVER_URL}setup/fleets`, {
                fleets: parsedData.fleets,
                companyID: currCompanyID
            })
                .then(data => {
                    console.log(data)
                    const inventory = axios.post(`${import.meta.env.VITE_SERVER_URL}setup/inventory`, {
                        fleets: parsedData.fleets,
                        equipmentTypes: parsedData.equipmentTypes,
                        companyID: currCompanyID
                    })
                        .then(idata => {
                            const retreiveQRCodes = axios.get(`${import.meta.env.VITE_SERVER_URL}print-qr-codes/${currCompanyID}`)
                                .then(res => console.log(res))
                                .catch(e => console.error(e))
                        })
                        .catch(e => console.error(e))
                })
                .catch(e => console.error(e))


            return () => {
                fleet
            }
        }
    }, [])


    return (
        // display the truck name, QR code, and a print button for every truck created

        <div>
            <div>QR Codes</div>
            <Link to={ROUTES.FLEET_OVERVIEW}><button>View your compnay dashboard</button></Link>
        </div>
    )
}

export default QRCodes