// Scenario budgets cover the docs team; these are game balance assumptions.
export const scenarios = {
  startup: {
    name: "🚀 Startup",
    difficulty: "Medium",
    budget: 260000,
    description:
      "The product works. Onboarding doesn’t. Help new developers reach their first success before the next funding review.",
    mission: "Turn signups into successful developers.",
    tip: "Start with code examples and a use case library. Quality focus improves onboarding; growth focus brings new readers.",
    team: {
      techWriters: 2,
      contentDesigners: 1,
      videoProducers: 0,
      engineers: 1,
      educators: 0,
    },
    startingReaders: 300,
    startingSatisfaction: 55,
    startingContent: ["docsHome", "quickStart"],
    goals: { readers: 1500, satisfaction: 75, days: 90 },
    objective: {
      key: "activation",
      label: "Onboarding success",
      target: 65,
      unit: "%",
    },
    weeklyFunding: 0,
  },
  enterprise: {
    name: "🏢 Enterprise",
    difficulty: "Hard",
    budget: 650000,
    description:
      "Thousands of readers. Years of scattered knowledge. Make the docs reliable and take pressure off the support team.",
    mission: "Make self-service support actually work.",
    tip: "Troubleshooting and a forum reduce support demand. Build in parallel with your larger team, then focus on quality.",
    team: {
      techWriters: 4,
      contentDesigners: 2,
      videoProducers: 1,
      engineers: 2,
      educators: 1,
    },
    startingReaders: 2500,
    startingSatisfaction: 45,
    startingContent: [
      "docsHome",
      "docsLanding",
      "quickStart",
      "apiReference",
      "comparison",
    ],
    goals: { readers: 5500, satisfaction: 85, days: 90 },
    objective: {
      key: "supportDeflection",
      label: "Support requests avoided",
      target: 60,
      unit: "%",
    },
    weeklyFunding: 0,
  },
  opensource: {
    name: "🌍 Open source",
    difficulty: "Hard",
    budget: 210000,
    description:
      "A useful project with a stretched maintainer team. Welcome contributors and turn a small community into a sustainable one.",
    mission: "Build a community that can share the work.",
    tip: "Build the forum and contributor program. Community focus recruits contributors; sponsors help cover payroll.",
    team: {
      techWriters: 1,
      contentDesigners: 0,
      videoProducers: 0,
      engineers: 1,
      educators: 0,
    },
    startingReaders: 600,
    startingSatisfaction: 60,
    startingContent: ["quickStart", "codeExamples"],
    goals: { readers: 2000, satisfaction: 75, days: 90 },
    objective: {
      key: "contributors",
      label: "Active contributors",
      target: 12,
      unit: "",
    },
    weeklyFunding: 2500,
    restrictions: { noAds: true, noPremium: true },
  },
  nightmare: {
    name: "🔥 Launch rescue",
    difficulty: "Extreme",
    budget: 185000,
    description:
      "Launch is coming up. The quick start is all you have. Prioritize the essential docs without burning through your budget.",
    mission: "Get the essential docs ready for launch.",
    tip: "Hire one writer, then build API reference, code examples, and troubleshooting. Protect quality before chasing traffic.",
    team: {
      techWriters: 1,
      contentDesigners: 0,
      videoProducers: 0,
      engineers: 1,
      educators: 0,
    },
    startingReaders: 150,
    startingSatisfaction: 40,
    startingContent: ["quickStart"],
    criticalContent: [
      "quickStart",
      "apiReference",
      "codeExamples",
      "troubleshooting",
    ],
    goals: { readers: 600, satisfaction: 70, days: 90 },
    objective: {
      key: "launchCoverage",
      label: "Launch essentials ready",
      target: 100,
      unit: "%",
    },
    weeklyFunding: 0,
  },
};

export const timelines = [
  { days: 30, label: "30 days" },
  { days: 60, label: "60 days" },
  { days: 90, label: "90 days" },
  { days: 180, label: "180 days" },
  { days: 365, label: "1 year" },
];

export const weeklyFocuses = {
  balanced: { label: "Balanced", description: "Steady growth and quality." },
  growth: {
    label: "Growth",
    description: "50% more new readers; slower quality gains.",
  },
  quality: {
    label: "Quality",
    description:
      "+2 satisfaction and +0.5 support prevention/week; 25% fewer new readers.",
  },
  community: {
    label: "Community",
    description: "Recruit contributors with a live forum; slower growth.",
  },
  agents: {
    label: "Agents",
    description:
      "+20% new readers and +1 satisfaction with machine-readable docs.",
  },
};

// Build times are weeks. Staff are reserved until the project ships.
export const projectDurations = {
  docsHome: 1,
  searchSEO: 2,
  socialContent: 1,
  webinars: 2,
  docsLanding: 1,
  comparison: 2,
  useCaseLibrary: 2,
  productTours: 2,
  quickStart: 1,
  codeExamples: 2,
  videoTutorials: 3,
  interactiveDemo: 4,
  apiReference: 3,
  troubleshooting: 2,
  communityForum: 2,
  advancedGuides: 3,
  bestPractices: 2,
  certification: 4,
  contributorProgram: 2,
  markdownDocs: 2,
  llmsIndex: 1,
  openApiContract: 3,
  mcpTools: 4,
  agentTaskTests: 2,
  frequentlyAskedQuestions: 1,
  actionableErrors: 2,
};

// Readiness is a game score, not a claim about any particular AI crawler.
export const agentChecks = [
  {
    key: "markdownDocs",
    label: "Readable without a browser",
    points: 25,
    description:
      "Stable URLs, Markdown mirrors, and no JavaScript-only answers.",
    source: "https://llmstxt.org/",
  },
  {
    key: "llmsIndex",
    label: "A useful entry map",
    points: 10,
    description:
      "A curated llms.txt points to the important docs. An emerging convention, not a ranking guarantee.",
    source: "https://llmstxt.org/",
  },
  {
    key: "openApiContract",
    label: "Explicit API contracts",
    points: 25,
    description:
      "OpenAPI schemas document inputs, responses, authentication, and errors.",
    source: "https://spec.openapis.org/oas/v3.2.0.html",
  },
  {
    key: "mcpTools",
    label: "Tools that explain themselves",
    points: 15,
    description:
      "MCP tools include input/output schemas, scoped access, and clear error behavior.",
    source:
      "https://modelcontextprotocol.io/specification/2025-11-25/server/tools",
  },
  {
    key: "agentTaskTests",
    label: "Tasks tested end to end",
    points: 25,
    description:
      "Check whether an agent can find the right doc, run an example, and recover from an error.",
    source:
      "https://modelcontextprotocol.io/specification/2025-11-25/server/tools",
  },
];

// Achievements
export const achievements = {
  firstRevenue: {
    name: "💰 First dollar",
    description: "Generated your first revenue",
    icon: "💰",
  },
  noAds: {
    name: "🎯 Ad-free hero",
    description: "Win without enabling ads",
    icon: "🎯",
  },
  enterprise: {
    name: "🏢 Enterprise whisperer",
    description: "Signed 3+ enterprise clients",
    icon: "🏢",
  },
  perfectSat: {
    name: "⭐ Reader delight",
    description: "Achieved 95%+ reader satisfaction",
    icon: "⭐",
  },
  fastWin: {
    name: "⚡ Speed demon",
    description: "Win before halfway through your selected timeline",
    icon: "⚡",
  },
  budgetMaster: {
    name: "💎 Frugal genius",
    description: "Won with $200k+ budget remaining",
    icon: "💎",
  },
  teamSmall: {
    name: "🎪 Small team hero",
    description: "Won with 5 or fewer team members",
    icon: "🎪",
  },
  community: {
    name: "🌟 Community champion",
    description: "Enabled contributor program and forum",
    icon: "🌟",
  },
  certKing: {
    name: "🎓 Certification king",
    description: "100+ certifications issued",
    icon: "🎓",
  },
  survivor: {
    name: "🔥 Survivor",
    description: "Recovered from negative budget",
    icon: "🔥",
  },
  premium: {
    name: "👑 Premium power",
    description: "200+ premium subscribers",
    icon: "👑",
  },
  agentReady: {
    name: "🤖 Agents welcome",
    description: "Reach 75 agent readiness points",
    icon: "🤖",
  },
};

// Content touchpoints
export const touchpointData = {
  frequentlyAskedQuestions: {
    name: "Task-based how-to guides",
    cost: 6000,
    maintenance: 2,
    tooltip:
      "Give users clear steps for real tasks, informed by the issues support keeps seeing.",
    satisfactionBoost: 5,
    supportReduction: 5,
    requires: { techWriters: 1 },
  },
  actionableErrors: {
    name: "Actionable error messages",
    cost: 9000,
    maintenance: 3,
    tooltip:
      "Explain what went wrong, what to try next, and when to contact support. Stop the “something went wrong” dead ends.",
    satisfactionBoost: 6,
    churnReduction: 2,
    supportReduction: 9,
    requires: { techWriters: 1, engineers: 1 },
  },
  markdownDocs: {
    name: "Machine-readable docs",
    cost: 10000,
    maintenance: 2,
    tooltip:
      "Clean Markdown mirrors, stable URLs, and answers that don’t need a JavaScript scavenger hunt.",
    readerBoost: 40,
    satisfactionBoost: 5,
    requires: { techWriters: 1, engineers: 1 },
    category: "agents",
  },
  llmsIndex: {
    name: "llms.txt entry map",
    cost: 3000,
    maintenance: 1,
    tooltip:
      "Give agents a short map to useful docs. A helpful convention—not a magic SEO button.",
    satisfactionBoost: 2,
    requires: { techWriters: 1 },
    prerequisites: ["markdownDocs"],
    category: "agents",
  },
  openApiContract: {
    supportReduction: 5,
    name: "OpenAPI contracts",
    cost: 16000,
    maintenance: 3,
    tooltip:
      "Machine-readable inputs, auth, errors, and real examples. Guessing is not an integration strategy.",
    satisfactionBoost: 8,
    churnReduction: 3,
    requires: { techWriters: 1, engineers: 1 },
    prerequisites: ["apiReference"],
    category: "agents",
  },
  mcpTools: {
    name: "Documented MCP tools",
    cost: 22000,
    maintenance: 5,
    tooltip:
      "Expose useful tasks with clear schemas and scoped permissions. Your tools should explain what they actually do.",
    satisfactionBoost: 5,
    readerBoost: 30,
    requires: { techWriters: 1, engineers: 2 },
    prerequisites: ["openApiContract"],
    category: "agents",
  },
  agentTaskTests: {
    supportReduction: 5,
    name: "Agent task testing",
    cost: 8000,
    maintenance: 2,
    tooltip:
      "Try the docs with an agent: find an answer, run an example, recover from an error. Fix what fails.",
    satisfactionBoost: 8,
    churnReduction: 3,
    requires: { techWriters: 1, engineers: 1 },
    prerequisites: ["markdownDocs", "codeExamples"],
    category: "agents",
  },
  docsHome: {
    name: "Docs homepage",
    cost: 5000,
    maintenance: 0,
    impact: "+50 readers/week",
    tooltip: "First impression matters. Clean, modern homepage.",
    readerBoost: 50,
    requires: { techWriters: 1, contentDesigners: 1 },
  },
  searchSEO: {
    name: "SEO optimization",
    cost: 8000,
    maintenance: 2,
    impact: "+100 readers/week",
    tooltip:
      "AEO? GEO? Still SEO in a new hat. Help people—and their AI assistants—find useful answers.",
    readerBoost: 100,
    requires: { techWriters: 1 },
  },
  socialContent: {
    name: "Social media",
    cost: 12000,
    maintenance: 4,
    impact: "+150 readers/week",
    tooltip: "Twitter, LinkedIn, dev.to. Consistent presence builds awareness.",
    readerBoost: 150,
    requires: { contentDesigners: 1 },
  },
  webinars: {
    name: "Monthly webinars",
    cost: 15000,
    maintenance: 0,
    impact: "+200 readers/week",
    tooltip: "Live sessions show expertise.",
    readerBoost: 200,
    requires: { educators: 1, techWriters: 1 },
  },
  docsLanding: {
    name: "Landing pages",
    cost: 6000,
    maintenance: 1,
    impact: "+5% satisfaction",
    tooltip: "Dedicated pages per use case.",
    satisfactionBoost: 5,
    requires: { contentDesigners: 1 },
  },
  comparison: {
    name: "Comparison guides",
    cost: 10000,
    maintenance: 2,
    impact: "+8% satisfaction",
    tooltip: "Why us vs competitors - be honest.",
    satisfactionBoost: 8,
    requires: { techWriters: 2 },
  },
  useCaseLibrary: {
    name: "Use case library",
    cost: 12000,
    maintenance: 3,
    impact: "+10% satisfaction",
    tooltip: "Real examples help them see success.",
    satisfactionBoost: 10,
    requires: { techWriters: 2, contentDesigners: 1 },
  },
  productTours: {
    name: "Product tours",
    cost: 8000,
    maintenance: 1,
    impact: "-5% churn",
    tooltip: "Guided walkthroughs reduce drop-off.",
    churnReduction: 5,
    requires: { contentDesigners: 1 },
  },
  quickStart: {
    name: "Quick start guide",
    cost: 4000,
    maintenance: 4,
    impact: "+5% satisfaction",
    tooltip: "Get them to hello world FAST.",
    satisfactionBoost: 5,
    requires: { techWriters: 1 },
  },
  codeExamples: {
    supportReduction: 7,
    name: "Code examples",
    cost: 10000,
    maintenance: 3,
    impact: "+10% satisfaction",
    tooltip: "Copy-paste ready code. Show, don't tell.",
    satisfactionBoost: 10,
    requires: { engineers: 1, techWriters: 1 },
  },
  videoTutorials: {
    name: "Video tutorials",
    cost: 20000,
    maintenance: 5,
    impact: "+15% satisfaction",
    tooltip: "Some people learn better with video.",
    satisfactionBoost: 15,
    requires: { videoProducers: 1, techWriters: 1 },
  },
  interactiveDemo: {
    name: "Interactive sandbox",
    cost: 35000,
    maintenance: 8,
    impact: "+20% sat, -8% churn",
    tooltip: "Live playground. Expensive but powerful.",
    satisfactionBoost: 20,
    churnReduction: 8,
    requires: { engineers: 2, techWriters: 1 },
  },
  apiReference: {
    supportReduction: 5,
    name: "API reference",
    cost: 15000,
    maintenance: 4,
    impact: "+10% satisfaction",
    tooltip: "Complete, accurate API docs. The foundation.",
    satisfactionBoost: 10,
    requires: { techWriters: 2, engineers: 1 },
  },
  troubleshooting: {
    supportReduction: 18,
    name: "Troubleshooting",
    cost: 12000,
    maintenance: 6,
    impact: "-10% churn",
    tooltip: "Common problems + solutions.",
    churnReduction: 10,
    requires: { techWriters: 2 },
  },
  communityForum: {
    supportReduction: 12,
    name: "Community forum",
    cost: 8000,
    maintenance: 2,
    impact: "-8% churn",
    tooltip: "Users helping users. Scales well.",
    churnReduction: 8,
    requires: { techWriters: 1 },
  },
  advancedGuides: {
    name: "Advanced guides",
    cost: 18000,
    maintenance: 6,
    impact: "+12% satisfaction",
    tooltip: "Beyond basics. For power users.",
    satisfactionBoost: 12,
    requires: { techWriters: 3 },
  },
  bestPractices: {
    supportReduction: 8,
    name: "Best practices",
    cost: 10000,
    maintenance: 3,
    impact: "+15% satisfaction",
    tooltip: "Not just how, but how WELL.",
    satisfactionBoost: 15,
    requires: { techWriters: 2, contentDesigners: 1 },
  },
  certification: {
    name: "Certification",
    cost: 25000,
    maintenance: 8,
    impact: "+10% satisfaction",
    tooltip: "Formal training + testing.",
    satisfactionBoost: 10,
    requires: { educators: 2, techWriters: 2 },
  },
  contributorProgram: {
    name: "Contributor program",
    cost: 15000,
    maintenance: 10,
    impact: "+8% satisfaction",
    tooltip: "Open source the docs.",
    satisfactionBoost: 8,
    requires: { techWriters: 1, engineers: 1 },
  },
};

// Monetization
export const monetizationData = {
  freemium: {
    name: "Freemium",
    cost: 0,
    description: "Basic docs free",
    enabled: true,
  },
  premiumContent: {
    name: "Premium content",
    cost: 25000,
    description: "$25/month per subscriber. Requires advanced guides.",
  },
  enterpriseSupport: {
    name: "Enterprise support",
    cost: 50000,
    description:
      "$5,000/month per client. A staffed support offer attracts one client every four weeks.",
  },
  advertising: {
    name: "Advertising",
    cost: 5000,
    description:
      "$5 per 1,000 impressions. Small income; costs 1 satisfaction point each week.",
  },
  certificationFees: {
    name: "Certification fees",
    cost: 15000,
    description:
      "$200 per exam. Requires a certification program and educators.",
  },
  sponsoredContent: {
    name: "Sponsored content",
    cost: 10000,
    description:
      "Weekly sponsorship income scales with your audience. Requires social content or a forum.",
  },
};

// Team roles
export const teamRoles = [
  {
    key: "techWriters",
    label: "Technical writers",
    cost: 10000,
    salary: 2500,
    tooltip: "Core docs team. The foundation.",
  },
  {
    key: "contentDesigners",
    label: "Content designers",
    cost: 10000,
    salary: 2500,
    tooltip: "UX for docs. Information architecture.",
  },
  {
    key: "videoProducers",
    label: "Video producers",
    cost: 12000,
    salary: 3000,
    tooltip: "Create video content. High impact.",
  },
  {
    key: "engineers",
    label: "Engineers",
    cost: 12000,
    salary: 3000,
    tooltip: "Docs tooling, automation, API docs.",
  },
  {
    key: "educators",
    label: "Educators",
    cost: 9000,
    salary: 2000,
    tooltip: "Curriculum design, certification.",
  },
];

// Metric tooltips
export const metricTooltips = {
  activeReaders: "Total readers currently using your documentation.",
  readerSat: "Reader satisfaction. Higher satisfaction reduces churn.",
  churn: "Percentage of readers who stop using docs each week.",
  totalRevenue: "Cumulative revenue from all monetization streams.",
  budget: "Remaining budget. Decreases weekly from costs.",
};
