import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Table, Space, Badge, Select, Modal, Form, message, TimePicker , Upload, Divider} from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';

import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const onChange = (time, timeString) => {
    console.log(time, timeString);
};

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const ShiftMaster = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [shifts, setShifts] = useState([]);
    const [searchShift, setSearchShift] = useState('');
    const [filteredShifts, setFilteredShifts] = useState([]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        { title: 'Shift ID', dataIndex: 'shift_id', key: 'shift_id' },
        { title: 'Shift Name', dataIndex: 'shift_name', key: 'shift_name' },
        { title: 'Start Time', dataIndex: 'start_time', key: 'start_time' },
        { title: 'End Time', dataIndex: 'end_time', key: 'end_time' },
        { title: 'Shift Type Name', dataIndex: 'shift_type', key: 'shift_type' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteShift(record)} danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { shift_id, shift_name, start_time, end_time, shift_type } = values;

            const response = await fetch('http://localhost:5000/api/addshiftmaster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shift_id,
                    shift_name,
                    start_time: dayjs(start_time).format('HH:mm:ss'),
                    end_time: dayjs(end_time).format('HH:mm:ss'),
                    shift_type,
                }),
            });

            if (response.ok) {
                message.success('Shift added successfully');
                form.resetFields(); 
                setIsModalOpen(false);
                fetchShifts(); 
            } else {
                message.error('Failed to add shift');
            }
        } catch (error) {
            console.error('Error adding shift:', error);
            message.error('An error occurred');
        }
    };

    const fetchShifts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/shiftsmaster');
            if (!response.ok) {
                throw new Error('Failed to fetch shifts');
            }
            const data = await response.json();
            setShifts(data);
            setFilteredShifts(data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
            message.error('Failed to fetch shifts');
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);


    const handleDeleteShift = async (record) => {
        if (window.confirm(`Are you sure you want to delete ${record.shift_name}?`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/shifts/${record.shift_id}`, { method: 'DELETE' });
                if (response.ok) {
                    message.success('Shift deleted successfully');

                    const updatedShifts = shifts.filter(shift => shift.shift_id !== record.shift_id);
                    setShifts(updatedShifts);
                    setFilteredShifts(updatedShifts);
                } else {
                    message.error('Failed to delete shift');
                }
            } catch (error) {
                console.error('Error deleting shift:', error);
                message.error('An error occurred');
            }
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSearchChange = (value) => {
        setSearchShift(value);
        if (value) {
            const filtered = shifts.filter(shift =>
                shift.shift_name.toLowerCase().includes(value.toLowerCase()) || shift.shift_id.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredShifts(filtered);
        } else {
            setFilteredShifts(shifts);
        }
    };

    const handleFileChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleBeforeUpload = (file) => {
        const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExcel) {
            message.error('You can only upload Excel file!');
        }
        return isExcel;
    };

    const handleFileUpload = async (file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const shiftsData = XLSX.utils.sheet_to_json(sheet); // อ่านข้อมูลจาก Excel Sheet
    
            try {
                const response = await fetch('http://localhost:5000/api/upload-shift-master', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ shifts: shiftsData }), // ส่งข้อมูล shifts ไปยัง backend
                });
    
                const result = await response.json();
                if (response.ok) {
                    message.success('Shift data uploaded successfully!');
                } else {
                    message.error('Failed to upload shift data');
                }
            } catch (error) {
                console.error('Error uploading shift data:', error);
                message.error('Error uploading shift data');
            }
        };
        reader.readAsBinaryString(file);
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
                    <small>Shift Master</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Search
                                placeholder="Search Shift ID / Shift Name"
                                onChange={(e) => handleSearchChange(e.target.value)}
                                allowClear
                                style={{ width: 200, marginRight: '20px', marginLeft: '20px' }}
                            />
                        </div>
                        <Button type="primary" onClick={showModal}>
                            Add Shift Master
                        </Button>
                        <Modal title="Add Shift Master" open={isModalOpen} onOk={handleOk} okText="Submit" onCancel={handleCancel}>
                            <Form form={form} layout="vertical" style={{ marginTop: '2rem' }}>
                                <Form.Item
                                    name="shift_id"
                                    label="Shift ID"
                                    rules={[{ required: true, message: 'Please enter Shift ID' }]}
                                >
                                    <Input placeholder="Enter Shift ID" />
                                </Form.Item>

                                <Form.Item
                                    name="shift_name"
                                    label="Shift Name"
                                    rules={[{ required: true, message: 'Please enter Shift Name' }]}
                                >
                                    <Input placeholder="Enter Shift Name" />
                                </Form.Item>

                                <Form.Item
                                    name="start_time"
                                    label="Start Time"
                                    rules={[{ required: true, message: 'Please Select Start Time' }]}
                                >
                                    <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    name="end_time"
                                    label="End Time"
                                    rules={[{ required: true, message: 'Please Select End Time' }]}
                                >
                                    <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    name="shift_type"
                                    label="Shift Type"
                                    rules={[{ required: true, message: 'Please select Shift Type' }]}
                                >
                                    <Select
                                        placeholder="Select Shift Type"
                                        options={[
                                            { value: 'Regular', label: 'Regular' },
                                            { value: 'OT', label: 'OT' }
                                        ]}
                                    />
                                </Form.Item>

                                <Divider />
                                <h3 style={{ marginBottom: '1rem' }}>Download Template File</h3>
                                <a href="/Insert_Shift_Master.xlsx" download>
                                    <Button type="primary">Insert Master Shift Template</Button>
                                </a>

                                <Divider />
                                <h3 style={{ marginBottom: '1rem' }}>Upload File</h3>
                                <Upload
                                    beforeUpload={handleBeforeUpload}
                                    customRequest={({ file, onSuccess, onError }) => {
                                        handleFileUpload(file).then(() => onSuccess());
                                    }}
                                    onChange={handleFileChange}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Excel File</Button>
                                </Upload>
                            </Form>
                        </Modal>
                    </div>
                    <div style={{ padding: '10px', marginTop: '15px' }}>
                        Total: <Badge count={shifts.length} color="#faad14" />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredShifts}
                        pagination={{ pageSize: 7 }}
                        rowKey="shift_id"
                    />

                </Content>
            </Layout>
        </Layout>
    );
};

export default ShiftMaster;


