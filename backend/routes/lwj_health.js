/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_router = require('express').Router();
const lwj_healthController = require('../controllers/lwj_healthController');

lwj_router.get('/health', lwj_healthController.lwj_getHealth);

module.exports = lwj_router;
