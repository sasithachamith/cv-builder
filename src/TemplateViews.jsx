import React from 'react';
import { Icon } from './templates.jsx';

/* ─────────────────────────────────────────────
   Shared building blocks
───────────────────────────────────────────── */

const PROFILE_KEYS = [
  { key: 'phone', icon: 'phone', label: 'Phone' },
  { key: 'email', icon: 'mail', label: 'Email' },
  { key: 'location', icon: 'pin', label: 'Location' },
  { key: 'dob', icon: 'calendar', label: 'Date of birth' },
];

function contactRows(personal) {
  return PROFILE_KEYS
    .filter((k) => (personal[k.key] || '').trim())
    .map((k) => ({ icon: k.icon, label: k.label, value: String(personal[k.key]).trim() }));
}

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'CV';

export function CvAvatar({ photo, name, size = 92, className = '', style }) {
  if (photo && photo.trim()) {
    return (
      <img
        className={`cv-avatar ${className}`}
        src={photo}
        alt={name || 'Profile'}
        crossOrigin="anonymous"
        style={{ width: size, height: size, ...style }}
      />
    );
  }
  return (
    <div className={`cv-avatar cv-avatar-initials ${className}`} style={{ width: size, height: size, fontSize: size * 0.36, ...style }} aria-hidden="true">
      {initialsOf(name)}
    </div>
  );
}

const has = (x) => {
  if (x == null) return false;
  if (typeof x === 'string') return x.trim().length > 0;
  if (Array.isArray(x)) return x.length > 0;
  return true;
};

/* ─────────────────────────────────────────────
   1 · SCHOOL LEAVER — the original template
───────────────────────────────────────────── */
function SchoolTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, activities, references } = cv;
  const contacts = contactRows(personal);
  const interests = [];
  return (
    <div className="tl tl-school" data-template="school">
      <aside className="tl-school-side">
        <div className="tl-school-profile">
          {personal.photo ? (
            <img className="tl-school-avatar" src={personal.photo} alt={personal.fullName} crossOrigin="anonymous" />
          ) : (
            <div className="tl-school-avatar tl-school-avatar-initials">{initialsOf(personal.fullName)}</div>
          )}
          <h1 className="tl-school-name">{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
          {has(personal.role) && <p className="tl-school-role">{personal.role}</p>}
        </div>

        {contacts.length > 0 && (
          <div className="tl-school-block">
            <h3 className="tl-school-block-title">Contact</h3>
            {contacts.map((c) => (
              <p className="tl-school-contact" key={c.key || c.value}>
                <Icon name={c.icon} size={11} /> {c.value}
              </p>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="tl-school-block">
            <h3 className="tl-school-block-title">Skills</h3>
            <ul className="tl-school-list">
              {skills.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}

        {languages.length > 0 && (
          <div className="tl-school-block">
            <h3 className="tl-school-block-title">Languages</h3>
            <ul className="tl-school-list">
              {languages.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}

        {interests.length > 0 && (
          <div className="tl-school-block">
            <h3 className="tl-school-block-title">Interests</h3>
            <ul className="tl-school-list">
              {interests.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}
      </aside>

      <main className="tl-school-main">
        {has(profile) && (
          <section className="tl-school-section">
            <h2 className="tl-school-title">Profile</h2>
            <p className="tl-school-text">{profile}</p>
          </section>
        )}

        {education.length > 0 && (
          <section className="tl-school-section">
            <h2 className="tl-school-title">Education</h2>
            {education.map((e, i) => (
              <div className="tl-school-card" key={i}>
                <div className="tl-school-card-head">
                  <h3>{e.institution || 'Institution'}</h3>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.detail) && <p>{e.detail}</p>}
              </div>
            ))}
          </section>
        )}

        {exams.map((exam, i) => (
          <section className="tl-school-section" key={i}>
            <h2 className="tl-school-title">Exam Results</h2>
            <div className="tl-school-exam">
              <div className="tl-school-exam-top">
                <h3>{exam.title || 'Examination'}</h3>
                {has(exam.year) && <span>{exam.year}</span>}
              </div>
              {exam.results?.length > 0 && (
                <table className="tl-school-table">
                  <tbody>
                    {exam.results.map((r, j) => (
                      <tr key={j}>
                        <td>{r[0]}</td>
                        <td>{r[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        ))}

        {activities.length > 0 && (
          <section className="tl-school-section">
            <h2 className="tl-school-title">Extra Activities</h2>
            <ul className="tl-school-bullets">
              {activities.map((a, i) => (
                <li key={i}>
                  {a.title}
                  {has(a.period) && <span className="tl-school-activity-period"> · {a.period}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {references.length > 0 && (
          <section className="tl-school-section tl-school-last">
            <h2 className="tl-school-title">References</h2>
            <div className="tl-school-refs">
              {references.map((r, i) => (
                <div className="tl-school-ref" key={i}>
                  <strong>{r.name}</strong>
                  {has(r.role) && <span>{r.role}</span>}
                  {has(r.contact) && <span>{r.contact}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2 · MODERN SLATE — single column, timeline
───────────────────────────────────────────── */
function ModernTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, experience, activities, references } = cv;
  const contacts = contactRows(personal);
  const chunks = (list, n) => {
    if (!list.length) return [];
    const out = [];
    for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
    return out;
  };
  const skillCols = chunks(skills, Math.ceil(skills.length / 2));

  return (
    <div className="tl tl-modern" data-template="modern">
      <header className="tl-modern-head">
        <div className="tl-modern-head-inner">
          <CvAvatar photo={personal.photo} name={personal.fullName} size={86} className="tl-modern-avatar" />
          <div>
            <h1>{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
            {has(personal.role) && <p className="tl-modern-role">{personal.role}</p>}
            {contacts.length > 0 && (
              <ul className="tl-modern-contact">
                {contacts.map((c) => (
                  <li key={c.value}>
                    <Icon name={c.icon} size={11} /> {c.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="tl-modern-body">
        {has(profile) && (
          <section>
            <h2><span>01</span> Profile</h2>
            <p className="tl-modern-text">{profile}</p>
          </section>
        )}

        {(education.length > 0 || exams.length > 0) && (
          <section>
            <h2><span>02</span> Education</h2>
            <div className="tl-modern-timeline">
              {education.map((e, i) => (
                <div className="tl-modern-item" key={`ed-${i}`}>
                  <div className="tl-modern-item-date">{e.period || ''}</div>
                  <div className="tl-modern-item-body">
                    <h3>{e.institution}</h3>
                    {has(e.detail) && <p>{e.detail}</p>}
                  </div>
                </div>
              ))}
              {exams.map((exam, i) => (
                <div className="tl-modern-item" key={`ex-${i}`}>
                  <div className="tl-modern-item-date">{exam.year || ''}</div>
                  <div className="tl-modern-item-body">
                    <h3>{exam.title}</h3>
                    {exam.results?.length > 0 && (
                      <ul className="tl-modern-grade-list">
                        {exam.results.map((r, j) => (
                          <li key={j}>{r[0]} <b>{r[1]}</b></li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2><span>03</span> Experience</h2>
            <div className="tl-modern-timeline">
              {experience.map((e, i) => (
                <div className="tl-modern-item" key={i}>
                  <div className="tl-modern-item-date">{e.period || ''}</div>
                  <div className="tl-modern-item-body">
                    <h3>{e.title}</h3>
                    {has(e.company) && <p className="tl-modern-company">{e.company}</p>}
                    {has(e.detail) && <p>{e.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skillCols[0]?.length > 0 && (
          <section>
            <h2><span>04</span> Skills</h2>
            <div className="tl-modern-cols">
              {skillCols.map((col, i) => col?.length > 0 && (
                <ul className="tl-modern-chips" key={i}>
                  {col.map((s) => <li key={s}>{s}</li>)}
                </ul>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2><span>05</span> Languages</h2>
            <ul className="tl-modern-chips">
              {languages.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        {activities.length > 0 && (
          <section>
            <h2><span>06</span> Activities & Achievements</h2>
            <ul className="tl-modern-bullets">
              {activities.map((a, i) => (
                <li key={i}>
                  {a.title}
                  {has(a.period) && <span className="tl-modern-activity-period"> · {a.period}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {references.length > 0 && (
          <section>
            <h2><span>07</span> References</h2>
            <div className="tl-modern-refs">
              {references.map((r, i) => (
                <div className="tl-modern-ref" key={i}>
                  <strong>{r.name}</strong>
                  {has(r.role) && <span>{r.role}</span>}
                  {has(r.contact) && <span>{r.contact}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3 · OCEAN BREEZE — teal sidebar, soft cards
───────────────────────────────────────────── */
function OceanTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, experience, activities, references } = cv;
  const contacts = contactRows(personal);
  return (
    <div className="tl tl-ocean" data-template="ocean">
      <aside className="tl-ocean-side">
        <CvAvatar photo={personal.photo} name={personal.fullName} size={94} className="tl-ocean-avatar" />
        <h1 className="tl-ocean-name">{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
        {has(personal.role) && <p className="tl-ocean-role">{personal.role}</p>}

        {contacts.length > 0 && (
          <div className="tl-ocean-block">
            <h3 className="tl-ocean-block-title">Contact</h3>
            {contacts.map((c) => (
              <p className="tl-ocean-contact" key={c.value}>
                <Icon name={c.icon} size={11} /> {c.value}
              </p>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="tl-ocean-block">
            <h3 className="tl-ocean-block-title">Skills</h3>
            <ul className="tl-ocean-list">
              {skills.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}

        {languages.length > 0 && (
          <div className="tl-ocean-block">
            <h3 className="tl-ocean-block-title">Languages</h3>
            <ul className="tl-ocean-list">
              {languages.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}
      </aside>

      <main className="tl-ocean-main">
        {has(profile) && (
          <section className="tl-ocean-section">
            <h2 className="tl-ocean-title">About Me</h2>
            <p className="tl-ocean-text">{profile}</p>
          </section>
        )}

        {education.length > 0 && (
          <section className="tl-ocean-section">
            <h2 className="tl-ocean-title">Education</h2>
            {education.map((e, i) => (
              <div className="tl-ocean-card" key={i}>
                <div className="tl-ocean-card-head">
                  <h3>{e.institution}</h3>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.detail) && <p>{e.detail}</p>}
              </div>
            ))}
          </section>
        )}

        {exams.map((exam, i) => (
          <section className="tl-ocean-section" key={i}>
            <h2 className="tl-ocean-title">Results</h2>
            <div className="tl-ocean-card">
              <div className="tl-ocean-card-head">
                <h3>{exam.title}</h3>
                {has(exam.year) && <span>{exam.year}</span>}
              </div>
              {exam.results?.length > 0 && (
                <table className="tl-ocean-table">
                  <tbody>
                    {exam.results.map((r, j) => (
                      <tr key={j}><td>{r[0]}</td><td>{r[1]}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        ))}

        {experience.length > 0 && (
          <section className="tl-ocean-section">
            <h2 className="tl-ocean-title">Experience</h2>
            {experience.map((e, i) => (
              <div className="tl-ocean-card" key={i}>
                <div className="tl-ocean-card-head">
                  <h3>{e.title}</h3>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.company) && <p className="tl-ocean-sub">{e.company}</p>}
                {has(e.detail) && <p>{e.detail}</p>}
              </div>
            ))}
          </section>
        )}

        {activities.length > 0 && (
          <section className="tl-ocean-section">
            <h2 className="tl-ocean-title">Highlights</h2>
            <ul className="tl-ocean-bullets">
              {activities.map((a, i) => (
                <li key={i}>
                  {a.title}
                  {has(a.period) && <span className="tl-ocean-activity-period"> · {a.period}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {references.length > 0 && (
          <section className="tl-ocean-section tl-ocean-last">
            <h2 className="tl-ocean-title">References</h2>
            <div className="tl-ocean-refs">
              {references.map((r, i) => (
                <div className="tl-ocean-ref" key={i}>
                  <strong>{r.name}</strong>
                  {has(r.role) && <span>{r.role}</span>}
                  {has(r.contact) && <span>{r.contact}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   4 · ROSÉ ELEGANCE — warm, serif headline
───────────────────────────────────────────── */
function BlushTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, experience, activities, references } = cv;
  const contacts = contactRows(personal);
  return (
    <div className="tl tl-blush" data-template="blush">
      <div className="tl-blush-inner">
        <header className="tl-blush-head">
          <div className="tl-blush-head-text">
            <h1>{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
            {has(personal.role) && <p className="tl-blush-role">{personal.role}</p>}
          </div>
          <CvAvatar photo={personal.photo} name={personal.fullName} size={92} className="tl-blush-avatar" />
        </header>

        <div className="tl-blush-contacts">
          {contacts.map((c) => (
            <span className="tl-blush-contact" key={c.value}>
              <Icon name={c.icon} size={11} /> {c.value}
            </span>
          ))}
        </div>

        {has(profile) && (
          <section className="tl-blush-section">
            <h2>Profile</h2>
            <p>{profile}</p>
          </section>
        )}

        {(education.length > 0 || exams.length > 0) && (
          <section className="tl-blush-section">
            <h2>Education & Results</h2>
            {education.map((e, i) => (
              <div className="tl-blush-item" key={`ed-${i}`}>
                <div className="tl-blush-item-head">
                  <strong>{e.institution}</strong>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.detail) && <p>{e.detail}</p>}
              </div>
            ))}
            {exams.map((exam, i) => (
              <div className="tl-blush-item" key={`ex-${i}`}>
                <div className="tl-blush-item-head">
                  <strong>{exam.title}</strong>
                  {has(exam.year) && <span>{exam.year}</span>}
                </div>
                {exam.results?.length > 0 && (
                  <div className="tl-blush-grades">
                    {exam.results.map((r, j) => (
                      <span className="tl-blush-grade" key={j}>{r[0]}: <b>{r[1]}</b></span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {experience.length > 0 && (
          <section className="tl-blush-section">
            <h2>Experience</h2>
            {experience.map((e, i) => (
              <div className="tl-blush-item" key={i}>
                <div className="tl-blush-item-head">
                  <strong>{e.title}{has(e.company) ? `, ${e.company}` : ''}</strong>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.detail) && <p>{e.detail}</p>}
              </div>
            ))}
          </section>
        )}

        {(skills.length > 0 || languages.length > 0) && (
          <section className="tl-blush-section">
            <h2>Skills & Languages</h2>
            <div className="tl-blush-chips">
              {skills.map((s) => <span className="tl-blush-chip" key={`s-${s}`}>{s}</span>)}
              {languages.map((s) => <span className="tl-blush-chip tl-blush-chip-soft" key={`l-${s}`}>{s}</span>)}
            </div>
          </section>
        )}

        {activities.length > 0 && (
          <section className="tl-blush-section">
            <h2>Activities</h2>
            <ul className="tl-blush-bullets">
              {activities.map((a, i) => (
                <li key={i}>
                  {a.title}
                  {has(a.period) && <span className="tl-blush-activity-period"> · {a.period}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {references.length > 0 && (
          <section className="tl-blush-section tl-blush-last">
            <h2>References</h2>
            <div className="tl-blush-refs">
              {references.map((r, i) => (
                <div className="tl-blush-ref" key={i}>
                  <strong>{r.name}</strong>
                  {has(r.role) && <span>{r.role}</span>}
                  {has(r.contact) && <span>{r.contact}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   5 · MINIMAL MONO — hairline rules, typography
───────────────────────────────────────────── */
function MinimalTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, experience, activities, references } = cv;
  const contacts = contactRows(personal);
  return (
    <div className="tl tl-minimal" data-template="minimal">
      <header className="tl-min-head">
        <h1>{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
        {has(personal.role) && <p>{personal.role}</p>}
        {contacts.length > 0 && (
          <p className="tl-min-contacts">
            {contacts.map((c, i) => (
              <span key={c.value} className="tl-min-contact">
                <Icon name={c.icon} size={10} /> {c.value}{i < contacts.length - 1 ? '  /  ' : ''}
              </span>
            ))}
          </p>
        )}
      </header>

      {has(profile) && (
        <section className="tl-min-section">
          <h2>Profile</h2>
          <p className="tl-min-text">{profile}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="tl-min-section">
          <h2>Education</h2>
          {education.map((e, i) => (
            <div className="tl-min-row" key={i}>
              <strong className="tl-min-row-title">{e.institution}</strong>
              <span className="tl-min-row-meta">{e.period}</span>
              {has(e.detail) && <p className="tl-min-row-sub">{e.detail}</p>}
            </div>
          ))}
        </section>
      )}

      {exams.map((exam, i) => (
        <section className="tl-min-section" key={i}>
          <h2>{exam.title || 'Results'}</h2>
          <div className="tl-min-row">
            {has(exam.year) && <span className="tl-min-row-meta">{exam.year}</span>}
            {exam.results?.length > 0 && (
              <div className="tl-min-grades">
                {exam.results.map((r, j) => (
                  <span className="tl-min-grade" key={j}>{r[0]} <b>{r[1]}</b></span>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {experience.length > 0 && (
        <section className="tl-min-section">
          <h2>Experience</h2>
          {experience.map((e, i) => (
            <div className="tl-min-row" key={i}>
              <strong className="tl-min-row-title">{e.title}</strong>
              <span className="tl-min-row-meta">{e.period}</span>
              {has(e.company) && <p className="tl-min-row-sub">{e.company}</p>}
              {has(e.detail) && <p className="tl-min-row-sub">{e.detail}</p>}
            </div>
          ))}
        </section>
      )}

      {(skills.length > 0 || languages.length > 0) && (
        <section className="tl-min-section">
          <h2>Skills & Languages</h2>
          <p className="tl-min-meta">{[...skills, ...languages].join('  ·  ')}</p>
        </section>
      )}

      {activities.length > 0 && (
        <section className="tl-min-section">
          <h2>Activities</h2>
          <ul className="tl-min-bullets">
            {activities.map((a, i) => (
              <li key={i}>
                {a.title}
                {has(a.period) && <span className="tl-min-activity-period"> ({a.period})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {references.length > 0 && (
        <section className="tl-min-section tl-min-last">
          <h2>References</h2>
          <div className="tl-min-refs">
            {references.map((r, i) => (
              <div className="tl-min-ref" key={i}>
                <strong>{r.name}</strong>
                <span>{[r.role, r.contact].filter(has).join(' — ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   6 · BOLD & BLUE — navy hero, amber accents
───────────────────────────────────────────── */
function BoldTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, experience, activities, references } = cv;
  const contacts = contactRows(personal);
  return (
    <div className="tl tl-bold" data-template="bold">
      <header className="tl-bold-hero">
        <CvAvatar photo={personal.photo} name={personal.fullName} size={96} className="tl-bold-avatar" />
        <div className="tl-bold-hero-text">
          <h1>{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
          {has(personal.role) && <p className="tl-bold-role">{personal.role}</p>}
          {contacts.length > 0 && (
            <div className="tl-bold-contacts">
              {contacts.map((c) => (
                <span className="tl-bold-contact" key={c.value}>
                  <Icon name={c.icon} size={11} /> {c.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="tl-bold-body">
        <div className="tl-bold-col">
          {has(profile) && (
            <section className="tl-bold-section">
              <h2>Profile</h2>
              <p className="tl-bold-text">{profile}</p>
            </section>
          )}

          {education.length > 0 && (
            <section className="tl-bold-section">
              <h2>Education</h2>
              {education.map((e, i) => (
                <div className="tl-bold-item" key={i}>
                  <h3>{e.institution}</h3>
                  {has(e.period) && <span className="tl-bold-meta">{e.period}</span>}
                  {has(e.detail) && <p>{e.detail}</p>}
                </div>
              ))}
            </section>
          )}

          {experience.length > 0 && (
            <section className="tl-bold-section">
              <h2>Experience</h2>
              {experience.map((e, i) => (
                <div className="tl-bold-item" key={i}>
                  <h3>{e.title}</h3>
                  {has(e.period) && <span className="tl-bold-meta">{e.period}{has(e.company) ? ` · ${e.company}` : ''}</span>}
                  {has(e.detail) && <p>{e.detail}</p>}
                </div>
              ))}
            </section>
          )}

          {activities.length > 0 && (
            <section className="tl-bold-section">
              <h2>Activities</h2>
              <ul className="tl-bold-bullets">
                {activities.map((a, i) => (
                  <li key={i}>
                    {a.title}
                    {has(a.period) && <span className="tl-bold-activity-period"> · {a.period}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="tl-bold-col">
          {exams.map((exam, i) => (
            <section className="tl-bold-section" key={i}>
              <h2>Results</h2>
              <div className="tl-bold-exam">
                <h3>{exam.title}</h3>
                {has(exam.year) && <span className="tl-bold-meta">{exam.year}</span>}
                {exam.results?.length > 0 && (
                  <table className="tl-bold-table">
                    <tbody>
                      {exam.results.map((r, j) => (
                        <tr key={j}><td>{r[0]}</td><td>{r[1]}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          ))}

          {skills.length > 0 && (
            <section className="tl-bold-section">
              <h2>Skills</h2>
              <ul className="tl-bold-chips">
                {skills.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section className="tl-bold-section">
              <h2>Languages</h2>
              <ul className="tl-bold-chips">
                {languages.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </section>
          )}

          {references.length > 0 && (
            <section className="tl-bold-section">
              <h2>References</h2>
              {references.map((r, i) => (
                <div className="tl-bold-ref" key={i}>
                  <strong>{r.name}</strong>
                  {has(r.role) && <span>{r.role}</span>}
                  {has(r.contact) && <span>{r.contact}</span>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   7 · EXECUTIVE GREY — serif name, ruled lines
───────────────────────────────────────────── */
function ExecTemplate({ cv }) {
  const { personal, profile, skills, languages, education, exams, experience, activities, references } = cv;
  const contacts = contactRows(personal);
  return (
    <div className="tl tl-exec" data-template="exec">
      <div className="tl-exec-inner">
        <header className="tl-exec-head">
          <div>
            <h1>{has(personal.fullName) ? personal.fullName : 'Your Name'}</h1>
            {has(personal.role) && <p className="tl-exec-role">{personal.role}</p>}
          </div>
          <div className="tl-exec-contact">
            {contacts.map((c) => (
              <p key={c.value}>
                <Icon name={c.icon} size={11} /> {c.value}
              </p>
            ))}
          </div>
        </header>

        {has(profile) && (
          <section className="tl-exec-section">
            <h2>Profile</h2>
            <p className="tl-exec-text">{profile}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="tl-exec-section">
            <h2>Experience</h2>
            {experience.map((e, i) => (
              <div className="tl-exec-item" key={i}>
                <div className="tl-exec-item-head">
                  <h3>{e.title}</h3>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.company) && <p className="tl-exec-sub">{e.company}</p>}
                {has(e.detail) && <p className="tl-exec-text">{e.detail}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="tl-exec-section">
            <h2>Education</h2>
            {education.map((e, i) => (
              <div className="tl-exec-item" key={i}>
                <div className="tl-exec-item-head">
                  <h3>{e.institution}</h3>
                  {has(e.period) && <span>{e.period}</span>}
                </div>
                {has(e.detail) && <p className="tl-exec-text">{e.detail}</p>}
              </div>
            ))}
          </section>
        )}

        {exams.map((exam, i) => (
          <section className="tl-exec-section" key={i}>
            <h2>Results</h2>
            <div className="tl-exec-item">
              <div className="tl-exec-item-head">
                <h3>{exam.title}</h3>
                {has(exam.year) && <span>{exam.year}</span>}
              </div>
              {exam.results?.length > 0 && (
                <div className="tl-exec-grades">
                  {exam.results.map((r, j) => (
                    <span className="tl-exec-grade" key={j}>{r[0]} — <b>{r[1]}</b></span>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}

        {skills.length > 0 && (
          <section className="tl-exec-section">
            <h2>Skills</h2>
            <ul className="tl-exec-chips">
              {skills.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        {languages.length > 0 && (
          <section className="tl-exec-section">
            <h2>Languages</h2>
            <p className="tl-exec-text">{languages.join('  ·  ')}</p>
          </section>
        )}

        {activities.length > 0 && (
          <section className="tl-exec-section">
            <h2>Activities</h2>
            <ul className="tl-exec-bullets">
              {activities.map((a, i) => (
                <li key={i}>
                  {a.title}
                  {has(a.period) && <span className="tl-exec-activity-period"> ({a.period})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {references.length > 0 && (
          <section className="tl-exec-section tl-exec-last">
            <h2>References</h2>
            <div className="tl-exec-refs">
              {references.map((r, i) => (
                <div className="tl-exec-ref" key={i}>
                  <strong>{r.name}</strong>
                  <span>{[r.role, r.contact].filter(has).join(' — ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export const TEMPLATE_RENDERERS = {
  school: SchoolTemplate,
  modern: ModernTemplate,
  ocean: OceanTemplate,
  blush: BlushTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  exec: ExecTemplate,
};
