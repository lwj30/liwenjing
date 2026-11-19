/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_healthModel = require('../models/lwj_healthModel');

async function lwj_getHealth(lwj_req, lwj_res) {
  try {
    const lwj_rows = await lwj_healthModel.lwj_checkDatabase();
    lwj_res.json({
      code: 0,
      msg: '服务正常',
      data: { lwj_database: lwj_rows[0].lwj_ok === 1 }
    });
  } catch (lwj_error) {
    console.error('[lwj_health_error]', lwj_error);
    lwj_res.status(500).json({ code: 1, msg: '数据库连接失败', data: {} });
  }
}

module.exports = { lwj_getHealth };
