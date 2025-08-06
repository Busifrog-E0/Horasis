import { NavLink } from "react-router-dom"
import LogoImage from '../../assets/images/logo-horasis.png'
import WhiteLogoImage from '../../assets/images/logo-horasis-white.png'

const Logo = ({ height = 50, type = "blue" }) => {
    return <NavLink to="/" className=" select-none" >
        {type === "blue" ?
            <img className="table-desktop select-none" src={LogoImage} style={{ height: height }} />
            :
            <img className="table-desktop select-none" src={WhiteLogoImage} style={{ height: height }} />
        }
        {/* <img className="table-mobile" src={'https://firebasestorage.googleapis.com/v0/b/vitaljobsdeploy.appspot.com/o/branding%2Flogo.svg?alt=media'} style={{ height: 40 }} /> */}
    </NavLink >
}

export default Logo