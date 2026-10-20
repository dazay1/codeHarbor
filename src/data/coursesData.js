// src/data/coursesData.js
export const INITIAL_TRACKS = [
  { id: 'web', name: 'Web Development', icon: 'Code', color: 'from-emerald-500 to-teal-600', active: true },
  { id: 'design', name: 'Graphic Design', icon: 'Palette', color: 'from-purple-500 to-pink-600', active: false },
  { id: 'cyber', name: 'Cybersecurity', icon: 'Shield', color: 'from-blue-500 to-indigo-600', active: false }
];

export const INITIAL_NODES = {
  web: [
    { id: 'w1', title: 'HTML Basics', desc: 'Tags & Structure', icon: 'Code', level: 1, completed: true, locked: false, totalLessons: 3, currentLesson: 3 },
    { id: 'w2', title: 'CSS Layouts', desc: 'Flexbox & Grid', icon: 'Layers', level: 2, completed: false, locked: false, totalLessons: 4, currentLesson: 1 },
    { id: 'w3', title: 'JavaScript DOM', desc: 'Interactivity', icon: 'Cpu', level: 3, completed: false, locked: true, totalLessons: 5, currentLesson: 0 },
    { id: 'w4', title: 'React Core', desc: 'Components & State', icon: 'Zap', level: 4, completed: false, locked: true, totalLessons: 6, currentLesson: 0 }
  ],
  design: [
    { id: 'd1', title: 'Color Theory', desc: 'Palette Harmonies', icon: 'Palette', level: 1, completed: true, locked: false, totalLessons: 3, currentLesson: 3 },
    { id: 'd2', title: 'Typography', desc: 'Fonts & Hierarchy', icon: 'Type', level: 2, completed: false, locked: false, totalLessons: 4, currentLesson: 2 },
    { id: 'd3', title: 'UI Layouts', desc: 'Grids & Alignment', icon: 'Layout', level: 3, completed: false, locked: true, totalLessons: 4, currentLesson: 0 }
  ],
  cyber: [
    { id: 'c1', title: 'Security Basics', desc: 'Passwords & Hash', icon: 'Lock', level: 1, completed: false, locked: false, totalLessons: 3, currentLesson: 1 },
    { id: 'c2', title: 'Network Fundamentals', desc: 'Ports & Protocols', icon: 'Globe', level: 2, completed: false, locked: true, totalLessons: 4, currentLesson: 0 }
  ]
};

export const MOCK_QUIZ = {
  id: 'quiz-w2',
  nodeTitle: 'CSS Layouts - Flexbox',
  question: 'Make the button centered both horizontally and vertically inside the flex container:',
  type: 'code', // 'code' | 'choice'
  initialCode: `<div style="display: flex; height: 120px; background: #334155;">\n  <button style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px;">\n    Click Me\n  </button>\n</div>`,
  expectedSnippets: ['justify-content: center', 'align-items: center'],
  choices: [
    { id: 'a', text: 'justify-content: center; align-items: center;', correct: true },
    { id: 'b', text: 'text-align: center; margin: auto;', correct: false },
    { id: 'c', text: 'float: center; display: inline;', correct: false }
  ]
};

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Alex Johnson', xp: 2450, streak: 14, avatar: '⚡' },
  { rank: 2, name: 'Sara Smith', xp: 2100, streak: 9, avatar: '🔥' },
  { rank: 3, name: 'You (Student)', xp: 1250, streak: 5, avatar: '🚀', isUser: true },
  { rank: 4, name: 'David Lee', xp: 980, streak: 3, avatar: '💻' },
  { rank: 5, name: 'Elena Rostova', xp: 820, streak: 2, avatar: '🎨' }
];