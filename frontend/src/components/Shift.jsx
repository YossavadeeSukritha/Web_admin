import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Select, Table, Badge, Space } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import axios from 'axios';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Shift = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    const handleAssignShift = () => {
        navigate('/AddShift');
    };

    const columns = [
        { title: 'No.', dataIndex: 'no', key: 'no', render: (_, __, index) => index + 1 },
        { title: 'Shift ID', dataIndex: 'shift_id', key: 'shift_id' },
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
        { title: 'Prefix', dataIndex: 'prefix', key: 'prefix' },
        { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
        { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
                        Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)} danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const onSearch = (value, type) => {
       
    };
    

    
    

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/departments');
                setDepartments(response.data || []);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchShiftData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/shifts');
                setData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error('Error fetching shift data:', error);
            }
        };

        fetchShiftData();
    }, []);

    const handleEditClick = (record) => {
        // Implement your edit logic here
        console.log("Edit", record);
    };

    const handleDeleteClick = (record) => {
        // Implement your delete logic here
        console.log("Delete", record);
    };

    return (
        <Layout className="layout">
            <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'}>
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
                    <small>Shift</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Search placeholder="Search by Shift ID" allowClear  style={{
                                width: 200,
                                marginRight: '20px',
                            }} />
                            <Search placeholder="Search by User ID / Name" allowClear  style={{
                                width: 200,
                                marginRight: '20px',
                            }} />
                            <Select
                                showSearch
                                style={{
                                    width: 200,
                                    marginRight: '20px',
                                }}
                                placeholder="Department"
                            
                                options={departments.map(dept => ({ value: dept.department_id, label: dept.name }))}
                            />
                        </div>
                        <Button type="primary" onClick={handleAssignShift}>
                            Assign Shift
                        </Button>
                    </div>
                    <div style={{ padding: '10px', marginTop: '15px' }}>
                        <span style={{ fontSize: 'larger' }}>
                            Total : <Badge count={filteredData.length} showZero color="#faad14" />
                        </span>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredData.map(item => ({ ...item, key: item.shift_id }))}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 1000 }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Shift;
