-- ============================================================
-- PlanetScale / MySQL 数据库初始化脚本
-- 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19
-- 用法：在 PlanetScale 控制台 / SQL Editor 中整段执行即可
-- ============================================================

CREATE DATABASE IF NOT EXISTS lwj_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lwj_db;

-- ========== 科技新闻表 ==========
CREATE TABLE IF NOT EXISTS lwj_news (
  lwj_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻ID',
  lwj_title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  lwj_category VARCHAR(50) NOT NULL COMMENT '新闻分类',
  lwj_summary VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  lwj_source VARCHAR(100) NOT NULL COMMENT '新闻来源',
  lwj_publish_time DATETIME NOT NULL COMMENT '发布时间',
  lwj_link VARCHAR(500) NOT NULL COMMENT '原文链接',
  PRIMARY KEY (lwj_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科技新闻表';

INSERT INTO lwj_news (lwj_title, lwj_category, lwj_summary, lwj_source, lwj_publish_time, lwj_link) VALUES
('大模型代码生成在软件开发中的实践', '人工智能', '介绍大模型辅助编码的典型流程，以及在代码审查与单元测试环节中的应用思路。', '技术观察', '2026-11-18 09:30:00', 'news-detail.html?id=1'),
('边缘计算芯片能效比持续提升', '芯片与硬件', '从架构优化与制程改进两个角度，梳理边缘设备芯片降低功耗的常见做法。', '硬件前线', '2026-11-17 14:20:00', 'news-detail.html?id=2'),
('开源社区发布新一代前端构建工具', '开发工具', '围绕启动速度、增量构建和插件生态，对比新一代构建工具的核心特性。', '开源中国', '2026-11-16 10:05:00', 'news-detail.html?id=3'),
('云原生可观测性方案的落地实践', '云计算', '结合日志、指标与链路追踪，说明中小团队搭建可观测性体系的基本步骤。', '云端技术', '2026-11-15 16:40:00', 'news-detail.html?id=4'),
('数据安全技术在水务行业中的应用', '数据安全', '探讨数据采集、传输与共享过程中的脱敏和权限控制策略。', '安全视界', '2026-11-14 11:15:00', 'news-detail.html?id=5'),
('WebGPU 推动浏览器端图形计算普及', '前端技术', '介绍 WebGPU 的基本能力，以及在浏览器中实现通用计算的技术要点。', '前端周刊', '2026-11-13 13:50:00', 'news-detail.html?id=6'),
('智能运维平台助力中小企业降本增效', '企业服务', '从告警收敛、容量预测和自动化处置三个方面说明智能运维的价值。', '企业数字化', '2026-11-12 08:45:00', 'news-detail.html?id=7'),
('低代码平台与原生开发的融合趋势', '开发范式', '分析低代码平台与手写代码协同工作的常见模式及适用场景。', '开发者社区', '2026-11-11 15:10:00', 'news-detail.html?id=8'),
('量子计算纠错研究取得新进展', '前沿科技', '概述量子纠错码的研究方向，以及其对大规模量子计算的意义。', '科技瞭望', '2026-11-10 09:00:00', 'news-detail.html?id=9');

-- ========== 科技图文表 ==========
CREATE TABLE IF NOT EXISTS lwj_gallery (
  lwj_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文ID',
  lwj_title VARCHAR(200) NOT NULL COMMENT '图文标题',
  lwj_category VARCHAR(50) NOT NULL COMMENT '图文分类',
  lwj_description VARCHAR(500) NOT NULL COMMENT '图文简介',
  lwj_image VARCHAR(200) NOT NULL COMMENT '图片路径（相对 frontend 目录）',
  lwj_source VARCHAR(100) NOT NULL COMMENT '内容来源',
  lwj_publish_time DATETIME NOT NULL COMMENT '发布时间',
  PRIMARY KEY (lwj_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科技图文表';

INSERT INTO lwj_gallery (lwj_title, lwj_category, lwj_description, lwj_image, lwj_source, lwj_publish_time) VALUES
('神经网络可视化入门', '人工智能', '用节点与连线的形式理解神经网络的数据流动，适合初学者建立直观认识。', 'images/lwj_gallery_01.png', 'AI 实验室', '2026-11-18 10:00:00'),
('边缘芯片的能效设计', '芯片与硬件', '从架构与制程两个维度梳理边缘设备芯片降低功耗的常见思路。', 'images/lwj_gallery_02.png', '硬件前线', '2026-11-17 11:30:00'),
('云原生架构图解', '云计算', '通过数据中心视角理解弹性伸缩、服务编排与资源调度的协作关系。', 'images/lwj_gallery_03.png', '云端技术', '2026-11-16 09:15:00'),
('数据安全防护要点', '数据安全', '围绕身份认证、访问控制与加密传输，整理业务系统常见防护实践。', 'images/lwj_gallery_04.png', '安全视界', '2026-11-15 14:40:00'),
('浏览器端图形计算新趋势', '前端技术', '介绍浏览器图形接口的演进，以及 3D 可视化在 Web 应用中的落地方式。', 'images/lwj_gallery_05.png', '前端周刊', '2026-11-14 16:05:00'),
('智能运维监控实践', '企业服务', '以监控大屏为切入点，说明告警收敛与容量预测在实际运维中的价值。', 'images/lwj_gallery_06.png', '企业数字化', '2026-11-13 08:50:00'),
('低代码开发模式解析', '开发范式', '用可视化积木的思路解释低代码平台与手写代码的协作方式。', 'images/lwj_gallery_07.png', '开发者社区', '2026-11-12 13:20:00'),
('量子计算基础概念', '前沿科技', '从量子比特与叠加态出发，概览量子计算的基本原理与研究意义。', 'images/lwj_gallery_08.png', '科技瞭望', '2026-11-11 15:35:00');
