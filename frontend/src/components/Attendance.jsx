import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Select, Table, Tag, Card, Col, Row, Statistic, Space, DatePicker } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const PickerWithType = ({ type, onChange }) => {
    return <DatePicker picker={type} onChange={onChange} />;
};

const Attendance = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [locations, setLocations] = useState([]);
    const [type, setType] = useState('date');
    const [selectedDate, setSelectedDate] = useState(null);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        { title: 'No', dataIndex: 'No', key: 'No' },
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
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'Status',
            render: (_, { Status }) => {
                console.log('Status:', Status);

                let color;
                switch (Status.toLowerCase()) {
                    case 'on-time':
                        color = 'green';
                        break;
                    case 'late':
                        color = 'red';
                        break;
                    case 'no-show':
                        color = 'grey';
                        break;
                    default:
                        color = 'default';
                }
                return (
                    <Tag color={color} key={Status}>
                        {Status ? Status.toUpperCase() : 'Unknown'}
                    </Tag>
                );
            }
        }
    ];

    const exportToCSV = () => {
        const currentDate = new Date().toISOString().split('T')[0];

        const csvData = filteredEmployees.map((employee) => ({
            No: employee['No'],
            
            "Employee ID": employee['Employee ID'],
            Prefix: employee['Prefix'],
            "First Name": employee['First Name'],
            "Last Name": employee['Last Name'],
            Department: employee['Department'],
            Location: employee['Location'],
            "Start Date Time": employee['Start Date Time'] || '-',
            "End Date Time": employee['End Date Time'] || '-',
            "Time In Location": employee['Time In Location'] || '-',
            "Time Out Location": employee['Time Out Location'] || '-',
            Duration: employee['Duration'],
            Status: employee['Status']
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        const filename = `Attendance_${currentDate}.csv`;
        saveAs(blob, filename);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [attendanceRes, departmentsRes, locationsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/attendance'),
                    axios.get('http://localhost:5000/api/departments'),
                    axios.get('http://localhost:5000/api/locations'),
                ]);
                setEmployees(attendanceRes.data);
                setDepartments(departmentsRes.data);
                setLocations(locationsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
    };

    const filteredEmployees = employees.filter((employee) => {
        const matchesSearchText =
            employee['Employee ID'].toLowerCase().includes(searchText.toLowerCase()) ||
            employee['First Name'].toLowerCase().includes(searchText.toLowerCase()) ||
            employee['Last Name'].toLowerCase().includes(searchText.toLowerCase());

        const matchesDepartment = selectedDepartment ? employee.Department === selectedDepartment : true;
        const matchesLocation = selectedLocation ? employee.Location === selectedLocation : true;
        const matchesStatus = selectedStatus ? employee.Status.toLowerCase() === selectedStatus.toLowerCase() : true;

        return matchesSearchText && matchesDepartment && matchesLocation && matchesStatus;
    });

    const getWeekNumber = (date) => {
        const firstDay = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDay) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
    };
    const filterDataByDate = (data, type, date) => {
        if (!date) return data;

        // แปลง dayjs object ให้เป็น Date object
        const selectedDate = dayjs(date).toDate();

        switch (type) {
            case 'date':
                return data.filter(item => {
                    const itemDate = new Date(item['Start Date Time']);
                    return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
                });
            case 'week':
                const selectedWeek = getWeekNumber(selectedDate);
                return data.filter(item => {
                    const itemDate = new Date(item['Start Date Time']);
                    return getWeekNumber(itemDate) === selectedWeek;
                });
            case 'month':
                return data.filter(item => {
                    const itemDate = new Date(item['Start Date Time']);
                    return itemDate.getMonth() === selectedDate.getMonth() && itemDate.getFullYear() === selectedDate.getFullYear();
                });
            case 'year':
                return data.filter(item => {
                    const itemDate = new Date(item['Start Date Time']);
                    return itemDate.getFullYear() === selectedDate.getFullYear();
                });
            default:
                return data;
        }
    };


    // กำหนดการกรองข้อมูล
    const filteredByDate = filterDataByDate(filteredEmployees, type, selectedDate);

    const handleDateChange = (value) => {
        setSelectedDate(value ? dayjs(value).toDate() : null);
    };



    const onTimeCount = employees.filter(employee => employee.Status === 'On-time').length;
    const lateCount = employees.filter(employee => employee.Status === 'Late').length;
    const noShowCount = employees.filter(employee => employee.Status === 'No-show').length;

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
                    <small>Attendance</small>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                                <div>
                                    <Search
                                        placeholder="Employee ID / Name"
                                        allowClear
                                        value={searchText}
                                        onChange={handleSearchChange}
                                        style={{ width: 200, marginRight: '20px', marginLeft: '20px' }}
                                    />
                                    <Select
                                        showSearch
                                        style={{ width: 400, marginRight: '20px', marginLeft: '20px' }}
                                        placeholder="Select Department"
                                        options={[
                                            { value: '', label: 'All Departments' },
                                            ...departments.map(dept => ({
                                                value: dept.department_name,
                                                label: `${dept.department_id} ${dept.department_name}`
                                            }))
                                        ]}
                                        onChange={handleDepartmentChange}
                                        allowClear
                                    />

                                </div>
                            </div>

                            <Select
                                showSearch
                                style={{ width: 400, marginRight: '20px', marginLeft: '20px' }}
                                placeholder="Select Location"
                                options={[
                                    { value: '', label: 'All Locations' },
                                    ...locations.map(location => ({
                                        value: location.location_name,
                                        label: location.location_name
                                    }))
                                ]}
                                onChange={(value) => setSelectedLocation(value)}
                                allowClear
                            />

                            <Select
                                showSearch
                                style={{ width: 200, marginRight: '20px', marginLeft: '20px', marginTop: '20px' }}
                                placeholder="Select Status"
                                options={[
                                    { value: '', label: 'All Status' },
                                    { value: 'Late', label: 'Late' },
                                    { value: 'On-time', label: 'On-Time' },
                                    { value: 'No-show', label: 'No-Show' },
                                    { value: 'Forgot to Clock Out', label: 'Forgot to Clock Out' }
                                ]}
                                onChange={(value) => setSelectedStatus(value)}
                                allowClear
                            />

                            <Space>
                                <Select value={type} onChange={setType} style={{ width: 80, marginLeft: '20px' }}>
                                    <Option value="date">Date</Option>
                                    <Option value="week">Week</Option>
                                    <Option value="month">Month</Option>
                                    <Option value="year">Year</Option>
                                </Select>
                                <PickerWithType style={{ width: 200 }} type={type} onChange={handleDateChange} />
                            </Space>


                        </div>
                        <Button type="primary" style={{ marginLeft: '20px'}} onClick={exportToCSV}>
                            Export to CSV
                        </Button>

                    </div>

                    <Row gutter={16} style={{ margin: '2rem' }}>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Active Employees"
                                    value={employees.filter(employee => employee.No).length} // คำนวณจำนวนของ No
                                    valueStyle={{ color: '#fa7900' }}
                                />
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="On Time"
                                    value={onTimeCount} // จำนวน On-time
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Late"
                                    value={lateCount} // จำนวน Late
                                    valueStyle={{ color: '#cf1322' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="No Show"
                                    value={noShowCount} // จำนวน No-show
                                    valueStyle={{ color: '#666b73' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={filteredByDate} // ใช้ข้อมูลที่กรองแล้ว
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




