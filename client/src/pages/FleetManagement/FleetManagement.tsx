import Sidebar from "components/Sidebar";

function FleetManagement() {
    return (
        <div className="Contents flex">
            <Sidebar />
            <div>
                <h2>Fleet Management</h2>
                <button>Print QR Codes</button>
            </div>
        </div>
    )
}

export default FleetManagement