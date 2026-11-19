:: 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
@echo off
chcp 65001 >nul
title lwj-backend-launcher
cd /d "%~dp0backend"

netstat -ano | findstr ":8030 " | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo 检测到 8030 端口已被占用，正在关闭旧服务...
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8030 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
)

ping -n 2 127.0.0.1 >nul
start "lwj-backend" /min node app.js
echo 后端服务已在后台启动
echo 访问地址：http://localhost:8030/
ping -n 2 127.0.0.1 >nul
