import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Typography } from 'antd';
import './Login.css';
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Register = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/');
    };

    return (
        <div className="login-wrapper">
            <Row className="login-container" gutter={32}>
                <Col xs={24} md={12} className="welcome-message">
                    <div className="welcome-content">
                        <Title level={2}>Welcome</Title>
                        <Text>If you already have an account with us <br />let's sign in</Text><br />
                        <Button type="default" ghost className="create-account-button" onClick={handleSignIn}>
                            Use your exist account
                        </Button>
                    </div>
                </Col>


                <Col xs={24} md={12} className="login-form-container">
                    <div className="login-form">
                        <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            Create Account
                        </Title>
                        <Form className="login" name="login" initialValues={{ remember: true }} onFinish={onFinish}>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="firstname"
                                rules={[{ required: true, message: 'Please input your First Name' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="First Name" />
                            </Form.Item>

                            <Form.Item
                                name="lastname"
                                rules={[{ required: true, message: 'Please input your Last Name' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Last Name" />
                            </Form.Item>               

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password' }]}                           
                            >
                                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password"/>
                            </Form.Item>

                            <Form.Item
                                name="confirm-password"
                                rules={[{ required: true, message: 'Please input your Confirm Password' }]}                           
                            >
                                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Confirm Password"/>
                            </Form.Item>

                            <Form.Item>
                                <Button block type="primary" htmlType="submit" >
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>


            </Row>
        </div>
    );
};

export default Register;
