import { UseAuth } from "hooks/Auth"
import { useNavigate } from "react-router-dom"
import * as ROUTES from "data/routes"

function Navigation() {
    const {session, signOut} = UseAuth()
    const navigate = useNavigate()

  console.log('session auth:', session)
  return (
    <nav className=' border-solid border-ternary border-b-2 '>
    <h2>Gaucho</h2>
    <button onClick={() => {
      signOut
      navigate(ROUTES.LANDING)
    }}>
      Sign Out
    </button>
  </nav>
  )
}

export default Navigation