// --- 外观设置 (Appearance Settings) ---
// 整体 UI 切换：论坛、设置、APP 布局、小组件等（聊天列表与聊天详情页保持不变）

const APPEARANCE_STORAGE_KEY = 'ovo_appearance_ui_mode';
const CUSTOM_TUTORIAL_CSS_KEY = 'ovo_custom_tutorial_css';
const CUSTOM_TUTORIAL_CSS_ENABLED_KEY = 'ovo_custom_tutorial_css_enabled';
const TOPBAR_BG_COLOR_KEY = 'ovo_topbar_bg_color';
const TOPBAR_BG_OPACITY_KEY = 'ovo_topbar_bg_opacity';
const TOPBAR_TEXT_COLOR_KEY = 'ovo_topbar_text_color';
const TOPBAR_BORDER_ENABLED_KEY = 'ovo_topbar_border_enabled';

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

function getTopbarBgColor() {
    try {
        return localStorage.getItem(TOPBAR_BG_COLOR_KEY) || '#ffffff';
    } catch (_) {
        return '#ffffff';
    }
}

function setTopbarBgColor(color) {
    try {
        localStorage.setItem(TOPBAR_BG_COLOR_KEY, color);
    } catch (_) {}
}

function getTopbarBgOpacity() {
    try {
        return localStorage.getItem(TOPBAR_BG_OPACITY_KEY) || '100';
    } catch (_) {
        return '100';
    }
}

function setTopbarBgOpacity(opacity) {
    try {
        localStorage.setItem(TOPBAR_BG_OPACITY_KEY, opacity);
    } catch (_) {}
}

function getTopbarTextColor() {
    try {
        return localStorage.getItem(TOPBAR_TEXT_COLOR_KEY) || '#000000';
    } catch (_) {
        return '#000000';
    }
}

function setTopbarTextColor(color) {
    try {
        localStorage.setItem(TOPBAR_TEXT_COLOR_KEY, color);
    } catch (_) {}
}

function isTopbarBorderEnabled() {
    try {
        return localStorage.getItem(TOPBAR_BORDER_ENABLED_KEY) !== 'false';
    } catch (_) {
        return true;
    }
}

function setTopbarBorderEnabled(enabled) {
    try {
        localStorage.setItem(TOPBAR_BORDER_ENABLED_KEY, enabled ? 'true' : 'false');
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

function applyTopbarStyle() {
    const styleId = 'ovo-custom-topbar-style';
    let styleEl = document.getElementById(styleId);
    
    const bgColor = getTopbarBgColor();
    const opacity = getTopbarBgOpacity();
    const textColor = getTopbarTextColor();
    const borderEnabled = isTopbarBorderEnabled();
    
    const opacityValue = parseInt(opacity) / 100;
    
    // 将 hex 颜色转换为 rgba
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    const css = `
        .app-header {
            background: rgba(${r}, ${g}, ${b}, ${opacityValue}) !important;
            color: ${textColor} !important;
            ${borderEnabled ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.1);' : 'border-bottom: none !important;'}
        }
        .app-header .title,
        .app-header h1 {
            color: ${textColor} !important;
        }
        .app-header .back-btn,
        .app-header button {
            color: ${textColor} !important;
        }
    `;
    
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
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

            <!-- 顶栏自定义设置区 -->
            <div class="appearance-section">
                <div class="appearance-section-header">
                    <h2 class="appearance-section-title">顶栏自定义</h2>
                    <span class="appearance-section-desc">自定义顶部导航栏样式</span>
                </div>
                <div class="topbar-custom-area">
                    <div class="topbar-custom-row">
                        <label class="topbar-custom-label">背景颜色</label>
                        <div class="topbar-color-input-group">
                            <input type="color" id="topbar-bg-color-picker" class="topbar-color-picker" value="${getTopbarBgColor()}">
                            <input type="text" id="topbar-bg-color-hex" class="topbar-color-hex" value="${getTopbarBgColor()}" placeholder="#ffffff" maxlength="7">
                        </div>
                    </div>
                    
                    <div class="topbar-custom-row">
                        <label class="topbar-custom-label">背景透明度</label>
                        <div class="topbar-slider-group">
                            <input type="range" id="topbar-bg-opacity-slider" class="topbar-slider" min="0" max="100" value="${getTopbarBgOpacity()}">
                            <span id="topbar-bg-opacity-value" class="topbar-slider-value">${getTopbarBgOpacity()}%</span>
                        </div>
                    </div>
                    
                    <div class="topbar-custom-row">
                        <label class="topbar-custom-label">文字颜色</label>
                        <div class="topbar-color-input-group">
                            <input type="color" id="topbar-text-color-picker" class="topbar-color-picker" value="${getTopbarTextColor()}">
                            <input type="text" id="topbar-text-color-hex" class="topbar-color-hex" value="${getTopbarTextColor()}" placeholder="#000000" maxlength="7">
                        </div>
                    </div>
                    
                    <div class="topbar-custom-row">
                        <label class="topbar-custom-label">底部边框</label>
                        <label class="topbar-switch">
                            <input type="checkbox" id="topbar-border-toggle" ${isTopbarBorderEnabled() ? 'checked' : ''}>
                            <span class="topbar-switch-slider"></span>
                        </label>
                    </div>
                    
                    <div class="topbar-btn-row">
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
    const topbarBgColorPicker = inner.querySelector('#topbar-bg-color-picker');
    const topbarBgColorHex = inner.querySelector('#topbar-bg-color-hex');
    const topbarTextPicker = inner.querySelector('#topbar-text-color-picker');
    const topbarTextHex = inner.querySelector('#topbar-text-color-hex');
    const topbarOpacitySlider = inner.querySelector('#topbar-bg-opacity-slider');
    const topbarOpacityValue = inner.querySelector('#topbar-bg-opacity-value');
    const topbarBorderToggle = inner.querySelector('#topbar-border-toggle');
    const topbarResetBtn = inner.querySelector('#topbar-reset-btn');

    // 背景颜色同步
    if (topbarBgColorPicker && topbarBgColorHex) {
        topbarBgColorPicker.addEventListener('input', () => {
            topbarBgColorHex.value = topbarBgColorPicker.value;
            setTopbarBgColor(topbarBgColorPicker.value);
            applyTopbarStyle();
        });
        topbarBgColorHex.addEventListener('input', () => {
            const hex = topbarBgColorHex.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                topbarBgColorPicker.value = hex;
                setTopbarBgColor(hex);
                applyTopbarStyle();
            }
        });
    }

    // 文字颜色同步
    if (topbarTextPicker && topbarTextHex) {
        topbarTextPicker.addEventListener('input', () => {
            topbarTextHex.value = topbarTextPicker.value;
            setTopbarTextColor(topbarTextPicker.value);
            applyTopbarStyle();
        });
        topbarTextHex.addEventListener('input', () => {
            const hex = topbarTextHex.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                topbarTextPicker.value = hex;
                setTopbarTextColor(hex);
                applyTopbarStyle();
            }
        });
    }

    // 透明度滑块
    if (topbarOpacitySlider && topbarOpacityValue) {
        topbarOpacitySlider.addEventListener('input', () => {
            topbarOpacityValue.textContent = topbarOpacitySlider.value + '%';
            setTopbarBgOpacity(topbarOpacitySlider.value);
            applyTopbarStyle();
        });
    }

    // 底部边框开关
    if (topbarBorderToggle) {
        topbarBorderToggle.addEventListener('change', () => {
            setTopbarBorderEnabled(topbarBorderToggle.checked);
            applyTopbarStyle();
        });
    }

    // 恢复默认按钮
    if (topbarResetBtn) {
        topbarResetBtn.addEventListener('click', () => {
            setTopbarBgColor('#ffffff');
            setTopbarBgOpacity('100');
            setTopbarTextColor('#000000');
            setTopbarBorderEnabled(true);
            
            if (topbarBgColorPicker) topbarBgColorPicker.value = '#ffffff';
            if (topbarBgColorHex) topbarBgColorHex.value = '#ffffff';
            if (topbarTextPicker) topbarTextPicker.value = '#000000';
            if (topbarTextHex) topbarTextHex.value = '#000000';
            if (topbarOpacitySlider) topbarOpacitySlider.value = '100';
            if (topbarOpacityValue) topbarOpacityValue.textContent = '100%';
            if (topbarBorderToggle) topbarBorderToggle.checked = true;
            
            applyTopbarStyle();
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
        applyTopbarStyle();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWhenReady);
    } else {
        injectWhenReady();
    }
})();
