import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Table, Space, Badge, Select, Modal, Form, message, Divider, Upload} from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined ,UploadOutlined} from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import * as XLSX from 'xlsx';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Location = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [locations, setLocations] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        { title: 'Location ID', dataIndex: 'location_id', key: 'location_id' },
        { title: 'Location Name', dataIndex: 'location_name', key: 'location_name' },
        { title: 'Latitude', dataIndex: 'latitude', key: 'latitude' },
        { title: 'Longitude', dataIndex: 'longitude', key: 'longitude' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteLocation(record)} danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/locations');
                const data = await response.json();
                setLocations(data.map(loc => ({ ...loc, key: loc.location_id })));
                setFilteredLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch('http://localhost:5000/api/addlocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('Location added successfully');
                form.resetFields();
                setIsModalOpen(false);
                const newLocation = await response.json();
                setLocations([...locations, { ...newLocation, key: newLocation.location_id }]);
                setFilteredLocations([...locations, { ...newLocation, key: newLocation.location_id }]);
            } else {
                message.error('Failed to add location');
            }
        } catch (error) {
            console.error('Error adding location:', error);
            message.error('Failed to add location');
        }
    };

    const handleDeleteLocation = async (record) => {
        if (window.confirm(`Are you sure you want to delete ${record.location_name}?`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/locations/${record.location_id}`, { method: 'DELETE' });
                if (response.ok) {
                    message.success('Location deleted');
                    setLocations(locations.filter(loc => loc.location_id !== record.location_id));
                    setFilteredLocations(filteredLocations.filter(loc => loc.location_id !== record.location_id));
                } else {
                    message.error('Failed to delete location');
                }
            } catch (error) {
                console.error('Error deleting location:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSearchChange = (value) => {
        setSearchLocation(value);
        if (value) {
            const filtered = locations.filter(loc =>
                loc.location_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredLocations(filtered);
        } else {
            setFilteredLocations(locations);
        }
    };

    // File Upload Handlers
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
            const locationsData = XLSX.utils.sheet_to_json(sheet); 
    
            try {
                const response = await fetch('http://localhost:5000/api/upload-locationmaster', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ locations: locationsData }), 
                });
    
                const result = await response.json();
                if (response.ok) {
                    message.success('Locations uploaded successfully!');
                } else {
                    message.error(`Failed to upload locations: ${result.message}`);
                }
            } catch (error) {
                console.error('Error uploading locations:', error);
                message.error('Error uploading locations');
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
                    <small>Location Master</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Select
                                showSearch
                                style={{ width: 400, marginRight: '20px', marginLeft: '20px' }}
                                placeholder="Select Location"
                                onChange={handleSearchChange}
                                value={searchLocation}
                            >
                                <Select.Option key="" value="">All Locations</Select.Option>
                                {locations.map(loc => (
                                    <Select.Option key={loc.location_id} value={loc.location_name}>
                                        {loc.location_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        <Button type="primary" onClick={showModal}>
                            Add Location Master
                        </Button>
                        <Modal title="Add Location" open={isModalOpen} onOk={handleOk} okText="Submit" onCancel={handleCancel}>
                            <Form form={form} layout="vertical" style={{ marginTop: '2rem' }}>
                                <Form.Item
                                    name="location_id"
                                    label="Location ID"
                                    rules={[{ required: true, message: 'Please enter Location ID' }]}
                                >
                                    <Input placeholder="Enter Location ID" />
                                </Form.Item>

                                <Form.Item
                                    name="location_name"
                                    label="Location Name"
                                    rules={[{ required: true, message: 'Please enter Location Name' }]}
                                >
                                    <Input placeholder="Enter Location Name" />
                                </Form.Item>

                                <Form.Item
                                    name="latitude"
                                    label="Latitude"
                                    rules={[{ required: true, message: 'Please enter Latitude' }]}
                                >
                                    <Input placeholder="Enter Latitude" />
                                </Form.Item>

                                <Form.Item
                                    name="longitude"
                                    label="Longitude"
                                    rules={[{ required: true, message: 'Please enter Longitude' }]}
                                >
                                    <Input placeholder="Enter Longitude" />
                                </Form.Item>

                                <Divider />
                                <h3 style={{ marginBottom: '1rem' }}>Download Template File</h3>
                                <a href="Insert_Location_Master.xlsx" download>
                                    <Button type="primary">Insert Location Master Template</Button>
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
                        <span style={{ fontSize: 'larger' }}>
                            Total: <Badge count={locations.length} color="#faad14" />
                        </span>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredLocations}
                        pagination={{ pageSize: 7 }}
                        rowKey="location_id"
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Location;
