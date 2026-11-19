/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_pool = require('../config/lwj_db');

async function lwj_checkDatabase() {
  const [lwj_rows] = await lwj_pool.query('SELECT 1 AS lwj_ok');
  return lwj_rows;
}

module.exports = { lwj_checkDatabase };
