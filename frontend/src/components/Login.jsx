import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Typography, message } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.css';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { email, password } = values;
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });

            // เก็บ token และข้อมูล user
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            message.success('Login successful');
            navigate('/Attendance');
        } catch (error) {
            if (error.response) {
                message.error(error.response.data.message); // ข้อความ error จาก backend
            } else {
                message.error('Connection error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <Row
                className="login-container"
                gutter={100}
                justify="center"
                align="middle"
                style={{ minHeight: '100vh' }}
            >
                <Col xs={24} md={12} className="login-form-container">
                    <div className="login-form">
                        <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            Sign in
                        </Title>
                        <Form
                            className="login"
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your Email' },
                                    { type: 'email', message: 'Please enter a valid email' },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please input your Password' },
                                    { min: 6, message: 'Password must be at least 6 characters' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Sign In
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
