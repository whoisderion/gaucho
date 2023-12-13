import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
function Sidebar() {
    return (
        <div className="Sidebar inline-flex flex-col w-64 border-r-1 border-cyan-50">
            <h2>Gaucho</h2>
            <ul className="pl-4 mt-8">
                <h4 className="mb-2">Dashboards</h4>
                <Link to={ROUTES.FLEET_OVERVIEW}>
                    <li className="pl-8 mb-2">Fleet Overview</li>
                </Link>
                <Link to={ROUTES.EQUIPMENT}>
                    <li className="pl-8 mb-2">Equipment</li>
                </Link>
                <Link to={ROUTES.MAINTENANCE}>
                    <li className="pl-8 mb-2">Maintenance</li>
                </Link>
                <Link to={ROUTES.USER_ACTIVITY}>
                    <li className="pl-8 mb-2">User Activity</li>
                </Link>
                <h4 className="mb-2">Settings</h4>
                <Link to={ROUTES.ACCOUNT}>
                    <li className="pl-8 mb-2">Account Settings</li>
                </Link>
                <Link to={ROUTES.FLEET_MANAGEMENT}>
                    <li className="pl-8 mb-2">Fleet Management</li>
                </Link>
                <Link>
                    <li className="pl-8 mb-2">Maintenance Settings</li>
                </Link>
                <h4 className="mb-2">Upload</h4>
                <Link>
                    <li className="pl-8 mb-2">New Entry</li>
                </Link>
            </ul>
        </div>
    )
}

export default Sidebar