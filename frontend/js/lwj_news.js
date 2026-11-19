/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
(function lwj_initNewsPage() {
  const lwj_apiLink = document.getElementById('lwj_news_api_link');
  const lwj_list = document.getElementById('lwj_news_list');
  const lwj_message = document.getElementById('lwj_news_message');
  const lwj_apiUrl = window.lwj_getApiUrl('/api/news');

  lwj_apiLink.href = lwj_apiUrl;
  lwj_apiLink.textContent = lwj_apiUrl;

  function lwj_showMessage(lwj_text, lwj_type) {
    lwj_message.textContent = lwj_text;
    lwj_message.className = 'lwj_message lwj_message--' + lwj_type;
  }

  function lwj_formatTime(lwj_value) {
    return String(lwj_value).replace('T', ' ').slice(0, 16);
  }

  function lwj_createItem(lwj_news) {
    const lwj_article = document.createElement('article');
    lwj_article.className = 'lwj_news_item';

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

    const lwj_title = document.createElement('h3');
    lwj_title.className = 'lwj_news_title';
    lwj_title.textContent = lwj_news.lwj_title;

    const lwj_summary = document.createElement('p');
    lwj_summary.className = 'lwj_news_summary';
    lwj_summary.textContent = lwj_news.lwj_summary;

    const lwj_foot = document.createElement('div');
    lwj_foot.className = 'lwj_news_foot';

    const lwj_source = document.createElement('span');
    lwj_source.className = 'lwj_news_source';
    lwj_source.textContent = '来源：' + lwj_news.lwj_source;

    const lwj_link = document.createElement('a');
    lwj_link.className = 'lwj_news_link';
    lwj_link.href = lwj_news.lwj_link;
    lwj_link.target = '_blank';
    lwj_link.rel = 'noopener noreferrer';
    lwj_link.textContent = '查看原文';

    lwj_foot.appendChild(lwj_source);
    lwj_foot.appendChild(lwj_link);

    lwj_article.appendChild(lwj_head);
    lwj_article.appendChild(lwj_title);
    lwj_article.appendChild(lwj_summary);
    lwj_article.appendChild(lwj_foot);

    return lwj_article;
  }

  async function lwj_loadNews() {
    lwj_showMessage('正在加载新闻数据...', 'info');

    try {
      const lwj_result = await window.lwj_fetchApi('/api/news');
      console.log('[lwj_news] 接口响应', lwj_result);

      if (lwj_result.code !== 0) {
        console.error('[lwj_news] 接口返回失败', lwj_result);
        lwj_showMessage(lwj_result.msg || '加载失败', 'error');
        return;
      }

      const lwj_data = lwj_result.data;
      if (!lwj_data.lwj_list || lwj_data.lwj_list.length === 0) {
        lwj_showMessage('暂无新闻数据。', 'info');
        return;
      }

      lwj_list.innerHTML = '';
      lwj_data.lwj_list.forEach(function lwj_renderItem(lwj_item) {
        lwj_list.appendChild(lwj_createItem(lwj_item));
      });
      lwj_showMessage('共加载 ' + lwj_data.lwj_total + ' 条新闻。', 'success');
    } catch (lwj_error) {
      console.error('[lwj_news] 请求异常', lwj_error);
      lwj_showMessage('请求失败，请检查后端服务是否已启动。', 'error');
    }
  }

  lwj_loadNews();
}());
