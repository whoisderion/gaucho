import { useNavigate } from "react-router-dom";
import * as ROUTES from 'data/routes'
import axios from "axios";
import { FormEvent } from "react";

function SignUp() {

    const navigate = useNavigate();

    const formSubmit = async (e: FormEvent) => {
        e.preventDefault()
        let data = new FormData(e.target as HTMLFormElement)
        let formObject = Object.fromEntries(data.entries())
        console.log(formObject['company-name'], formObject['company-email'], formObject['phone-number'])
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/create-account`, {
            companyName: formObject['company-name'],
            email: formObject['company-email'],
            phoneNumber: formObject['phone-number']
        })

        return navigate(ROUTES.CREATE_FLEET)
    }

    return (
        <div>
            <form onSubmit={formSubmit}>
                <div>
                    <p>Company Name</p>
                    <input type="text" name="company-name" id="company-name" />
                </div>
                <div>
                    <p>Company Phone Number</p>
                    <input type="tel" name="phone-number" id="phone-number" />
                </div>
                <div>
                    <p>E-mail</p>
                    <input type="text" name="company-email" id="company-email" ></input>
                </div>
                <div>
                    <input type="submit" value="Create your fleet" />
                </div>
            </form>
        </div>
    )
}

export default SignUp