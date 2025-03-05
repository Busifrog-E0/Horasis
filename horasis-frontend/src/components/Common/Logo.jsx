import { NavLink } from "react-router-dom"
import LogoImage from '../../assets/images/logo-tcs.png'

const Logo = ({ height = 50 }) => {
    return <NavLink to="/">
        <img className="table-desktop" src={LogoImage} style={{ height: height }} />
        {/* <img className="table-mobile" src={'https://firebasestorage.googleapis.com/v0/b/vitaljobsdeploy.appspot.com/o/branding%2Flogo.svg?alt=media'} style={{ height: 40 }} /> */}
    </NavLink >
}

export default Logo