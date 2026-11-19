/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_path = require('path');
const lwj_mysql = require('mysql2/promise');
require('dotenv').config({ path: lwj_path.join(__dirname, '..', '.env') });

async function lwj_testConnection(lwj_user, lwj_password) {
  const lwj_connection = await lwj_mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: lwj_user,
    password: lwj_password,
    database: process.env.DB_NAME
  });

  try {
    const [lwj_rows] = await lwj_connection.query('SELECT 1 AS lwj_ok');
    return lwj_rows[0].lwj_ok === 1;
  } finally {
    await lwj_connection.end();
  }
}

module.exports = { lwj_testConnection };
