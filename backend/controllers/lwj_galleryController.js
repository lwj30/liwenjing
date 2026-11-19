/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
const lwj_galleryModel = require('../models/lwj_galleryModel');

async function lwj_getGallery(lwj_req, lwj_res) {
  try {
    const lwj_list = await lwj_galleryModel.lwj_getGalleryList();
    lwj_res.json({
      code: 0,
      msg: 'ok',
      data: { lwj_total: lwj_list.length, lwj_list: lwj_list }
    });
  } catch (lwj_error) {
    console.error('[lwj_gallery_error]', lwj_error);
    lwj_res.status(500).json({
      code: 1,
      msg: '获取图文列表失败',
      data: { lwj_total: 0, lwj_list: [] }
    });
  }
}

module.exports = { lwj_getGallery };
