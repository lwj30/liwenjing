/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_path = require('path');
const lwj_express = require('express');
const lwj_cors = require('cors');
require('dotenv').config({ path: lwj_path.join(__dirname, '.env') });

const lwj_app = lwj_express();
const lwj_PORT = 8030;

lwj_app.use(lwj_cors());
lwj_app.use(lwj_express.json());
lwj_app.use(lwj_express.static(lwj_path.join(__dirname, '..', 'frontend')));

lwj_app.use('/api', require('./routes/lwj_health'));
lwj_app.use('/api/database', require('./routes/lwj_database'));
lwj_app.use('/api/news', require('./routes/lwj_news'));
lwj_app.use('/api/gallery', require('./routes/lwj_gallery'));

lwj_app.use((lwj_err, lwj_req, lwj_res, lwj_next) => {
  console.error('[lwj_server_error]', lwj_err);
  lwj_res.status(500).json({ code: 1, msg: '服务器内部错误', data: {} });
});

lwj_app.listen(lwj_PORT, () => {
  console.log(`Server running at http://localhost:${lwj_PORT}`);
});
