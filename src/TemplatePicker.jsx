import React, { useEffect, useRef, useState } from 'react';
import { TEMPLATES } from './templates.jsx';
import { TEMPLATE_RENDERERS } from './TemplateViews.jsx';
import { AppIcon } from './icons.jsx';

/* Live mini preview of a template, scaled to the thumb width */
export function TplThumb({ cv, templateId, height = 148 }) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(0.19);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setZoom(el.clientWidth / 794));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const T = TEMPLATE_RENDERERS[templateId] || TEMPLATE_RENDERERS.school;
  return (
    <div className="tpl-thumb" style={{ height }} ref={ref}>
      <div className="cc-scale-wrap" style={{ '--zoom': zoom }}>
        <div className="cc-page">
          <T cv={cv} />
        </div>
      </div>
    </div>
  );
}

export function TplCard({ cv, template, active, onClick, thumbHeight = 148 }) {
  const T = TEMPLATE_RENDERERS[template.id] || TEMPLATE_RENDERERS.school;
  return (
    <button className={`tpl-card ${active ? 'active' : ''}`} onClick={() => onClick(template.id)} type="button" aria-label={`Use ${template.name} template`}>
      <TplThumb cv={cv} templateId={template.id} height={thumbHeight} />
      {active && (
        <span className="tpl-check">
          <AppIcon name="check" size={15} strokeWidth={3} />
        </span>
      )}
      <div className="tpl-meta">
        <div className="tpl-name">
          {template.name}
          <span className="tpl-tag" style={{ background: '#eef2ff', color: '#4f46e5' }}>{template.accent}</span>
        </div>
        <p className="tpl-tagline">{template.tagline}</p>
        <div className="tpl-tags">
          {template.tags.map((t) => <span className="tpl-tag" key={t}>{t}</span>)}
        </div>
      </div>
    </button>
  );
}

export default function TemplatePicker({ open, onClose, currentId, onSelect, cv, mobile }) {
  if (!open) return null;

  const body = (
    <div className={mobile ? 'sheet-body' : 'tpl-modal-body'}>
      {TEMPLATES.map((t) => (
        <TplCard
          key={t.id}
          cv={cv}
          template={t}
          active={t.id === currentId}
          onClick={(id) => { onSelect(id); onClose(); }}
        />
      ))}
    </div>
  );

  if (mobile) {
    return (
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Choose a template">
          <div className="sheet-handle" />
          <div className="sheet-head">
            <span className="sheet-title">Choose your design</span>
            <button className="sheet-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="tpl-modal" onClick={onClose}>
      <div className="tpl-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Choose a template">
        <div className="sheet-head">
          <span className="sheet-title">Choose your design</span>
          <button className="sheet-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {body}
      </div>
    </div>
  );
}
