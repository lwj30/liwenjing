/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_router = require('express').Router();
const lwj_galleryController = require('../controllers/lwj_galleryController');

lwj_router.get('/', lwj_galleryController.lwj_getGallery);

module.exports = lwj_router;
