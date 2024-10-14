const pool = require('./database')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM public.users"); 
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error"});
    }
});

app.listen(5000, ()=>
    console.log(`Server is running on port 5000`)
)
