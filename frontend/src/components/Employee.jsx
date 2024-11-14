import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Table, Space, Badge, Select, Modal, Form, message } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Employees = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        { title: 'Employee ID', dataIndex: 'employee_id', key: 'employee_id' },
        { title: 'Prefix', dataIndex: 'prefix', key: 'prefix' },
        { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
        { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Department ID', dataIndex: 'department_id', key: 'department_id' },
        { title: 'Department Name', dataIndex: 'department', key: 'department' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)} danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/employees');
                const data = await response.json();
                const employeesWithKeys = data.map(employee => ({
                    ...employee,
                    key: employee.employee_id
                }));
                setEmployees(employeesWithKeys);
            } catch (error) {
                console.error('Error fetching employees', error);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/departments');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    

    const handleDeleteClick = async (record) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${record.firstname} ${record.lastname}?`);

        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/employees/${record.employee_id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setEmployees(employees.filter(employee => employee.employee_id !== record.employee_id));
                    message.success('Delete successfully');
                } else {
                    message.error('Failed to delete employee');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const response = await fetch('http://localhost:5000/api/addemployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.ok) {
                message.success('Employee added successfully');
                form.resetFields();
                setIsModalOpen(false);
                setEmployees([...employees, { ...data, key: data.employee_id }]);
            } else {
                message.error(data.message || 'Failed to add employee');
                if (data.detail) {
                    console.error('Error detail:', data.detail);
                }
            }
        } catch (error) {
            console.error('Full error:', error);
            if (error.errorFields) {
                message.error('Please fill in all required fields correctly');
            } else {
                message.error('Error: ' + (error.message || 'Failed to add employee'));
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //search
    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleSearchChange = (e) => {
        if (e.target.value === "") {
            setSearchText("");
        }
    };

    const filteredEmployees = employees.filter((employee) => {
        if (!searchText) return true;

        return (
            employee.employee_id.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.department_id === searchText
        );
    });


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
                    <small>All Employees</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                            <Search
                                placeholder="Employee ID / Name"
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 200, marginRight: '20px', marginLeft: '20px' }}
                            />
                            <Select
                                showSearch
                                style={{ width: 400, marginRight: '20px', marginLeft: '20px' }}
                                placeholder="Select Department"
                                options={[
                                    { value: '', label: 'All Departments' }, 
                                    ...departments?.map(dept => ({
                                        value: dept.department_id,
                                        label: `${dept.department_id} ${dept.department_name}`,
                                    }))
                                ]}
                                onChange={(value) => setSearchText(value)}
                                allowClear
                            />
                        </div>
                        <Button type="primary" onClick={showModal}>
                            Add Employee
                        </Button>
                        <Modal title="Add New Employee" open={isModalOpen} onOk={handleOk} okText="Submit" onCancel={handleCancel}>
                            <Form form={form} layout="vertical" style={{ marginTop: '2rem' }}>
                                <Form.Item
                                    name="employee_id"
                                    label="Employee ID"
                                    rules={[{ required: true, message: 'Please enter Employee ID' }]}
                                >
                                    <Input placeholder="Enter Employee ID" />
                                </Form.Item>

                                <Form.Item
                                    name="prefix"
                                    label="Prefix"
                                    rules={[{ required: true, message: 'Please select a prefix'}]}
                                >
                                    <Select
                                        placeholder="Select Prefix"
                                        options={[
                                            { value: 'นาย', label: 'นาย' },
                                            { value: 'นาง', label: 'นาง' },
                                            { value: 'นางสาว', label: 'นางสาว' }
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="firstname"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter first name' }]}
                                >
                                    <Input placeholder="Enter First Name" />
                                </Form.Item>

                                <Form.Item
                                    name="lastname"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please enter last name' }]}
                                >
                                    <Input placeholder="Enter Last Name" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Please enter email' }]}
                                >
                                    <Input placeholder="Enter Email" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[{ required: true, message: 'Please enter password' }]}
                                >
                                    <Input placeholder="Enter Password" />
                                </Form.Item>


                                <Form.Item
                                    name="role"
                                    label="Role"
                                    rules={[{ required: true, message: 'Please select role' }]}
                                >
                                    <Select
                                        placeholder="Select Role"
                                        options={[
                                            { value: 'admin', label: 'admin' },
                                            { value: 'employee', label: 'employee' }
                                        ]}
                                    />
                                </Form.Item>


                                <Form.Item
                                    name="department_id"
                                    label="Department Name"
                                    rules={[{ required: true, message: 'Please select a department' }]}
                                >
                                    <Select
                                        placeholder="Select Department"
                                        options={departments?.map(dept => ({
                                            value: dept.department_id,
                                            label: `${dept.department_id} ${dept.department_name}`,
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
                        dataSource={filteredEmployees}
                        rowKey="employee_id"
                        pagination={{ pageSize: 7 }}
                        scroll={{ x: 1000 }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Employees;
