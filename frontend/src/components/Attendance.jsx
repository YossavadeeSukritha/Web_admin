import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Select, Table, Tag, Card, Col, Row, Statistic } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Attendance = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Table columns
    // Table columns
const columns = [
    { title: 'No', dataIndex: 'No', key: 'No' },
    { title: 'Clock ID', dataIndex: 'Clock_id', key: 'Clock_id' },
    { title: 'Employee ID', dataIndex: 'Employee ID', key: 'Employee ID' },
    { title: 'Prefix', dataIndex: 'Prefix', key: 'Prefix' },
    { title: 'First Name', dataIndex: 'First Name', key: 'First Name' },
    { title: 'Last Name', dataIndex: 'Last Name', key: 'Last Name' },
    { title: 'Department', dataIndex: 'Department', key: 'Department' },
    { title: 'Location', dataIndex: 'Location', key: 'Location' },
    { title: 'Start Date Time', dataIndex: 'Start Date Time', key: 'Start Date Time' },
    { title: 'End Date Time', dataIndex: 'End Date Time', key: 'End Date Time' },
    { title: 'Time In Location', dataIndex: 'Time In Location', key: 'Time In Location' },
    { title: 'Time Out Location', dataIndex: 'Time Out Location', key: 'Time Out Location' },
    { title: 'Duration', dataIndex: 'Duration', key: 'Duration' },
    { title: 'Status', dataIndex: 'Status', key: 'Status' },
];

    // Fetch attendance data
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/attendance');
                console.log('Attendance Data:', response.data); // เพิ่มบรรทัดนี้
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };
    
        fetchAttendanceData();
    }, []);

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
                    <UserProfile />
                </Header>
                <Content style={{ padding: '10px' }}>
                    <small>Attendance</small>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Search placeholder="Employee ID / Name" style={{ width: 200, marginRight: '20px', marginLeft: '20px' }} />
                            <Select showSearch style={{ width: 400, marginRight: '20px', marginLeft: '20px' }} placeholder="Department" />
                            <Select showSearch style={{ width: 400, marginRight: '20px', marginLeft: '20px' }} placeholder="Location" />
                            <Select showSearch style={{ width: 200, marginRight: '20px', marginLeft: '20px', marginTop: '20px' }} placeholder="Status" options={[{ value: 'Late', label: 'Late' }, { value: 'On-Time', label: 'On-Time' }, { value: 'No-Show', label: 'No-Show' }]} />
                        </div>
                        <Button type="primary" style={{ marginLeft: '20px' }}>Export</Button>
                    </div>

                    <Row gutter={16} style={{ margin: '2rem' }}>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic title="Active Employees" value={8000} valueStyle={{ color: '#fa7900' }} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic title="On Time" value={1} valueStyle={{ color: '#3f8600' }} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic title="Late" value={9} valueStyle={{ color: '#cf1322' }} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic title="No Show" value={9} valueStyle={{ color: '#666b73' }} />
                            </Card>
                        </Col>
                    </Row>

                    <Table
    columns={columns}
    dataSource={employees}
    pagination={{ pageSize: 7 }}
    rowKey={(record) => record.Clock_id} 
    scroll={{ x: 1000 }}
/>

                </Content>
            </Layout>
        </Layout>
    );
};

export default Attendance;
