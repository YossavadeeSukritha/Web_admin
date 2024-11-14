import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon} from "react-icons/hi"
const ToggleThemeButton = ({darkTheme, toggleTheme}) => {
    return (
        <div style={{position: 'fixed', bottom: '1rem', left: '1rem'}}>
            <Button onClick={toggleTheme} icon={darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}></Button>
        </div>
    )
}
export default ToggleThemeButton;