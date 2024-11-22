import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Form, Input, Select, Space, DatePicker, message, Radio, Flex, Upload, Divider } from "antd";
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined, UploadOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';


const { Header, Sider, Content } = Layout;

const AddShift = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [form] = Form.useForm();
    const [value, setValue] = useState("Individual");
    const [formFields, setFormFields] = useState([{}]);
    const [collapsed, setCollapsed] = useState(false);

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onFinish = async (values) => {
        try {
            const formattedData = formFields.map((_, index) => {
                const dates = values[`date_${index}`];
    
                const selectedShift = shifts.find(shift => shift.shift_id === values[`shift_id_${index}`]);
    
                const assignedShifts = dates.map(date => ({
                    shift_id: selectedShift.shift_id,  
                    assigned_date: date.format('YYYY-MM-DD'),
                    start_time: selectedShift.start_time, 
                    end_time: selectedShift.end_time,    
                    assignment_type: value,
                    employee_id: value === 'Individual' ? values[`employee_id_${index}`] : null,
                    department_id: value === 'Department' ? values[`department_id_${index}`] : null
                }));
                
                return assignedShifts;
            });
    
            const flattenedData = formattedData.flat();
    
            const response = await fetch('http://localhost:5000/api/assigned-shifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignedShifts: flattenedData }),
            });
    
            if (response.ok) {
                message.success('assign shift success');
                form.resetFields();
                setFormFields([{}]);
            } else {
                const errorData = await response.json();
                message.error(errorData.error || 'cant assign shift');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('error assign shift');
        }
    };
    
    


    // Fetch departments
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

    // Fetch shifts
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/shiftsmaster');
                const data = await response.json();
                console.log('Fetched Shifts:', data); // เพิ่มบรรทัดนี้
                setShifts(data);
            } catch (error) {
                console.error('Error fetching shifts:', error);
            }
        };
        fetchShifts();
    }, []);

    const handleAddField = () => {
        setFormFields([...formFields, {}]);
    };

    const handleRemoveField = (index) => {
        if (formFields.length > 1) {
            const updatedFields = formFields.filter((_, idx) => idx !== index);
            setFormFields(updatedFields);
        }
    };

    const handleDateChange = (dates, dateStrings) => {
        console.log('Selected Dates: ', dates);
    };

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
            const assignedShiftsData = XLSX.utils.sheet_to_json(sheet);

            try {
                const response = await fetch('http://localhost:5000/api/upload-assigned-shifts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ assignedShifts: assignedShiftsData }),
                });

                const result = await response.json();
                if (response.ok) {
                    message.success('Assigned Shifts uploaded successfully!');
                } else {
                    message.error('Failed to upload Assigned Shifts');
                }
            } catch (error) {
                console.error('Error uploading Assigned Shifts:', error);
                message.error('Error uploading Assigned Shifts');
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <>
            <Layout className="layout">
                <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'} width={250}>
                    <Logo />
                    <MenuList darkTheme={darkTheme} />
                    <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
                </Sider>
                <Layout>
                    <Header style={{ display: 'flex', justifyContent: 'space-between', background: colorBgContainer, paddingLeft: '10px', paddingRight: '10px' }}>
                        <div>
                            <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
                        </div>
                  
                    </Header>
                    <Content>
                        <div style={{ padding: '10px' }}>
                            <small>Assign Shift</small>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                            <a href="/Assign_Shift.xlsx" download>
                                <Button type="primary" style={{ marginRight: '10px' }}>
                                    Insert Assign Shift Template
                                </Button>
                            </a>

                            <Upload
                                beforeUpload={handleBeforeUpload}
                                customRequest={({ file, onSuccess, onError }) => {
                                    handleFileUpload(file).then(() => onSuccess());
                                }}
                                onChange={handleFileChange}
                            >
                                <Button icon={<UploadOutlined />}>Upload Excel File</Button>
                            </Upload>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            minHeight: '100vh',
                            paddingTop: '2rem',
                        }}>
                            <Form
                                form={form}
                                onFinish={onFinish}
                                layout="vertical"
                                style={{
                                    width: '50%'
                                }}
                            >
                                {formFields.map((_, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: '2px solid lightgray ',
                                            padding: '2.5rem',
                                            marginBottom: '1rem',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >


                                        <Radio.Group onChange={onChange} value={value}>
                                            <Space direction="vertical">
                                                <Radio value="Individual">
                                                    Individual
                                                    {value === "Individual" ? (
                                                        <Form.Item
                                                            name={`employee_id_${index}`}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Input
                                                                style={{
                                                                    width: '30rem',
                                                                    marginInlineStart: 10,
                                                                }}
                                                                placeholder="Enter Employee ID"
                                                            />
                                                        </Form.Item>
                                                    ) : null}
                                                </Radio>
                                                <Radio value="Department">
                                                    Department
                                                    {value === "Department" ? (
                                                        <Form.Item
                                                            name={`department_id_${index}`}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Select Department"
                                                                style={{
                                                                    width: '30rem',
                                                                    marginInlineStart: 10,
                                                                }}
                                                                options={departments.map(department => ({
                                                                    value: department.department_id,
                                                                    label: department.department_name,
                                                                }))}
                                                            />
                                                        </Form.Item>
                                                    ) : null}
                                                </Radio>
                                            </Space>
                                        </Radio.Group>

                                        <Form.Item
                                            name={`shift_id_${index}`}
                                            label="Shift ID"
                                            rules={[{ required: true, message: 'Please select Shift ID' }]}
                                        >
                                            <Select
                                                placeholder="Select Shift ID"
                                                options={shifts.map(shift => ({
                                                    value: shift.shift_id,
                                                    label: `${shift.shift_id} - ${shift.shift_name}`,
                                                }))}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name={`date_${index}`}
                                            label="Date"
                                            rules={[{ required: true, message: 'Please enter Date' }]}
                                        >
                                            <Flex vertical gap="small">
                                                <DatePicker
                                                    multiple
                                                    onChange={(dates, dateStrings) => {
                                                        form.setFieldValue(`date_${index}`, dates);
                                                    }}
                                                    maxTagCount="responsive"
                                                />
                                            </Flex>
                                        </Form.Item>

                                        {/* ลบฟิลด์ */}
                                        {index > 0 && (
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => handleRemoveField(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Space style={{ gap: '1rem' }}>
                                        <Button type="dashed" onClick={handleAddField}>
                                            + Add
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            Submit
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

