/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_databaseModel = require('../models/lwj_databaseModel');

function lwj_getDefaults(lwj_req, lwj_res) {
  lwj_res.json({
    code: 0,
    msg: 'ok',
    data: {
      lwj_user: process.env.DB_USER || '',
      lwj_password: process.env.DB_PASSWORD || '',
      lwj_host: process.env.DB_HOST || '',
      lwj_name: process.env.DB_NAME || ''
    }
  });
}

async function lwj_connect(lwj_req, lwj_res) {
  const lwj_user = lwj_req.body ? lwj_req.body.lwj_user : '';
  const lwj_password = lwj_req.body ? lwj_req.body.lwj_password : '';

  if (!lwj_user || !lwj_password) {
    return lwj_res.status(400).json({
      code: 1,
      msg: '请输入用户名和密码',
      data: { lwj_connected: false }
    });
  }

  try {
    const lwj_ok = await lwj_databaseModel.lwj_testConnection(lwj_user, lwj_password);
    lwj_res.json({ code: 0, msg: 'ok', data: { lwj_connected: lwj_ok } });
  } catch (lwj_error) {
    console.error('[lwj_database_error]', lwj_error);
    lwj_res.status(500).json({
      code: 1,
      msg: '数据库连接失败：' + lwj_error.message,
      data: { lwj_connected: false }
    });
  }
}

module.exports = { lwj_getDefaults, lwj_connect };
