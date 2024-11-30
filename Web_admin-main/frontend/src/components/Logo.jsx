import logoimg from '../assets/Logo.png'
const Logo = () => {
    return (
        <div className="logo">
            <img src={logoimg} alt="Logo" className="logo-icon" />
        </div>
    )
}

export default Logo;