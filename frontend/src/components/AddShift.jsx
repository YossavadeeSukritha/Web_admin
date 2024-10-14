import React, { useState } from 'react';
import { Button, Layout, theme, Form, Input, Select, Space } from "antd";
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { DatePicker } from 'antd';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

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
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // form
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
    };

    const validateFields = async () => {
        try {
            const values = await form.validateFields();
            console.log('Validated Values:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
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
                            <small>Add Shift</small>
                        </div>
                        <div style={{ padding: '10px' }}>
                            <large>Assign To: </large>
                        </div>
                        <div style={{ marginTop: '30px' }}>
                            <Form
                                {...layout}
                                form={form}
                                name="control-hooks"
                                onFinish={onFinish}
                                style={{
                                    maxWidth: 600,
                                }}
                            >
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
                                    <Select placeholder="Select an option" allowClear>
                                        <Option value="IT">IT</Option>
                                        <Option value="HR">HR</Option>
                                        <Option value="Finance">Finance</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="RangePicker"
                                    name="RangePicker"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!',
                                        },
                                    ]}
                                >
                                    <RangePicker showTime />
                                </Form.Item>

                                <Form.Item
                                    name="location"
                                    label="Location"
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
                                    <Select placeholder="Select an option" allowClear>
                                        <Option value="IT">IT</Option>
                                        <Option value="HR">HR</Option>
                                        <Option value="Finance">Finance</Option>
                                    </Select>
                                </Form.Item>


                                <Form.Item {...tailLayout}>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button htmlType="button">
                                            Cancle
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
