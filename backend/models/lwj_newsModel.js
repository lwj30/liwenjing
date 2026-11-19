/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_pool = require('../config/lwj_db');

async function lwj_getNewsList() {
  const [lwj_rows] = await lwj_pool.query(
    'SELECT lwj_id, lwj_title, lwj_category, lwj_summary, lwj_source, lwj_publish_time, lwj_link FROM lwj_news ORDER BY lwj_publish_time DESC'
  );
  return lwj_rows;
}

async function lwj_getNewsById(lwj_id) {
  const [lwj_rows] = await lwj_pool.query(
    'SELECT lwj_id, lwj_title, lwj_category, lwj_summary, lwj_source, lwj_publish_time, lwj_link FROM lwj_news WHERE lwj_id = ?',
    [lwj_id]
  );
  return lwj_rows;
}

module.exports = { lwj_getNewsList, lwj_getNewsById };
