import { ClockCircleFilled } from "@ant-design/icons";
import logoimg from '../assets/Logo.png'
const Logo = () => {
    return (
        <div className="logo">
            {/* <div className="logo-icon"><ClockCircleFilled /></div> */}
            <img src={logoimg} alt="Logo" className="logo-icon" />
        </div>
    )
}

export default Logo;