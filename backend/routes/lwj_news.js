/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_router = require('express').Router();
const lwj_newsController = require('../controllers/lwj_newsController');

lwj_router.get('/', lwj_newsController.lwj_getNews);
lwj_router.get('/:lwj_id', lwj_newsController.lwj_getNewsById);

module.exports = lwj_router;
