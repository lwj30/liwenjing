/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 * 功能：MySQL 连接池，支持两种方式：
 *       1) 本地 .env：DB_HOST / DB_USER / DB_PASSWORD / DB_NAME（+ DB_PORT）
 *       2) PlanetScale 连接串：DATABASE_URL=mysql://user:pass@host:port/db?sslaccept=strict
 */
const lwj_path = require('path');
const lwj_mysql = require('mysql2/promise');
require('dotenv').config({ path: lwj_path.join(__dirname, '..', '.env') });

let lwj_pool;

if (process.env.DATABASE_URL) {
  // === PlanetScale / 云端连接串 ===
  console.log('[lwj_db] 使用 DATABASE_URL（PlanetScale 模式）');
  lwj_pool = lwj_mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  // === 本地 MySQL ===
  console.log('[lwj_db] 使用 .env 配置（本地模式）');
  lwj_pool = lwj_mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// 启动时验证连接，方便 Render 日志排查
(async function lwj_verify() {
  try {
    const [lwj_rows] = await lwj_pool.query('SELECT 1 AS lwj_ok');
    console.log('[lwj_db] 数据库连接成功，测试结果：', lwj_rows[0].lwj_ok);
  } catch (lwj_err) {
    console.warn('[lwj_db] 数据库连接失败（可能未配置）：', lwj_err.message);
  }
})();

module.exports = lwj_pool;
