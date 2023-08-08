import { useNavigate } from "react-router-dom";
import * as ROUTES from 'data/routes'

function SignUp() {

    const navigate = useNavigate();

    function continueSignUp() {
        // create account in firebase
        // save new account to database
        // continue to next page
        console.log('submitted')
        return navigate(ROUTES.CREATE_FLEET)
    }

    return (
        <div>
            <form>
                <div>
                    <p>Company Name</p>
                    <input type="text" name="company-name" id="name" />
                </div>
                <div>
                    <p>Company Phone Number</p>
                    <input type="text" name="phone-number" id="phone" />
                </div>
                <div>
                    <p>E-mail</p>
                    <input type="text" name="company-email" id="email" ></input>
                </div>
                <div>
                    <input type="button" value="Create your fleet" onClick={continueSignUp} />
                </div>
            </form>
        </div>
    )
}

export default SignUp