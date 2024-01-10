import { Navigate } from "react-router-dom";
import {useAuth} from "hooks/Auth"
import * as ROUTES from "data/routes"

const ProtectedRoute = ({children} : any) => {
    const {user} = useAuth()

    if(!user) {
        return <Navigate to={ROUTES.SIGN_IN}/>
    } 
    return <>{children}</>
}

export default ProtectedRoute