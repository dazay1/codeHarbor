// Course catalogue. `cat` is used by the filter chips, `c` is the accent colour.
export const TRACKS = [
  { id: 'web', cat: 'web', c: 'var(--coral)', icon: 'web', name: 'Web Foundations', units: 5, level: { en: 'Beginner', uz: 'Boshlang‘ich' }, tag: 'HTML · CSS', pct: 40,
    desc: { en: 'Build your first real web pages with structure, colour and layout.', uz: 'Tuzilma, rang va maket bilan birinchi haqiqiy veb-sahifalaringizni yarating.' } },
  { id: 'js', cat: 'code', c: 'var(--amber)', icon: 'js', name: 'JavaScript', units: 8, level: { en: 'Intermediate', uz: 'O‘rta' }, tag: 'JS · DOM', pct: 0,
    desc: { en: 'Make pages react to clicks, forms and data.', uz: 'Sahifalarni bosish, forma va ma’lumotlarga javob beradigan qiling.' } },
  { id: 'py', cat: 'code', c: 'var(--cyan)', icon: 'term', name: 'Python', units: 7, level: { en: 'Beginner', uz: 'Boshlang‘ich' }, tag: 'Python', pct: 0,
    desc: { en: 'Automate tasks and solve problems one step at a time.', uz: 'Vazifalarni avtomatlashtiring va masalalarni bosqichma-bosqich yeching.' } },
  { id: 'ui', cat: 'design', c: 'var(--blue)', icon: 'pen', name: 'UI & Graphic Design', units: 6, level: { en: 'Beginner', uz: 'Boshlang‘ich' }, tag: 'Layout · Type', pct: 0,
    desc: { en: 'Colour, type and layout for apps, posters and brands.', uz: 'Ilovalar, plakatlar va brendlar uchun rang, shrift va maket.' } },
  { id: 'ai', cat: 'code', c: 'var(--ok)', icon: 'spark', name: 'AI Tools', units: 4, level: { en: 'Beginner', uz: 'Boshlang‘ich' }, tag: 'Prompting', pct: 0,
    desc: { en: 'Use AI to write, design and debug faster.', uz: 'AI yordamida tezroq yozing, dizayn qiling va xatolarni toping.' } },
  { id: 'sc', cat: 'kids', c: 'var(--amber)', icon: 'blocks', name: 'Scratch for Kids', units: 6, level: { en: 'Ages 7–10', uz: '7–10 yosh' }, tag: 'Scratch 3', pct: 0,
    desc: { en: 'Drag blocks, make games and learn how programs think.', uz: 'Bloklarni suring, o‘yin yarating va dasturlar qanday fikrlashini o‘rganing.' } },
];

export const FILTERS = [
  ['all', 'f_all'],
  ['web', 'f_web'],
  ['code', 'f_code'],
  ['design', 'f_design'],
  ['kids', 'f_kids'],
];

export const LEADERBOARD = [
  { name: 'Binary', score: 5080, color: '#3EE6D2' },
  { name: 'Dilshod', score: 3000, color: '#FFB938' },
  { name: 'Madina', score: 1350, color: '#FF6B5A' },
  { name: 'Aziz', score: 1000, color: '#5B8CFF' },
];
