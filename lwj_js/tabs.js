/**
 * [Tab 选项卡通用模块]
 * @desc 可复用的 Tab 切换逻辑，支持一个页面多个 Tab 组。
 *       核心：事件委托监听点击 → 清除所有选中态 → 设置当前元素选中态。
 *       HTML 约定：
 *         <div class="lwj-tab-bar">
 *           <div class="lwj-tab-item lwj-tab-active" data-lwj-tab="id1">标签1</div>
 *           <div class="lwj-tab-item" data-lwj-tab="id2">标签2</div>
 *         </div>
 *         <div class="lwj-tab-panel lwj-panel-active" data-lwj-panel="id1">内容1</div>
 *         <div class="lwj-tab-panel" data-lwj-panel="id2">内容2</div>
 * @author 李汶静
 * @created 2026-11-02
 */
(function (global) {
  'use strict';

  var LwjTabs = {

    /**
     * [初始化 Tab 组]
     * @desc 为容器注册委托式 click 监听器。传入选择器字符串或 DOM 元素均可。
     * @param {string|HTMLElement} root - Tab 组容器
     * @returns {object} 本模块自身，支持链式多次调用
     */
    init: function (root) {
      var container = typeof root === 'string' ? document.querySelector(root) : root;
      if (!container) {
        console.warn('[LwjTabs] 未找到容器：', root);
        return this;
      }

      // 事件委托：父容器统一监听 click，避免给每个按钮单独绑监听器
      container.addEventListener('click', function (e) {
        // 兼容点击按钮本体或按钮内子元素（如 <span>）
        var item = e.target.closest('[data-lwj-tab]');
        if (!item) return;
        LwjTabs._activate(container, item.getAttribute('data-lwj-tab'));
      });

      return this;
    },

    /**
     * [公开：切换到指定面板]
     * @desc 允许 JS 主动触发切换（如默认选中非第一项）。
     * @param {HTMLElement} container - Tab 组容器
     * @param {string} panelId - 目标面板的 data-lwj-panel 值
     */
    switchTo: function (container, panelId) {
      this._activate(container, panelId);
    },

    /**
     * [私有：核心切换逻辑 —— 清除所有 → 设置当前]
     * @desc 先移除全部 tab 按钮与面板的选中类，再为目标 id 对应元素加上选中类。
     *       这是题目要求的"清除所有选项卡的选中状态 → 设置当前元素的选中状态"实现。
     * @param {HTMLElement} container - Tab 组容器
     * @param {string} panelId - 目标面板 ID
     * @private
     */
    _activate: function (container, panelId) {
      // === 第一步：清除所有选项卡的选中状态 ===
      var allTabs = container.querySelectorAll('[data-lwj-tab]');
      var allPanels = container.querySelectorAll('[data-lwj-panel]');

      allTabs.forEach(function (tab) {
        tab.classList.remove('lwj-tab-active');
      });
      allPanels.forEach(function (panel) {
        panel.classList.remove('lwj-panel-active');
      });

      // === 第二步：设置当前元素的选中状态 ===
      var activeTab = container.querySelector('[data-lwj-tab="' + panelId + '"]');
      var activePanel = container.querySelector('[data-lwj-panel="' + panelId + '"]');

      if (activeTab) activeTab.classList.add('lwj-tab-active');
      if (activePanel) activePanel.classList.add('lwj-panel-active');
    }
  };

  global.LwjTabs = LwjTabs;

})(window);
