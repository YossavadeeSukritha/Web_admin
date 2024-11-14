import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Table, Space, Badge ,Tag,Select} from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const Request = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [data, setData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // ดึงข้อมูล Requests จาก backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/requests')
            .then(response => {
                const formattedData = response.data.map((item, index) => ({
                    key: index,
                    no: index + 1,
                    request_id: item.request_id,
                    request_type: item.request_type,
                    detail: item.reason,
                    status: item.status,
                    request_date: item.request_date
                }));
                setData(formattedData);
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
            });
    }, []);

    const columns = [
        { title: 'No', dataIndex: 'no', key: 'no' },
        { title: 'Request ID', dataIndex: 'request_id', key: 'request_id' },
        { title: 'Request Type', dataIndex: 'request_type', key: 'request_type' },
        { title: 'Detail', dataIndex: 'detail', key: 'detail' },
        { title: 'Status', dataIndex: 'status', key: 'status', 
            render: (status) => {
                let color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        { title: 'Request Date', dataIndex: 'request_date', key: 'request_date' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<CheckCircleOutlined />} onClick={() => handleEditClick(record)}>Appoved</Button>
                    <Button icon={<CloseCircleOutlined />} onClick={() => handleDeleteClick(record)} danger>Reject</Button>
                </Space>
            ),
        },
    ];

    const handleEditClick = (record) => {
        console.log('Edit request:', record);
    };

    const handleDeleteClick = (record) => {
        console.log('Delete request:', record);
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
                    <UserProfile />
                </Header>
                <Content style={{ padding: '10px' }}>
                    <small>Request</small>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                        <div>
                        <Select
                                showSearch
                                style={{
                                    width: 200,
                                    marginRight: '20px',
                                    marginLeft: '20px',
                                    marginTop: '20px'
                                }}
                                placeholder="Status"
                                options={[
                                    { value: '1', label: 'Pending' },
                                    { value: '2', label: 'Appoved' },
                                    { value: '2', label: 'Rejected' }
                                ]}
                            />
                        </div>
                    </div>
                    <div style={{ padding: '10px', marginTop: '15px' }}>
                        <span style={{ fontSize: 'larger' }}>
                            Total : <Badge count={data.length} showZero color="#faad14" />
                        </span>
                    </div>

                    <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} scroll={{ x: 1000 }} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Request;
