// make conenction to the dbs
import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    password: "prdos2004",
    host: "localhost",
    port: 5432,
    database: "dbs"
})


export default pool;
