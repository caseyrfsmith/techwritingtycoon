// Game scenarios
export const scenarios = {
  startup: {
    name: '🚀 Startup mode',
    description: 'You\'re a docs team at a fast-growing startup. Move fast, iterate, find product-market fit.',
    budget: 500000,
    team: { techWriters: 2, contentDesigners: 1, videoProducers: 0, engineers: 1, educators: 0 },
    goals: { readers: 1000, revenue: 100000, satisfaction: 70, weeks: 26 },
    difficulty: 'Medium'
  },
  enterprise: {
    name: '🏢 Enterprise mode',
    description: 'Established company with high expectations. Quality over speed. Big budgets, bigger pressure.',
    budget: 1000000,
    team: { techWriters: 4, contentDesigners: 2, videoProducers: 1, engineers: 2, educators: 1 },
    goals: { readers: 2000, revenue: 500000, satisfaction: 85, weeks: 30 },
    difficulty: 'Hard'
  },
  opensource: {
    name: '🌍 Open source mode',
    description: 'Community-driven docs. Limited budget, but contributors can help. Stay true to open values.',
    budget: 150000,
    team: { techWriters: 1, contentDesigners: 0, videoProducers: 0, engineers: 1, educators: 0 },
    goals: { readers: 5000, revenue: 25000, satisfaction: 80, weeks: 35 },
    difficulty: 'Nightmare',
    restrictions: { noAds: true, noPremium: true }
  },
  nightmare: {
    name: '💀 Nightmare mode',
    description: 'Everything is on fire. Tiny budget. Unrealistic goals. Do your best.',
    budget: 100000,
    team: { techWriters: 1, contentDesigners: 0, videoProducers: 0, engineers: 0, educators: 0 },
    goals: { readers: 3000, revenue: 250000, satisfaction: 75, weeks: 20 },
    difficulty: 'EXTREME'
  }
};

// Achievements
export const achievements = {
  firstRevenue: { name: '💰 First dollar', description: 'Generated your first revenue', icon: '💰' },
  noAds: { name: '🎯 Ad-free hero', description: 'Hit revenue goal without enabling ads', icon: '🎯' },
  enterprise: { name: '🏢 Enterprise whisperer', description: 'Signed 3+ enterprise clients', icon: '🏢' },
  perfectSat: { name: '⭐ Reader delight', description: 'Achieved 95%+ reader satisfaction', icon: '⭐' },
  fastWin: { name: '⚡ Speed demon', description: 'Won in under 15 weeks', icon: '⚡' },
  budgetMaster: { name: '💎 Frugal genius', description: 'Won with $200k+ budget remaining', icon: '💎' },
  teamSmall: { name: '🎪 Small team hero', description: 'Won with 5 or fewer team members', icon: '🎪' },
  community: { name: '🌟 Community champion', description: 'Enabled contributor program and forum', icon: '🌟' },
  certKing: { name: '🎓 Certification king', description: '100+ certifications issued', icon: '🎓' },
  survivor: { name: '🔥 Survivor', description: 'Recovered from negative budget', icon: '🔥' },
  premium: { name: '👑 Premium power', description: '200+ premium subscribers', icon: '👑' }
};

// Content touchpoints
export const touchpointData = {
  docsHome: { 
    name: 'Docs homepage', 
    cost: 5000, 
    maintenance: 0, 
    impact: '+50 readers/week', 
    tooltip: 'First impression matters. Clean, modern homepage.', 
    readerBoost: 50,
    requires: { techWriters: 1, contentDesigners: 1 }
  },
  searchSEO: { 
    name: 'SEO optimization', 
    cost: 8000, 
    maintenance: 2, 
    impact: '+100 readers/week', 
    tooltip: 'Most devs start with Google. Be there.', 
    readerBoost: 100,
    requires: { techWriters: 1 }
  },
  socialContent: { 
    name: 'Social media', 
    cost: 12000, 
    maintenance: 4, 
    impact: '+150 readers/week', 
    tooltip: 'Twitter, LinkedIn, dev.to. Consistent presence builds awareness.', 
    readerBoost: 150,
    requires: { contentDesigners: 1 }
  },
  webinars: { 
    name: 'Monthly webinars', 
    cost: 15000, 
    maintenance: 0, 
    impact: '+200 readers/week', 
    tooltip: 'Live sessions show expertise.', 
    readerBoost: 200,
    requires: { educators: 1, techWriters: 1 }
  },
  docsLanding: { 
    name: 'Landing pages', 
    cost: 6000, 
    maintenance: 1, 
    impact: '+5% satisfaction', 
    tooltip: 'Dedicated pages per use case.', 
    satisfactionBoost: 5,
    requires: { contentDesigners: 1 }
  },
  comparison: { 
    name: 'Comparison guides', 
    cost: 10000, 
    maintenance: 2, 
    impact: '+8% satisfaction', 
    tooltip: 'Why us vs competitors - be honest.', 
    satisfactionBoost: 8,
    requires: { techWriters: 2 }
  },
  useCaseLibrary: { 
    name: 'Use case library', 
    cost: 12000, 
    maintenance: 3, 
    impact: '+10% satisfaction', 
    tooltip: 'Real examples help them see success.', 
    satisfactionBoost: 10,
    requires: { techWriters: 2, contentDesigners: 1 }
  },
  productTours: { 
    name: 'Product tours', 
    cost: 8000, 
    maintenance: 1, 
    impact: '-5% churn', 
    tooltip: 'Guided walkthroughs reduce drop-off.', 
    churnReduction: 5,
    requires: { contentDesigners: 1 }
  },
  quickStart: { 
    name: 'Quick start guide', 
    cost: 4000, 
    maintenance: 4, 
    impact: '+5% satisfaction', 
    tooltip: 'Get them to hello world FAST.', 
    satisfactionBoost: 5,
    requires: { techWriters: 1 }
  },
  codeExamples: { 
    name: 'Code examples', 
    cost: 10000, 
    maintenance: 3, 
    impact: '+10% satisfaction', 
    tooltip: 'Copy-paste ready code. Show, don\'t tell.', 
    satisfactionBoost: 10,
    requires: { engineers: 1, techWriters: 1 }
  },
  videoTutorials: { 
    name: 'Video tutorials', 
    cost: 20000, 
    maintenance: 5, 
    impact: '+15% satisfaction', 
    tooltip: 'Some people learn better with video.', 
    satisfactionBoost: 15,
    requires: { videoProducers: 1, techWriters: 1 }
  },
  interactiveDemo: { 
    name: 'Interactive sandbox', 
    cost: 35000, 
    maintenance: 8, 
    impact: '+20% sat, -8% churn', 
    tooltip: 'Live playground. Expensive but powerful.', 
    satisfactionBoost: 20, 
    churnReduction: 8,
    requires: { engineers: 2, techWriters: 1 }
  },
  apiReference: { 
    name: 'API reference', 
    cost: 15000, 
    maintenance: 4, 
    impact: '+10% satisfaction', 
    tooltip: 'Complete, accurate API docs. The foundation.', 
    satisfactionBoost: 10,
    requires: { techWriters: 2, engineers: 1 }
  },
  troubleshooting: { 
    name: 'Troubleshooting', 
    cost: 12000, 
    maintenance: 6, 
    impact: '-10% churn', 
    tooltip: 'Common problems + solutions.', 
    churnReduction: 10,
    requires: { techWriters: 2 }
  },
  communityForum: { 
    name: 'Community forum', 
    cost: 8000, 
    maintenance: 2, 
    impact: '-8% churn', 
    tooltip: 'Users helping users. Scales well.', 
    churnReduction: 8,
    requires: { contentDesigners: 1 }
  },
  advancedGuides: { 
    name: 'Advanced guides', 
    cost: 18000, 
    maintenance: 6, 
    impact: '+12% satisfaction', 
    tooltip: 'Beyond basics. For power users.', 
    satisfactionBoost: 12,
    requires: { techWriters: 3 }
  },
  bestPractices: { 
    name: 'Best practices', 
    cost: 10000, 
    maintenance: 3, 
    impact: '+15% satisfaction', 
    tooltip: 'Not just how, but how WELL.', 
    satisfactionBoost: 15,
    requires: { techWriters: 2, contentDesigners: 1 }
  },
  certification: { 
    name: 'Certification', 
    cost: 25000, 
    maintenance: 8, 
    impact: '+10% satisfaction', 
    tooltip: 'Formal training + testing.', 
    satisfactionBoost: 10,
    requires: { educators: 2, techWriters: 2 }
  },
  contributorProgram: { 
    name: 'Contributor program', 
    cost: 15000, 
    maintenance: 10, 
    impact: '+8% satisfaction', 
    tooltip: 'Open source the docs.', 
    satisfactionBoost: 8,
    requires: { techWriters: 2, engineers: 1 }
  }
};

// Monetization
export const monetizationData = {
  freemium: { name: 'Freemium', cost: 0, description: 'Basic docs free', enabled: true },
  premiumContent: { name: 'Premium content', cost: 25000, description: 'Paywalled advanced content' },
  enterpriseSupport: { name: 'Enterprise support', cost: 50000, description: 'White-glove support' },
  advertising: { name: 'Advertising', cost: 5000, description: 'Ads on docs pages' },
  certificationFees: { name: 'Certification fees', cost: 15000, description: 'Charge for exams' },
  sponsoredContent: { name: 'Sponsored content', cost: 10000, description: 'Partner content' }
};

// Team roles
export const teamRoles = [
  { key: 'techWriters', label: 'Technical writers', cost: 10000, salary: 2500, tooltip: 'Core docs team. The foundation.' },
  { key: 'contentDesigners', label: 'Content designers', cost: 10000, salary: 2500, tooltip: 'UX for docs. Information architecture.' },
  { key: 'videoProducers', label: 'Video producers', cost: 12000, salary: 3000, tooltip: 'Create video content. High impact.' },
  { key: 'engineers', label: 'Engineers', cost: 12000, salary: 3000, tooltip: 'Docs tooling, automation, API docs.' },
  { key: 'educators', label: 'Educators', cost: 9000, salary: 2000, tooltip: 'Curriculum design, certification.' }
];

// Metric tooltips
export const metricTooltips = {
  activeReaders: "Total readers currently using your documentation.",
  readerSat: "Reader satisfaction. Higher satisfaction reduces churn.",
  churn: "Percentage of readers who stop using docs each week.",
  totalRevenue: "Cumulative revenue from all monetization streams.",
  budget: "Remaining budget. Decreases weekly from costs."
};