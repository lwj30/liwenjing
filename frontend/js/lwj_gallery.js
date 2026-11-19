/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
(function lwj_initGalleryPage() {
  const lwj_apiLink = document.getElementById('lwj_gallery_api_link');
  const lwj_list = document.getElementById('lwj_gallery_list');
  const lwj_message = document.getElementById('lwj_gallery_message');
  const lwj_apiUrl = window.location.origin + '/api/gallery';

  lwj_apiLink.href = lwj_apiUrl;
  lwj_apiLink.textContent = lwj_apiUrl;

  function lwj_showMessage(lwj_text, lwj_type) {
    lwj_message.textContent = lwj_text;
    lwj_message.className = 'lwj_message lwj_message--' + lwj_type;
  }

  function lwj_formatTime(lwj_value) {
    return String(lwj_value).replace('T', ' ').slice(0, 16);
  }

  function lwj_createItem(lwj_item) {
    const lwj_card = document.createElement('article');
    lwj_card.className = 'lwj_gallery_item';

    const lwj_imagePath = lwj_item.lwj_image.charAt(0) === '/'
      ? lwj_item.lwj_image
      : '/' + lwj_item.lwj_image;

    const lwj_image = document.createElement('img');
    lwj_image.className = 'lwj_gallery_image';
    lwj_image.src = lwj_imagePath;
    lwj_image.alt = lwj_item.lwj_title;
    lwj_image.loading = 'lazy';

    const lwj_body = document.createElement('div');
    lwj_body.className = 'lwj_gallery_body';

    const lwj_category = document.createElement('span');
    lwj_category.className = 'lwj_news_category';
    lwj_category.textContent = lwj_item.lwj_category;

    const lwj_title = document.createElement('h3');
    lwj_title.className = 'lwj_gallery_title';
    lwj_title.textContent = lwj_item.lwj_title;

    const lwj_description = document.createElement('p');
    lwj_description.className = 'lwj_gallery_description';
    lwj_description.textContent = lwj_item.lwj_description;

    const lwj_foot = document.createElement('div');
    lwj_foot.className = 'lwj_news_foot';

    const lwj_source = document.createElement('span');
    lwj_source.className = 'lwj_news_source';
    lwj_source.textContent = lwj_item.lwj_source + ' · ' + lwj_formatTime(lwj_item.lwj_publish_time);

    lwj_foot.appendChild(lwj_source);
    lwj_body.appendChild(lwj_category);
    lwj_body.appendChild(lwj_title);
    lwj_body.appendChild(lwj_description);
    lwj_body.appendChild(lwj_foot);

    lwj_card.appendChild(lwj_image);
    lwj_card.appendChild(lwj_body);

    return lwj_card;
  }

  async function lwj_loadGallery() {
    lwj_showMessage('正在加载图文数据...', 'info');

    try {
      const lwj_response = await fetch(lwj_apiUrl);
      const lwj_result = await lwj_response.json();
      console.log('[lwj_gallery] 接口响应', lwj_result);

      if (lwj_result.code !== 0) {
        console.error('[lwj_gallery] 接口返回失败', lwj_result);
        lwj_showMessage(lwj_result.msg || '加载失败', 'error');
        return;
      }

      const lwj_data = lwj_result.data;
      if (!lwj_data.lwj_list || lwj_data.lwj_list.length === 0) {
        lwj_showMessage('暂无图文数据。', 'info');
        return;
      }

      lwj_list.innerHTML = '';
      lwj_data.lwj_list.forEach(function lwj_renderItem(lwj_item) {
        lwj_list.appendChild(lwj_createItem(lwj_item));
      });
      lwj_showMessage('共加载 ' + lwj_data.lwj_total + ' 条图文。', 'success');
    } catch (lwj_error) {
      console.error('[lwj_gallery] 请求异常', lwj_error);
      lwj_showMessage('请求失败，请检查后端服务是否已启动。', 'error');
    }
  }

  lwj_loadGallery();
}());
