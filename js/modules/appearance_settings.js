// --- 外观设置 (Appearance Settings) ---
// 整体 UI 切换：论坛、设置、APP 布局、小组件等（聊天列表与聊天详情页保持不变）

const APPEARANCE_STORAGE_KEY = 'ovo_appearance_ui_mode';
const CUSTOM_TUTORIAL_CSS_KEY = 'ovo_custom_tutorial_css';
const CUSTOM_TUTORIAL_CSS_ENABLED_KEY = 'ovo_custom_tutorial_css_enabled';

// 顶栏自定义存储键
const HEADER_BG_COLOR_KEY = 'ovo_header_bg_color';
const HEADER_BG_OPACITY_KEY = 'ovo_header_bg_opacity';
const HEADER_TEXT_COLOR_KEY = 'ovo_header_text_color';
const HEADER_BORDER_VISIBLE_KEY = 'ovo_header_border_visible';
const HEADER_CUSTOM_ENABLED_KEY = 'ovo_header_custom_enabled';

// 顶栏默认值
const HEADER_DEFAULTS = {
    bgColor: '#ffffff',
    bgOpacity: 80,
    textColor: '#333333',
    borderVisible: true
};

function getHeaderCustomEnabled() {
    try { return localStorage.getItem(HEADER_CUSTOM_ENABLED_KEY) === 'true'; } catch (_) { return false; }
}
function setHeaderCustomEnabled(v) {
    try { localStorage.setItem(HEADER_CUSTOM_ENABLED_KEY, v ? 'true' : 'false'); } catch (_) {}
}
function getHeaderBgColor() {
    try { return localStorage.getItem(HEADER_BG_COLOR_KEY) || HEADER_DEFAULTS.bgColor; } catch (_) { return HEADER_DEFAULTS.bgColor; }
}
function setHeaderBgColor(v) {
    try { localStorage.setItem(HEADER_BG_COLOR_KEY, v); } catch (_) {}
}
function getHeaderBgOpacity() {
    try { const v = localStorage.getItem(HEADER_BG_OPACITY_KEY); return v !== null ? parseInt(v, 10) : HEADER_DEFAULTS.bgOpacity; } catch (_) { return HEADER_DEFAULTS.bgOpacity; }
}
function setHeaderBgOpacity(v) {
    try { localStorage.setItem(HEADER_BG_OPACITY_KEY, String(v)); } catch (_) {}
}
function getHeaderTextColor() {
    try { return localStorage.getItem(HEADER_TEXT_COLOR_KEY) || HEADER_DEFAULTS.textColor; } catch (_) { return HEADER_DEFAULTS.textColor; }
}
function setHeaderTextColor(v) {
    try { localStorage.setItem(HEADER_TEXT_COLOR_KEY, v); } catch (_) {}
}
function getHeaderBorderVisible() {
    try { const v = localStorage.getItem(HEADER_BORDER_VISIBLE_KEY); return v !== null ? v === 'true' : HEADER_DEFAULTS.borderVisible; } catch (_) { return HEADER_DEFAULTS.borderVisible; }
}
function setHeaderBorderVisible(v) {
    try { localStorage.setItem(HEADER_BORDER_VISIBLE_KEY, v ? 'true' : 'false'); } catch (_) {}
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function applyHeaderCustomStyles() {
    const styleId = 'ovo-header-custom-style';
    let styleEl = document.getElementById(styleId);
    if (!getHeaderCustomEnabled()) {
        if (styleEl) styleEl.remove();
        return;
    }
    const bg = hexToRgb(getHeaderBgColor());
    const opacity = getHeaderBgOpacity() / 100;
    const textColor = getHeaderTextColor();
    const border = getHeaderBorderVisible();
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
.app-header {
    background-color: rgba(${bg.r}, ${bg.g}, ${bg.b}, ${opacity}) !important;
    ${border ? '' : 'border-bottom: none !important;'}
}
.app-header .title,
.app-header .back-btn,
.app-header .action-btn {
    color: ${textColor} !important;
}
.app-header .action-btn svg,
.app-header .back-btn svg {
    stroke: ${textColor} !important;
}
`;
}

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

function getCustomTutorialCss() {
    try {
        return localStorage.getItem(CUSTOM_TUTORIAL_CSS_KEY) || '';
    } catch (_) {
        return '';
    }
}

function setCustomTutorialCss(css) {
    try {
        localStorage.setItem(CUSTOM_TUTORIAL_CSS_KEY, css);
    } catch (_) {}
}

function isCustomTutorialCssEnabled() {
    try {
        return localStorage.getItem(CUSTOM_TUTORIAL_CSS_ENABLED_KEY) === 'true';
    } catch (_) {
        return false;
    }
}

function setCustomTutorialCssEnabled(enabled) {
    try {
        localStorage.setItem(CUSTOM_TUTORIAL_CSS_ENABLED_KEY, enabled ? 'true' : 'false');
    } catch (_) {}
}

function applyCustomTutorialCss() {
    const styleId = 'ovo-custom-tutorial-style';
    let styleEl = document.getElementById(styleId);
    if (isCustomTutorialCssEnabled()) {
        const css = getCustomTutorialCss();
        if (css.trim()) {
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = css;
        } else if (styleEl) {
            styleEl.remove();
        }
    } else if (styleEl) {
        styleEl.remove();
    }
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

            <!-- 顶栏自定义 -->
            <div class="appearance-section">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">顶栏样式</h2>
                    <span class="appearance-section-desc">自定义顶栏颜色配合壁纸</span>
                </div>
                <div class="header-custom-area">
                    <div class="header-custom-toggle-row">
                        <span class="header-custom-toggle-label">启用自定义顶栏</span>
                        <label class="custom-css-switch">
                            <input type="checkbox" id="header-custom-toggle" ${getHeaderCustomEnabled() ? 'checked' : ''}>
                            <span class="custom-css-switch-slider"></span>
                        </label>
                    </div>

                    <div class="header-custom-controls" id="header-custom-controls" style="${getHeaderCustomEnabled() ? '' : 'opacity:0.5;pointer-events:none;'}">
                        <!-- 背景颜色 -->
                        <div class="header-ctrl-row">
                            <span class="header-ctrl-label">背景颜色</span>
                            <div class="header-color-input-group">
                                <input type="color" id="header-bg-color" class="header-color-picker" value="${getHeaderBgColor()}">
                                <input type="text" id="header-bg-color-hex" class="header-hex-input" value="${getHeaderBgColor()}" maxlength="7" placeholder="#ffffff">
                            </div>
                        </div>

                        <!-- 背景透明度 -->
                        <div class="header-ctrl-row">
                            <span class="header-ctrl-label">背景透明度</span>
                            <div class="header-slider-group">
                                <input type="range" id="header-bg-opacity" class="header-slider" min="0" max="100" value="${getHeaderBgOpacity()}">
                                <span class="header-slider-value" id="header-bg-opacity-val">${getHeaderBgOpacity()}%</span>
                            </div>
                        </div>

                        <!-- 文字颜色 -->
                        <div class="header-ctrl-row">
                            <span class="header-ctrl-label">文字颜色</span>
                            <div class="header-color-input-group">
                                <input type="color" id="header-text-color" class="header-color-picker" value="${getHeaderTextColor()}">
                                <input type="text" id="header-text-color-hex" class="header-hex-input" value="${getHeaderTextColor()}" maxlength="7" placeholder="#333333">
                            </div>
                        </div>

                        <!-- 底部边框 -->
                        <div class="header-ctrl-row">
                            <span class="header-ctrl-label">底部边框</span>
                            <label class="custom-css-switch">
                                <input type="checkbox" id="header-border-toggle" ${getHeaderBorderVisible() ? 'checked' : ''}>
                                <span class="custom-css-switch-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- 恢复默认 -->
                    <div class="header-custom-btn-row">
                        <button type="button" id="header-reset-btn" class="custom-css-btn neutral">恢复默认</button>
                    </div>
                </div>
            </div>

            <!-- 自定义 CSS 区 -->
            <div class="appearance-section">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">自定义美化</h2>
                    <span class="appearance-section-desc">输入 CSS 代码自定义教程页面样式</span>
                </div>
                <div class="custom-css-area">
                    <div class="custom-css-toggle-row">
                        <span class="custom-css-toggle-label">启用自定义 CSS</span>
                        <label class="custom-css-switch">
                            <input type="checkbox" id="custom-tutorial-css-toggle" ${isCustomTutorialCssEnabled() ? 'checked' : ''}>
                            <span class="custom-css-switch-slider"></span>
                        </label>
                    </div>
                    <textarea id="custom-tutorial-css-input" class="custom-css-textarea" placeholder="/* 在此输入自定义 CSS */&#10;&#10;/* 例如修改教程页背景色: */&#10;#tutorial-content-area {&#10;  background: #1a1a2e;&#10;  color: #eee;&#10;}" spellcheck="false">${getCustomTutorialCss()}</textarea>
                    <div class="custom-css-btn-row">
                        <button type="button" id="custom-tutorial-css-save" class="custom-css-btn primary">保存并应用</button>
                        <button type="button" id="custom-tutorial-css-reset" class="custom-css-btn neutral">清空</button>
                    </div>
                    <div class="custom-css-hint">
                        <span>💡</span> 自定义 CSS 会叠加在当前选中的排版方案之上。可用浏览器开发者工具查看元素类名。
                    </div>
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

    // 自定义 CSS 事件绑定
    const cssToggle = inner.querySelector('#custom-tutorial-css-toggle');
    const cssTextarea = inner.querySelector('#custom-tutorial-css-input');
    const cssSaveBtn = inner.querySelector('#custom-tutorial-css-save');
    const cssResetBtn = inner.querySelector('#custom-tutorial-css-reset');

    if (cssToggle) {
        cssTextarea.disabled = !cssToggle.checked;

        cssToggle.addEventListener('change', () => {
            const enabled = cssToggle.checked;
            setCustomTutorialCssEnabled(enabled);
            cssTextarea.disabled = !enabled;
            applyCustomTutorialCss();
            if (typeof renderTutorialContent === 'function') renderTutorialContent();
        });
    }

    if (cssSaveBtn) {
        cssSaveBtn.addEventListener('click', () => {
            const css = cssTextarea.value;
            setCustomTutorialCss(css);
            applyCustomTutorialCss();
            if (typeof renderTutorialContent === 'function') renderTutorialContent();
            if (typeof showToast === 'function') showToast('自定义 CSS 已保存并应用');
        });
    }

    if (cssResetBtn) {
        cssResetBtn.addEventListener('click', () => {
            if (!confirm('确定要清空自定义 CSS 吗？')) return;
            cssTextarea.value = '';
            setCustomTutorialCss('');
            applyCustomTutorialCss();
            if (typeof renderTutorialContent === 'function') renderTutorialContent();
            if (typeof showToast === 'function') showToast('自定义 CSS 已清空');
        });
    }

    // --- 顶栏自定义事件绑定 ---
    const headerToggle = inner.querySelector('#header-custom-toggle');
    const headerControls = inner.querySelector('#header-custom-controls');
    const headerBgColor = inner.querySelector('#header-bg-color');
    const headerBgColorHex = inner.querySelector('#header-bg-color-hex');
    const headerBgOpacity = inner.querySelector('#header-bg-opacity');
    const headerBgOpacityVal = inner.querySelector('#header-bg-opacity-val');
    const headerTextColor = inner.querySelector('#header-text-color');
    const headerTextColorHex = inner.querySelector('#header-text-color-hex');
    const headerBorderToggle = inner.querySelector('#header-border-toggle');
    const headerResetBtn = inner.querySelector('#header-reset-btn');

    function updateHeaderControls(enabled) {
        if (headerControls) {
            headerControls.style.opacity = enabled ? '' : '0.5';
            headerControls.style.pointerEvents = enabled ? '' : 'none';
        }
    }

    if (headerToggle) {
        headerToggle.addEventListener('change', () => {
            const enabled = headerToggle.checked;
            setHeaderCustomEnabled(enabled);
            updateHeaderControls(enabled);
            applyHeaderCustomStyles();
        });
    }

    if (headerBgColor && headerBgColorHex) {
        headerBgColor.addEventListener('input', () => {
            headerBgColorHex.value = headerBgColor.value;
            setHeaderBgColor(headerBgColor.value);
            applyHeaderCustomStyles();
        });
        headerBgColorHex.addEventListener('input', () => {
            let v = headerBgColorHex.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                headerBgColor.value = v;
                setHeaderBgColor(v);
                applyHeaderCustomStyles();
            }
        });
    }

    if (headerBgOpacity && headerBgOpacityVal) {
        headerBgOpacity.addEventListener('input', () => {
            headerBgOpacityVal.textContent = headerBgOpacity.value + '%';
            setHeaderBgOpacity(parseInt(headerBgOpacity.value, 10));
            applyHeaderCustomStyles();
        });
    }

    if (headerTextColor && headerTextColorHex) {
        headerTextColor.addEventListener('input', () => {
            headerTextColorHex.value = headerTextColor.value;
            setHeaderTextColor(headerTextColor.value);
            applyHeaderCustomStyles();
        });
        headerTextColorHex.addEventListener('input', () => {
            let v = headerTextColorHex.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                headerTextColor.value = v;
                setHeaderTextColor(v);
                applyHeaderCustomStyles();
            }
        });
    }

    if (headerBorderToggle) {
        headerBorderToggle.addEventListener('change', () => {
            setHeaderBorderVisible(headerBorderToggle.checked);
            applyHeaderCustomStyles();
        });
    }

    if (headerResetBtn) {
        headerResetBtn.addEventListener('click', () => {
            if (!confirm('确定要恢复顶栏默认样式吗？')) return;
            setHeaderBgColor(HEADER_DEFAULTS.bgColor);
            setHeaderBgOpacity(HEADER_DEFAULTS.bgOpacity);
            setHeaderTextColor(HEADER_DEFAULTS.textColor);
            setHeaderBorderVisible(HEADER_DEFAULTS.borderVisible);
            if (headerBgColor) headerBgColor.value = HEADER_DEFAULTS.bgColor;
            if (headerBgColorHex) headerBgColorHex.value = HEADER_DEFAULTS.bgColor;
            if (headerBgOpacity) headerBgOpacity.value = HEADER_DEFAULTS.bgOpacity;
            if (headerBgOpacityVal) headerBgOpacityVal.textContent = HEADER_DEFAULTS.bgOpacity + '%';
            if (headerTextColor) headerTextColor.value = HEADER_DEFAULTS.textColor;
            if (headerTextColorHex) headerTextColorHex.value = HEADER_DEFAULTS.textColor;
            if (headerBorderToggle) headerBorderToggle.checked = HEADER_DEFAULTS.borderVisible;
            applyHeaderCustomStyles();
            if (typeof showToast === 'function') showToast('顶栏样式已恢复默认');
        });
    }
}

(function initAppearanceSettings() {
    function injectWhenReady() {
        const screen = document.getElementById('appearance-settings-screen');
        if (!screen || screen.querySelector('.appearance-settings-inner')) return;
        renderAppearanceSettingsScreen();
        applyCustomTutorialCss();
        applyHeaderCustomStyles();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWhenReady);
    } else {
        injectWhenReady();
    }
})();
