import 'App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import * as ROUTES from 'data/routes.ts'

import Landing from 'pages/Landing'
import SignUp from 'pages/SignUp/SignUp'
import Account from 'pages/Account'
import CreateFleet from 'pages/SignUp/CreateFleet'
import CreateInventory from 'pages/SignUp/CreateInventory'
import QRCodes from 'pages/SignUp/QRCodes'
import FleetOverview from 'pages/FleetOverview'
import Maintenance from 'pages/Maintenance'
import UserActivity from 'pages/UserActivity'
import EquipmentDashboard from 'pages/EquipmentDashboard'

function App() {

  return (
    <Router>
      <div className="App max-w-full w-[100vw] flex-auto">
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
            element={<QRCodes />} />
          <Route
            path={ROUTES.ACCOUNT}
            element={<Account />} />
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
        </Routes>
      </div>
    </Router>
  )
}

export default App
