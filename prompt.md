# 课程实践任务一 · 提示词迭代记录（prompt.md）

> 作者：李汶静　｜　日期：2026-11-09　｜　作品：Swiper 大国重器光影展
> 在线访问：<https://lwj30.github.io/liwenjing/swiper.html>

本文件记录两轮真实使用的提示词与对应生成效果，说明第一轮为什么会失败、第二轮如何修正，以及最终代码的验证结论。

---

## 一、第一轮提示词

### 1.1 原始提示词

```text
帮我用 Swiper 做一个图片轮播，白底、四个彩色球，要循环播放、自动播放、带圆点分页，
初始效果用立方体旋转。写完给我完整 HTML。
```

### 1.2 AI 首次生成的配置（节选）

```js
const sw = new Swiper('.swiper', {
  loop: true,
  autoplay: true,
  pagination: { el: '.swiper-pagination' }
  // 没有 effect、没有分页点击、没有 delay
});
```

### 1.3 实测问题（逐项验证）

| 需求 | 首轮结果 | 结论 |
|------|---------|------|
| 循环播放 | `loop: true` | 通过 |
| 自动播放 | 写了，但 `autoplay: true` 走默认 5 秒，且拖动后自动停止 | 不达标 |
| 圆点分页可点击 | 只写了 `el`，没写 `clickable: true` | 不达标 |
| 初始 cube 效果 | 完全没有 `effect` 字段，页面是普通平移轮播 | 不达标 |

**根因分析**：首轮提示词只描述了“想要的效果”，没有给出容器标识、时间参数和禁止项，模型按最省事的默认值补全，于是遗漏了 `effect` 与 `disableOnInteraction`。这类“效果型需求”如果不逐条拆成配置项，很容易被默认值悄悄替换。

---

## 二、第二轮提示词（优化后）

### 2.1 优化思路

1. 明确库版本与容器 id，避免选择器写错；
2. 把需求拆成编号条款，一条对应一个配置字段；
3. 给出具体数值（3.2 秒），而不是“自动播放”这种模糊描述；
4. 明确“不要改动其他默认值”，减少模型自作主张。

### 2.2 第二轮提示词

```text
Swiper 11，容器 id 为 wySw4，里面 6 张 slide。请严格按下面四条生成配置，不要改动其他默认值：
① 循环：loop: true；
② 自动播放：autoplay: { delay: 3200, disableOnInteraction: false }，即每 3.2 秒翻页，手动操作后继续自动播放；
③ 分页器：pagination: { el: '#wySw4 .swiper-pagination', clickable: true }，圆点可点击；
④ 初始效果：effect: 'cube'，并用 cubeEffect: { shadow: true, slideShadows: true } 开启阴影。
只输出这个 Swiper 的初始化代码，并逐条说明每个字段对应哪一条需求。
```

### 2.3 AI 第二轮输出（实际落地代码）

```js
new Swiper('#wySw4', {
  effect: 'cube',
  loop: true,
  speed: 650,
  grabCursor: true,
  /* ② 3.2 秒自动翻页，手动操作后不停止 */
  autoplay: { delay: 3200, disableOnInteraction: false },
  /* ③ 圆点分页器可点击 */
  pagination: { el: '#wySw4 .swiper-pagination', clickable: true },
  /* ④ 立方体 + 阴影 */
  cubeEffect: { shadow: true, slideShadows: true }
});
```

### 2.4 第二轮验证结论

| 需求 | 验证方式 | 结果 |
|------|---------|------|
| 初始 cube 3D | 打开页面观察首屏为立方体翻转 | 通过 |
| 3.2 秒自动翻页 | 静置约 4 秒，画面自动切到下一张 | 通过 |
| 手动分页后仍自动 | 点圆点切页，继续静置，仍会自动翻页 | 通过 |
| 循环 | 从第 6 张继续翻到第 1 张 | 通过 |

第二轮 4/4 通过，控制台无报错。

---

## 三、追加提示词：第七种 creative 电影墙

第一轮的四项需求达标后，又追加一轮“效果扩展”提示词：

```text
在演示四里加一排效果切换按钮：fade、cube、coverflow、flip、cards、creative。
第 7 个按钮是「creative 电影墙」：上一张向左移 20%、缩小到 0.86、绕 Z 轴转 -20° 并降低透明度；
下一张从右侧 100% 平移入场、放大到 1.12。切换时保持当前图片不跳回第一张。
```

AI 的回答指出一个关键事实：**Swiper 没有 `changeEffect` 方法**，运行时不能直接换效果，正确做法是记录当前 `realIndex`，然后 `destroy(true, true)` 再按新效果重建实例。最终实现：

```js
function lwjSwitchEffect(effect) {
  const currentIndex = lwjMainSwiper ? lwjMainSwiper.realIndex : 0;
  if (lwjMainSwiper) lwjMainSwiper.destroy(true, true);
  lwjMainSwiper = lwjCreateMainSwiper(effect, currentIndex, keyboardEnabled);
}
```

同时 `creativeEffect` 的 `prev` / `next` 分别控制“离场方向”和“入场方向”的变换，正好解释了 `translate`（平移）、`rotate`（旋转）、`scale`（缩放）三个属性各自的作用。

---

## 四、两轮对比小结

| 维度 | 第一轮 | 第二轮 |
|------|--------|--------|
| 需求描述 | 一句话概括效果 | 编号条款 + 具体数值 |
| 指定容器 | 未指定 | `#wySw4` |
| 生成结果 | 4 项中 3 项不达标 | 4 项全部通过 |
| 返工成本 | 需要人工逐项补配置 | 一次落地，只需微调动画速度 |

核心经验：**提示词要把“效果”翻译成“字段 + 取值 + 禁止项”**，并明确版本与选择器；否则模型会用默认值填补空白，而默认值恰恰最容易偏离预期。

---

## 五、答辩备查

- **为什么必须写 `disableOnInteraction: false`？** 否则用户拖动或点击分页后，Swiper 会永久停止自动播放。
- **`loop: true` 时 `initialSlide` 还准吗？** 需要配合 `initialSlide` 传真实索引；重建时用 `realIndex` 才能保持当前位置。
- **`translate` 的百分比相对谁？** 相对 slide 自身宽（x 轴）与高（y 轴），不是相对容器。
- **`rotate` 取值范围？** 单位 deg，正负号决定方向，常用 -180° ~ 180°。

---

## 六、任务三：与 AI 的关键对话记录（提示词 + 重要往返）

### 6.1 提示词 A —— 新增第六件展品

```text
为光影展轮播增加第六件展品「爱达 · 魔都号」：首艘国产大型邮轮，2024 年 1 月首航。
配图用 A1 生成，横版 16:9，画面写实、海面晨光。
slide 结构必须与现有五张完全一致：swiper-slide > img + caption（序号、名称、一句说明），
caption 要保留 data-swiper-parallax，别破坏现有视差。
```

**重要往返**：AI 第一版只塞了一个 `<img>`，没有 caption，序号和说明写死在 HTML 里，也没有
`data-swiper-parallax`。我指出「结构必须与现有五张一致」后，改为复用 `lwjRenderSlides()`：
只要在 `LWJ_EXHIBITS` 数组末尾加一条数据，六张 slide 结构、序号、视差属性全部自动统一。

### 6.2 提示词 B —— 加一个课堂未讲能力

```text
再挑一个课堂上没讲过的 Swiper 能力加上去，我选 keyboard 键盘控制：
聚焦展区后按 ← / → 翻页，并在页面上给一个开关可以即时启用 / 禁用。
另外把 mousewheel 滚轮、双击放大、parallax 视差一起保留。
```

**重要往返**：AI 第一版写的是 `keyboard: true`，但 Swiper 11 已不接受布尔简写，必须写
`keyboard: { enabled: true }`；而且它没给开关的实现方式。修正为初始化时传对象，开关切换时调用
`swiper.keyboard.enable()` / `swiper.keyboard.disable()`。

### 6.3 提示词 C —— delay 现场调节控件

```text
再加一个「现场改 delay」的小控件：输入毫秒数，点「应用」后立刻生效，
并在旁边输出「已改为 X 毫秒 ≈ Y 秒自动翻一页」的说明。
```

**重要往返**：AI 第一版只写了 `swiper.params.autoplay.delay = value`，但没有重启自动播放，
新值要等当前这一轮计时结束后才生效，现场看起来像“没反应”。修正为改完参数后
`autoplay.stop()` 再 `autoplay.start()`，让计时立刻按新值重来。

```js
swiper.params.autoplay.delay = value;
swiper.autoplay.stop();
swiper.autoplay.start();
```

### 6.4 提示词 D —— 在七种之外再加第八种翻页方式

```text
课堂上讲了 6 种 effect，任务二又加了 creative（第 7 种）。任务三的演示还要在七种之外再新用一种方法切页，
凑成 8 种：加一个 vertical 垂直翻页。要求 direction: 'vertical' + effect: 'slide'，
圆点分页在垂直模式下竖排在右侧，切换按钮和原有 7 个并列。
```

**重要往返**：AI 第一版把 `vertical` 当成一种 effect 传进去（`effect: 'vertical'`），控制台报错、切不动。
修正为：`direction: 'vertical'` 只改方向、`effect: 'slide'` 保留滑动，
并在重建时给容器加 `lwj_vertical-mode` 让分页器竖排在右侧。

### 6.5 答辩四连问速答

| 问题 | 一句话答案 |
|------|-----------|
| 这段代码什么意思？ | `autoplay: { delay: 3200, disableOnInteraction: false }` = 每 3.2 秒自动翻页，手动拖动后不停播、重新计时。 |
| AI 第一次给的哪里不对、改了什么？ | `autoplay: true` 既没 3.2 秒也无法“手动后继续”，改成完整对象并显式写 `false`。 |
| 新参数的作用？ | `delay` 管停留时长，`disableOnInteraction` 管交互后是否停播，`clickable` 管圆点，`keyboard.enabled` 管方向键。 |
| 现场把 delay 改成指定值？ | 改小翻页更急、改大停留更久；只影响自动间隔，不影响 `speed` 的手动切换动画速度。 |

