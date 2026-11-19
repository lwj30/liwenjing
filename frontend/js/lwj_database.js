/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
(function lwj_initDatabasePage() {
  const lwj_form = document.getElementById('lwj_db_form');
  const lwj_userInput = document.getElementById('lwj_db_user');
  const lwj_passwordInput = document.getElementById('lwj_db_password');
  const lwj_submitButton = document.getElementById('lwj_db_submit');
  const lwj_message = document.getElementById('lwj_db_message');
  const lwj_info = document.getElementById('lwj_db_info');

  function lwj_showMessage(lwj_text, lwj_type) {
    lwj_message.textContent = lwj_text;
    lwj_message.className = 'lwj_message lwj_message--' + lwj_type;
  }

  async function lwj_loadDefaults() {
    try {
      const lwj_response = await fetch(window.lwj_getApiUrl('/api/database/defaults'));
      const lwj_result = await lwj_response.json();
      console.log('[lwj_database] 默认值响应', lwj_result);

      if (lwj_result.code === 0) {
        lwj_userInput.value = lwj_result.data.lwj_user;
        lwj_passwordInput.value = lwj_result.data.lwj_password;
        lwj_info.textContent = '主机：' + lwj_result.data.lwj_host + '　数据库：' + lwj_result.data.lwj_name;
      } else {
        console.error('[lwj_database] 获取默认值失败', lwj_result);
      }
    } catch (lwj_error) {
      console.error('[lwj_database] 获取默认值异常', lwj_error);
      lwj_showMessage('无法读取默认配置，请确认后端服务已启动。', 'error');
    }
  }

  async function lwj_handleSubmit(lwj_event) {
    lwj_event.preventDefault();
    const lwj_user = lwj_userInput.value.trim();
    const lwj_password = lwj_passwordInput.value;

    if (!lwj_user || !lwj_password) {
      lwj_showMessage('请输入用户名和密码。', 'error');
      return;
    }

    lwj_submitButton.disabled = true;
    lwj_submitButton.textContent = '连接中...';
    lwj_showMessage('正在连接数据库...', 'info');

    try {
      const lwj_response = await fetch(window.lwj_getApiUrl('/api/database/connect'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lwj_user: lwj_user, lwj_password: lwj_password })
      });
      const lwj_result = await lwj_response.json();
      console.log('[lwj_database] 连接响应', lwj_result);

      if (lwj_result.code === 0) {
        lwj_showMessage('连接成功：MySQL 数据库可用。', 'success');
      } else {
        console.error('[lwj_database] 连接失败', lwj_result);
        lwj_showMessage(lwj_result.msg || '连接失败', 'error');
      }
    } catch (lwj_error) {
      console.error('[lwj_database] 请求异常', lwj_error);
      lwj_showMessage('请求失败，请检查后端服务是否已启动。', 'error');
    } finally {
      lwj_submitButton.disabled = false;
      lwj_submitButton.textContent = '连接数据库';
    }
  }

  lwj_form.addEventListener('submit', lwj_handleSubmit);
  lwj_loadDefaults();
}());
