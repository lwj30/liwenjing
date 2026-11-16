/**
 * [Tab 选项卡通用模块]
 * @desc 为任意容器元素挂载 Tab 切换逻辑，支持一个页面多个 Tab 组复用。
 *       核心机制：委托式事件监听 → 清除全部子元素选中态 → 设置当前元素选中态。
 *       HTML 结构约定（需调用方自行构造）：
 *         <div data-lwj-tabs>
 *           <button data-lwj-tab="panel-id" class="lwj-tab-btn lwj-tab-active">标签1</button>
 *           <button data-lwj-tab="panel-id2" class="lwj-tab-btn">标签2</button>
 *         </div>
 *         <div data-lwj-tab-panel="panel-id" class="lwj-tab-panel lwj-panel-active">内容1</div>
 *         <div data-lwj-tab-panel="panel-id2" class="lwj-tab-panel">内容2</div>
 * @author 李汶静
 * @created 2026-11-02
 */
//DOM查找方式
//按 id 找
//按 class 找
//按标签名找
//按 name 属性找
//通过选择器查找
//5. querySelector —— 返回**第一个**匹配的元素
//6. querySelectorAll —— 返回**所有**匹配的元素

(function (global) {
  'use strict';

  var lwj_Tabs = {

    /**
     * [初始化 Tab 组]
     * @desc 为指定容器注册点击委托监听器，自动绑定同一容器内的按钮与面板。
     * @param {HTMLElement} container - 外层容器元素（需包含 data-lwj-tabs 或传入任何 DOM 元素）
     * @returns {object} 本模块引用，支持链式多次调用
     */
    init: function (container) {
      // 兼容传入 selector 字符串或直接传 DOM 元素
      var root = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!root) {
        console.warn('[lwj_Tabs] 未找到容器', container);
        return this;
      }

      // 事件委托：在容器上统一监听 click，避免每个按钮单独绑监听器
      root.addEventListener('click', function (e) {
        var target = e.target;
        // 支持点击按钮本身或按钮内部子元素（如 <span>）
        var btn = target.closest('[data-lwj-tab]');
        if (!btn) return;

        var panelId = btn.getAttribute('data-lwj-tab');
        lwj_Tabs._switch(root, panelId);
      });

      return this;
    },

    /**
     * [切换到指定面板]
     * @desc 公共方法，允许 JS 主动触发切换（如页面加载后默认选中非第一项）。
     *       内部顺序：先清除所有选中态 → 再激活目标按钮与面板。
     * @param {HTMLElement} root - Tab 组容器
     * @param {string} panelId - 目标面板的 data-lwj-tab-panel 值
     */
    switchTo: function (root, panelId) {
      this._switch(root, panelId);
    },

    /**
     * [私有：实际切换逻辑]
     * @desc 先遍历容器内所有按钮/面板移除选中类名，再为传入的 panelId 对应元素添加选中类。
     *       这是"清除所有 → 设置当前"的核心实现。
     * @param {HTMLElement} root - Tab 组容器
     * @param {string} panelId - 目标面板 ID
     * @private
     */
    _switch: function (root, panelId) {
      // 第一步：清除所有选项卡的选中状态
      var allBtns = root.querySelectorAll('[data-lwj-tab]');
      var allPanels = root.querySelectorAll('[data-lwj-tab-panel]');

      allBtns.forEach(function (b) {
        b.classList.remove('lwj-tab-active');
      });
      allPanels.forEach(function (p) {
        p.classList.remove('lwj-panel-active');
      });

      // 第二步：设置当前元素的选中状态
      var activeBtn = root.querySelector('[data-lwj-tab="' + panelId + '"]');
      var activePanel = root.querySelector('[data-lwj-tab-panel="' + panelId + '"]');

      if (activeBtn) activeBtn.classList.add('lwj-tab-active');
      if (activePanel) activePanel.classList.add('lwj-panel-active');
    }
  };

  // 暴露到全局（ES5 无模块系统）
  global.lwj_Tabs = lwj_Tabs;

})(window);
