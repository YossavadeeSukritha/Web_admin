const pool = require('./database');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Fetch departments
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Departments');
        const departments = result.rows.map(department => ({
            value: department.department_id,
            label: department.name,
        }));
        res.json(departments);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Fetch locations
app.get('/api/locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Locations');
        const locations = result.rows.map(location => ({
            value: location.location_id,
            label: location.location_name,
        }));
        res.json(locations);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// Assign shift (with transaction handling)
app.post('/api/assign-shift', async (req, res) => {
    const { userid, department, location, startTime, endTime } = req.body;

    if (!userid && !department) {
        return res.status(400).json({ error: 'Please provide either a user ID or department' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        if (userid) {
            await client.query(
                `INSERT INTO Shifts (user_id, location_id, start_time, end_time) 
                 VALUES ($1, $2, $3, $4)`,
                [userid, location, startTime, endTime]
            );
        }

        if (department) {
            const usersResult = await client.query(
                `SELECT user_id FROM Users WHERE department_id = $1`, 
                [department]
            );
            const userIds = usersResult.rows.map(row => row.user_id);

            for (const user_id of userIds) {
                await client.query(
                    `INSERT INTO Shifts (user_id, location_id, start_time, end_time) 
                     VALUES ($1, $2, $3, $4)`,
                    [user_id, location, startTime, endTime]
                );
            }
        }

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json({ message: 'Shift assigned successfully' });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error assigning shift:', err);
        res.status(500).json({ error: 'Failed to assign shift' });
    } finally {
        client.release();
    }
});

app.get('/api/clockinout', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.clock_id, u.user_id, u.prefix, u.firstname, u.lastname, 
                   d.name AS department, l.location_name AS location, 
                   c.start_time, c.end_time, 
                   c.time_in_location, c.time_out_location, c.status
            FROM ClockInOut c
            JOIN Users u ON c.user_id = u.user_id
            JOIN Departments d ON u.department_id = d.department_id
            JOIN Locations l ON c.location_id = l.location_id
            ORDER BY c.start_time DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching clock-in/out records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});


app.get('/api/shifts', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.shift_id, s.user_id, u.prefix, u.firstname, u.lastname, 
                   d.name AS department, l.location_name AS location
            FROM Shifts s
            JOIN Users u ON s.user_id = u.user_id
            JOIN Departments d ON u.department_id = d.department_id
            JOIN Locations l ON s.location_id = l.location_id
            ORDER BY s.start_time DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching shifts:', err);
        res.status(500).json({ error: 'Failed to fetch shifts' });
    }
});


app.get('/api/requests', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Requests');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});



app.listen(5000, () => console.log(`Server is running on port 5000`));
