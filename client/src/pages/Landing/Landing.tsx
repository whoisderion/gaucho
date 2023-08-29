import { Link } from "react-router-dom"
import * as ROUTES from 'data/routes'

function Landing() {
    return (
        <div>
            <div className="text-emerald-700">Welcome to Gaucho</div>
            <div>
                <Link to={ROUTES.SIGN_UP}><button>Create a Company</button></Link>

                <Link to={ROUTES.ACCOUNT}><button>View Company Details</button></Link>

                <Link to={ROUTES.FLEET_OVERVIEW}><button>View Company Dashboards</button></Link>
            </div>
        </div>
    )
}

export default Landing