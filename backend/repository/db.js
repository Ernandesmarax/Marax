import pg from "pg";
const { Pool } = pg;
const pool = new pg.Pool({
  host: process.env.DB_HOTS,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default pool;
