<!-- 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy -->
# 接口变更记录

> 本文件只追加，不覆盖已有内容。每次创建或修改接口后追加：接口路径 | HTTP 方法 | 请求参数（含示例） | 响应格式（含 JSON 示例） | 修改时间。

## 2026-11-19 新增接口

- 接口路径：`/api/health`
- HTTP 方法：GET
- 请求参数：无（示例：`GET http://localhost:8030/api/health`）
- 响应格式：
  ```json
  {
    "code": 0,
    "msg": "服务正常",
    "data": { "lwj_database": true }
  }
  ```
- 修改时间：2026-11-19

## 2026-11-19 修改接口

- 接口路径：`/api/health`
- HTTP 方法：GET
- 请求参数：无（示例：`GET http://localhost:8030/api/health`）
- 响应格式：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": { "lwj_database": true }
  }
  ```
- 修改时间：2026-11-19

## 2026-11-19 新增接口

- 接口路径：`/api/database/defaults`
- HTTP 方法：GET
- 请求参数：无（示例：`GET http://localhost:8030/api/database/defaults`）
- 响应格式：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": {
      "lwj_user": "root",
      "lwj_password": "******",
      "lwj_host": "localhost",
      "lwj_name": "lwj_db"
    }
  }
  ```
- 修改时间：2026-11-19

## 2026-11-19 新增接口

- 接口路径：`/api/database/connect`
- HTTP 方法：POST
- 请求参数：JSON（示例：`{ "lwj_user": "root", "lwj_password": "******" }`）
- 响应格式（成功）：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": { "lwj_connected": true }
  }
  ```
  响应格式（失败）：
  ```json
  {
    "code": 1,
    "msg": "数据库连接失败：Access denied for user 'xxx'",
    "data": { "lwj_connected": false }
  }
  ```
- 修改时间：2026-11-19

## 2026-11-19 新增接口

- 接口路径：`/api/news`
- HTTP 方法：GET
- 请求参数：无（示例：`GET http://localhost:8030/api/news`）
- 响应格式：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": {
      "lwj_total": 9,
      "lwj_list": [
        {
          "lwj_id": 1,
          "lwj_title": "大模型代码生成在软件开发中的实践",
          "lwj_category": "人工智能",
          "lwj_summary": "介绍大模型辅助编码的典型流程。",
          "lwj_source": "技术观察",
          "lwj_publish_time": "2026-11-18T01:30:00.000Z",
          "lwj_link": "https://example.com/news/20261118-ai-code"
        }
      ]
    }
  }
  ```
- 修改时间：2026-11-19

## 2026-11-19 新增接口

- 接口路径：`/api/gallery`
- HTTP 方法：GET
- 请求参数：无（示例：`GET http://localhost:8030/api/gallery`）
- 响应格式：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": {
      "lwj_total": 8,
      "lwj_list": [
        {
          "lwj_id": 1,
          "lwj_title": "神经网络可视化入门",
          "lwj_category": "人工智能",
          "lwj_description": "用节点与连线的形式理解神经网络的数据流动。",
          "lwj_image": "images/lwj_gallery_01.png",
          "lwj_source": "AI 实验室",
          "lwj_publish_time": "2026-11-18T02:00:00.000Z"
        }
      ]
    }
  }
  ```
- 修改时间：2026-11-19

## 2026-11-19 新增接口

- 接口路径：`/api/news/:lwj_id`
- HTTP 方法：GET
- 请求参数：路径参数 `lwj_id`（示例：`GET http://localhost:8030/api/news/1`）
- 响应格式（成功）：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": {
      "lwj_news": {
        "lwj_id": 1,
        "lwj_title": "大模型代码生成在软件开发中的实践",
        "lwj_category": "人工智能",
        "lwj_summary": "介绍大模型辅助编码的典型流程。",
        "lwj_source": "技术观察",
        "lwj_publish_time": "2026-11-18T01:30:00.000Z",
        "lwj_link": "news-detail.html?id=1"
      }
    }
  }
  ```
  响应格式（失败）：
  ```json
  { "code": 1, "msg": "未找到该新闻", "data": {} }
  ```
- 修改时间：2026-11-19
