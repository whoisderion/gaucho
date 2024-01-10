import { Navigate } from "react-router-dom";
import {UseAuth} from "hooks/Auth"
import * as ROUTES from "data/routes"

const ProtectedRoute = ({children} : any) => {
    const {user} = UseAuth()

    if(!user) {
        return <Navigate to={ROUTES.SIGN_IN}/>
    } 
    return <>{children}</>
}

export default ProtectedRoute