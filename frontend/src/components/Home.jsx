import React, { useState , useEffect} from 'react';
import { Button, Layout, theme } from "antd";
import '../index.css'
import Logo from './Logo.jsx'
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import { Select } from 'antd';
import { DatePicker } from 'antd';
import { Table, Tag } from 'antd';
import departmentsData from '../data/departmen.json'

const { Header, Sider, Content } = Layout;

const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const { RangePicker } = DatePicker;

//Table
const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'User Id',
        dataIndex: 'userid',
        key: 'userid',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Prefix',
        dataIndex: 'prefix',
        key: 'prefix',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'First Name',
        dataIndex: 'firstname',
        key: 'firstname',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Last Name',
        dataIndex: 'lastname',
        key: 'lastname',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Start Time',
        dataIndex: 'starttime',
        key: 'starttime',
    },

    {
        title: 'Time In Location',
        dataIndex: 'timein',
        key: 'timein',
    },

    {
        title: 'End Time',
        dataIndex: 'endtime',
        key: 'endtime',
    },
    {
        title: 'Time Out Location',
        dataIndex: 'timeout',
        key: 'timeout',
    },

    {
        title: 'Status',
        key: 'status',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag === 'on-time' ? 'green' : 'red';

                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },

    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
    },
];

const data = [
    {
        key: '1',
        no: '1',
        userid: 'U1001',
        prefix: 'Miss',
        firstname: 'John ',
        lastname: ' Brown',
        department: 'Office of the President',
        starttime: '2024-10-10 00:09:00',
        timein: 'ON-SITE',
        endtime: '2024-10-10 00:16:00',
        timeout: 'OFF-SITE',
        tags: ['late', 'on-time'],
        location: 'Build'
    },
    // {
    //     key: '2',
    //     no:'1',
    //     userid:'U1001',
    //     name: 'John Brown',
    //     age: 32,
    //     address: 'New York No. 1 Lake Park',
    //     tags: ['nice', 'developer'],
    //   }
];

const Home = () => {
    //theme color
    const [darkTheme, setDarkTheme] = useState(true);
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    //departmentsData
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        setDepartments(departmentsData);
    }, []);


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
                        <div style={{ padding: '10px', marginBottom: '15px' }}>
                            <small>Home</small>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <Search
                                    placeholder="user id / name"
                                    allowClear
                                    onSearch={onSearch}
                                    style={{
                                        width: 200,
                                        marginRight: '20px',
                                        marginLeft: '20px'
                                    }}
                                />

                                <Select
                                    showSearch
                                    style={{
                                        width: 200,
                                        marginRight: '20px'
                                    }}
                                    placeholder="Location"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '1',
                                            label: 'Not Identified',
                                        },
                                        {
                                            value: '2',
                                            label: 'Closed',
                                        },
                                        {
                                            value: '3',
                                            label: 'Communicated',
                                        },
                                        {
                                            value: '4',
                                            label: 'Identified',
                                        },
                                        {
                                            value: '5',
                                            label: 'Resolved',
                                        },
                                        {
                                            value: '6',
                                            label: 'Cancelled',
                                        },
                                    ]}
                                />

<Select
            showSearch
            style={{ width: 200, marginRight: '20px' }}
            placeholder="Department"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={departments}
        />

                                <RangePicker showTime style={{ marginRight: '20px' }} />

                                <Select
                                    showSearch
                                    style={{
                                        width: 200,
                                        marginLeft: '20px',
                                        marginTop: '20px'
                                    }}
                                    placeholder="Status"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '1',
                                            label: 'Late',
                                        },
                                        {
                                            value: '2',
                                            label: 'On-Time',
                                        }
                                       
                                    ]}
                                />
                            </div>

                            <Button type="primary" style={{ marginRight: '20px' }}>
                                Export
                            </Button>
                        </div>

                        <div style={{ padding: '10px', marginTop: '15px' }}>
                            <large>Total : </large>
                        </div>
                        <div style={{ margin: 20 }}>
                            <Table columns={columns} dataSource={data} />
                        </div>
                    </Content>
                </Layout>
            </Layout>

        </>
    );
};

export default Home;