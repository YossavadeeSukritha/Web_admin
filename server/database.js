const {Pool} = require("pg")
 
const pool = new Pool({
    user: "postgres",
    password: "1213",
    host: "localhost",
    port: 5432,
    database: "webdb"
});

module.exports = pool;
