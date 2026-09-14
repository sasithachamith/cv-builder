import React, { useEffect, useRef, useState } from 'react';
import { TEMPLATE_RENDERERS } from './TemplateViews.jsx';
import { AppIcon } from './icons.jsx';

/* Live A4 preview with fit/zoom controls.
   The .cc-page node is the exact node exported to PDF. */
export default function PreviewPane({ className = '', cv, templateId, pageRef, minimal = false }) {
  const paneRef = useRef(null);
  const [fit, setFit] = useState(0.6);
  const [manual, setManual] = useState(null);

  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth - (minimal ? 32 : 48);
      setFit(Math.min(Math.max(w / 794, 0.28), 1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [minimal]);

  const zoom = manual ?? fit;
  const T = TEMPLATE_RENDERERS[templateId] || TEMPLATE_RENDERERS.school;
  const zoomBy = (dir) => setManual(Math.min(1.5, Math.max(0.3, (manual ?? fit) * (dir > 0 ? 1.25 : 0.8))));

  return (
    <div className={className} ref={paneRef}>
      {!minimal && (
        <div className="pane-tools">
          <span className="zoom-label">Live preview · A4</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="icon-btn zoom-btns" onClick={() => setManual(null)} aria-label="Fit to screen" title="Fit to screen">
              <AppIcon name="image" size={15} />
            </button>
            <div className="zoom-btns" style={{ display: 'flex', gap: 4 }}>
              <button className="icon-btn" onClick={() => zoomBy(-1)} aria-label="Zoom out"><AppIcon name="chevL" size={15} /></button>
              <button className="icon-btn" onClick={() => zoomBy(1)} aria-label="Zoom in"><AppIcon name="chevR" size={15} /></button>
            </div>
            <span className="zoom-label">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      )}
      <div className="preview-scroll">
        <div className="cc-scale-wrap" style={{ '--zoom': zoom }}>
          <div className="cc-page" ref={pageRef}>
            <T cv={cv} />
          </div>
        </div>
      </div>
    </div>
  );
}
