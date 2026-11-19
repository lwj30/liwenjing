/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 * 功能：API 基础地址配置 + 带自动降级的 fetch 包装器
 *       - localhost / 127.0.0.1 环境：走相对路径，Express 后端提供 /api
 *       - GitHub Pages 等静态托管：真实 fetch 失败时自动 fallback 到 lwj_mock 数据
 */
(function lwj_initApiConfig() {
  const lwj_params = new URLSearchParams(window.location.search);
  const lwj_customApi = lwj_params.get('api');
  const lwj_isLocal = ['localhost', '127.0.0.1'].indexOf(window.location.hostname) !== -1;
  const lwj_defaultBase = lwj_isLocal ? window.location.origin : 'http://localhost:8030';
  const lwj_base = (lwj_customApi || lwj_defaultBase).replace(/\/$/, '');

  window.lwj_getApiUrl = function lwj_getApiUrl(lwj_path) {
    return lwj_base + '/' + String(lwj_path).replace(/^\//, '');
  };

  window.lwj_getApiBase = function lwj_getApiBase() {
    return lwj_base;
  };

  /**
   * 带自动降级的 API 请求。先 fetch 真实后端，失败或超时则返回 mock 数据。
   * @param {string} lwj_path 接口路径，如 '/api/gallery'
   * @param {object} [lwj_options] fetch 第二参数（method / headers / body 等）
   * @returns {Promise<object>} 统一格式 { code, msg, data }
   */
  window.lwj_fetchApi = function lwj_fetchApi(lwj_path, lwj_options) {
    const lwj_cleanPath = String(lwj_path).replace(/^\//, '');
    const lwj_fullUrl = lwj_base + '/' + lwj_cleanPath;
    const lwj_timeoutMs = 4000;

    return new Promise(function lwj_executor(lwj_resolve) {
      let lwj_settled = false;

      // 超时兜底
      const lwj_timer = setTimeout(function lwj_onTimeout() {
        if (lwj_settled) return;
        lwj_settled = true;
        lwj_resolve(lwj_getMock(lwj_cleanPath, '请求超时，使用本地 mock 数据'));
      }, lwj_timeoutMs);

      fetch(lwj_fullUrl, lwj_options || {})
        .then(function lwj_parse(lwj_res) {
          if (lwj_settled) return;
          clearTimeout(lwj_timer);
          lwj_settled = true;
          if (!lwj_res.ok) {
            lwj_resolve(lwj_getMock(lwj_cleanPath, 'HTTP ' + lwj_res.status + '，使用 mock 数据'));
            return;
          }
          return lwj_res.json().then(function lwj_json(lwj_result) {
            lwj_resolve(lwj_result);
          }, function lwj_jsonFail() {
            lwj_resolve(lwj_getMock(lwj_cleanPath, '响应非 JSON，使用 mock 数据'));
          });
        })
        .catch(function lwj_onError(lwj_err) {
          if (lwj_settled) return;
          clearTimeout(lwj_timer);
          lwj_settled = true;
          console.warn('[lwj_fetchApi] 真实请求失败，降级到 mock：', lwj_err && lwj_err.message);
          lwj_resolve(lwj_getMock(lwj_cleanPath, '网络不可用，使用本地 mock 数据'));
        });
    });
  };

  function lwj_getMock(lwj_cleanPath, lwj_msg) {
    const lwj_mockStore = window.lwj_mock || {};
    // 先精确匹配，再尝试前缀匹配（如 /api/news/1 匹配 /api/news/*）
    let lwj_data = lwj_mockStore['/' + lwj_cleanPath];
    if (!lwj_data) {
      const lwj_prefix = Object.keys(lwj_mockStore).find(function lwj_startsWith(p) {
        return lwj_cleanPath.indexOf(p.replace(/^\//, '').replace(/\/$/, '') + '/') === 0;
      });
      if (lwj_prefix) lwj_data = lwj_mockStore[lwj_prefix];
    }
    if (lwj_data) {
      console.log('[lwj_fetchApi] 使用 mock 数据：' + lwj_cleanPath + ' — ' + lwj_msg);
      return lwj_data;
    }
    console.warn('[lwj_fetchApi] 无 mock 数据：' + lwj_cleanPath);
    return { code: 1, msg: lwj_msg || '无数据', data: {} };
  }

  console.log('[lwj_config] 接口基础地址：' + lwj_base
    + '（' + (lwj_isLocal ? '本地 Express 后端' : '静态托管，将自动降级 mock 数据') + '）');
}());
