import React from 'react';
import { TEMPLATES } from './templates.jsx';
import { TEMPLATE_RENDERERS } from './TemplateViews.jsx';
import { TplCard } from './TemplatePicker.jsx';
import { AppIcon } from './icons.jsx';

export default function Landing({ cv, templateId, onStart }) {
  const T = TEMPLATE_RENDERERS[templateId] || TEMPLATE_RENDERERS.school;

  const steps = [
    {
      num: '1', title: 'Pick a template',
      text: 'Choose from 7 professional designs — including a School Leaver CV with A/L and O/L results. You can switch anytime; your content stays.',
    },
    {
      num: '2', title: 'Fill in your details',
      text: 'Simple forms guide you section by section. Everything you type appears on the live preview instantly, and empty sections hide themselves.',
    },
    {
      num: '3', title: 'Download your PDF',
      text: 'One tap turns your CV into a print-ready A4 PDF. Works great on your phone and on your computer — no account needed.',
    },
  ];

  const why = [
    { icon: 'shield', title: 'Free & private', text: 'No sign-up, no fees, no ads. Your CV is saved only in your own browser.' },
    { icon: 'download', title: 'Real PDF download', text: 'A crisp A4 PDF, ready to attach to job applications or print.' },
    { icon: 'smartphone', title: 'Made for phones too', text: 'A proper mobile app feel — bottom navigation, big tap targets and previews.' },
    { icon: 'sparkles', title: 'First-timer friendly', text: 'Guided tour with tap targets shows you around on your first visit.' },
  ];

  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="logo">
          <span className="logo-mark"><AppIcon name="file" size={17} /></span>
          <span>CraftCV<small>free CV builder</small></span>
        </span>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => onStart()}>
            <AppIcon name="pencil" size={18} /> Create my CV
          </button>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="hero-copy">
          <h1>Create a professional CV <em>in minutes</em>.</h1>
          <p className="landing-sub">
            Pick one of 7 beautiful designs, fill in your details and download your CV as a
            print-ready PDF. No sign-up, no fees — everything happens in your browser and
            works beautifully on your phone.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" style={{ padding: '0 26px' }} onClick={() => onStart()}>
              <AppIcon name="sparkles" size={18} /> Start building — it’s free <AppIcon name="arrowRight" size={18} />
            </button>
            <button className="btn btn-ghost" onClick={() => onStart('school')}>
              See the School Leaver template
            </button>
          </div>
          <div className="hero-meta">
            <span><AppIcon name="download" size={16} /> PDF download</span>
            <span><AppIcon name="layout" size={16} /> 7 templates</span>
            <span><AppIcon name="smartphone" size={16} /> Mobile friendly</span>
            <span><AppIcon name="shield" size={16} /> Private</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="cc-scale-wrap" onClick={() => onStart()} style={{ cursor: 'pointer' }} title="Open the editor">
            <div className="cc-page">
              <T cv={cv} />
            </div>
          </div>
        </div>
      </div>

      <section className="landing-section">
        <h2>How it works</h2>
        <p className="section-sub">Three steps and your CV is ready to send.</p>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="tpl-strip-head">
          <div>
            <h2>Pick a template</h2>
            <p className="section-sub">Tap any design to open the editor with it — switching later keeps your content.</p>
          </div>
        </div>
        <div className="tpl-strip-grid">
          {TEMPLATES.map((t) => (
            <TplCard key={t.id} cv={cv} template={t} active={t.id === templateId} onClick={(id) => onStart(id)} thumbHeight={136} />
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Why CraftCV?</h2>
        <p className="section-sub">Built for first-time CV writers — on any device.</p>
        <div className="why-grid">
          {why.map((w) => (
            <div className="why-item" key={w.title}>
              <AppIcon name={w.icon} size={20} />
              <div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        CraftCV — free CV builder · 7 templates · Your data never leaves your device.
      </footer>
    </div>
  );
}
