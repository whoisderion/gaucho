import axios from 'axios'
import Sidebar from 'components/Sidebar'
import { useEffect, useState } from "react"

function Account() {

    const [companyInfo, setCompanyInfo]: any = useState()

    useEffect(() => {
        async function getCompanyInfo() {
            await axios.get(import.meta.env.VITE_SERVER_URL + '/account/company/' + import.meta.env.VITE_COMPANY_ID)
                .then(function (res: any) {
                    setCompanyInfo(res.data)
                    console.log(res.data)
                })
        }
        getCompanyInfo()
    }, [])

    if (companyInfo) {
        return (
            <div className='Contents'>
                <Sidebar />
                <div className="Settings inline-flex flex-col">
                    <h2 >Account</h2>
                    <div>
                        <p>Primary Email: {companyInfo.email}</p>
                        <p>Company ID: {companyInfo.id}</p>
                        <p>Company Name: {companyInfo.name}</p>
                        <p>Phone Number: {companyInfo.phoneNumber}</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Sidebar />
            </div>
        )
    }
}

export default Account