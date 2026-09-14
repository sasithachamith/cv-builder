import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SECTION_SCHEMA, SECTION_ORDER } from './templates.jsx';
import { TEMPLATE_RENDERERS } from './TemplateViews.jsx';
import Form from './Form.jsx';
import PreviewPane from './PreviewPane.jsx';
import TemplatePicker from './TemplatePicker.jsx';
import Coach from './Coach.jsx';
import { AppIcon } from './icons.jsx';
import { persistState, clearAll } from './storage.js';
import { downloadPdf, isMobile } from './utils.js';
import { sampleData, emptyData, normalizeData } from './data.js';

function sectionDone(sectionId, cv) {
  switch (sectionId) {
    case 'personal': return (cv.personal?.fullName || '').trim().length > 0;
    case 'profile': return (cv.profile || '').trim().length > 0;
    default: return Array.isArray(cv[sectionId]) && cv[sectionId].length > 0;
  }
}

export default function Editor({ cv, setCv, templateId, setTemplateId, onHome }) {
  const [activeSection, setActiveSection] = useState('personal');
  const [mobileTab, setMobileTab] = useState('edit');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobile, setMobile] = useState(() => isMobile());
  const pageRef = useRef(null);
  const toastTimer = useRef(null);

  // Persist on every change
  useEffect(() => {
    persistState({ cv, templateId });
  }, [cv, templateId]);

  // Track desktop vs mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const showToast = useCallback((msg, type = 'ok') => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const onSectionChange = useCallback(
    (sectionId, value) => setCv((prev) => ({ ...prev, [sectionId]: value })),
    [setCv]
  );

  /* ── Coach marks (Android-style tap targets) ── */
  const desktopMarks = [
    {
      id: 'd1', title: '1 · Your CV sections',
      text: 'Your CV is built from these sections. Tap through them — a green dot means that part is done. Sections you leave empty are hidden on your CV automatically.',
      getTarget: () => document.querySelector('.section-nav'),
      onNext: () => setActiveSection('personal'),
    },
    {
      id: 'd2', title: '2 · Fill in the details',
      text: 'Answer the questions here — the CV on the right updates instantly. Press Enter to add skills and languages as chips.',
      getTarget: () => document.querySelector('.form-pane'),
    },
    {
      id: 'd3', title: '3 · Live preview',
      text: 'This is your real CV, exactly as it will look in the PDF. Use the zoom buttons to read it closely.',
      getTarget: () => document.querySelector('.preview-pane'),
    },
    {
      id: 'd4', title: '4 · Download your PDF',
      text: 'Happy with it? Tap Download PDF to save your CV. You can switch designs anytime with the Templates button.',
      getTarget: () => document.querySelector('[data-coach="download-desktop"]'),
    },
  ];
  const mobileMarks = [
    {
      id: 'm1', title: '1 · Your CV sections',
      text: 'Swipe these chips and fill each section — a green dot means done. Sections you leave empty won\u2019t appear on your CV.',
      getTarget: () => document.querySelector('.mobile-section-chips'),
    },
    {
      id: 'm2', title: '2 · See your CV',
      text: 'Tap Preview to see your CV the way employers will see it.',
      getTarget: () => document.querySelector('[data-coach="tab-preview"]'),
      onNext: () => setMobileTab('preview'),
    },
    {
      id: 'm3', title: '3 · Change the design',
      text: 'Tap here to browse all 7 templates — switching keeps everything you typed.',
      getTarget: () => document.querySelector('[data-coach="templates-mobile"]'),
    },
    {
      id: 'm4', title: '4 · Download your PDF',
      text: 'Tap the big blue button to save your CV as a PDF. That\u2019s it — you\u2019re done!',
      getTarget: () => document.querySelector('[data-coach="download-mobile"]'),
    },
  ];
  const marks = React.useMemo(() => (mobile ? mobileMarks : desktopMarks), [mobile, activeSection, mobileTab]);

  /* ── PDF download ── */
  const doExport = async () => {
    const el = pageRef.current;
    if (!el) { showToast('Preview is not ready yet — please try again.', 'error'); return; }
    setBusy('Preparing your CV…');
    try {
      await downloadPdf({ el, cv, onProgress: (m) => setBusy(m) });
      showToast('PDF downloaded — check your downloads folder');
    } catch (e) {
      showToast('PDF export failed. Try again, or use Print → Save as PDF.', 'error');
    } finally {
      setBusy(null);
    }
  };
  const onDownload = async () => {
    if (mobile && mobileTab !== 'preview') {
      setMobileTab('preview');
      await new Promise((r) => setTimeout(r, 420));
    }
    doExport();
  };

  /* ── Reset menu ── */
  const menuAction = (kind) => {
    setMenuOpen(false);
    if (kind === 'home') { onHome(); return; }
    if (kind === 'sample') {
      if (window.confirm('Replace everything with the sample CV?')) {
        setCv(normalizeData(sampleData));
        showToast('Sample CV restored');
      }
    }
    if (kind === 'blank') {
      if (window.confirm('Start a completely blank CV?')) {
        setCv(normalizeData(emptyData));
        showToast('Blank CV ready — start typing');
      }
    }
    if (kind === 'clear') {
      if (window.confirm('Clear everything saved in this browser and restart?')) {
        clearAll();
        window.location.reload();
      }
    }
  };

  /* ── Section navigation ── */
  const idx = SECTION_ORDER.indexOf(activeSection);
  const prevSection = idx > 0 ? SECTION_SCHEMA[idx - 1] : null;
  const nextSection = idx < SECTION_ORDER.length - 1 ? SECTION_SCHEMA[idx + 1] : null;
  const activeSchema = SECTION_SCHEMA.find((s) => s.id === activeSection);
  const T = TEMPLATE_RENDERERS[templateId] || TEMPLATE_RENDERERS.school;

  const logo = (
    <span className="logo">
      <span className="logo-mark"><AppIcon name="file" size={17} /></span>
      <span>CraftCV<small>free CV builder</small></span>
    </span>
  );

  const topbar = (
    <header className="topbar">
      <button className="icon-btn" onClick={onHome} aria-label="Back to home" data-coach="home">
        <AppIcon name="home" size={19} />
      </button>
      {logo}
      <div className="topbar-title">{cv.personal?.fullName?.trim() || 'My CV'}</div>
      <div className="topbar-actions">
        {mobile ? (
          <button className="icon-btn" onClick={() => setPickerOpen(true)} aria-label="Templates" data-coach="templates-mobile">
            <AppIcon name="layout" size={19} />
          </button>
        ) : (
          <button className="btn btn-soft" onClick={() => setPickerOpen(true)} data-coach="templates-desktop">
            <AppIcon name="layout" size={18} /> Templates
          </button>
        )}
        {!mobile && (
          <button className="btn btn-primary" onClick={onDownload} data-coach="download-desktop">
            <AppIcon name="download" size={18} /> Download PDF
          </button>
        )}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <AppIcon name="menu" size={19} />
          </button>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 91 }} onClick={() => setMenuOpen(false)} />
              <div className="menu-pop">
                <button onClick={() => menuAction('home')}><AppIcon name="home" size={16} /> Back to home</button>
                <button onClick={() => menuAction('sample')}><AppIcon name="rotate" size={16} /> Restore sample CV</button>
                <button onClick={() => menuAction('blank')}><AppIcon name="file" size={16} /> Start a blank CV</button>
                <button onClick={() => menuAction('clear')} style={{ color: '#dc2626' }}><AppIcon name="trash" size={16} /> Clear saved data</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );

  const prevNextButtons = (
    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <button className="btn btn-ghost" onClick={() => prevSection && setActiveSection(prevSection.id)} disabled={!prevSection}>
        <AppIcon name="chevL" size={17} /> Prev
      </button>
      <button
        className="btn btn-primary"
        style={{ flex: 1 }}
        onClick={() => { if (nextSection) setActiveSection(nextSection.id); else onDownload(); }}
      >
        {nextSection ? <>Next: {nextSection.label} <AppIcon name="chevR" size={17} /></> : <><AppIcon name="download" size={17} /> Download PDF</>}
      </button>
    </div>
  );

  const formBody = (
    <>
      <div className="form-pane-head">
        <h2>{activeSchema.label}</h2>
        <span className="hint">Left empty = hidden on CV</span>
      </div>
      <Form cv={cv} sectionId={activeSection} onSectionChange={onSectionChange} />
      {prevNextButtons}
    </>
  );

  return (
    <>
      <div className="app-root">
        {topbar}

        {mobile ? (
          <div className="mobile-main">
            {mobileTab === 'edit' ? (
              <div className="mobile-pane edit">
                <div className="mobile-section-chips">
                  {SECTION_SCHEMA.map((s) => (
                    <button
                      key={s.id}
                      className={`ms-chip ${s.id === activeSection ? 'active' : ''} ${sectionDone(s.id, cv) ? 'done' : ''}`}
                      onClick={() => setActiveSection(s.id)}
                    >
                      <AppIcon name={s.icon} size={16} /> {s.label} <span className="nav-dot" />
                    </button>
                  ))}
                </div>
                {formBody}
              </div>
            ) : (
              <PreviewPane className="mobile-pane preview" cv={cv} templateId={templateId} pageRef={pageRef} minimal />
            )}
            <nav className="bottom-nav">
              <button
                className={`bn-item ${mobileTab === 'edit' ? 'active' : ''}`}
                onClick={() => setMobileTab('edit')}
                aria-label="Edit"
              >
                <AppIcon name="pencil" /> Edit
              </button>
              <button className="bn-item" onClick={onDownload} aria-label="Download PDF" data-coach="download-mobile">
                <span className="bn-download-icon"><AppIcon name="download" size={24} /></span>
                <span>PDF</span>
              </button>
              <button
                className={`bn-item ${mobileTab === 'preview' ? 'active' : ''}`}
                onClick={() => setMobileTab('preview')}
                aria-label="Preview"
                data-coach="tab-preview"
              >
                <AppIcon name="eye" /> Preview
              </button>
            </nav>
          </div>
        ) : (
          <div className="desktop-layout">
            <nav className="section-nav">
              {SECTION_SCHEMA.map((s) => (
                <button
                  key={s.id}
                  className={`nav-item ${s.id === activeSection ? 'active' : ''} ${sectionDone(s.id, cv) ? 'done' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <AppIcon name={s.icon} size={18} /> {s.label} <span className="nav-dot" />
                </button>
              ))}
            </nav>
            <div className="form-pane">{formBody}</div>
            <PreviewPane className="preview-pane" cv={cv} templateId={templateId} pageRef={pageRef} />
          </div>
        )}
      </div>

      {/* Print-only sheet (Ctrl/Cmd+P) */}
      <div className="cc-print-sheet" aria-hidden="true">
        <div className="cc-page">
          <T cv={cv} />
        </div>
      </div>

      <TemplatePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentId={templateId}
        onSelect={(id) => { setTemplateId(id); showToast('Template changed'); }}
        cv={cv}
        mobile={mobile}
      />

      <Coach marks={marks} onClose={() => {}} />

      {toast && <div className={`toast ${toast.type === 'error' ? 'error' : ''}`} role="status">{toast.msg}</div>}

      {busy && (
        <div className="busy-overlay">
          <div className="spinner" />
          <p>{busy}</p>
        </div>
      )}
    </>
  );
}
