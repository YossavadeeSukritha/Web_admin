import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Form, Input, Select, Space, DatePicker, message } from "antd";
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const AddShift = () => {
    // theme color
    const [darkTheme, setDarkTheme] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [form] = Form.useForm();

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onFinish = async (values) => {
        const { userid, department, DateTime, location } = values;
        const [startTime, endTime] = DateTime;
    
        const startTimeString = startTime.format('YYYY-MM-DD HH:mm:ss');
        const endTimeString = endTime.format('YYYY-MM-DD HH:mm:ss');
    
        try {
            const response = await fetch('http://localhost:5000/api/assign-shift', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid: userid || null,
                    department: department || null,
                    location,
                    startTime: startTimeString,
                    endTime: endTimeString,
                }),
            });
    
            if (response.ok) {
                message.success('Shift assigned successfully');
            } else {
                message.error('Failed to assign shift');
            }
        } catch (error) {
            message.error('Error occurred while assigning shift');
            console.error('Error submitting shift:', error);
        }
    };
    

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

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/locations');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const locationOptions = data.map(location => ({
                        value: location.value || '',
                        label: location.label || '',
                    })).filter(option => option.value);
                    setLocations(locationOptions);
                } else {
                    console.error("Expected an array but received:", data);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    const navigate = useNavigate();

    const handleCancel = () => {
        form.resetFields();
        navigate('/Shift');
    };


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
                            <small>Assign Shift</small>
                        </div>
                        <div style={{ padding: '10px', marginTop: '15px' }}>
                            <span style={{ fontSize: 'larger' }}>Assign Shift :</span>
                        </div>


                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            minHeight: '100vh',
                            paddingTop: '5rem',
                        }}>
                            <Form
                                {...layout}
                                form={form}
                                name="control-hooks"
                                onFinish={onFinish}
                                style={{ maxWidth: 600, width: '100%' }}
                            >
                                {/* User ID / Name */}
                                <Form.Item
                                    name="userid"
                                    label="User ID / Name"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value || getFieldValue('department')) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Please input either User ID or select Department'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                {/* Department */}
                                <Form.Item
                                    name="department"
                                    label="Department"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value || getFieldValue('userid')) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Please input either User ID or select Department'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Department"
                                        options={departments}
                                        optionFilterProp="label"
                                    />
                                </Form.Item>

                                {/* Date Time Range */}
                                <Form.Item
                                    name="DateTime"
                                    label="Date Time"
                                    rules={[{ required: true, message: 'Please input!' }]}

                                >
                                    <RangePicker showTime style={{ width: '100%' }} />
                                </Form.Item>

                                {/* Location */}
                                <Form.Item
                                    name="location"
                                    label="Location"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Location"
                                        options={locations.map(location => ({
                                            value: location.value,
                                            label: location.label,
                                        }))}
                                    />
                                </Form.Item>

                                {/* Submit / Cancel Buttons */}
                                <Form.Item {...tailLayout}>
                                    <Space style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',

                                    }}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button htmlType="button" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>

                        </div>

                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default AddShift;
