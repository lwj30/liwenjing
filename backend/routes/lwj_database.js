/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_router = require('express').Router();
const lwj_databaseController = require('../controllers/lwj_databaseController');

lwj_router.get('/defaults', lwj_databaseController.lwj_getDefaults);
lwj_router.post('/connect', lwj_databaseController.lwj_connect);

module.exports = lwj_router;
