import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Select, Table, Tag, DatePicker, Badge } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import axios from 'axios';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Attandance = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedRange, setSelectedRange] = useState([]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        { title: 'No', dataIndex: 'no', key: 'no' },
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
        { title: 'Prefix', dataIndex: 'prefix', key: 'prefix' },
        { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
        { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        { title: 'Time In Location', dataIndex: 'time_in_location', key: 'time_in_location' },
        { title: 'Time Out Location', dataIndex: 'time_out_location', key: 'time_out_location' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const color = status === 'Late' ? 'volcano' : 'green';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    const onSearch = (value) => {
        const filteredData = data.filter(item => {
            const matchesUserIdOrName =
                item.user_id.includes(value) ||
                `${item.firstname} ${item.lastname}`.toLowerCase().includes(value.toLowerCase());

            const matchesDepartment = selectedDepartment ? item.department === selectedDepartment : true;

            return matchesUserIdOrName && matchesDepartment;
        });
        setFilteredData(filteredData);
    };

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
        const filtered = data.filter(item => item.department_id === value);
        setFilteredData(filtered);
    };

    const handleLocationChange = (value) => {
        setSelectedLocation(value);
        const filteredData = data.filter(item => item.location_id === value);
        setFilteredData(filteredData);
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        const filteredData = data.filter(item => {
            const isLate = item.status.toLowerCase() === 'late';
            const isOnTime = item.status.toLowerCase() === 'on-time';

            if (value === '1') return isLate;
            if (value === '2') return isOnTime;
            return true;
        });
        setFilteredData(filteredData);
    };

    const handleRangeChange = (dates) => {
        if (!dates) {
            setFilteredData(data);
            return;
        }

        const [start, end] = dates;
        const filtered = data.filter(item => {
            const itemStart = dayjs(item.start_time);
            const itemEnd = dayjs(item.end_time);
            return itemStart.isBetween(start, end, null, '[]') ||
                itemEnd.isBetween(start, end, null, '[]');
        });

        setFilteredData(filtered);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clockinout');
                const fetchedData = response.data.map((item, index) => ({
                    ...item,
                    no: index + 1,
                    key: item.clock_id,
                }));
                setData(fetchedData);
                setFilteredData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

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
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/locations');
                if (Array.isArray(response.data)) {
                    const locationOptions = response.data.map(loc => ({
                        value: loc.value,
                        label: loc.label,
                    }));
                    setLocations(locationOptions);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

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
                    <small>Attendance</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Search placeholder="User ID / Name" allowClear onSearch={onSearch} style={{
                                width: 200,
                                marginRight: '20px',
                                marginLeft: '20px'
                            }} />
                            <Select
                                showSearch
                                style={{
                                    width: 400,
                                    marginRight: '20px',
                                    marginLeft: '20px'
                                }}
                                placeholder="Department"
                                onChange={handleDepartmentChange}
                                options={departments.map(dept => ({ value: dept.value, label: dept.label }))}
                            />
                            <Select
                                showSearch
                                style={{
                                    width: 400,
                                    marginRight: '20px',
                                    marginLeft: '20px'
                                }}
                                placeholder="Location"
                                onChange={handleLocationChange}
                                options={locations.map(location => ({
                                    value: location.value,
                                    label: location.label,
                                }))}
                                allowClear
                            />
                            <RangePicker showTime onChange={handleRangeChange} style={{
                                width: 400,
                                marginRight: '20px',
                                marginLeft: '20px',
                                marginTop: '20px'
                            }} />
                            <Select
                                showSearch
                                style={{
                                    width: 200,
                                    marginRight: '20px',
                                    marginLeft: '20px',
                                    marginTop: '20px'
                                }}
                                placeholder="Status"
                                onChange={handleStatusChange}
                                options={[
                                    { value: '1', label: 'Late' },
                                    { value: '2', label: 'On-Time' },
                                ]}
                            />
                        </div>
                        <Button type="primary" style={{ marginLeft: '20px' }}>
                            Export
                        </Button>
                    </div>
                    <div style={{ padding: '10px', marginTop: '15px' }}>
                        <span style={{ fontSize: 'larger' }}>
                            Total : <Badge count={filteredData.length} showZero color="#faad14" />
                        </span>
                    </div>

                    <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} scroll={{ x: 1000 }} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Attandance;
