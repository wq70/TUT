// --- 外观设置 (Appearance Settings) ---
// 整体 UI 切换：论坛、设置、APP 布局、小组件等（聊天列表与聊天详情页保持不变）

const APPEARANCE_STORAGE_KEY = 'ovo_appearance_ui_mode';
const TOPBAR_STORAGE_KEY = 'ovo_topbar_custom';

const TOPBAR_DEFAULTS = {
    bgColor: '#ffffff',
    bgOpacity: 80,
    textColor: '#333333',
    showBorder: true
};

function getTopbarConfig() {
    try {
        const raw = localStorage.getItem(TOPBAR_STORAGE_KEY);
        return raw ? { ...TOPBAR_DEFAULTS, ...JSON.parse(raw) } : { ...TOPBAR_DEFAULTS };
    } catch (_) {
        return { ...TOPBAR_DEFAULTS };
    }
}

function saveTopbarConfig(cfg) {
    try {
        localStorage.setItem(TOPBAR_STORAGE_KEY, JSON.stringify(cfg));
    } catch (_) {}
    applyTopbarStyles(cfg);
}

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function applyTopbarStyles(cfg) {
    if (!cfg) cfg = getTopbarConfig();
    document.documentElement.style.setProperty('--topbar-bg', hexToRgba(cfg.bgColor, cfg.bgOpacity));
    document.documentElement.style.setProperty('--topbar-text', cfg.textColor);
    document.documentElement.style.setProperty('--topbar-border', cfg.showBorder ? '1px solid #eee' : 'none');
}

// 页面加载时立即应用
(function() { applyTopbarStyles(); })();

function getAppearanceMode() {
    try {
        return localStorage.getItem(APPEARANCE_STORAGE_KEY) || 'classic';
    } catch (_) {
        return 'classic';
    }
}

function setAppearanceMode(mode) {
    try {
        localStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
    } catch (_) {}
}

function renderAppearanceSettingsScreen() {
    const screen = document.getElementById('appearance-settings-screen');
    if (!screen) return;
    
    screen.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'appearance-settings-inner';

    const currentMode = getAppearanceMode();

    inner.innerHTML = `
        <header class="app-header">
            <button class="back-btn" data-target="home-screen">‹</button>
            <div class="title-container">
                <h1 class="title">外观设置</h1>
            </div>
            <div class="placeholder"></div>
        </header>
        <main class="content appearance-content">
            
            <!-- 教程排版设置区 -->
            <div class="appearance-section">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">教程排版</h2>
                    <span class="appearance-section-desc">选择教程界面的显示风格</span>
                </div>
                
                <div class="appearance-thumbnail-container">
                    <!-- 方案一：经典 -->
                    <div class="appearance-thumbnail-item ${currentMode === 'classic' ? 'selected' : ''}" data-mode="classic">
                        <div class="appearance-thumbnail-box">
                            <div class="thumb-screen thumb-classic">
                                <div class="thumb-header"></div>
                                <div class="thumb-card"></div>
                                <div class="thumb-card"></div>
                                <div class="thumb-card"></div>
                            </div>
                            <div class="thumbnail-check-icon">✓</div>
                        </div>
                        <div class="appearance-thumbnail-label">经典</div>
                    </div>

                    <!-- 方案二：简约 -->
                    <div class="appearance-thumbnail-item ${currentMode === 'modern' ? 'selected' : ''}" data-mode="modern">
                        <div class="appearance-thumbnail-box">
                            <div class="thumb-screen thumb-modern">
                                <div class="thumb-header"></div>
                                <div class="thumb-group">
                                    <div class="thumb-row"></div>
                                    <div class="thumb-row"></div>
                                </div>
                                <div class="thumb-group">
                                    <div class="thumb-row"></div>
                                </div>
                            </div>
                            <div class="thumbnail-check-icon">✓</div>
                        </div>
                        <div class="appearance-thumbnail-label">简约</div>
                    </div>

                    <!-- 方案三：白兔岛 -->
                    <div class="appearance-thumbnail-item ${currentMode === 'rabbit' ? 'selected' : ''}" data-mode="rabbit">
                        <div class="appearance-thumbnail-box">
                            <div class="thumb-screen thumb-rabbit">
                                <div class="thumb-rabbit-bg"></div>
                                <div class="thumb-header"></div>
                                <div class="thumb-rabbit-card"></div>
                                <div class="thumb-rabbit-card"></div>
                            </div>
                            <div class="thumbnail-check-icon">✓</div>
                        </div>
                        <div class="appearance-thumbnail-label">白兔岛</div>
                    </div>
                </div>
            </div>

            <!-- 预留区：壁纸设置 (未来添加) -->
            <div class="appearance-section" style="opacity: 0.5;">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">壁纸方案</h2>
                    <span class="appearance-section-desc">敬请期待</span>
                </div>
                <div class="appearance-thumbnail-container">
                    <div class="appearance-thumbnail-item">
                        <div class="appearance-thumbnail-box" style="background:#eee;"></div>
                        <div class="appearance-thumbnail-label">默认</div>
                    </div>
                </div>
            </div>

            <!-- 顶栏颜色自定义 -->
            <div class="appearance-section topbar-custom-section">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">顶栏自定义</h2>
                    <span class="appearance-section-desc">配合壁纸调整顶栏样式</span>
                </div>
                <div class="topbar-custom-body">
                    <!-- 预览 -->
                    <div class="topbar-preview" id="topbar-preview">
                        <span class="topbar-preview-back">‹</span>
                        <span class="topbar-preview-title">预览效果</span>
                        <span class="topbar-preview-dot">⋯</span>
                    </div>

                    <!-- 背景颜色 -->
                    <div class="topbar-row">
                        <label class="topbar-row-label">背景颜色</label>
                        <div class="topbar-color-input">
                            <input type="color" id="topbar-bg-color" />
                            <input type="text" id="topbar-bg-hex" maxlength="7" placeholder="#ffffff" spellcheck="false" />
                        </div>
                    </div>

                    <!-- 背景透明度 -->
                    <div class="topbar-row">
                        <label class="topbar-row-label">背景透明度</label>
                        <div class="topbar-slider-wrap">
                            <input type="range" id="topbar-bg-opacity" min="0" max="100" />
                            <span id="topbar-opacity-val" class="topbar-slider-val">80%</span>
                        </div>
                    </div>

                    <!-- 文字颜色 -->
                    <div class="topbar-row">
                        <label class="topbar-row-label">文字颜色</label>
                        <div class="topbar-color-input">
                            <input type="color" id="topbar-text-color" />
                            <input type="text" id="topbar-text-hex" maxlength="7" placeholder="#333333" spellcheck="false" />
                        </div>
                    </div>

                    <!-- 底部边框 -->
                    <div class="topbar-row">
                        <label class="topbar-row-label">底部边框</label>
                        <label class="topbar-switch">
                            <input type="checkbox" id="topbar-border-toggle" />
                            <span class="topbar-switch-slider"></span>
                        </label>
                    </div>

                    <!-- 恢复默认 -->
                    <button class="topbar-reset-btn" id="topbar-reset-btn">恢复默认</button>
                </div>
            </div>

        </main>
    `;

    screen.appendChild(inner);

    const items = inner.querySelectorAll('.appearance-thumbnail-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.dataset.mode) return; // 忽略没有 mode 的占位项
            
            // 移除同组内的 selected
            const container = item.closest('.appearance-thumbnail-container');
            container.querySelectorAll('.appearance-thumbnail-item').forEach(c => c.classList.remove('selected'));
            
            item.classList.add('selected');
            const mode = item.dataset.mode;
            setAppearanceMode(mode);
            
            if (typeof renderTutorialContent === 'function') {
                renderTutorialContent();
            }
        });
    });

    // --- 顶栏自定义控件绑定 ---
    const cfg = getTopbarConfig();
    const bgColorEl = inner.querySelector('#topbar-bg-color');
    const bgHexEl = inner.querySelector('#topbar-bg-hex');
    const opacityEl = inner.querySelector('#topbar-bg-opacity');
    const opacityValEl = inner.querySelector('#topbar-opacity-val');
    const textColorEl = inner.querySelector('#topbar-text-color');
    const textHexEl = inner.querySelector('#topbar-text-hex');
    const borderEl = inner.querySelector('#topbar-border-toggle');
    const resetBtn = inner.querySelector('#topbar-reset-btn');
    const preview = inner.querySelector('#topbar-preview');

    // 初始化控件值
    bgColorEl.value = cfg.bgColor;
    bgHexEl.value = cfg.bgColor;
    opacityEl.value = cfg.bgOpacity;
    opacityValEl.textContent = cfg.bgOpacity + '%';
    textColorEl.value = cfg.textColor;
    textHexEl.value = cfg.textColor;
    borderEl.checked = cfg.showBorder;

    function updatePreview(c) {
        preview.style.background = hexToRgba(c.bgColor, c.bgOpacity);
        preview.style.color = c.textColor;
        preview.style.borderBottom = c.showBorder ? '1px solid #eee' : 'none';
    }
    updatePreview(cfg);

    function currentCfg() {
        return {
            bgColor: bgColorEl.value,
            bgOpacity: parseInt(opacityEl.value, 10),
            textColor: textColorEl.value,
            showBorder: borderEl.checked
        };
    }

    function onTopbarChange() {
        const c = currentCfg();
        bgHexEl.value = c.bgColor;
        textHexEl.value = c.textColor;
        opacityValEl.textContent = c.bgOpacity + '%';
        updatePreview(c);
        saveTopbarConfig(c);
    }

    bgColorEl.addEventListener('input', onTopbarChange);
    opacityEl.addEventListener('input', onTopbarChange);
    textColorEl.addEventListener('input', onTopbarChange);
    borderEl.addEventListener('change', onTopbarChange);

    bgHexEl.addEventListener('change', () => {
        const v = bgHexEl.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            bgColorEl.value = v;
            onTopbarChange();
        }
    });
    textHexEl.addEventListener('change', () => {
        const v = textHexEl.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            textColorEl.value = v;
            onTopbarChange();
        }
    });

    resetBtn.addEventListener('click', () => {
        bgColorEl.value = TOPBAR_DEFAULTS.bgColor;
        bgHexEl.value = TOPBAR_DEFAULTS.bgColor;
        opacityEl.value = TOPBAR_DEFAULTS.bgOpacity;
        opacityValEl.textContent = TOPBAR_DEFAULTS.bgOpacity + '%';
        textColorEl.value = TOPBAR_DEFAULTS.textColor;
        textHexEl.value = TOPBAR_DEFAULTS.textColor;
        borderEl.checked = TOPBAR_DEFAULTS.showBorder;
        updatePreview(TOPBAR_DEFAULTS);
        saveTopbarConfig({ ...TOPBAR_DEFAULTS });
    });
}

(function initAppearanceSettings() {
    function injectWhenReady() {
        const screen = document.getElementById('appearance-settings-screen');
        if (!screen || screen.querySelector('.appearance-settings-inner')) return;
        renderAppearanceSettingsScreen();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWhenReady);
    } else {
        injectWhenReady();
    }
})();
