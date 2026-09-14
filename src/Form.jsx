import React, { useRef, useState } from 'react';
import { SECTION_SCHEMA } from './templates.jsx';
import { AppIcon } from './icons.jsx';

const GRADES = ['A', 'B', 'C', 'S', 'F', 'Distinction', 'Merit', 'Pass'];

function emptyItem(schema) {
  const out = {};
  schema.fields.forEach((f) => { out[f.key] = ''; });
  return out;
}

function Field({ field, children }) {
  return (
    <div className="field">
      <label className="field-label">
        {field.label}
        {field.required ? <span style={{ color: '#dc2626' }}> *</span> : null}
      </label>
      {children}
    </div>
  );
}

function TextControl({ field, value, onChange, onEnter }) {
  return (
    <Field field={field}>
      <input
        className="input"
        type="text"
        value={value || ''}
        placeholder={field.placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter(e); }}
      />
    </Field>
  );
}

function AreaControl({ field, value, onChange }) {
  return (
    <Field field={field}>
      <textarea
        className="input"
        value={value || ''}
        placeholder={field.placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={field.key === 'detail' ? 3 : 4}
      />
    </Field>
  );
}

/* Photo upload with local resize */
function resizeImage(file, maxDim = 720) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function PhotoControl({ field, value, onChange }) {
  const inputRef = useRef(null);
  return (
    <Field field={field}>
      <div className="photo-picker">
        {value ? (
          <img className="photo-thumb" src={value} alt="Profile" />
        ) : (
          <div className="photo-empty"><AppIcon name="user" size={26} /></div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <span className="btn btn-ghost file-btn" style={{ minHeight: 40 }}>
            <AppIcon name="camera" size={17} /> {value ? 'Change photo' : 'Upload photo'}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                try { onChange(await resizeImage(file)); } catch (err) { /* ignore */ }
                if (inputRef.current) inputRef.current.value = '';
              }}
            />
          </span>
          {value ? (
            <button className="link-btn" type="button" onClick={() => onChange('')}>
              <AppIcon name="trash" size={14} /> Remove photo
            </button>
          ) : (
            <p className="small-note">JPG or PNG. Stays on your device.</p>
          )}
        </div>
      </div>
    </Field>
  );
}

function TagsControl({ field, value, onChange }) {
  const [draft, setDraft] = useState('');
  const list = Array.isArray(value) ? value : [];
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...list, v]);
    setDraft('');
  };
  return (
    <Field field={field}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          type="text"
          value={draft}
          placeholder={field.placeholder || 'Type and press Enter'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          }}
        />
        <button type="button" className="btn btn-soft" onClick={add} aria-label="Add">
          <AppIcon name="plus" size={18} />
        </button>
      </div>
      {list.length > 0 && (
        <div className="chip-row" style={{ marginTop: 10 }}>
          {list.map((item, i) => (
            <span className="chip" key={`${item}-${i}`}>
              {item}
              <button type="button" aria-label={`Remove ${item}`} onClick={() => onChange(list.filter((_, j) => j !== i))}>✕</button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}

function ListControl({ field, value, onChange, sectionLabel }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <Field field={field}>
      {list.map((item, i) => (
        <div className="list-card" key={i}>
          <div className="list-card-head">
            <span className="list-card-title">{field.itemLabel} {i + 1}</span>
            <button className="link-btn" type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}>
              <AppIcon name="trash" size={14} /> Remove
            </button>
          </div>
          {field.fields.map((f) =>
            f.type === 'textarea' ? (
              <AreaControl
                key={f.key}
                field={f}
                value={item[f.key]}
                onChange={(v) => onChange(list.map((it, j) => (j === i ? { ...it, [f.key]: v } : it)))}
              />
            ) : (
              <TextControl
                key={f.key}
                field={f}
                value={item[f.key]}
                onChange={(v) => onChange(list.map((it, j) => (j === i ? { ...it, [f.key]: v } : it)))}
              />
            )
          )}
        </div>
      ))}
      <button
        className="add-btn"
        type="button"
        onClick={() => onChange([...list, emptyItem(field)])}
      >
        <AppIcon name="plus" size={17} /> Add {field.itemLabel.toLowerCase()}
      </button>
      {sectionLabel === 'Experience' && list.length === 0 && (
        <p className="small-note" style={{ marginTop: 8 }}>Tip: use “•” at the start of each bullet point in “What you did”.</p>
      )}
    </Field>
  );
}

function ExamListControl({ field, value, onChange }) {
  const exams = Array.isArray(value) ? value : [];
  const newExam = () => ({ title: '', year: '', results: [['', '']] });

  return (
    <Field field={field}>
      {exams.map((exam, ei) => (
        <div className="list-card" key={ei}>
          <div className="list-card-head">
            <span className="list-card-title">{field.itemLabel} {ei + 1}</span>
            <button className="link-btn" type="button" onClick={() => onChange(exams.filter((_, j) => j !== ei))}>
              <AppIcon name="trash" size={14} /> Remove
            </button>
          </div>
          <TextControl
            field={{ key: 'title', label: 'Exam name', type: 'text', placeholder: 'G.C.E. Advanced Level — Commerce Stream' }}
            value={exam.title}
            onChange={(v) => onChange(exams.map((e, j) => (j === ei ? { ...e, title: v } : e)))}
          />
          <TextControl
            field={{ key: 'year', label: 'Year', type: 'text', placeholder: '2024' }}
            value={exam.year}
            onChange={(v) => onChange(exams.map((e, j) => (j === ei ? { ...e, year: v } : e)))}
          />
          <div className="field">
            <label className="field-label">Subjects & grades</label>
            {(exam.results || []).map((row, ri) => (
              <div className="grade-row" key={ri}>
                <input
                  className="input"
                  type="text"
                  placeholder="Subject"
                  value={row[0] || ''}
                  onChange={(e) =>
                    onChange(exams.map((ex, j) =>
                      j === ei
                        ? { ...ex, results: ex.results.map((r, k) => (k === ri ? [e.target.value, r[1]] : r)) }
                        : ex))
                  }
                />
                <select
                  className="input grade-select"
                  value={row[1] || ''}
                  onChange={(e) =>
                    onChange(exams.map((ex, j) =>
                      j === ei
                        ? { ...ex, results: ex.results.map((r, k) => (k === ri ? [r[0], e.target.value] : r)) }
                        : ex))
                  }
                >
                  <option value="">Grade</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <button
                  className="grade-remove"
                  type="button"
                  aria-label="Remove row"
                  onClick={() =>
                    onChange(exams.map((ex, j) =>
                      j === ei ? { ...ex, results: ex.results.filter((_, k) => k !== ri) } : ex))
                  }
                >
                  <AppIcon name="x" size={15} />
                </button>
              </div>
            ))}
            <button
              className="btn btn-soft"
              type="button"
              style={{ minHeight: 40, fontSize: 13.5 }}
              onClick={() =>
                onChange(exams.map((ex, j) => (j === ei ? { ...ex, results: [...(ex.results || []), ['', '']] } : ex)))
              }
            >
              <AppIcon name="plus" size={16} /> Add subject
            </button>
          </div>
        </div>
      ))}
      <button className="add-btn" type="button" onClick={() => onChange([...exams, newExam()])}>
        <AppIcon name="plus" size={17} /> Add {field.itemLabel.toLowerCase()}
      </button>
    </Field>
  );
}

export default function Form({ cv, sectionId, onSectionChange }) {
  const schema = SECTION_SCHEMA.find((s) => s.id === sectionId);
  if (!schema) return null;
  const data = cv[sectionId];

  const patch = (key, value) =>
    onSectionChange(
      sectionId,
      Array.isArray(data) ? value : { ...(data && typeof data === 'object' ? data : {}), [key]: value }
    );

  return (
    <div>
      {schema.fields.map((field) => {
        switch (field.type) {
          case 'image':
            return <PhotoControl key={field.key} field={field} value={data[field.key]} onChange={(v) => patch(field.key, v)} />;
          case 'tags':
            return <TagsControl key={field.key} field={field} value={Array.isArray(data) ? data : []} onChange={(v) => patch(field.key, v)} />;
          case 'textarea':
            return <AreaControl key={field.key} field={field} value={data[field.key]} onChange={(v) => patch(field.key, v)} />;
          case 'list':
            return (
              <ListControl
                key={field.key}
                field={field}
                value={Array.isArray(data) ? data : []}
                onChange={(v) => patch(field.key, v)}
                sectionLabel={schema.label}
              />
            );
          case 'examList':
            return (
              <ExamListControl
                key={field.key}
                field={field}
                value={Array.isArray(data) ? data : []}
                onChange={(v) => patch(field.key, v)}
              />
            );
          default:
            return <TextControl key={field.key} field={field} value={data[field.key]} onChange={(v) => patch(field.key, v)} />;
        }
      })}
    </div>
  );
}
