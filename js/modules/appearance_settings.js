// --- 外观设置 (Appearance Settings) ---
// 整体 UI 切换：论坛、设置、APP 布局、小组件等（聊天列表与聊天详情页保持不变）

const APPEARANCE_STORAGE_KEY = 'ovo_appearance_ui_mode';
const CUSTOM_TUTORIAL_CSS_KEY = 'ovo_custom_tutorial_css';
const CUSTOM_TUTORIAL_CSS_ENABLED_KEY = 'ovo_custom_tutorial_css_enabled';
const TOPBAR_SETTINGS_KEY = 'ovo_topbar_settings';

const TOPBAR_DEFAULTS = {
    bgColor: '#ffffff',
    bgOpacity: 80,
    textColor: '#333333',
    showBorder: true
};

function getTopbarSettings() {
    try {
        const raw = localStorage.getItem(TOPBAR_SETTINGS_KEY);
        return raw ? { ...TOPBAR_DEFAULTS, ...JSON.parse(raw) } : { ...TOPBAR_DEFAULTS };
    } catch (_) {
        return { ...TOPBAR_DEFAULTS };
    }
}

function saveTopbarSettings(settings) {
    try {
        localStorage.setItem(TOPBAR_SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
}

function applyTopbarSettings(settings) {
    if (!settings) settings = getTopbarSettings();
    const styleId = 'ovo-topbar-custom-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    const r = parseInt(settings.bgColor.slice(1, 3), 16);
    const g = parseInt(settings.bgColor.slice(3, 5), 16);
    const b = parseInt(settings.bgColor.slice(5, 7), 16);
    const a = settings.bgOpacity / 100;
    styleEl.textContent = `
        .app-header {
            background-color: rgba(${r}, ${g}, ${b}, ${a}) !important;
            border-bottom: ${settings.showBorder ? '1px solid #eee' : 'none'} !important;
        }
        .app-header .title,
        .app-header .subtitle {
            color: ${settings.textColor} !important;
        }
        .app-header .back-btn,
        .app-header .action-btn {
            color: ${settings.textColor} !important;
        }
        .app-header .action-btn svg,
        .app-header .back-btn svg {
            stroke: ${settings.textColor} !important;
        }
        .app-header .action-btn-group .action-btn svg {
            stroke: ${settings.textColor} !important;
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
                    <span class="appearance-section-desc">自定义顶栏颜色，配合壁纸使用</span>
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
                            <input type="checkbox" id="topbar-border-toggle" ${topbarSettings.showBorder ? 'checked' : ''}>
                            <span class="custom-css-switch-slider"></span>
                        </label>
                    </div>
                    <div class="topbar-btn-row">
                        <button type="button" id="topbar-reset-btn" class="custom-css-btn neutral">恢复默认</button>
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

    // 顶栏设置事件绑定
    const tbBgColor = inner.querySelector('#topbar-bg-color');
    const tbBgColorHex = inner.querySelector('#topbar-bg-color-hex');
    const tbOpacity = inner.querySelector('#topbar-bg-opacity');
    const tbOpacityVal = inner.querySelector('#topbar-bg-opacity-val');
    const tbTextColor = inner.querySelector('#topbar-text-color');
    const tbTextColorHex = inner.querySelector('#topbar-text-color-hex');
    const tbBorderToggle = inner.querySelector('#topbar-border-toggle');
    const tbResetBtn = inner.querySelector('#topbar-reset-btn');

    function updateTopbar() {
        const s = {
            bgColor: tbBgColor.value,
            bgOpacity: parseInt(tbOpacity.value),
            textColor: tbTextColor.value,
            showBorder: tbBorderToggle.checked
        };
        saveTopbarSettings(s);
        applyTopbarSettings(s);
    }

    if (tbBgColor) {
        tbBgColor.addEventListener('input', () => {
            tbBgColorHex.value = tbBgColor.value;
            updateTopbar();
        });
    }
    if (tbBgColorHex) {
        tbBgColorHex.addEventListener('input', () => {
            let v = tbBgColorHex.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                tbBgColor.value = v;
                updateTopbar();
            }
        });
    }
    if (tbOpacity) {
        tbOpacity.addEventListener('input', () => {
            tbOpacityVal.textContent = tbOpacity.value + '%';
            updateTopbar();
        });
    }
    if (tbTextColor) {
        tbTextColor.addEventListener('input', () => {
            tbTextColorHex.value = tbTextColor.value;
            updateTopbar();
        });
    }
    if (tbTextColorHex) {
        tbTextColorHex.addEventListener('input', () => {
            let v = tbTextColorHex.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                tbTextColor.value = v;
                updateTopbar();
            }
        });
    }
    if (tbBorderToggle) {
        tbBorderToggle.addEventListener('change', updateTopbar);
    }
    if (tbResetBtn) {
        tbResetBtn.addEventListener('click', () => {
            saveTopbarSettings(TOPBAR_DEFAULTS);
            applyTopbarSettings(TOPBAR_DEFAULTS);
            tbBgColor.value = TOPBAR_DEFAULTS.bgColor;
            tbBgColorHex.value = TOPBAR_DEFAULTS.bgColor;
            tbOpacity.value = TOPBAR_DEFAULTS.bgOpacity;
            tbOpacityVal.textContent = TOPBAR_DEFAULTS.bgOpacity + '%';
            tbTextColor.value = TOPBAR_DEFAULTS.textColor;
            tbTextColorHex.value = TOPBAR_DEFAULTS.textColor;
            tbBorderToggle.checked = TOPBAR_DEFAULTS.showBorder;
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
        applyTopbarSettings();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWhenReady);
    } else {
        injectWhenReady();
    }
})();
