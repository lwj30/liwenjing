/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_newsModel = require('../models/lwj_newsModel');

async function lwj_getNews(lwj_req, lwj_res) {
  try {
    const lwj_list = await lwj_newsModel.lwj_getNewsList();
    lwj_res.json({
      code: 0,
      msg: 'ok',
      data: { lwj_total: lwj_list.length, lwj_list: lwj_list }
    });
  } catch (lwj_error) {
    console.error('[lwj_news_error]', lwj_error);
    lwj_res.status(500).json({
      code: 1,
      msg: '获取新闻列表失败',
      data: { lwj_total: 0, lwj_list: [] }
    });
  }
}

async function lwj_getNewsById(lwj_req, lwj_res) {
  try {
    const lwj_id = Number(lwj_req.params.lwj_id);
    if (!Number.isInteger(lwj_id) || lwj_id <= 0) {
      return lwj_res.status(400).json({ code: 1, msg: '新闻 id 参数无效', data: {} });
    }

    const lwj_rows = await lwj_newsModel.lwj_getNewsById(lwj_id);
    if (lwj_rows.length === 0) {
      return lwj_res.status(404).json({ code: 1, msg: '未找到该新闻', data: {} });
    }

    lwj_res.json({ code: 0, msg: 'ok', data: { lwj_news: lwj_rows[0] } });
  } catch (lwj_error) {
    console.error('[lwj_news_detail_error]', lwj_error);
    lwj_res.status(500).json({ code: 1, msg: '获取新闻详情失败', data: {} });
  }
}

module.exports = { lwj_getNews, lwj_getNewsById };
