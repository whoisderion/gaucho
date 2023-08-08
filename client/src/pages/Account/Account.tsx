import axios from 'axios'
import { useEffect, useState } from "react"

function Account() {

    const [companyInfo, setCompanyInfo]: any = useState()

    useEffect(() => {
        async function getCompanyInfo() {
            await axios.get(import.meta.env.VITE_SERVER_URL + 'account/company?companyID=clk7h1bi10000ztnbzju9lf02')
                .then(function (res: any) {
                    setCompanyInfo(res.data)
                })
        }
        getCompanyInfo()
    }, [])

    if (companyInfo) {
        return (
            <div>
                <h1>Account</h1>
                <div>
                    <p>Created: </p>
                    <p>Primary Email: {companyInfo.email}</p>
                    <p>Company ID: {companyInfo.id}</p>
                    <p>Company Name: {companyInfo.name}</p>
                    <p>Phone Number: {companyInfo.phoneNumber}</p>
                </div>
            </div>
        )
    }
}

export default Account