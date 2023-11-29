import { Pool } from "pg";
 
const pool = new Pool();

pool.connect((err) => {
    if (err) throw err
    console.log("Connect to PostgreSQL successfully!")
});

module.exports = pool;