import { AuditOutlined, ScheduleFilled, SignatureFilled, FileTextOutlined ,UserOutlined,CompassOutlined} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const MenuList = ({ darkTheme }) => {
    const navigate = useNavigate();

    const pageRedirect = (key) => {
        console.log('Page Key - ', key);
        navigate(`/${key}`);
    }

    const items = [   
        { label: 'Attendance', key: 'Attendance', icon: <ScheduleFilled /> },
        { label: 'Employees', key: 'Employees', icon: <UserOutlined /> },
        { label: 'Shift Master', key: 'ShiftMaster', icon: <AuditOutlined /> },
        { label: 'Assign Shift', key: 'AddShift', icon: <SignatureFilled /> },
        { label: 'Shift Management', key: 'ShiftManagement', icon: <FileTextOutlined /> },
        { label: 'Location Master', key: 'Location', icon: <CompassOutlined />},
        { label: 'Request', key: 'Request', icon: <FileTextOutlined /> }
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
