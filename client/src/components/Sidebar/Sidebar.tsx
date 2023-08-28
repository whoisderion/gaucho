import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
function Sidebar() {
    return (
        <div className="Sidebar inline-flex flex-col w-64 border-r-1 border-cyan-50">
            <h2 className=" text-3xl">Gaucho</h2>
            <ul className="pl-4 mt-8">
                <h4 className="mb-2">Dashboards</h4>
                {/* the following should be links to their respectice components */}
                <Link to={ROUTES.FLEET_OVERVIEW}>
                    <li className="pl-8 mb-2">Fleet Overview</li>
                </Link>
                <Link to={ROUTES.MAINTENANCE}>
                    <li className="pl-8 mb-2">Maintenance</li>
                </Link>
                <Link to={ROUTES.USER_ACTIVITY}>
                    <li className="pl-8 mb-2">User Activity</li>
                </Link>
                <Link to={ROUTES.EQUIPMENT}>
                    <li className="pl-8 mb-2">Equipment</li>
                </Link>
            </ul>
        </div>
    )
}

export default Sidebar