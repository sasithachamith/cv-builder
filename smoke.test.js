/* Smoke test: render the real app in jsdom and check for runtime errors. */
import { JSDOM } from 'jsdom';
import React from 'react';
import { createRoot } from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

const { window } = dom;

// Polyfills jsdom lacks
let MOCK_MOBILE = false;
global.ResizeObserver = window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.matchMedia = window.matchMedia = (q) => ({
  matches: MOCK_MOBILE,
  media: q,
  addEventListener() {},
  removeEventListener() {},
});
window.HTMLElement.prototype.scrollIntoView = function () {};
window.HTMLCanvasElement.prototype.getContext = function () {
  return { fillRect() {}, drawImage() {}, fillStyle: '', measureText: () => ({ width: 0 }) };
};
global.window = window;
global.document = window.document;
try { Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true }); } catch (e) { global.navigator = window.navigator; }
global.HTMLElement = window.HTMLElement;
global.Node = window.Node;
global.Element = window.Element;
global.localStorage = window.localStorage;
global.getComputedStyle = window.getComputedStyle;
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = clearTimeout;

const errors = [];
window.addEventListener('error', (e) => errors.push('window error: ' + e.message));

const { default: App } = await import('./src/App.jsx');
const { TEMPLATE_RENDERERS } = await import('./src/TemplateViews.jsx');
const { sampleData } = await import('./src/data.js');

const rootEl = document.getElementById('root');
createRoot(rootEl).render(React.createElement(App));

await new Promise((r) => setTimeout(r, 300));

const html = document.body.innerHTML;
const checks = [];
const check = (name, cond) => { checks.push([name, !!cond]); if (!cond) console.error('FAIL:', name); };

// Landing renders
check('landing hero title', html.includes('Create a professional CV'));
check('landing template strip (7 cards)', document.querySelectorAll('.tpl-strip-grid .tpl-card').length === 7);
check('landing steps', document.querySelectorAll('.step-card').length === 3);

// Start editor: click "Start building"
const startBtn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Start building'));
check('found start button', !!startBtn);
startBtn.click();
await new Promise((r) => setTimeout(r, 300));

check('editor topbar', !!document.querySelector('.topbar'));
check('desktop 3-pane layout', !!document.querySelector('.desktop-layout'));
check('section nav has 9 items', document.querySelectorAll('.section-nav .nav-item').length === 9);
check('form pane present', !!document.querySelector('.form-pane'));
check('preview pane present', !!document.querySelector('.preview-pane'));
check('live preview shows Kavindu', document.querySelector('.preview-pane').textContent.includes('Kavindu Fernando'));

// Exercise a few sections
const navItems = [...document.querySelectorAll('.section-nav .nav-item')];
navItems.find((b) => b.textContent.includes('Skills')).click();
await new Promise((r) => setTimeout(r, 100));
check('skills form', document.querySelector('.form-pane').textContent.includes('Communication Skills'));
navItems.find((b) => b.textContent.includes('Exam Results')).click();
await new Promise((r) => setTimeout(r, 100));
check('exam form rows', document.querySelectorAll('.grade-row').length >= 4);

// Coach marks appear (first visit)
check('coach card visible', !!document.querySelector('.tap-card'));
document.querySelector('.tap-btn.ghost')?.click(); // skip
await new Promise((r) => setTimeout(r, 100));
check('coach dismissed', !document.querySelector('.tap-card'));

// Every template renders standalone with sample data
const holder = document.createElement('div');
document.body.appendChild(holder);
for (const [id, Comp] of Object.entries(TEMPLATE_RENDERERS)) {
  let ok = true;
  try {
    createRoot(holder).render(React.createElement(Comp, { cv: sampleData }));
    await new Promise((r) => setTimeout(r, 50));
    ok = holder.textContent.length > 50;
  } catch (e) { ok = false; console.error('template crashed:', id, e); }
  check(`template renders: ${id}`, ok);
  holder.innerHTML = '';
}

// Type into a field → preview updates
navItems.find((b) => b.textContent.includes('Personal Info')).click();
await new Promise((r) => setTimeout(r, 100));
console.log('FORM PANE HEADING:', document.querySelector('.form-pane-head')?.textContent);
console.log('FIRST INPUT:', document.querySelector('.form-pane input')?.outerHTML?.slice(0, 120));
// Drive React's onChange directly (jsdom cannot simulate native typing for React 18)
const nameInput = document.querySelector('.form-pane input');
const propKey = Object.keys(nameInput).find((k) => k.startsWith('__reactProps'));
const props = nameInput[propKey];
check('input has React onChange prop', typeof props.onChange === 'function');
props.onChange({ target: { value: 'Amaya Perera' } });
await new Promise((r) => setTimeout(r, 150));
console.log('PREVIEW HAS AMAYA:', document.querySelector('.preview-pane').textContent.includes('Amaya Perera'));
console.log('STORAGE:', localStorage.getItem('craftcv-state-v1')?.slice(0, 200));
check('live update reflected in preview', document.querySelector('.preview-pane').textContent.includes('Amaya Perera'));
check('localStorage persisted', (JSON.parse(localStorage.getItem('craftcv-state-v1'))?.cv?.personal?.fullName) === 'Amaya Perera');

check('no window errors', errors.length === 0);
if (errors.length) console.error('WINDOW ERRORS:', errors);

/* ── Mobile layout pass ── */
rootEl.innerHTML = '';
localStorage.clear();
MOCK_MOBILE = true;
errors.length = 0;
createRoot(rootEl).render(React.createElement(App));
await new Promise((r) => setTimeout(r, 300));
const mHtml = document.body.innerHTML;
check('mobile: landing shows', mHtml.includes('Create a professional CV'));
const mStart = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Start building'));
mStart.click();
await new Promise((r) => setTimeout(r, 300));
check('mobile: editor opens on Edit tab', !!document.querySelector('.mobile-pane.edit'));
check('mobile: bottom nav present', !!document.querySelector('.bottom-nav'));
check('mobile: bottom nav has 3 items', document.querySelectorAll('.bottom-nav .bn-item').length === 3);
check('mobile: raised download button', !!document.querySelector('.bn-download-icon'));
check('mobile: section chips', !!document.querySelector('.mobile-section-chips'));
check('mobile: coach appears', !!document.querySelector('.tap-card'));
// Preview tab
document.querySelector('[data-coach="tab-preview"]')?.click();
await new Promise((r) => setTimeout(r, 150));
check('mobile: preview tab shows CV', document.querySelector('.mobile-pane.preview')?.textContent.includes('Kavindu Fernando'));
// Template sheet
document.querySelector('[data-coach="templates-mobile"]')?.click();
await new Promise((r) => setTimeout(r, 150));
check('mobile: template sheet opens', !!document.querySelector('.sheet'));
check('mobile: sheet lists 7 templates', document.querySelectorAll('.sheet .tpl-card').length === 7);

const failed = checks.filter(([, ok]) => !ok).length;
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);
