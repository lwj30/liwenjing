<!-- 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy -->
# 数据库变更记录

> 本文件只追加，不覆盖已有内容。按执行顺序记录全部 SQL（含测试数据的 INSERT），仅凭本文件即可在新机器上完整重建数据库。

## 2026-11-19 初始化

```sql
CREATE DATABASE IF NOT EXISTS lwj_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lwj_db;
```

当前尚未创建业务表。后续每次建表、改表或插入测试数据，按执行顺序追加到本文件。
