// --- 外观设置 (Appearance Settings) ---
// 整体 UI 切换：论坛、设置、APP 布局、小组件等（聊天列表与聊天详情页保持不变）

const APPEARANCE_STORAGE_KEY = 'ovo_appearance_ui_mode';
const CUSTOM_TUTORIAL_CSS_KEY = 'ovo_custom_tutorial_css';
const CUSTOM_TUTORIAL_CSS_ENABLED_KEY = 'ovo_custom_tutorial_css_enabled';

// 顶栏自定义存储键
const TOPBAR_BG_COLOR_KEY = 'ovo_topbar_bg_color';
const TOPBAR_BG_OPACITY_KEY = 'ovo_topbar_bg_opacity';
const TOPBAR_TEXT_COLOR_KEY = 'ovo_topbar_text_color';
const TOPBAR_BORDER_KEY = 'ovo_topbar_border_visible';

const TOPBAR_DEFAULTS = {
    bgColor: '#ffffff',
    bgOpacity: 80,
    textColor: '#333333',
    borderVisible: true
};

function getTopbarSettings() {
    try {
        return {
            bgColor: localStorage.getItem(TOPBAR_BG_COLOR_KEY) || TOPBAR_DEFAULTS.bgColor,
            bgOpacity: parseInt(localStorage.getItem(TOPBAR_BG_OPACITY_KEY) ?? TOPBAR_DEFAULTS.bgOpacity, 10),
            textColor: localStorage.getItem(TOPBAR_TEXT_COLOR_KEY) || TOPBAR_DEFAULTS.textColor,
            borderVisible: localStorage.getItem(TOPBAR_BORDER_KEY) !== null
                ? localStorage.getItem(TOPBAR_BORDER_KEY) === 'true'
                : TOPBAR_DEFAULTS.borderVisible
        };
    } catch (_) {
        return { ...TOPBAR_DEFAULTS };
    }
}

function saveTopbarSettings(settings) {
    try {
        localStorage.setItem(TOPBAR_BG_COLOR_KEY, settings.bgColor);
        localStorage.setItem(TOPBAR_BG_OPACITY_KEY, String(settings.bgOpacity));
        localStorage.setItem(TOPBAR_TEXT_COLOR_KEY, settings.textColor);
        localStorage.setItem(TOPBAR_BORDER_KEY, String(settings.borderVisible));
    } catch (_) {}
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
}

function applyTopbarStyles() {
    const s = getTopbarSettings();
    const rgb = hexToRgb(s.bgColor);
    const alpha = s.bgOpacity / 100;
    const styleId = 'ovo-topbar-custom-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
        .app-header {
            background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}) !important;
            border-bottom: ${s.borderVisible ? '1px solid #eee' : 'none'} !important;
        }
        .app-header .title,
        .app-header .back-btn,
        .app-header .action-btn {
            color: ${s.textColor} !important;
        }
        .app-header .action-btn svg,
        .app-header .back-btn svg {
            stroke: ${s.textColor} !important;
        }
    `;
}

function resetTopbarSettings() {
    saveTopbarSettings(TOPBAR_DEFAULTS);
    applyTopbarStyles();
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
    const topbarSettings = getTopbarSettings();

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

            <!-- 顶栏自定义设置 -->
            <div class="appearance-section">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">顶栏样式</h2>
                    <span class="appearance-section-desc">自定义顶栏颜色以配合壁纸</span>
                </div>
                <div class="topbar-settings-area">
                    <div class="topbar-setting-row">
                        <span class="topbar-setting-label">背景颜色</span>
                        <div class="topbar-color-input-group">
                            <input type="color" id="topbar-bg-color" class="topbar-color-picker" value="${topbarSettings.bgColor}">
                            <input type="text" id="topbar-bg-color-hex" class="topbar-hex-input" value="${topbarSettings.bgColor}" maxlength="7" placeholder="#ffffff">
                        </div>
                    </div>
                    <div class="topbar-setting-row">
                        <span class="topbar-setting-label">背景透明度</span>
                        <div class="topbar-slider-group">
                            <input type="range" id="topbar-bg-opacity" class="topbar-slider" min="0" max="100" value="${topbarSettings.bgOpacity}">
                            <span id="topbar-bg-opacity-val" class="topbar-slider-val">${topbarSettings.bgOpacity}%</span>
                        </div>
                    </div>
                    <div class="topbar-setting-row">
                        <span class="topbar-setting-label">文字颜色</span>
                        <div class="topbar-color-input-group">
                            <input type="color" id="topbar-text-color" class="topbar-color-picker" value="${topbarSettings.textColor}">
                            <input type="text" id="topbar-text-color-hex" class="topbar-hex-input" value="${topbarSettings.textColor}" maxlength="7" placeholder="#333333">
                        </div>
                    </div>
                    <div class="topbar-setting-row">
                        <span class="topbar-setting-label">底部边框</span>
                        <label class="custom-css-switch">
                            <input type="checkbox" id="topbar-border-toggle" ${topbarSettings.borderVisible ? 'checked' : ''}>
                            <span class="custom-css-switch-slider"></span>
                        </label>
                    </div>
                    <div class="topbar-setting-row topbar-reset-row">
                        <button type="button" id="topbar-reset-btn" class="topbar-reset-btn">恢复默认</button>
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

    // 顶栏自定义事件绑定
    const topbarBgColor = inner.querySelector('#topbar-bg-color');
    const topbarBgColorHex = inner.querySelector('#topbar-bg-color-hex');
    const topbarBgOpacity = inner.querySelector('#topbar-bg-opacity');
    const topbarBgOpacityVal = inner.querySelector('#topbar-bg-opacity-val');
    const topbarTextColor = inner.querySelector('#topbar-text-color');
    const topbarTextColorHex = inner.querySelector('#topbar-text-color-hex');
    const topbarBorderToggle = inner.querySelector('#topbar-border-toggle');
    const topbarResetBtn = inner.querySelector('#topbar-reset-btn');

    function syncAndApplyTopbar() {
        const s = {
            bgColor: topbarBgColor.value,
            bgOpacity: parseInt(topbarBgOpacity.value, 10),
            textColor: topbarTextColor.value,
            borderVisible: topbarBorderToggle.checked
        };
        saveTopbarSettings(s);
        applyTopbarStyles();
    }

    if (topbarBgColor) {
        topbarBgColor.addEventListener('input', () => {
            topbarBgColorHex.value = topbarBgColor.value;
            syncAndApplyTopbar();
        });
    }
    if (topbarBgColorHex) {
        topbarBgColorHex.addEventListener('input', () => {
            let v = topbarBgColorHex.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                topbarBgColor.value = v;
                syncAndApplyTopbar();
            }
        });
    }
    if (topbarBgOpacity) {
        topbarBgOpacity.addEventListener('input', () => {
            topbarBgOpacityVal.textContent = topbarBgOpacity.value + '%';
            syncAndApplyTopbar();
        });
    }
    if (topbarTextColor) {
        topbarTextColor.addEventListener('input', () => {
            topbarTextColorHex.value = topbarTextColor.value;
            syncAndApplyTopbar();
        });
    }
    if (topbarTextColorHex) {
        topbarTextColorHex.addEventListener('input', () => {
            let v = topbarTextColorHex.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                topbarTextColor.value = v;
                syncAndApplyTopbar();
            }
        });
    }
    if (topbarBorderToggle) {
        topbarBorderToggle.addEventListener('change', syncAndApplyTopbar);
    }
    if (topbarResetBtn) {
        topbarResetBtn.addEventListener('click', () => {
            resetTopbarSettings();
            topbarBgColor.value = TOPBAR_DEFAULTS.bgColor;
            topbarBgColorHex.value = TOPBAR_DEFAULTS.bgColor;
            topbarBgOpacity.value = TOPBAR_DEFAULTS.bgOpacity;
            topbarBgOpacityVal.textContent = TOPBAR_DEFAULTS.bgOpacity + '%';
            topbarTextColor.value = TOPBAR_DEFAULTS.textColor;
            topbarTextColorHex.value = TOPBAR_DEFAULTS.textColor;
            topbarBorderToggle.checked = TOPBAR_DEFAULTS.borderVisible;
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
        applyTopbarStyles();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWhenReady);
    } else {
        injectWhenReady();
    }
})();
