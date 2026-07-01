// lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',        // localhost Laragon
  user: 'root',              // user default Laragon
  password: '',              // default kosong
  database: 'erp_kmm_project',  // ganti sesuai nama DB kamu
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;