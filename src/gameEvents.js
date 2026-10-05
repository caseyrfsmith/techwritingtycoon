// Events are deliberately small enough that one lucky draw cannot win a game.
export const gameEvents = [
  {
    id: "broken-example",
    title: "The example doesn’t compile",
    description:
      "A reader found a broken snippet. You can fix the root cause or publish a temporary workaround.",
    requiresContent: "codeExamples",
    options: [
      {
        text: "Test and repair the examples",
        effect: { budget: -4000, readerSat: 5 },
      },
      { text: "Publish a workaround", effect: { readerSat: -3 } },
      {
        text: "Use the team’s week to fix it",
        effect: { delay: 1, readerSat: 4 },
      },
    ],
  },
  {
    id: "release-change",
    title: "A feature changed after review",
    description:
      "Engineering changed the authentication flow. The docs need another pass before readers can trust them.",
    options: [
      {
        text: "Bring in a contractor",
        effect: { budget: -6000, readerSat: 3 },
      },
      {
        text: "Reassign the team for a week",
        effect: { delay: 1, readerSat: 5 },
      },
      { text: "Flag the gap and keep shipping", effect: { readerSat: -4 } },
    ],
  },
  {
    id: "reader-feedback",
    title: "Readers showed you where they get stuck",
    description:
      "Five usability sessions point to the same confusing step. A focused rewrite could make a real difference.",
    options: [
      {
        text: "Rewrite and test the flow",
        effect: { budget: -5000, readerSat: 6, activation: 4 },
      },
      {
        text: "Add a short explanation now",
        effect: { budget: -1500, readerSat: 2 },
      },
      { text: "Put it on the backlog", effect: {} },
    ],
  },
  {
    id: "community-pr",
    title: "Your first regular contributor",
    description:
      "A community member has sent three helpful fixes. They’re interested in doing more, with some guidance.",
    requiresContent: "communityForum",
    options: [
      {
        text: "Fund a small mentoring sprint",
        effect: { budget: -2500, contributors: 2, readerSat: 3 },
      },
      {
        text: "Welcome them with a starter issue",
        effect: { contributors: 1 },
      },
      {
        text: "Help them improve a tutorial",
        effect: { delay: 1, contributors: 2, readerSat: 4 },
      },
    ],
  },
  {
    id: "budget-review",
    title: "Leadership wants a progress update",
    description:
      "The next budget review is here. Show the work or spend the week gathering stronger evidence.",
    scenarios: ["startup", "enterprise", "nightmare"],
    options: [
      { text: "Show the shipped improvements", effect: { budget: 3000 } },
      {
        text: "Run another round of user research",
        effect: { budget: -3000, readerSat: 4 },
      },
      {
        text: "Ask the team to prepare the report",
        effect: { delay: 1, budget: 6000 },
      },
    ],
  },
  {
    id: "sponsor-match",
    title: "A sponsor will match community funding",
    description:
      "A company using the project offers a small grant. They want public progress updates, not a paywall.",
    scenarios: ["opensource"],
    options: [
      {
        text: "Accept the grant and reporting work",
        effect: { funding: 12000, delay: 1 },
      },
      { text: "Take a smaller unrestricted grant", effect: { funding: 6000 } },
      { text: "Stay independent", effect: { contributors: 1 } },
    ],
  },
  {
    id: "tutorial-spotlight",
    title: "A developer shared your tutorial",
    description:
      "Your guide is getting attention. Help the new arrivals succeed, or spend a little to reach more of them.",
    requiresContent: "quickStart",
    options: [
      {
        text: "Answer questions in the comments",
        effect: { readers: 120, readerSat: 3 },
      },
      { text: "Promote the guide", effect: { budget: -3000, readers: 250 } },
      { text: "Stay focused on the roadmap", effect: { readers: 50 } },
    ],
  },
  {
    id: "support-pattern",
    title: "Support spotted a recurring question",
    description:
      "One missing explanation is causing repeat tickets. The support team has examples you can use.",
    scenarios: ["enterprise"],
    options: [
      {
        text: "Write the answer together",
        effect: { budget: -3000, supportDeflection: 5, readerSat: 4 },
      },
      {
        text: "Make space for a support review",
        effect: { delay: 1, supportDeflection: 7 },
      },
      { text: "Add the question to the backlog", effect: { readerSat: -2 } },
    ],
  },
  {
    id: "launch-scope",
    title: "One more feature before launch?",
    description:
      "Product wants an extra integration guide. It could attract readers, but the essentials still need attention.",
    scenarios: ["nightmare"],
    options: [
      { text: "Keep the launch scope focused", effect: { readerSat: 3 } },
      {
        text: "Hire short-term help for the extra guide",
        effect: { budget: -8000, readers: 200 },
      },
      {
        text: "Shift the team to the extra work",
        effect: { delay: 1, readers: 150, readerSat: -2 },
      },
    ],
  },
  {
    id: "search-feedback",
    title: "Good answers, hard to find",
    description:
      "Readers like the content but can’t find it. A small navigation pass is cheaper than a full redesign.",
    options: [
      {
        text: "Fix labels and navigation",
        effect: { budget: -2500, readerSat: 4 },
      },
      { text: "Test a bigger restructure", effect: { delay: 1, readerSat: 6 } },
      { text: "Leave it for next quarter", effect: { readerSat: -3 } },
    ],
  },
  {
    id: "hiring-referral",
    title: "A writer comes recommended",
    description:
      "A trusted colleague referred a technical writer who can start now. Hiring adds permanent weekly costs.",
    options: [
      {
        text: "Hire them — $2,500/week ongoing",
        effect: { budget: -8000, team: { techWriters: 1 } },
      },
      {
        text: "Book a short editing engagement",
        effect: { budget: -3000, readerSat: 3 },
      },
      { text: "Keep the current team", effect: {} },
    ],
  },
  {
    id: "agent-wrong-version",
    title: "The agent found the wrong API version",
    description:
      "An agent copied an outdated parameter from an old guide. Clean version links and explicit contracts could prevent the next failure.",
    requiresContent: "markdownDocs",
    options: [
      {
        text: "Fix version labels and redirects",
        effect: { budget: -2500, readerSat: 4, activation: 3 },
      },
      {
        text: "Use the week to audit stale links",
        effect: { delay: 1, readerSat: 5 },
      },
      { text: "Add a warning to the old page", effect: { readerSat: 1 } },
    ],
  },
  {
    id: "agent-tool-error",
    title: "The MCP tool failed, but said “success”",
    description:
      "A tool returned a vague response after an authentication error. The agent carried on with the wrong assumption.",
    requiresContent: "mcpTools",
    options: [
      {
        text: "Fix the error schema and add a regression check",
        effect: { budget: -3000, readerSat: 5 },
      },
      {
        text: "Take a week for a full tool review",
        effect: { delay: 1, readerSat: 6 },
      },
      { text: "Document the limitation", effect: { readerSat: -2 } },
    ],
  },
];
