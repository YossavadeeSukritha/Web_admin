import { UserOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Popover, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/');
    };
    const content = (
        <List>
            <List.Item><UserOutlined /> My Account</List.Item>
            <List.Item>
                <Button type="primary" onClick={handleLogout}><LogoutOutlined /> Logout</Button>
            </List.Item>
        </List>
    );
    return (
        <div style={{ display: "flex" }}>
            <div>
                <Popover placement="bottomRight" content={content} >
                    <Avatar size={38} icon={<UserOutlined />} />
                </Popover>
            </div>
        </div>
    )
}

export default UserProfile;