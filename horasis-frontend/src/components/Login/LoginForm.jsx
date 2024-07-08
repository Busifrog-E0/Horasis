import { postItem } from "../../constants/operations"
import { useContext } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { useState } from "react"
import { loginValidation } from "../../utils/schema/registration-validations/loginValidation"
import LoginInputField from "./LoginInputField"

const SignInButtonStyle = {
    padding: "19px",
    height: "100%",
    fontSize: "16px",
    fontWeight: 600,
    marginTop: 5,
}

const LoginForm = ({ setLoading, activeKey, }) => {

    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const [errorOj, setErrorObj] = useState({})
    const [loginFormValue, setLoginFormValue] = useState({})

    const validate = (callback) => {
        const { error, warning } = loginValidation
            .validate(loginFormValue, { abortEarly: false, stripUnknown: true });
        if (error && error.details) {

            let obj = {}
            error.details.forEach(val => (
                obj[val.context.key] = val.message
            ))
            setErrorObj(obj)
        }
        else {
            setErrorObj({})
            if (callback) {
                callback()
            }
        }

    }
    const validateSingle = (value, key, callback) => {
        setLoginFormValue({ ...loginFormValue, ...value })
        const { error, warning } = loginValidation
            .extract(key)
            .validate(value[key], { abortEarly: false, stripUnknown: true });
        if (error && error.details) {


            let obj = {}
            error.details.forEach(val => (
                obj[key] = val.message
            ))
            setErrorObj(obj)
        }

        else {
            setErrorObj({})
            if (callback) {
                callback()
            }
        }
    }

    const login = () => {
        setLoading(true)
        // var api = activeKey === "2" ? 'staffs/login' : 'admin/login'
        let api = "crm/login"
        postItem(api, loginFormValue,
            (result) => {
                setLoading(false)
                updateCurrentUser(result)
            }, errMsg => {
                setLoading(false)
                console.log(errMsg)
                setErrorObj({ Username: "Incorrect username", "Password": "Incorrect password" })
            }, updateCurrentUser, currentUserData)
    }

    return (
        <>
            <LoginInputField
                type="text"
                field="Username"
                errorOj={errorOj}
                loginFormValue={loginFormValue}
                validateSingle={validateSingle} />
            <LoginInputField
                type="password"
                field="Password"
                errorOj={errorOj}
                loginFormValue={loginFormValue}
                validateSingle={validateSingle} />

            <button
                onClick={() => validate(login)}
                size="large"
                block
                type="primary"
                style={SignInButtonStyle}
            >
                Sign In
            </button>
        </>
    )
}

export default LoginForm