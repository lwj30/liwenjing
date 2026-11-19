/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
(function lwj_initNewsDetailPage() {
  const lwj_apiLink = document.getElementById('lwj_detail_api_link');
  const lwj_content = document.getElementById('lwj_detail_content');
  const lwj_message = document.getElementById('lwj_detail_message');
  const lwj_params = new URLSearchParams(window.location.search);
  const lwj_id = lwj_params.get('id');
  const lwj_apiUrl = window.location.origin + '/api/news/' + encodeURIComponent(lwj_id || '');

  lwj_apiLink.href = lwj_apiUrl;
  lwj_apiLink.textContent = lwj_apiUrl;

  function lwj_showMessage(lwj_text, lwj_type) {
    lwj_message.textContent = lwj_text;
    lwj_message.className = 'lwj_message lwj_message--' + lwj_type;
  }

  function lwj_formatTime(lwj_value) {
    return String(lwj_value).replace('T', ' ').slice(0, 16);
  }

  function lwj_renderDetail(lwj_news) {
    lwj_content.innerHTML = '';

    const lwj_head = document.createElement('div');
    lwj_head.className = 'lwj_news_head';

    const lwj_category = document.createElement('span');
    lwj_category.className = 'lwj_news_category';
    lwj_category.textContent = lwj_news.lwj_category;

    const lwj_time = document.createElement('span');
    lwj_time.className = 'lwj_news_time';
    lwj_time.textContent = lwj_formatTime(lwj_news.lwj_publish_time);

    lwj_head.appendChild(lwj_category);
    lwj_head.appendChild(lwj_time);

    const lwj_title = document.createElement('h2');
    lwj_title.className = 'lwj_detail_title';
    lwj_title.textContent = lwj_news.lwj_title;

    const lwj_meta = document.createElement('p');
    lwj_meta.className = 'lwj_detail_meta';
    lwj_meta.textContent = '来源：' + lwj_news.lwj_source + '　编号：' + lwj_news.lwj_id;

    const lwj_summary = document.createElement('p');
    lwj_summary.className = 'lwj_detail_summary';
    lwj_summary.textContent = lwj_news.lwj_summary;

    lwj_content.appendChild(lwj_head);
    lwj_content.appendChild(lwj_title);
    lwj_content.appendChild(lwj_meta);
    lwj_content.appendChild(lwj_summary);
  }

  async function lwj_loadDetail() {
    if (!lwj_id) {
      lwj_showMessage('缺少新闻 id 参数。', 'error');
      return;
    }

    lwj_showMessage('正在加载新闻详情...', 'info');

    try {
      const lwj_response = await fetch(lwj_apiUrl);
      const lwj_result = await lwj_response.json();
      console.log('[lwj_news_detail] 接口响应', lwj_result);

      if (lwj_result.code !== 0) {
        console.error('[lwj_news_detail] 接口返回失败', lwj_result);
        lwj_showMessage(lwj_result.msg || '加载失败', 'error');
        return;
      }

      lwj_renderDetail(lwj_result.data.lwj_news);
      lwj_showMessage('新闻详情加载成功。', 'success');
    } catch (lwj_error) {
      console.error('[lwj_news_detail] 请求异常', lwj_error);
      lwj_showMessage('请求失败，请检查后端服务是否已启动。', 'error');
    }
  }

  lwj_loadDetail();
}());
