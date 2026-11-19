/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 * 功能：GitHub Pages 等无后端环境下的静态 mock 数据，接口格式与后端 Express / MySQL 返回一致。
 *      当真实 API 请求失败时，lwj_fetchApi() 会自动降级到此处的数据。
 */
(function lwj_initMock() {
  window.lwj_mock = {
    '/api/gallery': {
      code: 0, msg: 'mock 数据',
      data: { lwj_total: 8, lwj_list: [
        { lwj_id: 1, lwj_title: '神经网络可视化入门', lwj_category: '人工智能',
          lwj_description: '用节点与连线的形式理解神经网络的数据流动，适合初学者建立直观认识。',
          lwj_image: 'images/lwj_gallery_01.png', lwj_source: 'AI 实验室',
          lwj_publish_time: '2026-11-18 10:00:00' },
        { lwj_id: 2, lwj_title: '边缘芯片的能效设计', lwj_category: '芯片与硬件',
          lwj_description: '从架构与制程两个维度梳理边缘设备芯片降低功耗的常见思路。',
          lwj_image: 'images/lwj_gallery_02.png', lwj_source: '硬件前线',
          lwj_publish_time: '2026-11-17 11:30:00' },
        { lwj_id: 3, lwj_title: '云原生架构图解', lwj_category: '云计算',
          lwj_description: '通过数据中心视角理解弹性伸缩、服务编排与资源调度的协作关系。',
          lwj_image: 'images/lwj_gallery_03.png', lwj_source: '云端技术',
          lwj_publish_time: '2026-11-16 09:15:00' },
        { lwj_id: 4, lwj_title: '数据安全防护要点', lwj_category: '数据安全',
          lwj_description: '围绕身份认证、访问控制与加密传输，整理业务系统常见防护实践。',
          lwj_image: 'images/lwj_gallery_04.png', lwj_source: '安全视界',
          lwj_publish_time: '2026-11-15 14:40:00' },
        { lwj_id: 5, lwj_title: '浏览器端图形计算新趋势', lwj_category: '前端技术',
          lwj_description: '介绍浏览器图形接口的演进，以及 3D 可视化在 Web 应用中的落地方式。',
          lwj_image: 'images/lwj_gallery_05.png', lwj_source: '前端周刊',
          lwj_publish_time: '2026-11-14 16:05:00' },
        { lwj_id: 6, lwj_title: '智能运维监控实践', lwj_category: '企业服务',
          lwj_description: '以监控大屏为切入点，说明告警收敛与容量预测在实际运维中的价值。',
          lwj_image: 'images/lwj_gallery_06.png', lwj_source: '企业数字化',
          lwj_publish_time: '2026-11-13 08:50:00' },
        { lwj_id: 7, lwj_title: '低代码开发模式解析', lwj_category: '开发范式',
          lwj_description: '用可视化积木的思路解释低代码平台与手写代码的协作方式。',
          lwj_image: 'images/lwj_gallery_07.png', lwj_source: '开发者社区',
          lwj_publish_time: '2026-11-12 13:20:00' },
        { lwj_id: 8, lwj_title: '量子计算基础概念', lwj_category: '前沿科技',
          lwj_description: '从量子比特与叠加态出发，概览量子计算的基本原理与研究意义。',
          lwj_image: 'images/lwj_gallery_08.png', lwj_source: '科技瞭望',
          lwj_publish_time: '2026-11-11 15:35:00' }
      ] }
    },
    '/api/news': {
      code: 0, msg: 'mock 数据',
      data: { lwj_total: 9, lwj_list: [
        { lwj_id: 1, lwj_title: '大模型代码生成在软件开发中的实践', lwj_category: '人工智能',
          lwj_summary: '介绍大模型辅助编码的典型流程，以及在代码审查与单元测试环节中的应用思路。',
          lwj_source: '技术观察', lwj_publish_time: '2026-11-18 09:30:00',
          lwj_link: 'news-detail.html?id=1' },
        { lwj_id: 2, lwj_title: '边缘计算芯片能效比持续提升', lwj_category: '芯片与硬件',
          lwj_summary: '从架构优化与制程改进两个角度，梳理边缘设备芯片降低功耗的常见做法。',
          lwj_source: '硬件前线', lwj_publish_time: '2026-11-17 14:20:00',
          lwj_link: 'news-detail.html?id=2' },
        { lwj_id: 3, lwj_title: '开源社区发布新一代前端构建工具', lwj_category: '开发工具',
          lwj_summary: '围绕启动速度、增量构建和插件生态，对比新一代构建工具的核心特性。',
          lwj_source: '开源中国', lwj_publish_time: '2026-11-16 10:05:00',
          lwj_link: 'news-detail.html?id=3' },
        { lwj_id: 4, lwj_title: '云原生可观测性方案的落地实践', lwj_category: '云计算',
          lwj_summary: '结合日志、指标与链路追踪，说明中小团队搭建可观测性体系的基本步骤。',
          lwj_source: '云端技术', lwj_publish_time: '2026-11-15 16:40:00',
          lwj_link: 'news-detail.html?id=4' },
        { lwj_id: 5, lwj_title: '数据安全技术在水务行业中的应用', lwj_category: '数据安全',
          lwj_summary: '探讨数据采集、传输与共享过程中的脱敏和权限控制策略。',
          lwj_source: '安全视界', lwj_publish_time: '2026-11-14 11:15:00',
          lwj_link: 'news-detail.html?id=5' },
        { lwj_id: 6, lwj_title: 'WebGPU 推动浏览器端图形计算普及', lwj_category: '前端技术',
          lwj_summary: '介绍 WebGPU 的基本能力，以及在浏览器中实现通用计算的技术要点。',
          lwj_source: '前端周刊', lwj_publish_time: '2026-11-13 13:50:00',
          lwj_link: 'news-detail.html?id=6' },
        { lwj_id: 7, lwj_title: '智能运维平台助力中小企业降本增效', lwj_category: '企业服务',
          lwj_summary: '从告警收敛、容量预测和自动化处置三个方面说明智能运维的价值。',
          lwj_source: '企业数字化', lwj_publish_time: '2026-11-12 08:45:00',
          lwj_link: 'news-detail.html?id=7' },
        { lwj_id: 8, lwj_title: '低代码平台与原生开发的融合趋势', lwj_category: '开发范式',
          lwj_summary: '分析低代码平台与手写代码协同工作的常见模式及适用场景。',
          lwj_source: '开发者社区', lwj_publish_time: '2026-11-11 15:10:00',
          lwj_link: 'news-detail.html?id=8' },
        { lwj_id: 9, lwj_title: '量子计算纠错研究取得新进展', lwj_category: '前沿科技',
          lwj_summary: '概述量子纠错码的研究方向，以及其对大规模量子计算的意义。',
          lwj_source: '科技瞭望', lwj_publish_time: '2026-11-10 09:00:00',
          lwj_link: 'news-detail.html?id=9' }
      ] }
    },
    '/api/news/1': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 1, lwj_title: '大模型代码生成在软件开发中的实践', lwj_category: '人工智能',
      lwj_summary: '介绍大模型辅助编码的典型流程，以及在代码审查与单元测试环节中的应用思路。',
      lwj_source: '技术观察', lwj_publish_time: '2026-11-18 09:30:00',
      lwj_link: 'news-detail.html?id=1'
    } },
    '/api/news/2': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 2, lwj_title: '边缘计算芯片能效比持续提升', lwj_category: '芯片与硬件',
      lwj_summary: '从架构优化与制程改进两个角度，梳理边缘设备芯片降低功耗的常见做法。',
      lwj_source: '硬件前线', lwj_publish_time: '2026-11-17 14:20:00',
      lwj_link: 'news-detail.html?id=2'
    } },
    '/api/news/3': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 3, lwj_title: '开源社区发布新一代前端构建工具', lwj_category: '开发工具',
      lwj_summary: '围绕启动速度、增量构建和插件生态，对比新一代构建工具的核心特性。',
      lwj_source: '开源中国', lwj_publish_time: '2026-11-16 10:05:00',
      lwj_link: 'news-detail.html?id=3'
    } },
    '/api/news/4': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 4, lwj_title: '云原生可观测性方案的落地实践', lwj_category: '云计算',
      lwj_summary: '结合日志、指标与链路追踪，说明中小团队搭建可观测性体系的基本步骤。',
      lwj_source: '云端技术', lwj_publish_time: '2026-11-15 16:40:00',
      lwj_link: 'news-detail.html?id=4'
    } },
    '/api/news/5': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 5, lwj_title: '数据安全技术在水务行业中的应用', lwj_category: '数据安全',
      lwj_summary: '探讨数据采集、传输与共享过程中的脱敏和权限控制策略。',
      lwj_source: '安全视界', lwj_publish_time: '2026-11-14 11:15:00',
      lwj_link: 'news-detail.html?id=5'
    } },
    '/api/news/6': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 6, lwj_title: 'WebGPU 推动浏览器端图形计算普及', lwj_category: '前端技术',
      lwj_summary: '介绍 WebGPU 的基本能力，以及在浏览器中实现通用计算的技术要点。',
      lwj_source: '前端周刊', lwj_publish_time: '2026-11-13 13:50:00',
      lwj_link: 'news-detail.html?id=6'
    } },
    '/api/news/7': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 7, lwj_title: '智能运维平台助力中小企业降本增效', lwj_category: '企业服务',
      lwj_summary: '从告警收敛、容量预测和自动化处置三个方面说明智能运维的价值。',
      lwj_source: '企业数字化', lwj_publish_time: '2026-11-12 08:45:00',
      lwj_link: 'news-detail.html?id=7'
    } },
    '/api/news/8': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 8, lwj_title: '低代码平台与原生开发的融合趋势', lwj_category: '开发范式',
      lwj_summary: '分析低代码平台与手写代码协同工作的常见模式及适用场景。',
      lwj_source: '开发者社区', lwj_publish_time: '2026-11-11 15:10:00',
      lwj_link: 'news-detail.html?id=8'
    } },
    '/api/news/9': { code: 0, msg: 'mock 数据', data: {
      lwj_id: 9, lwj_title: '量子计算纠错研究取得新进展', lwj_category: '前沿科技',
      lwj_summary: '概述量子纠错码的研究方向，以及其对大规模量子计算的意义。',
      lwj_source: '科技瞭望', lwj_publish_time: '2026-11-10 09:00:00',
      lwj_link: 'news-detail.html?id=9'
    } },
    '/api/database/defaults': { code: 0, msg: 'mock 数据', data: {
      lwj_user: 'root', lwj_password: '********',
      lwj_host: 'localhost', lwj_name: 'lwj_db'
    } },
    '/api/database/connect': { code: 0, msg: 'mock：静态托管环境无 MySQL，此处为模拟连接成功', data: {
      lwj_ok: true, lwj_mode: 'mock'
    } }
  };
}());
