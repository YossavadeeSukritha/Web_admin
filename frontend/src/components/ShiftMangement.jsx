import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Table, Space, Select, Form, message, DatePicker, Tag, Dropdown, Modal } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const ShiftManagement = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [shiftData, setShiftData] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(dayjs());
    const [weekDays, setWeekDays] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [shifts, setShifts] = useState([]);
    const navigate = useNavigate();
    const { token: { colorBgContainer } } = theme.useToken();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null); // สำหรับเก็บ shift ที่ถูกเลือก
    const [availableShifts, setAvailableShifts] = useState([]); // เก็บข้อมูล shift IDs ที่ดึงมาจากฐานข้อมูล
    const [newShiftId, setNewShiftId] = useState(''); // เก็บ Shift ID ที่เลือกใหม่


    const shiftColors = ['green', 'blue'];

    // Fetch shifts data
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shiftmanagement');
            console.log('Shift Data from API:', response.data);
            const groupedData = groupShiftsByEmployeeAndDate(response.data);
            setShiftData(groupedData);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Group shifts by employee and date
    const groupShiftsByEmployeeAndDate = (data) => {
        const grouped = {};

        data.forEach(employee => {
            const key = employee['Employee ID'];
            if (!grouped[key]) {
                grouped[key] = {
                    ...employee,
                    shiftsByDate: {}
                };
            }

            employee.Shifts.forEach(shift => {
                const dateKey = dayjs(shift['Assignment Date']).format('YYYY-MM-DD');
                if (!grouped[key].shiftsByDate[dateKey]) {
                    grouped[key].shiftsByDate[dateKey] = [];
                }
                grouped[key].shiftsByDate[dateKey].push(shift);
            });
        });

        return Object.values(grouped);
    };


    // Generate week days for display
    const generateWeekDays = (date) => {
        const monday = date.startOf('week').add(1, 'day');
        const days = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = monday.add(i, 'day');
            days.push({
                date: currentDay,
                display: `${currentDay.format('dddd D')}`
            });
        }
        return days;
    };

    useEffect(() => {
        const days = generateWeekDays(selectedWeek);
        setWeekDays(days);
    }, [selectedWeek]);

    // Delete shift
    const handleDeleteShift = async (assignedShiftId) => {
        try {
            // ลบ shift โดยใช้ assigned_shift_id
            const url = `http://localhost:5000/api/deleteshiftmanagement/${assignedShiftId}`;
            await axios.delete(url);
            message.success('Shift deleted successfully');
            fetchData(); // เรียก fetchData เพื่ออัปเดตข้อมูลหลังจากการลบ
        } catch (err) {
            console.error('Delete shift error:', err);
            message.error('Error deleting shift');
        }
    };

    // Context menu items
    const getContextMenuItems = (shift) => [
        {
            key: 'update',
            label: 'Update',
            onClick: () => showUpdateModal(shift),
        },
        {
            key: 'delete',
            label: 'Delete',
            danger: true,
            onClick: () => {
                console.log('Shift before deletion:', shift); // Add this to debug
                // ใช้ assigned_shift_id ในการลบ
                handleDeleteShift(shift['AssignedShift ID']);
            }
        }
    ];



    // Table columns
    const columns = [
        { title: 'Employee ID', dataIndex: 'Employee ID', key: 'employee_id' },
        { title: 'First Name', dataIndex: 'First Name', key: 'firstname' },
        { title: 'Last Name', dataIndex: 'Last Name', key: 'lastname' },
        ...weekDays.map((day) => ({
            title: day.display,
            key: day.date.format('YYYY-MM-DD'),
            render: (_, record) => {
                const currentDay = day.date.format('YYYY-MM-DD');
                const shifts = record.shiftsByDate[currentDay] || [];

                return (
                    <Space direction="vertical" size={4}>
                        {shifts.map((shift) => {
                            // ตรวจสอบค่าของ 'AssignedShift ID' และ 'assigned_shift_id'
                            console.log('Shift data:', shift);
                            console.log('AssignedShift ID:', shift['AssignedShift ID']);
                            console.log('assigned_shift_id:', shift.assigned_shift_id);

                            return (
                                <Dropdown
                                    key={`${shift['Employee ID']}-${shift['Shift ID']}`}
                                    trigger={['contextMenu']}
                                    menu={{
                                        items: getContextMenuItems(shift),
                                    }}
                                >
                                    <Tag
                                        color={shiftColors[shifts.indexOf(shift) % shiftColors.length]}
                                        style={{ padding: '4px 8px', cursor: 'context-menu' }}
                                    >
                                        {shift['Start time']} - {shift['End Time']}
                                    </Tag>
                                </Dropdown>
                            );
                        })}
                    </Space>
                );
            }

        }))
    ];

    const handleWeekChange = (date) => {
        if (date) {
            setSelectedWeek(date);
        }
    };

    // Filtered shift data
    const filteredShiftData = shiftData.filter((record) => {
        if (!searchText) return true;

        return (
            record['Employee ID'].toLowerCase().includes(searchText.toLowerCase()) ||
            record['First Name'].toLowerCase().includes(searchText.toLowerCase()) ||
            record['Last Name'].toLowerCase().includes(searchText.toLowerCase())
        );
    });

    const handleAssignShift = () => {
        navigate('/AddShift');
    };

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/shiftsmaster');
                const data = await response.json();
                setShifts(data);
            } catch (error) {
                console.error('Error fetching shifts:', error);
            }
        };
        fetchShifts();
    }, []);

    const showUpdateModal = (shift) => {
        setSelectedShift(shift); // เก็บ shift ที่เลือกไว้ใน Modal
        setModalVisible(true); // แสดง Modal
        fetchAvailableShifts(); // ดึงข้อมูล Shift IDs ใหม่จากฐานข้อมูล
    };

    const fetchAvailableShifts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shiftsmaster'); // ดึงข้อมูล Shift IDs จากฐานข้อมูล
            setAvailableShifts(response.data); // เก็บข้อมูล Shift IDs ที่ได้รับ
        } catch (err) {
            console.error('Error fetching available shifts:', err);
        }
    };

    const handleUpdateShift = async () => {
        try {
            if (!newShiftId) {
                message.error('Please select a new Shift ID');
                return;
            }
            
            const url = `http://localhost:5000/api/updatetshift/${selectedShift['AssignedShift ID']}`;
            const response = await axios.put(url, {
                shiftId: newShiftId, // ส่ง Shift ID ใหม่
            });
    
            message.success('Shift updated successfully');
            fetchData(); // เรียกข้อมูลใหม่หลังการอัปเดต
            setModalVisible(false); // ปิด Modal
        } catch (err) {
            console.error('Error updating shift:', err);
            message.error('Failed to update shift');
        }
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
                    <small>Shift Management</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <Search
                                placeholder="Employee ID / Name"
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 200, marginRight: '20px', marginLeft: '20px' }}
                            />

                            <Space>
                                <DatePicker
                                    picker="week"
                                    onChange={(date) => setSelectedWeek(date)}
                                    defaultValue={dayjs()}
                                    style={{ width: 200, marginRight: '20px', marginLeft: '20px' }}
                                />
                            </Space>
                        </div>
                        <Button type="primary" onClick={handleAssignShift}>
                            Assign Shift
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredShiftData}
                        rowKey={(record) => `${record['Employee ID']}-${record['Shift ID']}`}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />

                    <Modal
                        title="Update Shift"
                        visible={modalVisible}
                        onCancel={() => setModalVisible(false)} // ปิด Modal
                        onOk={handleUpdateShift} // เมื่อกด OK ให้เรียกฟังก์ชัน update
                    >
                        <Form>
                            <Form.Item label="Shift ID">
                                <Select
                                    value={newShiftId}
                                    onChange={(value) => setNewShiftId(value)} // เมื่อเลือก Shift ID ใหม่
                                >
                                    {availableShifts.map((shift) => (
                                        <Select.Option key={shift.shift_id} value={shift.shift_id}>
                                            {shift.shift_id}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>



                </Content>
            </Layout>
        </Layout>
    );
};

export default ShiftManagement;






