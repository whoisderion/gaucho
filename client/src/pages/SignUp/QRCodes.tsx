import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"

function QRCodes() {

    // make a request for the qr codes for every truck

    // make a print all QRs function

    // make a print selected QR function

    return (
        // display the truck name, QR code, and a print button for every truck created

        <div>
            <div>QR Codes</div>
            <Link to={ROUTES.FLEET_OVERVIEW}><button>View your compnay dashboard</button></Link>
        </div>
    )
}

export default QRCodes