import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Table, Space, Badge, Select, Modal, Form, message, Upload, Divider, Tag } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const AddLocation = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [locations, setLocations] = useState([]);
    const [editRecord, setEditRecord] = useState(null);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        { title: 'Employee ID', dataIndex: 'employee_id', key: 'employee_id' },
    { title: 'Prefix', dataIndex: 'prefix', key: 'prefix' },
    { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
    {
        title: 'Location Name', 
        dataIndex: 'location_names', 
        key: 'location_names',
        render: (locationNames) => (
          <Space>
            {locationNames.split(', ').map((location, index) => (
              <Tag key={index}>{location}</Tag> // แสดงชื่อ location ด้วย Tag
            ))}
          </Space>
        ),
      },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (

                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} >
                        Edit
                    </Button>

                </Space>
            ),
        },
    ];

    // Fetch Data
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/locations'); // เปลี่ยน endpoint เป็น location
                const data = await response.json();
                setLocations(data); // เปลี่ยนเป็น setLocations
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/employeeslocation');
            setEmployees(response.data);
          } catch (error) {
            console.error('Error fetching employees:', error);
          }
        };
    
        fetchEmployees();
      }, []);

    const showModal = () => setIsModalOpen(true);

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpenEdit(false);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            
            // ค่า location_ids จะเป็น array ของ location_id
            const { employee_id, location_ids } = values;
    
            console.log('Submitted Values:', { employee_id, location_ids });
    
            // ส่งข้อมูลไป backend
            const response = await axios.post('http://localhost:5000/api/add-employee-locations', {
                employee_id,
                location_ids, // ส่ง array location_ids
            });
    
            message.success('Locations added successfully!');
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Failed to add locations.');
        }
    };
    

    const handleEditClick = (record) => {
        setEditRecord(record);
        form.setFieldsValue({
          employee_id: record.employee_id,
          location_ids: record.location_names.split(', ').map(loc => locations.find(location => location.location_name === loc)?.location_id),
        });
        setIsModalOpenEdit(true);
      };
    
      const handleEditSubmit = async () => {
        try {
          const values = await form.validateFields();
          const { employee_id, location_ids } = values;
    
          // ส่งข้อมูลไป backend เพื่ออัพเดต locations
          const response = await axios.put('http://localhost:5000/api/update-employee-locations', {
            employee_id,
            location_ids,
          });
    
          message.success('Locations updated successfully!');
          form.resetFields();
          setIsModalOpenEdit(false);
        } catch (error) {
          console.error('Error submitting form:', error);
          message.error('Failed to update locations.');
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
                    <small>Add Location</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Search
                                placeholder="Employee ID / Name"
                                allowClear

                                style={{ width: 200, marginRight: '20px', marginLeft: '20px' }}
                            />

                        </div>
                        <Button type="primary" onClick={showModal}>
                            Add Location
                        </Button>
                        <Modal title="Add Location" open={isModalOpen} onOk={handleOk} okText="Submit" onCancel={handleCancel}>
                            <Form form={form} layout="vertical" style={{ marginTop: '2rem' }}>
                                <Form.Item
                                    name="employee_id"
                                    label="Employee ID"
                                    rules={[{ required: true, message: 'Please enter Employee ID' }]}
                                >
                                    <Input placeholder="Enter Employee ID" />
                                </Form.Item>

                                <Form.Item
    name="location_ids" 
    label="Location Names"
    rules={[{ required: true, message: 'Please select at least one location' }]}
>
    <Select
        mode="multiple"
        placeholder="Select Locations"
        options={locations?.map(location => ({
            value: location.location_id,
            label: location.location_name, // แก้ไข template literal เป็น property
        }))}
    />
</Form.Item>
                            </Form>


                        </Modal>
                        <Modal
            title={isModalOpenEdit ? 'Edit Location' : 'Add Location'}
            open={isModalOpen || isModalOpenEdit}
            onOk={isModalOpenEdit ? handleEditSubmit : handleOk}
            onCancel={handleCancel}
            okText="Submit"
          >
            <Form form={form} layout="vertical" style={{ marginTop: '2rem' }}>
              <Form.Item
                name="employee_id"
                label="Employee ID"
                rules={[{ required: true, message: 'Please enter Employee ID' }]}
              >
                <Input placeholder="Enter Employee ID" disabled={isModalOpenEdit} />
              </Form.Item>
              <Form.Item
                name="location_ids" 
                label="Location Names"
                rules={[{ required: true, message: 'Please select at least one location' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Locations"
                  options={locations?.map(location => ({
                    value: location.location_id,
                    label: location.location_name,
                  }))}
                />
              </Form.Item>
            </Form>
          </Modal>


                    </div>
                    <div style={{ padding: '10px', marginTop: '15px' }}>
                        <span style={{ fontSize: 'larger' }}>
                            Total : <Badge count={employees.length} color="#faad14" />
                        </span>
                    </div>
                    <Table
      columns={columns}
      dataSource={employees}
      rowKey="employee_id"
      pagination={{ pageSize: 7 }}
      scroll={{ x: 1000 }}
    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AddLocation;
