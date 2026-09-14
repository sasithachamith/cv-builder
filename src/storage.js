import { sampleData, normalizeData } from './data.js';

const STORAGE_KEY = 'craftcv-state-v1';
const TAP_KEY = 'craftcv-taps-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.cv) {
        return { cv: normalizeData(saved.cv), templateId: saved.templateId || 'school', view: 'editor', seenLanding: true };
      }
    }
  } catch (e) {
    /* corrupted storage — fall back to sample */
  }
  return { cv: normalizeData(sampleData), templateId: 'school', view: 'landing', seenLanding: false };
}

export function persistState({ cv, templateId }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cv, templateId }));
  } catch (e) {
    /* storage full or blocked — editing still works in memory */
  }
}

export function seenTaps() {
  try {
    return JSON.parse(localStorage.getItem(TAP_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

export function markTapSeen(key) {
  try {
    const map = seenTaps();
    map[key] = true;
    localStorage.setItem(TAP_KEY, JSON.stringify(map));
  } catch (e) {
    /* ignore */
  }
}

export function clearAll() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TAP_KEY);
  } catch (e) {
    /* ignore */
  }
}
