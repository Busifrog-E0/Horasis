import { convertPascalToNormalCase } from "../../utils/app/GetCapitalized"

const LoginInputField = ({ loginFormValue, errorOj, validateSingle, field, type = 'text', info = 'info' }) => {
    return <div className="reg-input-group reg-flex">
        <label className="reg-form-label">
            {convertPascalToNormalCase(field)}
            {/* <InfoIcon title={info} /> */}
        </label>
        <input

            value={loginFormValue[field]}
            style={errorOj[field] != undefined ? { borderColor: 'red' } : {}}
            type={type}
            onChange={(e) => {
                validateSingle({ [field]: e.target.value }, field)
            }} placeholder={convertPascalToNormalCase(field)} />
        {errorOj[field] != undefined && <p style={{ color: 'red', margin: 0 }}>{errorOj[field]}</p>}

    </div>
}
export default LoginInputField
