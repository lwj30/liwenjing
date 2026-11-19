/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
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

  console.log('[lwj_config] 接口基础地址：' + lwj_base);
}());
