import Sidebar from "components/Sidebar"

function FleetOverview() {

    return (
        <div className="Contents">
            <Sidebar />
            <div className="Dashboard inline-flex flex-col">
                Fleet Overview
                {/* Things to show
                    - Trucks
                        - inventory changes
                        - current mileage
                        - upcoming maintenance
                     */}
            </div>
        </div>
    )
}

export default FleetOverview