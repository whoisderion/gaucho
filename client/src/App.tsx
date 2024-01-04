import 'App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import * as ROUTES from 'data/routes.ts'

import Landing from 'pages/Landing'
import SignUp from 'pages/SignUp/SignUp'
import Account from 'pages/Settings/Account'
import CreateFleet from 'pages/SignUp/CreateFleet'
import CreateInventory from 'pages/SignUp/CreateInventory'
import SignUpQRCodes from 'pages/SignUp/QRCodes'
import FleetOverview from 'pages/Dashboards/FleetOverview'
import Maintenance from 'pages/Dashboards/Maintenance'
import UserActivity from 'pages/Dashboards/UserActivity'
import EquipmentDashboard from 'pages/Dashboards/EquipmentDashboard'
import FleetManagement from 'pages/Settings/FleetManagement'
import QRCodes from 'pages/QRCodes'
import Upload from 'pages/Upload'
import MaintenanceSettings from 'pages/Settings/MaintenanceSettings'

function App() {

  return (
    <Router>
      <div className="App w-screen h-screen overflow-hidden">
        <nav className=' border-solid border-ternary border-b-2 '>
          <h2>Gaucho</h2>
        </nav>
        <Routes>
          <Route
            path={ROUTES.LANDING}
            element={<Landing />} />
          {/* <Route
            path={ROUTES.HOME}
            element={<Home />} /> */}
          <Route
            path={ROUTES.SIGN_UP}
            element={<SignUp />} />
          <Route
            path={ROUTES.CREATE_FLEET}
            element={<CreateFleet />} />
          <Route
            path={ROUTES.CREATE_INVENTORY}
            element={<CreateInventory />} />
          <Route
            path={ROUTES.PRINT_QR_CODES}
            element={<SignUpQRCodes />} />
          <Route
            path={ROUTES.ACCOUNT}
            element={<Account />} />
          <Route
            path={ROUTES.FLEET_MANAGEMENT}
            element={<FleetManagement />} />
          <Route
            path={ROUTES.MAINTENANCE_SETTINGS}
            element={<MaintenanceSettings />} />
          <Route
            path={ROUTES.FLEET_OVERVIEW}
            element={<FleetOverview />} />
          <Route
            path={ROUTES.MAINTENANCE}
            element={<Maintenance />} />
          <Route
            path={ROUTES.USER_ACTIVITY}
            element={<UserActivity />} />
          <Route
            path={ROUTES.EQUIPMENT}
            element={<EquipmentDashboard />} />
          <Route
            path={ROUTES.LIST_QR_CODES}
            element={<QRCodes />} />
          <Route
            path='/trucks/upload/:id'
            element={<Upload />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
