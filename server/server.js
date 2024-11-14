const pool = require('./database');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//Fetch Data Employee
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

//Fetch Data Department Name
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT department_id, department_name FROM Departments');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//Fetch Data Location
app.get('/api/locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Locations');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//Fetch Data Shift Master
app.get('/api/shiftsmaster', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM MasterShifts');
        res.json(result.rows);
    } catch (error) {
        console.error(error);   
        res.status(500).send('Server Error');
    }
});

app.get('/api/attendance', async (req, res) => {
    try {
        // SQL query to fetch attendance data
        const query = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY c.clock_id) AS "No",
                c.clock_id AS "Clock_id",
                e.employee_id AS "Employee ID",
                e.prefix AS "Prefix",
                e.firstname AS "First Name",
                e.lastname AS "Last Name",
                d.department_name AS "Department",
                l.location_name AS "Location",
                c.start_time AS "Start Date Time",
                c.end_time AS "End Date Time",
                c.time_in_location AS "Time In Location",
                c.time_out_location AS "Time Out Location",
                CONCAT(EXTRACT(HOUR FROM (c.end_time - c.start_time)), ' ชั่วโมง') AS "Duration",
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
        const result = await pool.query(query); // Execute query
        res.json(result.rows); // Send results as JSON
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

//Add new shift master
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

//Add New Employee
app.post('/api/addemployee', async (req, res) => {
    try {
        const { employee_id, prefix, firstname, lastname, email, password, department_id } = req.body;

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
            RETURNING *`, [employee_id, prefix, firstname,lastname,email,password, role,department_id]
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

//Add new location
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

app.listen(5000, () => console.log(`Server is running on port 5000`));
