import presidentImg from '../images/PresidentTEDX.png';
import vicePresidentImg from '../images/VicePresidentTEDX.png';

export const EVENTS = [
  {
    id: 'resonance-2026', status: 'upcoming', theme: 'Resonance', year: 2026, date: '2026-11-14', venue: 'UMT Auditorium, Lahore',
    desc: 'A single day exploring the ideas that echo far beyond the room they were spoken in — from neuroscience to street art.',
    speakerCount: 12,
    schedule: [
      { time: '09:00 AM', title: 'Doors Open & Registration', desc: 'Check-in, badge collection, and morning coffee in the main foyer.' },
      { time: '10:00 AM', title: 'Opening Remarks', desc: 'Welcome address from the TEDxUMT Lahore organizing committee.' },
      { time: '10:30 AM', title: 'Session I — Signals', desc: 'Talks on communication, neuroscience, and the science of being heard.' },
      { time: '01:00 PM', title: 'Lunch & Networking', desc: 'A curated lunch break with structured networking activities.' },
      { time: '02:30 PM', title: 'Session II — Structures', desc: 'Talks on systems, architecture, and the invisible frameworks around us.' },
      { time: '05:00 PM', title: 'Closing & Reception', desc: 'Closing remarks followed by an evening reception in the courtyard.' }
    ]
  },
  {
    id: 'convergence-2025', status: 'past', theme: 'Convergence', year: 2025, date: '2025-11-08', venue: 'UMT Auditorium, Lahore',
    desc: 'Where disciplines met — engineers, poets, and policymakers shared one stage to talk about collision as progress.',
    speakerCount: 10, gallery: 9
  },
  {
    id: 'genesis-2024', status: 'past', theme: 'Genesis', year: 2024, date: '2024-11-02', venue: 'UMT Auditorium, Lahore',
    desc: 'The first chapter — TEDxUMT Lahore\'s inaugural exploration of beginnings, origins, and first principles.',
    speakerCount: 8, gallery: 12
  }
];

export const SPEAKERS = [
  {
    id: 'amina-raza', name: 'Dr. Amina Raza', profession: 'Cognitive Neuroscientist', topic: 'The Architecture of Memory', event: 'Resonance 2026', seed: 'sp1',
    bio: 'Dr. Amina Raza studies how the brain encodes long-term memory and what that means for how we design education and technology.', org: 'LUMS School of Science & Engineering'
  },
  {
    id: 'hamza-tariq', name: 'Hamza Tariq', profession: 'Robotics Engineer', topic: 'Machines That Listen', event: 'Resonance 2026', seed: 'sp2',
    bio: 'Hamza builds assistive robotics for low-resource clinics across Pakistan, focused on machines that adapt to people, not the other way around.', org: 'NUST Robotics Lab'
  },
  {
    id: 'sana-idris', name: 'Sana Idris', profession: 'Urban Designer', topic: 'Cities That Remember', event: 'Resonance 2026', seed: 'sp3',
    bio: 'Sana designs public spaces that preserve collective memory in fast-growing South Asian cities.', org: 'Studio Meridian'
  },
  {
    id: 'bilal-siddiqui', name: 'Bilal Siddiqui', profession: 'Climate Economist', topic: 'The Cost of Silence', event: 'Resonance 2026', seed: 'sp4',
    bio: 'Bilal researches how climate risk gets systematically underpriced — and what that costs emerging economies.', org: 'Institute for Policy Research'
  },
  {
    id: 'zainab-farooq', name: 'Zainab Farooq', profession: 'Composer & Sound Artist', topic: 'Frequencies of Belonging', event: 'Convergence 2025', seed: 'sp5',
    bio: 'Zainab composes soundscapes from field recordings across Punjab, exploring what sound reveals about identity.', org: 'Independent Artist'
  },
  {
    id: 'ibrahim-khalid', name: 'Ibrahim Khalid', profession: 'AI Ethicist', topic: 'Who Trains the Trainer?', event: 'Convergence 2025', seed: 'sp6',
    bio: 'Ibrahim works at the intersection of machine learning governance and public policy in South Asia.', org: 'Centre for Digital Futures'
  },
  {
    id: 'noor-fatima', name: 'Noor Fatima', profession: 'Physician & Author', topic: 'The Body Keeps Time', event: 'Genesis 2024', seed: 'sp7',
    bio: 'Noor writes on the intersection of medicine and memory, drawing on a decade of clinical practice.', org: 'Shaukat Khanum Hospital'
  },
  {
    id: 'usman-ali', name: 'Usman Ali', profession: 'Social Entrepreneur', topic: 'Building Without Permission', event: 'Genesis 2024', seed: 'sp8',
    bio: 'Usman founded three ventures aimed at closing Pakistan\'s rural-urban opportunity gap.', org: 'Rasta Ventures'
  }
];

export const TEAM = {
  Executive: [
    { name: 'Ayesha Bint e Hamid', role: 'President', dept: 'Executive Board', seed: 't1', imgSrc: presidentImg },
    { name: 'Muhammad Ahmed', role: 'Vice President', dept: 'Executive Board', seed: 't2', imgSrc: vicePresidentImg },
  ],
  Operations: [
    { name: 'Talha Mir', role: 'Operations Lead', dept: 'Operations', seed: 't4' },
    { name: 'Areeba Sohail', role: 'Logistics Manager', dept: 'Operations', seed: 't5' }
  ],
  Marketing: [
    { name: 'Danish Aslam', role: 'Marketing Lead', dept: 'Marketing', seed: 't6' },
    { name: 'Hania Yousaf', role: 'Content Strategist', dept: 'Marketing', seed: 't7' }
  ],
  Design: [
    { name: 'Zara Malik', role: 'Creative Director', dept: 'Design', seed: 't8' },
    { name: 'Omar Farooq', role: 'Brand Designer', dept: 'Design', seed: 't9' }
  ],
  Media: [
    { name: 'Rida Aftab', role: 'Media Lead', dept: 'Media', seed: 't10' },
    { name: 'Junaid Sarwar', role: 'Videographer', dept: 'Media', seed: 't11' }
  ],
  Partnerships: [
    { name: 'Laiba Zahid', role: 'Partnerships Lead', dept: 'Partnerships', seed: 't12' }
  ]
};

export const BLOG = [
  {
    id: 'why-ideas-need-rooms', title: 'Why Good Ideas Still Need a Room to Live In', category: 'Reflections', date: 'Jul 12, 2026',
    excerpt: 'In an age of infinite feeds, the case for eighteen minutes, one stage, and an audience that showed up on purpose.', seed: 'b1', featured: true
  },
  {
    id: 'curating-resonance', title: 'Inside the Curation of Resonance', category: 'Behind the Scenes', date: 'Jun 28, 2026',
    excerpt: 'How our programming team narrowed 140 speaker applications down to twelve talks.', seed: 'b2'
  },
  {
    id: 'first-time-speaker-guide', title: 'A First-Time Speaker\'s Guide to the TEDx Stage', category: 'Guides', date: 'Jun 14, 2026',
    excerpt: 'What we tell every speaker in their first coaching session, distilled into five principles.', seed: 'b3'
  },
  {
    id: 'campus-to-stage', title: 'From Campus Society to Global Stage', category: 'Community', date: 'May 30, 2026',
    excerpt: 'A short history of how a student club became one of Lahore\'s most anticipated annual gatherings.', seed: 'b4'
  }
];

export const SPONSORS = {
  Title: [{ name: 'Meridian Bank' }],
  Gold: [{ name: 'Northline Tech' }, { name: 'Aurora Foods' }],
  Silver: [{ name: 'Bramble Coffee' }, { name: 'Vantage Media' }, { name: 'Codeworks' }]
};

export const FAQ = [
  { q: 'Where is TEDxUMT Lahore held?', a: 'Our flagship event is held at the UMT Auditorium on the University of Management and Technology campus in Lahore.' },
  { q: 'How can I apply to speak?', a: 'Visit the Apply page and submit the Speaker application. Our programming team reviews submissions on a rolling basis.' },
  { q: 'Is the event open to the public?', a: 'Yes — tickets are released ahead of each event and are open to students, faculty, and the general public.' },
  { q: 'How do I become a sponsor?', a: 'Head to the Sponsors page to review our packages, or reach out directly through the Contact form.' }
];

