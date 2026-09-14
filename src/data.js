// Sample data so new users instantly see a finished CV.
// Every key maps to a component of the template JSX; only non-empty
// sections render, so partially filled CVs never show blank blocks.

export const sampleData = {
  personal: {
    fullName: 'Kavindu Fernando',
    role: 'School Leaver',
    email: 'kavindufernando@gmail.com',
    phone: '+94 77 123 4567',
    location: 'Galle, Sri Lanka',
    dob: '12 May 2005',
    photo: 'https://i.pravatar.cc/300?img=12',
  },
  profile:
    'Motivated and hardworking school leaver from Galle with excellent results in the Commerce stream. Seeking an entry-level opportunity to begin a professional career in accounting or business administration. A quick learner with strong communication skills and a positive attitude towards teamwork and responsibility.',
  skills: [
    'Communication Skills',
    'Computer Literacy',
    'MS Office Suite',
    'Team Work',
    'Time Management',
    'Internet & Email',
  ],
  languages: ['Sinhala (Native)', 'English (Fluent)', 'Tamil (Basic)'],
  education: [
    { institution: 'St. Aloysius\u2019 College, Galle', period: '2011 – 2024', detail: 'Completed G.C.E. Advanced Level Examination (Commerce Stream)' },
  ],
  exams: [
    {
      title: 'G.C.E. Advanced Level — Commerce Stream',
      year: '2024',
      results: [['Accounting', 'A'], ['Business Studies', 'B'], ['Economics', 'A'], ['General English', 'A']],
    },
    {
      title: 'G.C.E. Ordinary Level Examination',
      year: '2021',
      results: [['Mathematics', 'A'], ['Science', 'A'], ['English', 'A'], ['Sinhala', 'B'], ['History', 'B'], ['ICT', 'A'], ['Commerce', 'A'], ['Buddhism', 'A'], ['Drama', 'C']],
    },
  ],
  experience: [],
  activities: [
    { title: 'Secretary – School Commerce Society (2022–2024)', period: '' },
    { title: 'Participated in Inter-school Cricket Tournament, Galle District (2023)', period: '' },
    { title: 'Volunteer – Community Cleaning Programme, Galle Municipal Council', period: '' },
    { title: 'Participated in National Child Parliament, Southern Province (2022)', period: '' },
  ],
  references: [
    { name: 'Mr. Pradeep Samarasinghe', role: 'Principal, St. Aloysius\u2019 College, Galle', contact: '+94 91 222 3344' },
    { name: 'Mrs. Chamari Weerasinghe', role: 'Commerce Teacher, St. Aloysius\u2019 College', contact: 'chamari.w@staloysius.lk' },
  ],
};

// Empty CV used by "Start fresh"
export const emptyData = {
  personal: { fullName: 'Your Name', role: 'Job Title', email: '', phone: '', location: '', dob: '', photo: '' },
  profile: '',
  skills: [],
  languages: [],
  education: [],
  exams: [],
  experience: [],
  activities: [],
  references: [],
};

export const sanitizeList = (v) =>
  Array.isArray(v)
    ? v.filter((item) =>
        typeof item === 'string'
          ? item.trim().length > 0
          : item && Object.values(item).some((x) => (typeof x === 'string' ? x.trim() : true)))
    : [];

export function normalizeData(data) {
  const base = data && typeof data === 'object' ? data : {};
  const personal = base.personal || {};
  const norm = {
    personal: {
      fullName: personal.fullName || '',
      role: personal.role || '',
      email: personal.email || '',
      phone: personal.phone || '',
      location: personal.location || '',
      dob: personal.dob || '',
      photo: personal.photo || '',
    },
    profile: base.profile || '',
    skills: sanitizeList(base.skills),
    languages: sanitizeList(base.languages),
    education: sanitizeList(base.education),
    exams: sanitizeList(base.exams).map((e) => ({
      ...e,
      results: Array.isArray(e.results)
        ? e.results.map((r) => (Array.isArray(r) ? r : [String(r[0] ?? ''), String(r[1] ?? '')])).filter((r) => r[0].trim())
        : [],
    })),
    experience: sanitizeList(base.experience),
    activities: sanitizeList(base.activities),
    references: sanitizeList(base.references),
  };
  return norm;
}
