import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Typography } from 'antd';
import './Login.css';
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/Register');
    };

    const handleSignIn = () => {
        navigate('/Attandance');
    };

    return (
        <div className="login-wrapper">
            <Row className="login-container" gutter={32}>
                <Col xs={24} md={12} className="login-form-container">
                    <div className="login-form">
                        <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            Sign in
                        </Title>
                        <Form className="login" name="login" initialValues={{ remember: true }} onFinish={onFinish}>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password' }]}
                            >
                                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                            </Form.Item>

                            <Form.Item>
                                <a href="#">Forgot password?</a>
                            </Form.Item>

                            <Form.Item>
                                <Button block type="primary" htmlType="submit" onClick={handleSignIn}>
                                    Sign In
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                <Col xs={24} md={12} className="welcome-message">
                    <div className="welcome-content">
                        <Title level={2}>Hello</Title>
                        <Text>If you don't have an account,</Text><br />
                        <Text>Enter your details to start managing your time with Geolocation</Text><br />
                        <Button type="default" ghost className="create-account-button" onClick={handleRegister}>
                            Create new account
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
