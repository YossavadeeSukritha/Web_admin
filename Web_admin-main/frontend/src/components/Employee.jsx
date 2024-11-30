import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Input, Table, Space, Badge, Select, Modal, Form, message, Upload, Divider } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import * as XLSX from 'xlsx';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Employees = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [form] = Form.useForm();

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
                    <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} >
                        Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)} danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // Fetch Data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/employees');
                const data = await response.json();
                const employeesWithKeys = data.map(employee => ({
                    ...employee,
                    key: employee.employee_id,
                }));
                setEmployees(employeesWithKeys);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/departments');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchEmployees();
        fetchDepartments();
    }, []);

    // Modal Handlers
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpenEdit(false);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch('http://localhost:5000/api/addemployee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                message.success('Employee added successfully');
                form.resetFields();
                setIsModalOpen(false);
                setEmployees([...employees, { ...data, key: data.employee_id }]);
            } else {
                message.error(data.message || 'Failed to add employee');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            message.error('Please fill in all required fields correctly');
        }
    };

    const handleEditClick = (record) => {
        setEditRecord(record);
        form.setFieldsValue(record);
        setIsModalOpenEdit(true);
    };

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch(`http://localhost:5000/api/employees/${editRecord.employee_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('Employee updated successfully');
                setEmployees(employees.map(emp =>
                    emp.employee_id === editRecord.employee_id ? { ...emp, ...values } : emp
                ));
                setIsModalOpenEdit(false);
            } else {
                message.error('Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            message.error('Error updating employee');
        }
    };

    const handleDeleteClick = async (record) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${record.firstname} ${record.lastname}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/employees/${record.employee_id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setEmployees(employees.filter(employee => employee.employee_id !== record.employee_id));
                    message.success('Deleted successfully');
                } else {
                    message.error('Failed to delete employee');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    // Search and Filter
    const handleSearch = (value) => setSearchText(value);
    const filteredEmployees = employees.filter((employee) => {
        if (!searchText) return true;

        return (
            employee.employee_id.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.department_id === searchText
        );
    });

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
            const employeesData = XLSX.utils.sheet_to_json(sheet);

            try {
                const response = await fetch('http://localhost:5000/api/upload-employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ employees: employeesData }),
                });

                const result = await response.json();
                if (response.ok) {
                    message.success('Employees uploaded successfully!');
                } else {
                    message.error('Failed to upload employees');
                }
            } catch (error) {
                console.error('Error uploading employees:', error);
                message.error('Error uploading employees');
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
                                        label: `${dept.department_name}`,
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
                                    rules={[{ required: true, message: 'Please select a prefix' }]}
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

                                <Divider />
                                <h3 style={{ marginBottom: '1rem' }}>Download Template File</h3>
                                <a href="/Insert_Employee.xlsx" download>
                                    <Button type="primary">Insert Employee Template</Button>
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

                        <Modal title="Edit Employee" open={isModalOpenEdit} onOk={handleEditSubmit} okText="Update" onCancel={handleCancel}>
                            <Form form={form} layout="vertical" style={{ marginTop: '2rem' }}>
                                <Form.Item
                                    name="employee_id"
                                    label="Employee ID"
                                    rules={[{ message: 'Please enter Employee ID' }]}
                                >
                                    <Input placeholder="Enter Employee ID" disabled />
                                </Form.Item>

                                <Form.Item
                                    name="prefix"
                                    label="Prefix"
                                    rules={[{ message: 'Please select a prefix' }]}
                                >
                                    <Select
                                        placeholder="Select Prefix"
                                        options={[
                                            { value: 'นาย', label: 'นาย' },
                                            { value: 'นาง', label: 'นาง' },
                                            { value: 'นางสาว', label: 'นางสาว' }
                                        ]}
                                        disabled
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="firstname"
                                    label="First Name"
                                    rules={[{ message: 'Please enter first name' }]}
                                >
                                    <Input placeholder="Enter First Name" />
                                </Form.Item>

                                <Form.Item
                                    name="lastname"
                                    label="Last Name"
                                    rules={[{ message: 'Please enter last name' }]}
                                >
                                    <Input placeholder="Enter Last Name" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ message: 'Please enter email' }]}
                                >
                                    <Input placeholder="Enter Email" disabled />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[{ message: 'Please enter password' }]}
                                >
                                    <Input placeholder="Enter Password" />
                                </Form.Item>

                                <Form.Item
                                    name="role"
                                    label="Role"
                                    rules={[{ message: 'Please select role' }]}
                                >
                                    <Select
                                        placeholder="Select Role"
                                        options={[
                                            { value: 'admin', label: 'admin' },
                                            { value: 'employee', label: 'employee' }
                                        ]}
                                        disabled
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
