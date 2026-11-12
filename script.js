/* =============================================
   抓小球小游戏 — 交互逻辑
   ============================================= */

'use strict';

/* ---------- 配置对象 ---------- */
const GAME_CONFIG = {
    GAME_DURATION_SECONDS: 120,   // 2 分钟
    BALL_SIZE: 60,                // 小球直径 px
    SCORE_HIT: 2,                 // 点中小球得分
    SCORE_MISS: -1,               // 点击空白得分
    TRAP_DELAY: 10,               // 错误球开局 N 秒后登场
    TRAP_PENALTY: -3,             // 点中错误球扣分
    MIN_BALL_DISTANCE: 80,        // 两球中心最小距离 px
    MAX_SPAWN_RETRY: 50           // 错误球位置重随上限（防死循环）
};

/* ---------- 游戏状态对象 ---------- */
const gameState = {
    status: 'idle',      // 'idle' | 'playing' | 'ended'
    score: 0,
    timeLeft: GAME_CONFIG.GAME_DURATION_SECONDS,
    countdownTimer: null, // setInterval 引用，用于清理
    trapActive: false,    // 错误球是否已登场
    trapTimer: null       // 错误球登场 setTimeout 引用
};

/* ---------- DOM 缓存对象 ---------- */
const DOM = {};

/* ---------- 初始化：等待 DOM 加载完毕后绑定 ---------- */
document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    bindEvents();
});

/**
 * 缓存所有需要操作的 DOM 元素
 * 避免每次操作都重新 getElementById
 */
function cacheDom() {
    DOM.scoreDisplay  = document.getElementById('score-display');
    DOM.timerDisplay  = document.getElementById('timer-display');
    DOM.startBtn      = document.getElementById('start-btn');
    DOM.restartBtn    = document.getElementById('restart-btn');
    DOM.gameArea      = document.getElementById('game-area');
    DOM.ball          = document.getElementById('ball');
    DOM.wrongBall     = document.getElementById('wrongBall');
    DOM.overlay       = document.getElementById('overlay');
    DOM.finalScore    = document.getElementById('final-score');
}

/**
 * 绑定事件监听
 */
function bindEvents() {
    DOM.startBtn.addEventListener('click', startGame);
    DOM.restartBtn.addEventListener('click', restartGame);

    // 游戏区域点击：用事件委托统一处理
    // 小球和空白都冒泡到 game-area，通过 e.target 区分
    DOM.gameArea.addEventListener('click', onGameAreaClick);
}

/**
 * 游戏区域点击处理（事件委托统一入口）
 * 利用事件冒泡机制，点小球或空白都触发此函数
 * 通过 e.target 判断点到了谁
 * @param {MouseEvent} e
 */
function onGameAreaClick(e) {
    // 状态保护：只有 playing 状态才计分
    if (gameState.status !== 'playing') return;

    // 计算点击点在 game-area 内的局部坐标（用于飘字定位）
    const areaRect = DOM.gameArea.getBoundingClientRect();
    const clickX = e.clientX - areaRect.left;
    const clickY = e.clientY - areaRect.top;

    // 三分支判断：正确球 / 错误球 / 空白
    if (e.target === DOM.ball) {
        // 命中正确球：+2 分
        gameState.score += GAME_CONFIG.SCORE_HIT;
        showFloatText(clickX, clickY, '+' + GAME_CONFIG.SCORE_HIT, 'plus');
    } else if (e.target === DOM.wrongBall) {
        // 点中错误球：-3 分
        gameState.score += GAME_CONFIG.TRAP_PENALTY;
        showFloatText(clickX, clickY, String(GAME_CONFIG.TRAP_PENALTY), 'danger');
    } else {
        // 点到空白：-1 分（允许负数）
        gameState.score += GAME_CONFIG.SCORE_MISS;
        showFloatText(clickX, clickY, String(GAME_CONFIG.SCORE_MISS), 'minus');
    }

    // 更新分数显示
    updateScore();

    // 无论点到什么，两球都刷新位置（先刷正确球，错误球再做距离保护）
    spawnBall();
    if (gameState.trapActive) {
        spawnWrongBall();
    }
}

/**
 * 在 game-area 指定坐标生成得分飘字
 * 动画结束后自动从 DOM 移除，防止泄漏
 * @param {number} x - game-area 内局部 X 坐标
 * @param {number} y - game-area 内局部 Y 坐标
 * @param {string} text - 显示文本（如 '+2' / '-1'）
 * @param {string} type - 样式类型 'plus' | 'minus' | 'danger'
 */
function showFloatText(x, y, text, type) {
    const el = document.createElement('div');
    el.className = `float-text ${type}`;
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';

    // 动画结束移除元素
    el.addEventListener('animationend', () => el.remove());

    DOM.gameArea.appendChild(el);
}

/* ---------- 核心游戏逻辑 ---------- */

/**
 * 开始游戏
 */
function startGame() {
    // 状态保护：只有 idle 才能开始
    if (gameState.status !== 'idle') return;

    // 初始化状态
    gameState.status   = 'playing';
    gameState.score    = 0;
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION_SECONDS;

    // 更新 UI
    updateScore();
    updateTimerDisplay();

    // 禁用开始按钮
    DOM.startBtn.disabled = true;
    DOM.startBtn.textContent = '游戏中...';

    // 随机位置生成小球
    spawnBall();

    // 启动倒计时（每秒递减）
    gameState.countdownTimer = setInterval(updateCountdown, 1000);

    // 调度错误球登场（开局 TRAP_DELAY 秒后）
    gameState.trapTimer = setTimeout(activateTrapBall, GAME_CONFIG.TRAP_DELAY * 1000);
}

/**
 * 错误球登场：10 秒后由 setTimeout 触发
 * 边界保护：游戏已结束或剩余时间不足时不登场
 */
function activateTrapBall() {
    gameState.trapTimer = null;

    // 只在一局进行中且剩余时间足够时才登场
    if (gameState.status !== 'playing') return;
    if (gameState.timeLeft < GAME_CONFIG.TRAP_DELAY) return;

    gameState.trapActive = true;
    spawnWrongBall();
}

/**
 * 在游戏区域内生成一个随机坐标
 * 边界保护：确保球完整落在可视区域内，不被截断
 * @returns {{left: number, top: number}}
 */
function randomPosition() {
    const areaRect = DOM.gameArea.getBoundingClientRect();
    const padding = 4; // 内边距，避免球紧贴边界

    let maxLeft = areaRect.width - GAME_CONFIG.BALL_SIZE - padding;
    let maxTop  = areaRect.height - GAME_CONFIG.BALL_SIZE - padding;

    // 边界保护：可用空间过小时退化为 padding（保证不报错）
    if (maxLeft < padding) maxLeft = padding;
    if (maxTop  < padding) maxTop  = padding;

    return {
        left: Math.floor(Math.random() * (maxLeft - padding + 1)) + padding,
        top:  Math.floor(Math.random() * (maxTop  - padding + 1)) + padding
    };
}

/**
 * 在游戏区域内随机位置生成正确小球
 */
function spawnBall() {
    const pos = randomPosition();
    DOM.ball.style.left = pos.left + 'px';
    DOM.ball.style.top  = pos.top  + 'px';
    DOM.ball.removeAttribute('hidden'); // 与错误球统一用 hidden 控制显隐
}

/**
 * 生成错误小球（带距离保护）
 * 与正确球中心距 < MIN_BALL_DISTANCE 时重新随机，
 * 重试 MAX_SPAWN_RETRY 次后放宽限制（防小屏死循环）
 */
function spawnWrongBall() {
    const half = GAME_CONFIG.BALL_SIZE / 2;

    // 正确球当前中心坐标
    const ballCenterX = parseFloat(DOM.ball.style.left) + half;
    const ballCenterY = parseFloat(DOM.ball.style.top)  + half;

    let pos = randomPosition();

    for (let i = 0; i < GAME_CONFIG.MAX_SPAWN_RETRY; i++) {
        const dx = (pos.left + half) - ballCenterX;
        const dy = (pos.top  + half) - ballCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= GAME_CONFIG.MIN_BALL_DISTANCE) break; // 距离合格
        pos = randomPosition(); // 太近，重随
    }

    DOM.wrongBall.style.left = pos.left + 'px';
    DOM.wrongBall.style.top  = pos.top  + 'px';
    DOM.wrongBall.removeAttribute('hidden');
}

/**
 * 倒计时回调：每秒触发一次
 */
function updateCountdown() {
    gameState.timeLeft--;
    updateTimerDisplay();

    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

/**
 * 结束游戏
 */
function endGame() {
    gameState.status = 'ended';

    // 清除倒计时
    if (gameState.countdownTimer) {
        clearInterval(gameState.countdownTimer);
        gameState.countdownTimer = null;
    }

    // 清除错误球登场调度（防结束瞬间冒出）
    if (gameState.trapTimer) {
        clearTimeout(gameState.trapTimer);
        gameState.trapTimer = null;
    }
    gameState.trapActive = false;

    // 隐藏两个小球（统一 hidden 机制）
    DOM.ball.setAttribute('hidden', '');
    DOM.wrongBall.setAttribute('hidden', '');

    // 更新最终得分文本
    DOM.finalScore.textContent = gameState.score;

    // 显示结束遮罩
    DOM.overlay.removeAttribute('hidden');
}

/**
 * 再来一局：重置所有状态并重新开始
 */
function restartGame() {
    // 重置状态机
    gameState.status   = 'idle';
    gameState.score    = 0;
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION_SECONDS;

    // 重置错误球状态（防御性清理，正常流程 endGame 已清过）
    if (gameState.trapTimer) {
        clearTimeout(gameState.trapTimer);
        gameState.trapTimer = null;
    }
    gameState.trapActive = false;
    DOM.wrongBall.setAttribute('hidden', '');

    // 隐藏遮罩
    DOM.overlay.setAttribute('hidden', '');

    // 恢复开始按钮
    DOM.startBtn.disabled = false;
    DOM.startBtn.textContent = '开始游戏';

    // 更新 UI
    updateScore();
    updateTimerDisplay();

    // 立即开始新一局
    startGame();
}

/* ---------- UI 更新辅助函数 ---------- */

/**
 * 更新分数显示
 */
function updateScore() {
    DOM.scoreDisplay.textContent = gameState.score;
}

/**
 * 更新倒计时显示（格式 MM:SS）
 * 剩余 ≤10 秒时附加危险样式（红色闪烁）
 */
function updateTimerDisplay() {
    DOM.timerDisplay.textContent = formatTime(gameState.timeLeft);
    DOM.timerDisplay.classList.toggle('danger', gameState.timeLeft <= 10);
}

/**
 * 秒数 → MM:SS 格式字符串
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // 两位数补零
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
