import 'App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import * as ROUTES from 'data/routes.ts'

import Landing from 'pages/Landing'

function App() {

  return (
    <Router>
      <div className="App max-w-full flex-auto">
        <Routes>
          <Route
            path={ROUTES.LANDING}
            element={<Landing />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
