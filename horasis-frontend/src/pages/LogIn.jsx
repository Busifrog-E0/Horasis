import { useContext, useState } from "react";
import LoaderOverlay from "../components/Loader/LoaderOverlay";
import LoginForm from "../components/Login/LoginForm";
import Logo from "../components/Common/Logo";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { AuthContext, defaultUserData } from "../utils/AuthProvider";
import { postItem } from "../constants/operations";
const logoText = {
  fontSize: "1.7rem",
  fontWeight: "700",
  margin: 0,
  marginLeft: "10px",
};
const branding = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20
};

const LogIn = () => {

  const [loading, setLoading] = useState(false)
  const [showpass, setShowpass] = useState(false)
  const { currentUserData, updateCurrentUser } = useContext(AuthContext)
  const [errorObj, setErrorObj] = useState({})
  const [loginFormValue, setLoginFormValue] = useState({})



  const validateSingle = (value, key, callback) => {
    setLoginFormValue({ ...loginFormValue, ...value })
    // const { error, warning } = loginValidation
    //     .extract(key)
    //     .validate(value[key], { abortEarly: false, stripUnknown: true });
    // if (error && error.details) {


    //     let obj = {}
    //     error.details.forEach(val => (
    //         obj[key] = val.message
    //     ))
    //     setErrorObj(obj)
    // }

    // else {
    //     setErrorObj({})
    //     if (callback) {
    //         callback()
    //     }
    // }
  }
  const validate = (callback) => {
    // const { error, warning } = loginValidation
    //     .validate(loginFormValue, { abortEarly: false, stripUnknown: true });
    // if (error && error.details) {

    //     let obj = {}
    //     error.details.forEach(val => (
    //         obj[val.context.key] = val.message
    //     ))
    //     setErrorObj(obj)
    // }
    // else {
    //     setErrorObj({})
    //     if (callback) {
    //         callback()
    //     }
    // }
    callback()
  }

  const login = () => {
    // setLoading(true)
    // var api = activeKey === "2" ? 'staffs/login' : 'admin/login'
    // let api = "crm/login"
    // postItem(api, loginFormValue,
    //   (result) => {
    //     setLoading(false)
    //     updateCurrentUser(result)
    //   }, errMsg => {
    //     setLoading(false)
    //     console.log(errMsg)
    //     setErrorObj({ Email: "Incorrect Email", "Password": "Incorrect password" })
    //   }, updateCurrentUser, currentUserData)
    updateCurrentUser(defaultUserData)
  }

  return (
    <div style={{ minHeight: "100svh", }} className="flex flex-col justify-center items-center bg-system-primary-bg ">
      <div style={{ borderRadius: 20 }} className="bg-system-secondary-bg flex flex-col gap-4 login-form py-4 px-8 lg:px-16 lg:py-10">
        <center>
          <Logo height={80} />
        </center>
        <div>
          <h1 className="text-3xl font-semibold text-system-primary-accent">
            Login
          </h1>
          <p className="text-system-primary-text text-lg font-medium">Login to your account to access all the features of Horasis!</p>
        </div>
        <div>
          <h1 className="text-system-primary-text font-medium text-lg">Email</h1>
          {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
          <Input
            className="py-4 rounded-xl border-2 border-system-file-border-accent"
            width="full"
            name="email"
            placeholder="Ex. abc@efg.com"
            setValue={(e) => {
              validateSingle({ ['Email']: e }, 'Email')
            }}
            value={loginFormValue.Email}
            type="text"
          />
          {errorObj['Email'] != undefined && <p className="text-brand-red m-0" >{errorObj['Email']}</p>}
        </div>
        <div>
          <h1 className="text-system-primary-text font-medium text-lg">Password</h1>
          <Input
            className="py-4 rounded-xl border-2 border-system-file-border-accent"
            width="full"
            name="password"
            placeholder="Enter the password"
            setValue={(e) => {
              validateSingle({ ['Password']: e }, 'Password')
            }}
            value={loginFormValue.Password}
            type={showpass ? "text" : "password"}
          // withIcon="true"
          // icon={showpass ? icons.eyeon.outline : icons.eyeoff.outline}
          // iconpos="right"
          // iconClick={() => {
          //   setShowpass((prev) => !prev);
          // }}
          />
          {errorObj['Password'] != undefined && <p className="text-brand-red m-0" >{errorObj['Password']}</p>}
        </div>

        <div className="mt-4">
          <Button
            loading={false}
            onClick={() => {
              validate(login)
            }}
            variant="black"
            width="full"
          >
            Login
          </Button>
        </div>




      </div>
    </div>
  );
};

export default LogIn;
