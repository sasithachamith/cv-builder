import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { seenTaps, markTapSeen } from './storage.js';

/* Android-style tap-target coach marks for first-time users.
   Each mark highlights an element with a pulsing ring and a card. */
export default function Coach({ marks, onClose }) {
  const [index, setIndex] = useState(-1);
  const [pos, setPos] = useState(null);
  const cardRef = useRef(null);

  // Find the first not-yet-seen mark on mount
  useEffect(() => {
    const first = marks.findIndex((m) => !seenTaps()[m.id]);
    setIndex(first);
  }, [marks]);

  const mark = index >= 0 ? marks[index] : null;

  const finish = useCallback(() => {
    marks.forEach((m) => markTapSeen(m.id));
    setIndex(-1);
    onClose?.();
  }, [marks, onClose]);

  const next = useCallback(() => {
    if (mark) markTapSeen(mark.id);
    if (index + 1 < marks.length) setIndex(index + 1);
    else finish();
  }, [index, marks, mark, finish]);

  // Position ring + card each step
  useLayoutEffect(() => {
    if (!mark) { setPos(null); return; }
    const el = mark.getTarget?.();
    if (!el || typeof el.getBoundingClientRect !== 'function') { next(); return; }
    try { el.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) { /* ignore */ }
    const r = el.getBoundingClientRect();
    const ringSize = 52;
    const ring = {
      left: r.left + r.width / 2 - ringSize / 2,
      top: r.top + r.height / 2 - ringSize / 2,
      width: ringSize,
      height: ringSize,
    };
    const card = cardRef.current;
    const cw = card ? card.offsetWidth : 324;
    const ch = card ? card.offsetHeight : 170;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 16;
    let left = Math.min(Math.max(r.left + r.width / 2 - cw / 2, 12), vw - cw - 12);
    let top = r.bottom + gap;
    if (top + ch > vh - 12) top = r.top - ch - gap;
    if (top < 12) top = 12;
    setPos({ ring, left, top });
  }, [mark, next]);

  // Keyboard: Enter → next, Esc → finish
  useEffect(() => {
    if (!mark) return;
    const onKey = (e) => {
      if (e.key === 'Enter') next();
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mark, next, finish]);

  if (!mark || !pos) return null;

  return (
    <>
      <div className="tap-backdrop" />
      <div className="tap-ring" style={pos.ring} />
      <div className="tap-card" ref={cardRef} style={{ left: pos.left, top: pos.top, opacity: pos ? 1 : 0 }}>
        <h4>
          <span className="tap-num">{index + 1}/{marks.length}</span>
          {mark.title}
        </h4>
        <p>{mark.text}</p>
        <div className="tap-actions">
          <button className="tap-btn ghost" onClick={finish}>Skip</button>
          <button className="tap-btn primary" onClick={next} autoFocus>
            {index + 1 < marks.length ? 'Next' : 'Got it!'}
          </button>
        </div>
      </div>
    </>
  );
}
