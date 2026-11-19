<!--
姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
-->
# 李汶静课程作品集

## 基本信息

- 学号：24001011030
- 姓名：李汶静
- 项目名称：李汶静课程作品集
- 项目类别：自选

## 技术栈

- 前端：`frontend/` 目录，原生 HTML、CSS、JavaScript，不依赖任何第三方库、框架或 CDN
- 后端：`backend/` 目录，Node.js + Express，RESTful + MVC 风格，接口统一以 `/api/` 为前缀，端口 `8030`
- 数据库：MySQL，连接参数由 `backend/.env` 中的 `DB_USER`、`DB_PASSWORD`、`DB_HOST`、`DB_NAME` 提供

## 目录结构

```
new-lwj-project/
├── AGENTS.md              # 项目开发规范
├── liwenjing_prompt.md    # 开发指令记录（只追加）
├── readme.md              # 项目说明
├── frontend/              # 前端静态资源
│   ├── index.html         # 首页 / 页面导航
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── images/
└── backend/               # 后端服务
    ├── app.js             # Express 入口
    ├── config/            # 数据库等配置
    ├── models/
    ├── controllers/
    ├── routes/
    ├── lwj_interface.md   # 接口变更记录（只追加）
    ├── lwj_database.md    # 数据库变更记录（只追加）
    └── .env               # 本地环境变量（不纳入版本控制）
```

## 运行方式

```bash
# 1. 切换国内 npm 镜像（按项目规范）
npm config set registry https://registry.npmmirror.com

# 2. 安装后端依赖
cd backend
npm i

# 3. 在 backend/.env 中配置数据库连接参数后启动服务
npm start
```

启动后访问 `http://localhost:8030/` 查看首页，`GET http://localhost:8030/api/health` 可检查服务与数据库状态。
