/**
 * AI 聊天后端服务
 * @desc 提供 POST /api/chat：接收前端 messages 数组，带上 API Key 转发给硅基流动，
 *       把模型回答原样返回；同时静态托管项目根目录，方便直接打开页面调试。
 * @author 李汶静
 * @created 2026-11-23
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3001;

/**
 * 读取 .env 配置
 * @desc 不引入第三方依赖，逐行解析 KEY=VALUE，已存在的环境变量优先
 * @returns {void}
 */
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) { return; }
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach(function (line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) { return; }
    const index = trimmed.indexOf('=');
    if (index < 0) { return; }
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && !process.env[key]) { process.env[key] = value; }
  });
}

loadEnv();

const API_KEY = process.env.SILICONFLOW_API_KEY || '';
const BASE_URL = (process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1').replace(/\/+$/, '');
const MODEL = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash';
const TEMPERATURE = Number(process.env.SILICONFLOW_TEMPERATURE) || 0.7;
const MAX_TOKENS = Number(process.env.SILICONFLOW_MAX_TOKENS) || 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};

/**
 * 读取请求体
 * @desc 限制 1MB，防止超大请求拖垮进程
 * @param {http.IncomingMessage} req - 请求对象
 * @returns {Promise<string>} 请求体文本
 */
function readBody(req) {
  return new Promise(function (resolve, reject) {
    let size = 0;
    const chunks = [];
    req.on('data', function (chunk) {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(new Error('请求体过大'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

/**
 * 返回 JSON 响应
 * @desc 统一设置 UTF-8 与 CORS 头，便于本地跨端口调试
 * @param {http.ServerResponse} res - 响应对象
 * @param {number} status - HTTP 状态码
 * @param {Object} data - 响应数据
 * @returns {void}
 */
function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

/**
 * 处理 /api/chat
 * @desc 校验 messages 后调用硅基流动 Chat Completions，把模型的回答原文取出返回
 * @param {http.IncomingMessage} req - 请求对象
 * @param {http.ServerResponse} res - 响应对象
 * @returns {Promise<void>}
 */
async function handleChat(req, res) {
  if (!API_KEY) {
    sendJson(res, 500, { error: '服务端未配置 SILICONFLOW_API_KEY，请在 .env 中填写' });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch (err) {
    sendJson(res, 400, { error: '请求体不是合法 JSON：' + err.message });
    return;
  }

  const messages = payload && payload.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    sendJson(res, 400, { error: 'messages 必须是非空数组' });
    return;
  }

  // 只保留合法角色与字符串内容，顺便限制条数，避免超长上下文
  const safeMessages = messages.slice(-40).filter(function (m) {
    return m && ['system', 'user', 'assistant'].indexOf(m.role) >= 0 && typeof m.content === 'string';
  });
  if (!safeMessages.length) {
    sendJson(res, 400, { error: 'messages 中没有合法的对话内容' });
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 60000);

  try {
    const upstream = await fetch(BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify({
        model: payload.model || MODEL,
        messages: safeMessages,
        temperature: typeof payload.temperature === 'number' ? payload.temperature : TEMPERATURE,
        max_tokens: typeof payload.max_tokens === 'number' ? payload.max_tokens : MAX_TOKENS
      }),
      signal: controller.signal
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      sendJson(res, 502, { error: '上游返回了非 JSON 内容', raw: text.slice(0, 500) });
      return;
    }

    if (!upstream.ok) {
      sendJson(res, upstream.status, {
        error: (data && data.message) || ('上游接口错误 HTTP ' + upstream.status)
      });
      return;
    }

    const content = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';
    if (!content) {
      sendJson(res, 502, { error: '上游没有返回回答内容' });
      return;
    }

    // 原样返回回答正文，附带用量信息便于前端展示
    sendJson(res, 200, {
      reply: content,
      model: data.model || MODEL,
      usage: data.usage || null
    });
  } catch (err) {
    const aborted = err && err.name === 'AbortError';
    sendJson(res, aborted ? 504 : 502, {
      error: aborted ? '上游接口超时（60 秒）' : ('转发失败：' + err.message)
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 静态文件服务
 * @desc 把 URL 映射到项目根目录下的文件，阻止 ../ 越界访问，目录默认 index.html
 * @param {http.IncomingMessage} req - 请求对象
 * @param {http.ServerResponse} res - 响应对象
 * @returns {void}
 */
function serveStatic(req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(ROOT, urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 禁止访问');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 文件不存在：' + urlPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    res.end();
    return;
  }

  if (req.url && req.url.split('?')[0] === '/api/chat') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: '请使用 POST 请求' });
      return;
    }
    handleChat(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { error: '不支持的请求方法' });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, function () {
  console.log('AI 聊天服务已启动：http://localhost:' + PORT + '/chat-api.html');
  console.log('接口地址：POST http://localhost:' + PORT + '/api/chat');
  console.log('模型：' + MODEL + ' · Key：' + (API_KEY ? '已配置' : '未配置（请检查 .env）'));
});
