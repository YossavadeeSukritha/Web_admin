// import React, { useState, useEffect } from 'react';
// import { Button, Layout, theme, Form, Input, Select, Space, DatePicker, message, Radio, Flex } from "antd";
// import '../index.css';
// import Logo from './Logo.jsx';
// import MenuList from './MenuList.jsx';
// import ToggleThemeButton from './ToggleThemeButton.jsx';
// import UserProfile from './UserProfile.jsx';
// import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";


// const { Header, Sider, Content } = Layout;

// const AddShift = () => {
//     const [darkTheme, setDarkTheme] = useState(true);
//     const [departments, setDepartments] = useState([]);
//     const [locations, setLocations] = useState([]);
//     const [shifts, setShifts] = useState([]);
//     const [form] = Form.useForm();
//     const [value, setValue] = useState("individual");
//     const [formFields, setFormFields] = useState([{}]);
//     const [collapsed, setCollapsed] = useState(false);
    
//     const onChange = (e) => {
//         console.log('radio checked', e.target.value);
//         setValue(e.target.value);
//     };

//     const toggleTheme = () => {
//         setDarkTheme(!darkTheme);
//     };

//     const {
//         token: { colorBgContainer },
//     } = theme.useToken();

//     const onFinish = async (values) => {
//         // Handle form submit
//     };

//     // Fetch departments
//     useEffect(() => {
//         const fetchDepartments = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/departments');
//                 const data = await response.json();
//                 setDepartments(data);
//             } catch (error) {
//                 console.error('Error fetching departments:', error);
//             }
//         };
//         fetchDepartments();
//     }, []);

//     // Fetch shifts
//     useEffect(() => {
//         const fetchShifts = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/shiftsmaster');
//                 const data = await response.json();
//                 setShifts(data);
//             } catch (error) {
//                 console.error('Error fetching shifts:', error);
//             }
//         };
//         fetchShifts();
//     }, []);

//     // Fetch locations
//     useEffect(() => {
//         const fetchLocations = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/locations');
//                 const data = await response.json();
//                 setLocations(data);
//             } catch (error) {
//                 console.error('Error fetching locations:', error);
//             }
//         };
//         fetchLocations();
//     }, []);

//     const handleAddField = () => {
//         setFormFields([...formFields, {}]); 
//     };

//     return (
//         <>
//             <Layout className="layout">
//                 <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'}>
//                     <Logo />
//                     <MenuList darkTheme={darkTheme} />
//                     <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
//                 </Sider>
//                 <Layout>
//                     <Header style={{ display: 'flex', justifyContent: 'space-between', background: colorBgContainer, paddingLeft: '10px', paddingRight: '10px' }}>
//                         <div>
//                             <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
//                         </div>
//                         <div>
//                             <UserProfile />
//                         </div>
//                     </Header>
//                     <Content>
//                         <div style={{ padding: '10px' }}>
//                             <small>Assign Shift</small>
//                         </div>
//                         <div style={{
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'flex-start',
//                             minHeight: '100vh',
//                             paddingTop: '2rem',
//                         }}>
//                             <Form
//                                 form={form}
//                                 onFinish={onFinish}
//                                 layout="vertical"
//                                 style={{
//                                     width: '50%'
//                                 }}
//                             >
//                                 <Form.Item
//                                     name="assigned_shift_id"
//                                     label="Assigned Shift ID"
//                                     rules={[{ required: true, message: 'Please enter Assigned Shift ID' }]}
//                                 >
//                                     <Input placeholder="Enter Assigned Shift ID" />
//                                 </Form.Item>

//                                 <Radio.Group onChange={onChange} value={value}>
//                                     <Space direction="vertical">
//                                         <Radio value="individual">
//                                             Individual
//                                             {value === "individual" ? (
//                                                 <Input
//                                                     style={{
//                                                         width: '30rem',
//                                                         marginInlineStart: 10,
//                                                     }}
//                                                     placeholder="Enter Employee ID"
//                                                 />
//                                             ) : null}
//                                         </Radio>
//                                         <Radio value="department">
//                                             Department
//                                             {value === "department" ? (
//                                                 <Select
//                                                     placeholder="Select Department"
//                                                     style={{
//                                                         width: '30rem',
//                                                         marginInlineStart: 10,
//                                                     }}
//                                                     options={departments.map(department => ({
//                                                         value: department.department_id,
//                                                         label: department.department_name,
//                                                     }))}
//                                                 />
//                                             ) : null}
//                                         </Radio>
//                                     </Space>
//                                 </Radio.Group>

//                                 <Form.Item
//                                     name="shift_id"
//                                     label="Shift ID"
//                                     rules={[{ required: true, message: 'Please select Shift ID' }]}
//                                 >
//                                     <Select
//                                         placeholder="Select Shift ID"
//                                         options={shifts.map(shift => ({
//                                             value: shift.shift_id,
//                                             label: `${shift.shift_id} - ${shift.shift_name}`,
//                                         }))}
//                                     />
//                                 </Form.Item>

//                                 <Form.Item
//                                     name="date"
//                                     label="Date"
//                                     rules={[{ required: true, message: 'Please enter Date' }]}
//                                 >
//                                     <Flex vertical gap="small">
//                                         <DatePicker multiple onChange={onChange} maxTagCount="responsive" />
//                                     </Flex>
//                                 </Form.Item>

//                                 <Form.Item
//                                     name="location_name"
//                                     label="Location Name"
//                                     rules={[{ required: true, message: 'Please select Location Name' }]}
//                                 >
//                                     <Select
//                                         placeholder="Select Location Name"
//                                         options={locations.map(location => ({
//                                             value: location.location_id,
//                                             label: location.location_name,
//                                         }))}
//                                     />
//                                 </Form.Item>

//                                 {/* กดadd */}

//                                 <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
//                                     <Space style={{ gap: '1rem' }}>
//                                         <Button type="dashed" onClick={handleAddField}>
//                                             + Add
//                                         </Button>
//                                         <Button type="primary" htmlType="submit">
//                                             Submit
//                                         </Button>
//                                     </Space>
//                                 </Form.Item>
                
//                             </Form>
//                         </div>
//                     </Content>
//                 </Layout>
//             </Layout>
//         </>
//     );
// };

// export default AddShift;

import React, { useState, useEffect } from 'react';
import { Button, Layout, theme, Form, Input, Select, Space, DatePicker, message, Radio, Flex } from "antd";
import '../index.css';
import Logo from './Logo.jsx';
import MenuList from './MenuList.jsx';
import ToggleThemeButton from './ToggleThemeButton.jsx';
import UserProfile from './UserProfile.jsx';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AddShift = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [form] = Form.useForm();
    const [value, setValue] = useState("individual");
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
        // ส่งข้อมูลทั้งหมดในรูปแบบ array
        console.log('Form Data: ', values);
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
                setShifts(data);
            } catch (error) {
                console.error('Error fetching shifts:', error);
            }
        };
        fetchShifts();
    }, []);

    // Fetch locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/locations');
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
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

    return (
        <>
            <Layout className="layout">
                <Sider collapsed={collapsed} className="sidebar" theme={darkTheme ? 'dark' : 'light'} width={250}>
                    <Logo/>
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
                                        <Form.Item
                                            name={`assigned_shift_id_${index}`}
                                            label="Assigned Shift ID"
                                            rules={[{ required: true, message: 'Please enter Assigned Shift ID' }]}
                                        >
                                            <Input placeholder="Enter Assigned Shift ID" />
                                        </Form.Item>

                                        <Radio.Group onChange={onChange} value={value}>
                                            <Space direction="vertical">
                                                <Radio value="individual">
                                                    Individual
                                                    {value === "individual" ? (
                                                        <Input
                                                            style={{
                                                                width: '30rem',
                                                                marginInlineStart: 10,
                                                            }}
                                                            placeholder="Enter Employee ID"
                                                        />
                                                    ) : null}
                                                </Radio>
                                                <Radio value="department">
                                                    Department
                                                    {value === "department" ? (
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
                                                <DatePicker multiple onChange={onChange} maxTagCount="responsive" />
                                            </Flex>
                                        </Form.Item>

                                        <Form.Item
                                            name={`location_name_${index}`}
                                            label="Location Name"
                                            rules={[{ required: true, message: 'Please select Location Name' }]}
                                        >
                                            <Select
                                                placeholder="Select Location Name"
                                                options={locations.map(location => ({
                                                    value: location.location_id,
                                                    label: location.location_name,
                                                }))}
                                            />
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





