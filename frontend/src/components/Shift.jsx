import React, { useState } from 'react';
import { Button, Layout, theme, Input, Select, Table, Space } from "antd"; // Imported all required components from antd
import { UserAddOutlined, MenuUnfoldOutlined, MenuFoldOutlined, EditOutlined ,DeleteOutlined} from '@ant-design/icons'; // Importing icons
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import { useNavigate } from 'react-router-dom';


const { Header, Sider, Content } = Layout;

const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);


// Shift component
const Shift = () => {
    // Theme color
    const [darkTheme, setDarkTheme] = useState(true);
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    // Function to navigate to AddShift
    const handleAddShiftClick = () => {
        navigate('/AddShift');
    };

    // Function to navigate to EditShift (record could be passed to edit specific row)
    const handleEditClick = (record) => {
        navigate(`/editshift/${record.userid}`); // You can pass the record's ID if needed for editing
    };

    const handleDeleteClick = (record) => {
        navigate(`/deleteshift/${record.userid}`); // You can pass the record's ID if needed for editing
    };

    // Table columns
    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'User Id',
            dataIndex: 'userid',
            key: 'userid',
        },
        {
            title: 'Prefix',
            dataIndex: 'prefix',
            key: 'prefix',
        },
        {
            title: 'First Name',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Location', 
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditClick(record)} 
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteClick(record)} 
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // Table data
    const data = [
        {
            key: '1',
            no: '1',
            userid: 'U1001',
            prefix: 'Miss',
            firstname: 'John',
            lastname: 'Brown',
            department: 'Office of the President',
            location: 'Building A'
        },
    ];

    return (
        <>
            <Layout className="layout">
                <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'}>
                    <Logo />
                    <MenuList darkTheme={darkTheme} />
                    <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
                </Sider>
                <Layout>
                    <Header style={{ display: 'flex', justifyContent: 'space-between', background: colorBgContainer, paddingLeft: '10px', paddingRight: '10px' }}>
                        <div>
                            <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
                        </div>
                        <div>
                            <UserProfile />
                        </div>
                    </Header>
                    <Content>
                        <div style={{ padding: '10px' }}>
                            <small>Shift</small>
                        </div>

                        {/* Flex container to align Search, Select, and Button */}
                        <div style={{ paddingLeft: '10px', paddingRight: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Search
                                    placeholder="user id / name"
                                    allowClear
                                    onSearch={onSearch}
                                    style={{
                                        width: 200,
                                    }}
                                />

                                <Select
                                    showSearch
                                    style={{
                                        width: 200,
                                    }}
                                    placeholder="Department"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[
                                        { value: '1', label: 'HR' },
                                        { value: '2', label: 'IT' },
                                        { value: '3', label: 'Finance' },
                                    ]}
                                />
                            </div>

                            <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddShiftClick}>
                                Add Shift
                            </Button>
                        </div>

                        {/* Table */}
                        <div style={{ margin: 20 }}>
                            <Table columns={columns} dataSource={data} />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Shift;
