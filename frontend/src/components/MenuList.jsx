import { AuditOutlined, ScheduleFilled, SignatureFilled, FileTextOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const MenuList = ({ darkTheme }) => {
    const navigate = useNavigate();

    const pageRedirect = (key) => {
        console.log('Page Key - ', key);
        navigate(`/${key}`);
    }

    const items = [   
        { label: 'Attandance', key: 'Attandance', icon: <ScheduleFilled /> },
        { label: 'Shift', key: 'Shift', icon: <AuditOutlined /> },
        { label: 'Assign Shift', key: 'AddShift', icon: <SignatureFilled /> },
        { label: 'Request', key: 'Request', icon: <FileTextOutlined /> },
    ]
    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode="inline"
            items={items}
            className="menu-bar"
            onClick={(e) => pageRedirect(e.key)}
        />
    )
}

export default MenuList;
