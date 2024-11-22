const pool = require('./database');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_secret_key';

// Login
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ email
        const result = await pool.query('SELECT * FROM Employees WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // ตรวจสอบว่า role เป็น 'admin'
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // สร้าง JWT token
        const token = jwt.sign(
            { id: user.employee_id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.employee_id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/validate-token', authenticateToken, (req, res) => {
    return res.status(200).json({
        valid: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
});


//Fetch Data
//Employee
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id, 
                e.prefix, 
                e.firstname, 
                e.lastname, 
                e.email, 
                e.department_id,
                d.department_name AS department
            FROM Employees e
            LEFT JOIN Departments d ON e.department_id = d.department_id;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to fetch Employees');
    }
});
//Department
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT department_id, department_name FROM Departments');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//Location
app.get('/api/locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Locations');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//Shift Master
app.get('/api/shiftsmaster', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM MasterShifts');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
//Attendance
app.get('/api/attendance', async (req, res) => {
    try {
        const query = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY c.clock_id) AS "No",
                
                e.employee_id AS "Employee ID",
                e.prefix AS "Prefix",
                e.firstname AS "First Name",
                e.lastname AS "Last Name",
                d.department_name AS "Department",
                l.location_name AS "Location",
                to_char(c.start_time, 'YYYY-MM-DD HH24:MI:SS') AS "Start Date Time",
                COALESCE(to_char(c.end_time, 'YYYY-MM-DD HH24:MI:SS'), '-') AS "End Date Time",
                COALESCE(c.time_in_location, '-') AS "Time In Location",
                COALESCE(c.time_out_location, '-') AS "Time Out Location",
                CASE 
                    WHEN c.end_time IS NULL OR c.end_time < c.start_time 
                        THEN '-' 
                    ELSE CONCAT(EXTRACT(HOUR FROM (c.end_time - c.start_time)), ' Hours') 
                END AS "Duration",
                c.status AS "Status"
            FROM 
                ClockInOut c
            JOIN 
                Employees e ON c.employee_id = e.employee_id
            LEFT JOIN 
                Departments d ON e.department_id = d.department_id
            LEFT JOIN 
                Locations l ON c.location_id = l.location_id
            ORDER BY 
                c.clock_id;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});
//Employeelocation
app.get('/api/employeeslocation', async (req, res) => {
    try {
        const query = `
        SELECT 
          e.employee_id, 
          e.prefix, 
          e.firstname, 
          e.lastname,
          STRING_AGG(l.location_name, ', ') AS location_names
        FROM Employees e
        JOIN EmployeeLocations el ON e.employee_id = el.employee_id
        JOIN Locations l ON el.location_id = l.location_id
        GROUP BY e.employee_id;
      `;
        const result = await pool.query(query);
        res.json(result.rows);  // ส่งผลลัพธ์กลับไปยัง Frontend
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Internal Server Error');
    }
});


//Add 
//new shift master
app.post('/api/addshiftmaster', async (req, res) => {
    const { shift_id, shift_name, start_time, end_time, shift_type } = req.body;
    try {
        const query = `
            INSERT INTO MasterShifts (shift_id, shift_name, start_time, end_time, shift_type) 
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(query, [shift_id, shift_name, start_time, end_time, shift_type]);
        res.status(201).json({ message: 'Shift added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//New Employee
app.post('/api/addemployee', async (req, res) => {
    try {
        const { employee_id, prefix, firstname, lastname, email, password, department_id, role } = req.body;


        const checkEmail = await pool.query(
            'SELECT email FROM Employees WHERE email = $1',
            [email]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        const result = await pool.query(
            `INSERT INTO Employees (employee_id, prefix, firstname, lastname, email, password, role, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`, [employee_id, prefix, firstname, lastname, email, password, role, department_id]
        );

        const deptResult = await pool.query(
            'SELECT department_name FROM Departments WHERE department_id = $1',
            [department_id]
        );

        const newEmployee = {
            ...result.rows[0],
            department: deptResult.rows[0]?.department_name
        };

        delete newEmployee.password;
        res.status(201).json(newEmployee);

    } catch (error) {
        console.error('Error adding employee:', error);

        if (error.constraint === 'employees_email_key') {
            res.status(400).json({
                message: 'Email already exists'
            });
        } else if (error.constraint === 'employees_pkey') {
            res.status(400).json({
                message: 'Employee ID already exists'
            });
        } else if (error.constraint === 'employees_department_id_fkey') {
            res.status(400).json({
                message: 'Invalid department ID'
            });
        } else {
            res.status(500).json({
                message: 'Internal server error',
                detail: error.message
            });
        }
    }
});
//new location
app.post('/api/addlocation', async (req, res) => {
    const { location_id, location_name, latitude, longitude } = req.body;
    try {
        const newLocation = await pool.query(
            'INSERT INTO locations (location_id, location_name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
            [location_id, location_name, latitude, longitude]
        );
        res.json(newLocation.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const checkShiftOverlap = async (pool, employeeId, departmentId, shiftId, assignedDate) => {
    try {
        // Get the new shift times
        const getNewShiftQuery = `
            SELECT shift_id, start_time, end_time 
            FROM MasterShifts 
            WHERE shift_id = $1`;
        const newShift = await pool.query(getNewShiftQuery, [shiftId]);

        if (newShift.rows.length === 0) {
            throw new Error('ไม่พบข้อมูลกะการทำงาน');
        }

        const newStartTime = newShift.rows[0].start_time;
        const newEndTime = newShift.rows[0].end_time;

        // Query to check for time overlaps only
        const checkOverlapQuery = `
            WITH existing_shifts AS (
                -- Get all assigned shifts for the employee on the same date
                SELECT 
                    ms.shift_id,
                    ms.start_time,
                    ms.end_time
                FROM AssignedShifts as_shifts
                JOIN MasterShifts ms ON as_shifts.shift_id = ms.shift_id
                WHERE as_shifts.assigned_date = $1
                AND (
                    -- Check individual assignments
                    (as_shifts.assignment_type = 'Individual' AND as_shifts.employee_id = $2)
                    OR 
                    -- Check department assignments
                    (as_shifts.assignment_type = 'Department' 
                     AND as_shifts.department_id IN (
                        SELECT department_id 
                        FROM Employees 
                        WHERE employee_id = $2
                     ))
                )
            )
            SELECT EXISTS (
                SELECT 1 
                FROM existing_shifts
                WHERE (
                    -- Check if new shift overlaps with any existing shift
                    -- Either new shift starts during an existing shift
                    ($3::time >= start_time AND $3::time < end_time)
                    OR 
                    -- Or new shift ends during an existing shift
                    ($4::time > start_time AND $4::time <= end_time)
                    OR
                    -- Or new shift completely contains an existing shift
                    ($3::time <= start_time AND $4::time >= end_time)
                )
            ) as has_overlap,
            ARRAY_AGG(
                CASE 
                    WHEN ($3::time >= start_time AND $3::time < end_time)
                    OR ($4::time > start_time AND $4::time <= end_time)
                    OR ($3::time <= start_time AND $4::time >= end_time)
                    THEN json_build_object(
                        'existing_shift_start', start_time,
                        'existing_shift_end', end_time
                    )
                END
            ) FILTER (WHERE start_time IS NOT NULL) as overlapping_shifts
            FROM existing_shifts;
        `;

        const result = await pool.query(checkOverlapQuery, [
            assignedDate,
            employeeId || departmentId,
            newStartTime,
            newEndTime
        ]);

        const overlappingShifts = (result.rows[0].overlapping_shifts || []).filter(shift => shift !== null);


        if (result.rows[0].has_overlap) {
            // สร้างข้อความแสดงรายละเอียดการทับซ้อน
            const overlapDetails = overlappingShifts.map(shift =>
                `${shift.existing_shift_start} - ${shift.existing_shift_end}`
            ).join(', ');

            return {
                hasOverlap: true,
                message: `พบการทับซ้อนของเวลาทำงานกับกะที่มีอยู่แล้ว: ${overlapDetails}`
            };
        }

        return {
            hasOverlap: false,
            message: null
        };

    } catch (error) {
        throw error;
    }
};

//Assign shift
app.post('/api/assigned-shifts', async (req, res) => {
    const { assignedShifts } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const shift of assignedShifts) {
            if (shift.assignment_type === 'Individual') {
                shift.department_id = null;

                // Check for overlapping shifts for individual
                const overlapCheck = await checkShiftOverlap(
                    client,
                    shift.employee_id,
                    null,
                    shift.shift_id,
                    shift.assigned_date
                );

                if (overlapCheck.hasOverlap) {
                    throw new Error(`Unable to assign a shift to Employee ID ${shift.employee_id} on ${shift.assigned_date}\n${overlapCheck.message}`);
                }
            } else if (shift.assignment_type === 'Department') {
                shift.employee_id = null;

                const employeesQuery = `
                    SELECT employee_id 
                    FROM Employees 
                    WHERE department_id = $1`;
                const employees = await client.query(employeesQuery, [shift.department_id]);

                // Check for overlapping shifts for each employee in the department
                for (const employee of employees.rows) {
                    const overlapCheck = await checkShiftOverlap(
                        client,
                        employee.employee_id,
                        shift.department_id,
                        shift.shift_id,
                        shift.assigned_date
                    );

                    if (overlapCheck.hasOverlap) {
                        throw new Error(`Unable to assign a shift to Department ID ${shift.department_id} on ${shift.assigned_date}\n${overlapCheck.message}`);
                    }
                }
            }

            const query = `
                INSERT INTO AssignedShifts (
                    shift_id, 
                    assigned_date, 
                    assignment_type, 
                    employee_id, 
                    department_id
                )
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (assigned_date, employee_id, shift_id) 
                DO UPDATE SET
                    shift_id = EXCLUDED.shift_id, 
                    assigned_date = EXCLUDED.assigned_date, 
                    assignment_type = EXCLUDED.assignment_type,
                    employee_id = EXCLUDED.employee_id, 
                    department_id = EXCLUDED.department_id;
            `;

            await client.query(query, [
                shift.shift_id,
                shift.assigned_date,
                shift.assignment_type,
                shift.employee_id,
                shift.department_id
            ]);
        }

        await client.query('COMMIT');
        res.status(200).send({ message: 'Shift saved successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error:', error);
        res.status(500).send({ error: 'Time overlap' });
    } finally {
        client.release();
    }
});


//Delete
async function deleteRecordById(table, column, id) {
    try {
        const result = await pool.query(`DELETE FROM ${table} WHERE ${column} = $1`, [id]);
        return result.rowCount > 0 ? { status: 200, message: `${table} deleted successfully` } : { status: 404, message: `${table} not found` };
    } catch (err) {
        console.error(`Error deleting from ${table}:`, err);
        return { status: 500, message: 'Server error' };
    }
}
//Locations
app.delete('/api/locations/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteRecordById('Locations', 'location_id', id);
    res.status(result.status).json({ message: result.message });
});
//Employees
app.delete('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteRecordById('Employees', 'employee_id', id);
    res.status(result.status).json({ message: result.message });
});
//Shift
app.delete('/api/shifts/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteRecordById('MasterShifts', 'shift_id', id);
    res.status(result.status).json({ message: result.message });
});


//Shftmanagement
app.get('/api/shiftmanagement', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id AS "Employee ID",
                e.firstname AS "First Name",
                e.lastname AS "Last Name",
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'AssignedShift ID', asg.assigned_shift_id,  -- เพิ่ม assigned_shift_id
                        'Assignment Date', asg.assigned_date,
                        'Shift ID', ms.shift_id,
                        'Start time', ms.start_time,
                        'End Time', ms.end_time
                    )
                ) AS "Shifts"
            FROM 
                AssignedShifts asg
            LEFT JOIN 
                Employees e ON asg.assignment_type = 'Individual' AND asg.employee_id = e.employee_id
            LEFT JOIN 
                MasterShifts ms ON asg.shift_id = ms.shift_id
            GROUP BY 
                e.employee_id, e.firstname, e.lastname
            ORDER BY 
                e.firstname;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





//file-upload
//employee
app.post('/api/upload-employees', async (req, res) => {
    const employees = req.body.employees; // Array of employee objects

    if (!employees || employees.length === 0) {
        return res.status(400).json({ message: 'No employee data provided' });
    }

    try {
        // Hash passwords for each employee
        const saltRounds = 10;
        const hashedEmployees = await Promise.all(employees.map(async (employee) => {
            const hashedPassword = await bcrypt.hash(employee.password, saltRounds);
            return {
                employee_id: employee.employee_id,
                prefix: employee.prefix,
                firstname: employee.firstname,
                lastname: employee.lastname,
                email: employee.email,
                password: hashedPassword,
                role: employee.role,
                department_id: employee.department_id,
            };
        }));

        // Insert employees into the database
        for (const employee of hashedEmployees) {
            const query = `
                INSERT INTO Employees (employee_id, prefix, firstname, lastname, email, password, role, department_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (employee_id) DO NOTHING
            `;

            const values = [
                employee.employee_id,
                employee.prefix,
                employee.firstname,
                employee.lastname,
                employee.email,
                employee.password,
                employee.role,
                employee.department_id,
            ];

            try {
                await pool.query(query, values);
            } catch (error) {
                console.error('Error inserting employee:', error);
                return res.status(500).json({ message: 'Error inserting employees into the database' });
            }
        }

        return res.status(200).json({ message: 'Employees uploaded successfully' });

    } catch (error) {
        console.error('Error processing employee data:', error);
        return res.status(500).json({ message: 'Error processing employee data' });
    }
});
//shiftmaster
app.post('/api/upload-shift-master', async (req, res) => {
    const shifts = req.body.shifts; // ข้อมูล Shift Master ที่ส่งมาจาก Frontend

    if (!shifts || shifts.length === 0) {
        return res.status(400).json({ message: 'No shift data provided' });
    }

    try {
        // ตรวจสอบข้อมูลและเตรียมข้อมูลเพื่อบันทึก
        const formattedShifts = shifts.map(shift => ({
            shift_id: shift.shift_id,
            shift_name: shift.shift_name,
            start_time: dayjs(shift.start_time).format('HH:mm:ss'),  // แปลงเวลาให้เป็น HH:mm:ss
            end_time: dayjs(shift.end_time).format('HH:mm:ss'),      // แปลงเวลาให้เป็น HH:mm:ss
            shift_type: shift.shift_type,
        }));


        // Insert shifts into the database
        for (const shift of formattedShifts) {
            const query = `
    INSERT INTO MasterShifts (shift_id, shift_name, start_time, end_time, shift_type)
    VALUES ($1, $2, $3, $4, $5)
`;

            const values = [
                shift.shift_id,
                shift.shift_name,
                shift.start_time,
                shift.end_time,
                shift.shift_type,
            ];

            try {
                await pool.query(query, values);  // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
            } catch (error) {
                console.error('Error inserting shift:', error);
                return res.status(500).json({ message: 'Error inserting shifts into the database' });
            }

        }

        return res.status(200).json({ message: 'Shift data uploaded successfully' });

    } catch (error) {
        console.error('Error processing shift data:', error);
        return res.status(500).json({ message: 'Error processing shift data' });
    }
});

const excelDateToJSDate = (excelDate) => {
    // Excel's date system starts from 1900-01-01
    const excelEpoch = new Date(1900, 0, 1);

    // Adjust for Excel's leap year bug (Excel incorrectly considers 1900 a leap year)
    const adjustedDate = excelDate > 59 ? excelDate - 1 : excelDate;

    const jsDate = new Date(excelEpoch.getTime() + (adjustedDate - 1) * 24 * 60 * 60 * 1000);
    return jsDate;
};
//uoload assign ship
app.post('/api/upload-assigned-shifts', async (req, res) => {
    const assignedShifts = req.body.assignedShifts;

    if (!assignedShifts || assignedShifts.length === 0) {
        return res.status(400).json({ message: 'No assigned shift data provided' });
    }

    try {
        const validatedShifts = assignedShifts.map((shift) => {
            const {
                shift_id,
                assigned_date,
                assignment_type,
                employee_id,
                department_id,
            } = shift;

            // Log the raw date
            console.log('Raw Date:', assigned_date, 'Type:', typeof assigned_date);

            // Convert Excel serial date to a proper date string
            let processedDate;
            if (typeof assigned_date === 'number') {
                const jsDate = excelDateToJSDate(assigned_date);
                processedDate = jsDate.toISOString().split('T')[0];
                console.log('Processed Date:', processedDate);
            } else {
                // Fallback for string dates
                processedDate = new Date(assigned_date).toISOString().split('T')[0];
            }

            // Validate required fields
            if (!shift_id || !processedDate || !assignment_type) {
                throw new Error(`Missing required fields: shift_id: ${shift_id}, date: ${processedDate}, assignment_type: ${assignment_type}`);
            }

            // Validate assignment type
            if (assignment_type === 'Individual' && !employee_id) {
                throw new Error('Employee ID is required for individual assignment');
            }

            return {
                shift_id,
                assigned_date: processedDate,
                assignment_type,
                employee_id: assignment_type === 'Individual' ? employee_id : null,
                department_id: assignment_type === 'Department' ? department_id : null,
            };
        });

        // Process each validated shift
        for (const shift of validatedShifts) {
            const query = `
                INSERT INTO AssignedShifts (
                    shift_id, assigned_date, assignment_type, 
                    employee_id, department_id
                ) 
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (assigned_date, employee_id, shift_id)
                DO NOTHING
            `;
            const values = [
                shift.shift_id,
                shift.assigned_date,
                shift.assignment_type,
                shift.employee_id,
                shift.department_id,
            ];

            try {
                const result = await pool.query(query, values);
                console.log('Inserted shift:', shift);
            } catch (error) {
                console.error('Error inserting assigned shift:', error);
                return res.status(500).json({
                    message: 'Error inserting assigned shifts into the database',
                    errorDetails: error.message,
                    shift: shift
                });
            }
        }

        return res.status(200).json({
            message: 'Assigned Shifts uploaded successfully',
            totalShifts: validatedShifts.length
        });

    } catch (error) {
        console.error('Error processing assigned shifts data:', error);
        return res.status(500).json({
            message: 'Error processing assigned shifts data',
            errorDetails: error.message
        });
    }
});

//edit employee
app.put('/api/employees/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const { prefix, firstname, lastname, email, password, role, department_id } = req.body;

    let hashedPassword = password;

    if (password) {
        try {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ message: 'Failed to hash password.' });
        }
    }

    const query = `
        UPDATE employees 
        SET prefix = $1, firstname = $2, lastname = $3, email = $4, password = $5, role = $6, department_id = $7 
        WHERE employee_id = $8;
    `;

    pool.query(query, [prefix, firstname, lastname, email, hashedPassword, role, department_id, employee_id], (error, results) => {
        if (error) {
            console.error('Error updating employee:', error);
            return res.status(500).json({ message: 'Failed to update employee.' });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    });
});

//AddLocation
app.post('/api/add-employee-locations', async (req, res) => {
    const { employee_id, location_ids } = req.body;

    if (!employee_id || !Array.isArray(location_ids) || location_ids.length === 0) {
        return res.status(400).send('Invalid data');
    }

    try {
        // สร้าง values และ params แบบถูกต้อง
        const values = location_ids.map((location_id, index) =>
            `($1, $${index + 2})`
        ).join(', ');

        const query = `
            INSERT INTO EmployeeLocations (employee_id, location_id)
            VALUES ${values}
            ON CONFLICT (employee_id, location_id) DO NOTHING
        `;

        // สร้าง params array
        const params = [employee_id, ...location_ids];

        await pool.query(query, params);

        res.status(200).send('Locations assigned successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



app.put('/api/update-employee-locations', async (req, res) => {
    const { employee_id, location_ids } = req.body;

    if (!employee_id || !location_ids || location_ids.length === 0) {
        return res.status(400).json({ message: 'Employee ID and Location IDs are required.' });
    }

    try {
        // ลบข้อมูลการเชื่อมโยงตำแหน่งเดิมทั้งหมด
        await pool.query('DELETE FROM EmployeeLocations WHERE employee_id = $1', [employee_id]);

        // เพิ่มข้อมูลการเชื่อมโยงตำแหน่งใหม่
        const insertQuery = `
            INSERT INTO EmployeeLocations (employee_id, location_id)
            VALUES ($1, $2)
        `;

        // สำหรับแต่ละ location_id ที่เลือก เพิ่มข้อมูลการเชื่อมโยง
        for (let location_id of location_ids) {
            await pool.query(insertQuery, [employee_id, location_id]);
        }

        res.status(200).json({ message: 'Locations updated successfully!' });
    } catch (error) {
        console.error('Error updating employee locations:', error);
        res.status(500).json({ message: 'Server error while updating locations.' });
    }
});

//Setting
app.get('/api/get-radius', async (req, res) => {
    try {

        const result = await pool.query('SELECT setting_value FROM Settings WHERE setting_key = $1', ['default_radius']);
        if (result.rows.length > 0) {
            res.json({ radius: result.rows[0].setting_value });
        } else {
            res.status(404).json({ message: 'ไม่พบการตั้งค่า radius ในฐานข้อมูล' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล radius' });
    }
});
app.post('/api/update-radius', async (req, res) => {
    const { radius } = req.body;  // รับค่าจากฟอร์มที่กรอก

    try {
        const result = await pool.query(
            'UPDATE Settings SET setting_value = $1 WHERE setting_key = $2 RETURNING *',
            [radius, 'default_radius']
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Radius updated successfully', data: result.rows[0] });
        } else {
            res.status(400).json({ message: 'Failed to update radius' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//Ship management
app.delete('/api/deleteshiftmanagement/:assignedShiftId', async (req, res) => {
    const { assignedShiftId } = req.params;
    console.log('Assigned Shift ID received from frontend:', assignedShiftId);

    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    const shiftIdInt = parseInt(assignedShiftId, 10);
    if (isNaN(shiftIdInt)) {
        return res.status(400).json({ message: 'Invalid shift ID' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM AssignedShifts WHERE assigned_shift_id = $1 RETURNING *', 
            [shiftIdInt]  // ใช้ตัวเลข
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Shift assignment not found' });
        }

        res.status(200).json({ message: 'Shift assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting shift assignment:', error);
        res.status(500).json({ message: 'Error deleting shift assignment' });
    }
});









app.listen(5000, () => console.log(`Server is running on port 5000`));
