// ─────────────────────────────────────────────────────────────
// Template metadata — 7 CV designs
// ─────────────────────────────────────────────────────────────
export const TEMPLATES = [
  { id: 'school', name: 'School Leaver', accent: 'Slate & Sky', tags: ['School leaver', 'A/L results', 'Classic'], tagline: 'The classic two-column school leaver CV — dark sidebar, exam results, references.' },
  { id: 'modern', name: 'Modern Slate', accent: 'Indigo & Cyan', tags: ['Modern', 'Timeline', 'Any level'], tagline: 'Clean single-column layout with a strong header band and colour-coded sections.' },
  { id: 'ocean', name: 'Ocean Breeze', accent: 'Teal & Sand', tags: ['Fresh', 'Friendly', 'Any level'], tagline: 'Light and airy with a teal sidebar, soft cards and generous whitespace.' },
  { id: 'blush', name: 'Rosé Elegance', accent: 'Rose & Mauve', tags: ['Elegant', 'Soft', 'Creatives'], tagline: 'Warm rose-toned design with a serif headline — gentle, personal, polished.' },
  { id: 'minimal', name: 'Minimal Mono', accent: 'Mono black', tags: ['Minimal', 'Bold', 'Professionals'], tagline: 'Stripped-back monochrome CV with hairline dividers and typographic hierarchy.' },
  { id: 'bold', name: 'Bold & Blue', accent: 'Navy & Amber', tags: ['Bold', 'Corporate', 'Professionals'], tagline: 'Confident navy header, amber highlights and a two-column skill-friendly body.' },
  { id: 'exec', name: 'Executive Grey', accent: 'Graphite & Teal', tags: ['Executive', 'Serif', 'Professionals'], tagline: 'Understated executive sheet with a serif name, ruled lines and a refined feel.' },
];

export const DEFAULT_TEMPLATE_ID = 'school';

export const templateMeta = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

// ─────────────────────────────────────────────────────────────
// Field schema — what the form shows per section
// ─────────────────────────────────────────────────────────────
export const SECTION_SCHEMA = [
  {
    id: 'personal', label: 'Personal Info', icon: 'user', fields: [
      { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Kavindu Fernando', required: true },
      { key: 'role', label: 'Job title', type: 'text', placeholder: 'e.g. School Leaver' },
      { key: 'email', label: 'Email', type: 'text', placeholder: 'you@example.com' },
      { key: 'phone', label: 'Phone', type: 'text', placeholder: '+94 77 123 4567' },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Galle, Sri Lanka' },
      { key: 'dob', label: 'Date of birth', type: 'text', placeholder: '12 May 2005' },
      { key: 'photo', label: 'Photo', type: 'image' },
    ],
  },
  {
    id: 'profile', label: 'Profile Summary', icon: 'clipboard', fields: [
      { key: 'profile', label: 'About yourself', type: 'textarea', placeholder: 'Motivated and hardworking school leaver…' },
    ],
  },
  {
    id: 'skills', label: 'Skills', icon: 'bolt', fields: [
      { key: 'skills', label: 'Skills', type: 'tags', placeholder: 'Communication Skills, Computer Literacy, MS Office…' },
    ],
  },
  {
    id: 'languages', label: 'Languages', icon: 'globe', fields: [
      { key: 'languages', label: 'Languages', type: 'tags', placeholder: 'Sinhala (Native), English (Fluent)…' },
    ],
  },
  {
    id: 'education', label: 'Education', icon: 'grad', fields: [
      { key: 'education', label: 'School / Institute', type: 'list', itemLabel: 'Education entry', fields: [
        { key: 'institution', label: 'School / Institute', type: 'text', placeholder: 'St. Aloysius\u2019 College, Galle' },
        { key: 'period', label: 'Period', type: 'text', placeholder: '2011 – 2024' },
        { key: 'detail', label: 'Qualification / detail', type: 'text', placeholder: 'Completed G.C.E. A/L Examination (Commerce Stream)' },
      ] },
    ],
  },
  {
    id: 'exams', label: 'Exam Results', icon: 'chart', fields: [
      { key: 'exams', label: 'Exams & results', type: 'examList', itemLabel: 'Exam', itemFields: [
        { key: 'title', label: 'Exam name', type: 'text', placeholder: 'G.C.E. Advanced Level — Commerce Stream' },
        { key: 'year', label: 'Year', type: 'text', placeholder: '2024' },
      ] },
    ],
  },
  {
    id: 'experience', label: 'Experience', icon: 'briefcase', fields: [
      { key: 'experience', label: 'Work experience', type: 'list', itemLabel: 'Experience entry', fields: [
        { key: 'title', label: 'Job title', type: 'text', placeholder: 'e.g. Sales Assistant' },
        { key: 'company', label: 'Company', type: 'text', placeholder: 'e.g. ABC Traders (Pvt) Ltd' },
        { key: 'period', label: 'Period', type: 'text', placeholder: '2024 – Present' },
        { key: 'detail', label: 'What you did', type: 'textarea', placeholder: '• Served customers…' },
      ] },
    ],
  },
  {
    id: 'activities', label: 'Activities', icon: 'star', fields: [
      { key: 'activities', label: 'Activities & achievements', type: 'list', itemLabel: 'Activity', fields: [
        { key: 'title', label: 'Activity / achievement', type: 'text', placeholder: 'Secretary – School Commerce Society (2022–2024)' },
        { key: 'period', label: 'Period (optional)', type: 'text', placeholder: '2023' },
      ] },
    ],
  },
  {
    id: 'references', label: 'References', icon: 'people', fields: [
      { key: 'references', label: 'References', type: 'list', itemLabel: 'Reference', fields: [
        { key: 'name', label: 'Name', type: 'text', placeholder: 'Mr. Pradeep Samarasinghe' },
        { key: 'role', label: 'Position', type: 'text', placeholder: 'Principal, St. Aloysius\u2019 College, Galle' },
        { key: 'contact', label: 'Contact', type: 'text', placeholder: '+94 91 222 3344' },
      ] },
    ],
  },
];

export const SECTION_ORDER = SECTION_SCHEMA.map((s) => s.id);

// ─────────────────────────────────────────────────────────────
// Line-icon set (inline SVG, stroke based — consistent weight)
// ─────────────────────────────────────────────────────────────
const ICON_PATHS = {
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.8.7a2 2 0 0 1 1.7 2Z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 3-10 6L2 7',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  calendar: 'M8 2v4 M16 2v4 M3 9h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z',
};

export const Icon = ({ name, size = 16, strokeWidth = 1.8, className = '', style }) => {
  const d = ICON_PATHS[name] || ICON_PATHS.pin;
  return (
    <svg className={`cc-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={d} />
    </svg>
  );
};
