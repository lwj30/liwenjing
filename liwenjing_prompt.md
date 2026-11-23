# liwenjing_prompt.md

> 本文档记录「AI 聊天 · 后端接口版」这次任务的提示词、实现要点与踩到的问题。
> 时间：2026-11-23 · 作者：李汶静 · 使用模型：DeepSeek-V4.1-Flash

## 一、原始提示词（原文）

```
sk-iagbcatolovgwxlgvakpmtlnxggdarufgxkxnpeeuezvfiy这个是新的key，现在让 Trae 写后端接口 /api/chat
接口要做三件事：收前端发来的 messages 数组 → 带上 Key 转发给硅基流动 → 把模型的回答原样返回给前端。
3
写聊天页面
一个输入框 + 一个发送按钮 + 一块消息区。发送后把"用户的话"先显示出来， 再等接口返回追加"AI 的回答"，等待期间显示"正在思考…"。
多轮对话怎么实现
模型本身不记事。所谓"记得上文"，是因为每次请求都把之前的全部对话一起发过去。 所以要维护一个 messages 数组，每轮把用户消息和 AI 回复都 push 进去。
测试 + 记录
先在页面上问"你好"，再问"我刚才问了什么"——能答上来，说明多轮对话通了。 把这次用的提示词和遇到的问题记进 liwenjing_prompt.md。
调参数小抄：temperature 越高回答越发散（0.7 适合聊天，0.2 适合查资料）； max_tokens 限制回答长度，设太小会出现"话说到一半断了"。
```

## 二、本次产出的文件

| 文件 | 作用 |
|---|---|
| `server.js` | Node 原生 http 服务：实现 `POST /api/chat`，并静态托管项目根目录 |
| `chat-api.html` | 聊天页面：输入框 + 发送按钮 + 消息区，等待时显示“正在思考…” |
| `.env` | 本地密钥与参数配置（已加入 `.gitignore`，不提交仓库） |

启动方式：

```powershell
node d:\gj\server.js
# 浏览器打开 http://localhost:3001/chat-api.html
```

## 三、接口设计

请求：

```json
POST /api/chat
{ "messages": [ { "role": "system", "content": "..." }, { "role": "user", "content": "你好" } ] }
```

后端做的事：
1. 解析请求体，校验 `messages` 是非空数组，只保留 system / user / assistant 三种角色且 content 为字符串的项，最多取最近 40 条；
2. 带上 `Authorization: Bearer <Key>`，转发到 `https://api.siliconflow.cn/v1/chat/completions`；
3. 取出 `choices[0].message.content`，以 `{ reply, model, usage }` 原样返回给前端。

关键参数（都可在 `.env` 里改）：`temperature` 默认 0.7（聊天场景），`max_tokens` 默认 1024。温度越高越发散、越低越稳；max_tokens 太小会出现回答被截断。

## 四、多轮对话怎么实现

模型本身不记事。每次请求都必须把**之前所有对话**一起带上，所以前端维护一个数组：

```js
var messages = [{ role: 'system', content: '你是一个简洁的中文助手' }];

// 发送时
messages.push({ role: 'user', content: 用户输入 });
// 拿到回答后
messages.push({ role: 'assistant', content: reply });
```

下一轮请求把这个数组整体 POST 给 `/api/chat`，模型就能“看到”上文。页面底部的“当前对话条数”就是实时的数组长度，便于观察上下文有没有累积。

如果请求失败，代码会把刚 push 的用户消息 `pop()` 掉，避免一条失败消息污染后续上下文。

## 五、测试结果

接口层（PowerShell 直接调）：

- 问「你好」→ 答「你好！有什么可以帮你的吗？」
- 再问「我刚才问了什么？」→ 答「你刚才问的是“你好”。需要我为你做点什么吗？」

页面层（浏览器实际操作）：

- 输入「你好」后用户气泡立即出现，AI 气泡显示“正在思考”三点动画，按钮变为“思考中”并禁用；
- 回复到位后显示完整中文问候；
- 再问「我刚才问了什么？」，AI 明确回答“你刚才问的是‘你好’”，底部显示“当前对话条数：4”；
- 控制台无报错，网络仅一条 `POST /api/chat 200`。

## 六、遇到的问题与解决

1. **新 Key 无效（最重要）**
   用户这次给的新 Key（`sk-iagb...vfiy`）实测返回 `{"code":30014,"message":"Token is invalid."}`，模型列表接口也 401。
   处理：暂时用之前那个仍然有效的 Key 跑通全流程，`.env` 顶部写了注释说明；等拿到有效 Key 后只改 `.env` 一行即可。

2. **Key 不能放在前端**
   前端直连硅基流动会把 Key 暴露在源码里。所以这次把 Key 放到后端 `.env`，页面只请求同源的 `/api/chat`。`.env` 已在 `.gitignore` 中，不进仓库。

3. **静态页面无法直接跑后端**
   双击 `chat-api.html` 用 `file://` 打开时，`fetch('/api/chat')` 没有服务端可依。必须先用 `node server.js` 启动服务，再访问 `http://localhost:3001/chat-api.html`。

4. **请求超时与重复提交**
   后端加了 AbortController 60 秒超时，超时返回 504；前端请求期间禁用发送按钮，防止用户连点产生并发请求。

5. **中文与编码**
   PowerShell 的 `Invoke-RestMethod` 传中文 JSON 时必须 `[System.Text.Encoding]::UTF8.GetBytes($body)`，否则服务端收到乱码；控制台显示乱码则先执行 `[Console]::OutputEncoding = [Text.Encoding]::UTF8`。

6. **静态文件路径穿越**
   静态服务把 URL 拼到根目录后校验 `startsWith(ROOT)`，阻止 `../` 越界读取。

## 七、后续可以做的

- 把非流式改成 SSE 流式输出（后端用 `stream: true` 逐块转发，前端逐字追加）；
- 增加历史记录上限与滚动窗口，控制 token 成本；
- 换成真正的后端部署（GitHub Pages 不能运行 Node，只能托管静态文件）。
