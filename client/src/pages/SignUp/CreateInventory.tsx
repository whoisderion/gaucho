import { useNavigate } from "react-router-dom"
import * as ROUTES from 'data/routes'
import { useEffect, useState } from "react"

function CreateInventory() {
    useEffect(() => {
        const fleetsData = sessionStorage.getItem("fleetsData")
        if (fleetsData) {
            let parsedData = JSON.parse(fleetsData)["fleets"]
            setData(parsedData)
        }
    }, [])

    const [data, setData] = useState("")
    const navigate = useNavigate()

    function continueSignup() {
        navigate(ROUTES.PRINT_QR_CODES)
    }

    console.log(data)


    return (
        <>
            <div>Create Inventory</div>
            <button onClick={continueSignup}>Complete</button>
        </>
    )
}

export default CreateInventory