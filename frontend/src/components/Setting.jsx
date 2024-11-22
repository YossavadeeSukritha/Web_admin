import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Divider, Radio, Space, message } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';

const { Header, Sider, Content } = Layout;

const Setting = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [value, setValue] = useState('noautoclockout'); // ค่าเริ่มต้นเป็น 'noautoclockout'
    const [radius, setRadius] = useState('');
    const [isEditing, setIsEditing] = useState(false);  // เพิ่มสถานะสำหรับการแก้ไข

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // ดึงค่า radius จากฐานข้อมูลเมื่อคอมโพเนนต์โหลด
    useEffect(() => {
        const fetchRadius = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/get-radius');
                const data = await response.json();
                if (response.ok) {
                    setRadius(data.radius);  // ตั้งค่า radius จากฐานข้อมูล
                } else {
                    message.error('ไม่สามารถดึงค่า radius');
                }
            } catch (error) {
                message.error('เกิดข้อผิดพลาดในการดึงค่า radius');
            }
        };

        fetchRadius();
    }, []);

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/update-radius', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ radius }),  // ส่งค่า radius ไป
            });

            const result = await response.json();

            if (response.ok) {
                message.success('อัปเดต radius เรียบร้อย');
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error('ไม่สามารถอัปเดต radius');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);  // เปลี่ยนเป็นโหมดแก้ไข
    };

    return (
        <Layout className="layout">
            <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'} width={250}>
                <Logo />
                <MenuList darkTheme={darkTheme} />
                <ToggleThemeButton darkTheme={darkTheme} toggleTheme={() => setDarkTheme(!darkTheme)} />
            </Sider>
            <Layout>
                <Header style={{ display: 'flex', justifyContent: 'space-between', background: colorBgContainer, padding: '0 10px' }}>
                    <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
                </Header>
                <Content style={{ padding: '10px' }}>
                    <small>Setting</small>
                    <div style={{ margin: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Set Radius</h4>
                        <Input
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            placeholder="Set radius (m)"
                            disabled={!isEditing}  // ปิดการแก้ไขถ้าไม่อยู่ในโหมดแก้ไข
                            style={{ width: "30%" }}
                        />

                        <Divider />
                        <h4 style={{ marginBottom: '1rem' }}>Clock Out Mode</h4>

                        <Radio.Group onChange={onChange} value={value}>
                            <Space direction="vertical">
                                <Radio value="autoclockout">Auto Clock Out</Radio>
                                <Radio value="noautoclockout">No Auto Clock Out</Radio>
                            </Space>
                        </Radio.Group>
                        <Divider />
                    </div>
                    <Button htmlType="button" style={{ margin: '1rem' }} onClick={handleEdit} disabled={isEditing}>
                        Edit
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleSave}
                        disabled={!isEditing}  // ปิดการใช้งานถ้าไม่ได้อยู่ในโหมดแก้ไข
                    >
                        Save
                    </Button>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Setting;
