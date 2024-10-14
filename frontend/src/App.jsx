import React, { useState } from 'react';
import { Button, Layout, theme } from "antd";
import '../index.css'
import Logo from './Logo.jsx'
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const App = () => {
    //theme color
    const [darkTheme, setDarkTheme] = useState(true);
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <Layout className="layout">
                <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'}>
                    <Logo />
                    <MenuList darkTheme={darkTheme} />
                    <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
                </Sider>
                <Layout>
                    <Header style={{ display: 'flex', justifyContent: 'space-between', background: colorBgContainer, paddingLeft: '10px', paddingRight: '10px' }}>
                        <div>
                            <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
                        </div>
                        <div>
                            <UserProfile/>
                        </div>
                    </Header>
                   
                </Layout>
            </Layout>

        </>
    );
};

export default App;