import 'App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import * as ROUTES from 'data/routes.ts'
import ProtectedRoute from 'components/ProtectedRoute'

import Landing from 'pages/Landing'
import SignUp from 'pages/SignUp/SignUp'
import SignIn from 'pages/SignIn'
import Home from 'pages/Home'
import {CreateFleet, CreateInventory, SignUpQRCodes} from 'pages/SignUp'
import {FleetOverview, Maintenance, UserActivity, EquipmentDashboard} from 'pages/Dashboards'
import Account from 'pages/Settings/Account'
import FleetManagement from 'pages/Settings/FleetManagement'
import MaintenanceSettings from 'pages/Settings/MaintenanceSettings'
import QRCodes from 'pages/QRCodes'
import Upload from 'pages/Upload'


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
          <Route
            path={ROUTES.SIGN_UP}
            element={<SignUp/>} />
          <Route 
            path={ROUTES.SIGN_IN}
            element={<SignIn/>}/>
          <Route
            path={ROUTES.HOME}
            element={<Home />} />
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
