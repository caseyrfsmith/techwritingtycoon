export const chaosEvents = [
  {
    id: 101,
    title: '🔥 Your best writer quits',
    description: 'Your senior technical writer just accepted a job at a competitor. They gave 2 weeks notice.',
    options: [
      { text: 'Counter-offer (+$1k/week salary)', effect: { budget: -20000 } },
      { text: 'Let them go, hire replacement', effect: { team: { techWriters: -1 } } },
      { text: 'Panic hire someone junior fast', effect: { budget: -8000, readerSat: -10 } }
    ]
  },
  {
    id: 102,
    title: '📝 Viral tweet about typo',
    description: 'Someone found a typo in your quick start guide. Their tweet has 50k views and counting. 😬',
    options: [
      { text: 'Fix immediately, apologize publicly', effect: { readerSat: -5, readers: 200 } },
      { text: 'Fix quietly, ignore the drama', effect: { readerSat: -10 } },
      { text: 'Turn it into a meme, own it', effect: { readerSat: 5, readers: 500, budget: -5000 } }
    ]
  },
  {
    id: 103,
    title: '🎯 Competitor poaches your content',
    description: 'A competitor copied your entire docs structure and some content. Word-for-word in places.',
    options: [
      { text: 'Hire lawyers (expensive)', effect: { budget: -40000, readerSat: -5 } },
      { text: 'Public callout on social media', effect: { readers: 300, readerSat: 10 } },
      { text: 'Flattered, focus on being better', effect: { readerSat: 5 } }
    ]
  },
  {
    id: 104,
    title: '💸 Budget cut by leadership',
    description: 'Company is tightening belts. Your docs budget is cut by 30% effective immediately.',
    options: [
      { text: 'Fight it with data', effect: { readerSat: -5 } },
      { text: 'Accept it, pivot strategy', effect: { budget: -100000 } },
      { text: 'Find creative revenue streams', effect: { revenue: 5000, readerSat: -5 } }
    ]
  },
  {
    id: 105,
    title: '🚀 Product launch chaos',
    description: 'Engineering shipped a major feature with ZERO docs. Launch is tomorrow. Marketing is furious.',
    options: [
      { text: 'All-nighter: rush basic docs', effect: { readerSat: -15, budget: -5000 } },
      { text: 'Delay launch to do it right', effect: { readerSat: 10, budget: -20000 } },
      { text: 'Video explainer instead', effect: { budget: -8000, readers: 300 } }
    ]
  },
  {
    id: 106,
    title: '⚡ API breaking changes with no warning',
    description: 'Engineering shipped breaking API changes. Half your docs are now wrong and users are confused.',
    options: [
      { text: 'Emergency docs sprint', effect: { budget: -15000, readerSat: -10 } },
      { text: 'Stagger updates over time', effect: { readerSat: -20 } },
      { text: 'Hire contractors for speed', effect: { budget: -30000, readerSat: -5 } }
    ]
  },
  {
    id: 107,
    title: '🐛 Security vulnerability disclosed',
    description: 'A security researcher found a critical vulnerability. You need emergency docs on mitigation ASAP.',
    options: [
      { text: 'Drop everything, write guide now', effect: { readerSat: 10, budget: -8000 } },
      { text: 'Let engineering handle comms', effect: { readerSat: -15 } },
      { text: 'Coordinate comprehensive response', effect: { budget: -12000, readerSat: 15 } }
    ]
  },
  {
    id: 108,
    title: '👥 Community member becomes toxic',
    description: 'A prolific forum contributor is being hostile to newcomers. It\'s driving people away.',
    options: [
      { text: 'Ban them immediately', effect: { readerSat: 5, readers: -50 } },
      { text: 'Private conversation first', effect: { budget: -3000, readerSat: 8 } },
      { text: 'Ignore it, focus on docs', effect: { readerSat: -12 } }
    ]
  },
  {
    id: 109,
    title: '📊 Analytics show major drop-off',
    description: 'Data shows 70% of users abandon docs at a specific page. Something is very wrong.',
    options: [
      { text: 'Emergency redesign of that section', effect: { budget: -10000, readerSat: 15 } },
      { text: 'A/B test different approaches', effect: { budget: -15000, readerSat: 20 } },
      { text: 'Add more examples and videos', effect: { budget: -8000, readerSat: 10 } }
    ]
  },
  {
    id: 110,
    title: '💻 Docs site goes down',
    description: 'Your docs hosting provider has a major outage. Docs have been down for 6 hours.',
    options: [
      { text: 'Switch providers immediately', effect: { budget: -25000, readerSat: -15 } },
      { text: 'Wait it out, they\'ll fix it', effect: { readerSat: -25 } },
      { text: 'Set up redundant hosting', effect: { budget: -40000, readerSat: -10 } }
    ]
  },
  {
    id: 111,
    title: '📢 CEO promises impossible timeline',
    description: 'Your CEO just promised comprehensive docs for a new product in 2 weeks. It normally takes 8.',
    options: [
      { text: 'Push back with realistic timeline', effect: { readerSat: -5, budget: -10000 } },
      { text: 'Deliver bare minimum on time', effect: { readerSat: -20, readers: 200 } },
      { text: 'Pull team from other projects', effect: { readerSat: -15, budget: -20000 } }
    ]
  },
  {
    id: 112,
    title: '🎨 Rebrand breaks everything',
    description: 'Marketing launched a rebrand. Every screenshot and branded element in docs is now outdated.',
    options: [
      { text: 'Update everything methodically', effect: { budget: -30000, readerSat: 5 } },
      { text: 'Prioritize high-traffic pages only', effect: { budget: -12000, readerSat: -5 } },
      { text: 'Add disclaimer and update slowly', effect: { readerSat: -15 } }
    ]
  },
  {
    id: 113,
    title: '🗣️ Influencer trashes your docs',
    description: 'A popular developer influencer made a video roasting your documentation. It\'s going viral.',
    options: [
      { text: 'Respond with humility, promise fixes', effect: { readerSat: -10, readers: 400 } },
      { text: 'Ignore the drama', effect: { readerSat: -20 } },
      { text: 'Invite them to collaborate', effect: { budget: -15000, readerSat: 10, readers: 800 } }
    ]
  },
  {
    id: 114,
    title: '⏰ Writer burnout crisis',
    description: 'Your team is exhausted. Two writers are on stress leave and morale is at an all-time low.',
    options: [
      { text: 'Mandatory time off for everyone', effect: { budget: -10000, readerSat: -15 } },
      { text: 'Hire temps to ease the load', effect: { budget: -25000, readerSat: -5 } },
      { text: 'Push through, promise breaks later', effect: { readerSat: -20, team: { techWriters: -1 } } }
    ]
  },
  {
    id: 115,
    title: '📱 Mobile experience is broken',
    description: 'Users report docs are unusable on mobile. 40% of your traffic is mobile.',
    options: [
      { text: 'Responsive redesign project', effect: { budget: -35000, readerSat: 20 } },
      { text: 'Mobile-specific docs site', effect: { budget: -50000, readerSat: 25 } },
      { text: 'Quick CSS fixes', effect: { budget: -8000, readerSat: 5 } }
    ]
  },
  {
    id: 116,
    title: '🤦 SME ghosted your review request',
    description: 'Your subject matter expert has ignored 12 review requests. Docs are blocked for 3 weeks now.',
    options: [
      { text: 'Escalate to their manager', effect: { readerSat: -10, budget: -5000 } },
      { text: 'Publish without review', effect: { readerSat: -15, readers: 100 } },
      { text: 'Find another SME', effect: { budget: -8000, readerSat: -5 } }
    ]
  },
  {
    id: 117,
    title: '🔄 Product team pivoted... again',
    description: 'Product just announced a "minor pivot." Half your docs are now about deprecated features.',
    options: [
      { text: 'Frantically rewrite everything', effect: { budget: -20000, readerSat: -20 } },
      { text: 'Archive old docs, start fresh', effect: { readerSat: -15, readers: -200 } },
      { text: 'Demand advance notice policy', effect: { readerSat: -10, budget: -5000 } }
    ]
  },
  {
    id: 118,
    title: '📧 SME sent back docs with "looks good 👍"',
    description: 'You know they didn\'t read it. The docs still have [INSERT DETAILS] placeholders.',
    options: [
      { text: 'Send it back with highlights', effect: { readerSat: -5 } },
      { text: 'Schedule review meeting', effect: { budget: -4000, readerSat: 5 } },
      { text: 'Just publish and hope', effect: { readerSat: -25 } }
    ]
  },
  {
    id: 119,
    title: '🎯 PM changed requirements mid-sprint',
    description: 'You\'re 80% done with docs when PM says "actually, we\'re doing it completely differently now."',
    options: [
      { text: 'Throw it all away, restart', effect: { budget: -15000, readerSat: -15 } },
      { text: 'Try to salvage what you can', effect: { budget: -8000, readerSat: -10 } },
      { text: 'Push back on timeline', effect: { readerSat: -5, readers: -100 } }
    ]
  },
  {
    id: 120,
    title: '🗣️ Engineer says "it\'s self-documenting"',
    description: 'Engineering insists their code is "self-documenting" and refuses to help with docs.',
    options: [
      { text: 'Learn it yourself (painful)', effect: { budget: -10000, readerSat: -20 } },
      { text: 'Get engineering director involved', effect: { budget: -5000, readerSat: -5 } },
      { text: 'Document what you can, flag gaps', effect: { readerSat: -15 } }
    ]
  },
  {
    id: 121,
    title: '📝 SME wrote "docs" in engineering jargon',
    description: 'Your SME "helped" by writing docs. They\'re completely incomprehensible to end users.',
    options: [
      { text: 'Rewrite from scratch', effect: { budget: -12000, readerSat: 10 } },
      { text: 'Edit heavily, try to salvage', effect: { budget: -6000, readerSat: 5 } },
      { text: 'Publish as "technical reference"', effect: { readerSat: -10 } }
    ]
  },
  {
    id: 122,
    title: '🏃 Last-minute feature before release',
    description: 'Engineering added a "small feature" yesterday. Release is tomorrow. It\'s not documented.',
    options: [
      { text: 'Emergency docs sprint', effect: { budget: -8000, readerSat: -15 } },
      { text: 'Basic placeholder, update later', effect: { readerSat: -10, readers: 150 } },
      { text: 'Delay release for proper docs', effect: { budget: -15000, readerSat: 5 } }
    ]
  },
  {
    id: 123,
    title: '💬 Sales promised custom docs',
    description: 'Sales promised a huge client custom documentation. You weren\'t consulted. Deal closes Friday.',
    options: [
      { text: 'Drop everything, deliver it', effect: { budget: -25000, readerSat: -20, enterpriseClients: 1 } },
      { text: 'Negotiate timeline', effect: { budget: -15000, readerSat: -10, enterpriseClients: 1 } },
      { text: 'Tell sales to renegotiate', effect: { readerSat: -15 } }
    ]
  },
  {
    id: 124,
    title: '🔍 Docs review meeting went off rails',
    description: 'Your docs review turned into a 2-hour debate about button colors. Zero docs decisions made.',
    options: [
      { text: 'Schedule follow-up with agenda', effect: { budget: -3000 } },
      { text: 'Make executive decision yourself', effect: { readerSat: -5, readers: 100 } },
      { text: 'Get manager to set boundaries', effect: { budget: -5000, readerSat: 5 } }
    ]
  },
  {
    id: 125,
    title: '📚 Marketing used technical terms wrong',
    description: 'Marketing\'s new campaign uses technical terms incorrectly. Users are confused. Docs team blamed.',
    options: [
      { text: 'Update docs to match marketing', effect: { readerSat: -20 } },
      { text: 'Get marketing to fix messaging', effect: { budget: -10000, readerSat: 5 } },
      { text: 'Add glossary to clarify', effect: { budget: -5000, readerSat: 10 } }
    ]
  },
  {
    id: 126,
    title: '⚠️ Engineering broke the docs site',
    description: 'An engineer "just pushed a small change" to the docs infrastructure. Now nothing builds.',
    options: [
      { text: 'Emergency rollback', effect: { budget: -8000, readerSat: -10 } },
      { text: 'Fix it yourself', effect: { budget: -12000, readerSat: -15 } },
      { text: 'Make them fix it', effect: { readerSat: -20, readers: -150 } }
    ]
  },
  {
    id: 127,
    title: '🎨 Designer wants to "reimagine" docs',
    description: 'A designer wants to completely redesign docs UI. "It\'ll be more engaging!" But unreadable.',
    options: [
      { text: 'Politely decline', effect: { readerSat: -5 } },
      { text: 'Let them try on one section', effect: { budget: -8000, readerSat: -10 } },
      { text: 'User test their ideas first', effect: { budget: -15000, readerSat: 15 } }
    ]
  },
  {
    id: 128,
    title: '📊 Analytics tool broke',
    description: 'Your docs analytics haven\'t tracked anything for 3 weeks. You just noticed. Leadership wants a report.',
    options: [
      { text: 'Scramble to fix and backfill', effect: { budget: -10000 } },
      { text: 'Present what data you have', effect: { readerSat: -5 } },
      { text: 'Switch to new analytics tool', effect: { budget: -20000, readerSat: 5 } }
    ]
  },
  {
    id: 129,
    title: '🤝 Cross-functional meeting hell',
    description: 'Your calendar is now 80% meetings. "Alignment meetings." "Sync meetings." "Meeting to plan meetings."',
    options: [
      { text: 'Decline half of them', effect: { readerSat: -10, budget: 5000 } },
      { text: 'Set office hours instead', effect: { readerSat: 10, budget: -5000 } },
      { text: 'Suffer through all of them', effect: { readerSat: -25, team: { techWriters: -1 } } }
    ]
  }
];

export const opportunityEvents = [
  {
    id: 201,
    title: '📰 Tech blog wants interview',
    description: 'A major tech publication wants to interview you about "docs as product." Big visibility opportunity.',
    options: [
      { text: 'Do it! Great marketing', effect: { readers: 500, readerSat: 10 } },
      { text: 'Too busy, decline', effect: {} },
      { text: 'Negotiate sponsored content', effect: { readers: 300, revenue: 5000, budget: -2000 } }
    ]
  },
  {
    id: 202,
    title: '🎪 Conference speaking slot',
    description: 'You\'ve been invited to speak at DevConf (10k attendees). Travel + prep time required.',
    options: [
      { text: 'Accept! Build the brand', effect: { readers: 800, budget: -8000, readerSat: 15 } },
      { text: 'Too expensive, decline', effect: {} },
      { text: 'Virtual presentation instead', effect: { readers: 400, budget: -2000, readerSat: 5 } }
    ]
  },
  {
    id: 203,
    title: '🤝 Strategic partnership offer',
    description: 'A complementary product wants to co-market. Joint webinar series, cross-promotion.',
    options: [
      { text: 'Partner up!', effect: { readers: 600, budget: -10000, enterpriseClients: 1 } },
      { text: 'Too risky, pass', effect: {} },
      { text: 'Limited trial partnership', effect: { readers: 200, budget: -3000 } }
    ]
  },
  {
    id: 204,
    title: '💼 Enterprise pilot program',
    description: 'Fortune 500 company wants to pilot your enterprise docs program. Could be huge reference.',
    options: [
      { text: 'Go all-in on this!', effect: { budget: -30000, enterpriseClients: 1, revenue: 25000 } },
      { text: 'Standard offering only', effect: { enterpriseClients: 1, revenue: 10000 } },
      { text: 'Not ready yet', effect: {} }
    ],
    requires: 'enterpriseSupport'
  },
  {
    id: 205,
    title: '🎓 University wants partnership',
    description: 'A major university wants to use your docs in their curriculum. Great PR, but needs maintenance.',
    options: [
      { text: 'Accept, dedicate resources', effect: { budget: -15000, readers: 1000, readerSat: 10 } },
      { text: 'Accept but minimal support', effect: { readers: 500 } },
      { text: 'Decline, stay focused', effect: {} }
    ]
  },
  {
    id: 206,
    title: '💰 Angel investor interested',
    description: 'An investor wants to fund your docs as a separate product. They\'re offering $500k for 20% equity.',
    options: [
      { text: 'Take the deal!', effect: { budget: 500000, revenue: 50000 } },
      { text: 'Counter: $300k for 10%', effect: { budget: 300000, revenue: 30000 } },
      { text: 'No thanks, stay independent', effect: { readerSat: 5 } }
    ]
  },
  {
    id: 207,
    title: '🏆 Docs award nomination',
    description: 'Your docs have been nominated for "Best Developer Documentation" at TechDocs Awards.',
    options: [
      { text: 'Campaign for votes', effect: { budget: -10000, readers: 600, readerSat: 15 } },
      { text: 'Just let it happen naturally', effect: { readers: 200, readerSat: 5 } },
      { text: 'Decline nomination, too busy', effect: {} }
    ]
  },
  {
    id: 208,
    title: '📚 Publisher wants to make a book',
    description: 'O\'Reilly wants to publish your docs as a technical book. Royalties + massive exposure.',
    options: [
      { text: 'Yes! This is huge', effect: { budget: -20000, readers: 1500, revenue: 10000 } },
      { text: 'Negotiate better terms', effect: { budget: -15000, readers: 1200, revenue: 15000 } },
      { text: 'Keep docs open and free', effect: { readerSat: 10 } }
    ]
  },
  {
    id: 209,
    title: '🎬 YouTube creator wants to collab',
    description: 'A tech YouTuber (500k subs) wants to create a tutorial series using your docs.',
    options: [
      { text: 'Full support with early access', effect: { budget: -8000, readers: 2000, readerSat: 20 } },
      { text: 'Standard support only', effect: { readers: 1000, readerSat: 10 } },
      { text: 'No special treatment', effect: { readers: 400 } }
    ]
  },
  {
    id: 210,
    title: '🌍 Open source foundation invite',
    description: 'A major open source foundation wants your docs to be the model for their ecosystem.',
    options: [
      { text: 'Accept! Open source FTW', effect: { budget: -25000, readers: 3000, readerSat: 25 } },
      { text: 'License but keep control', effect: { readers: 1500, revenue: 20000 } },
      { text: 'Politely decline', effect: {} }
    ]
  },
  {
    id: 211,
    title: '💡 Startup wants to white-label',
    description: 'A well-funded startup wants to white-label your docs platform for $100k.',
    options: [
      { text: 'Take the deal', effect: { budget: 100000, revenue: 30000 } },
      { text: 'Build it as a product', effect: { budget: -50000, revenue: 50000 } },
      { text: 'Not our focus', effect: {} }
    ]
  },
  {
    id: 212,
    title: '🎤 Podcast interview request',
    description: 'The top developer podcast wants you for a 2-hour deep dive on documentation.',
    options: [
      { text: 'Hell yes!', effect: { readers: 800, readerSat: 12 } },
      { text: 'Too time-consuming', effect: {} },
      { text: 'Counter with shorter format', effect: { readers: 400, readerSat: 6 } }
    ]
  },
  {
    id: 213,
    title: '🏢 Consulting opportunity',
    description: 'A Fortune 100 company will pay $75k for your team to consult on their docs strategy.',
    options: [
      { text: 'Accept, great revenue', effect: { budget: 75000, readerSat: -10 } },
      { text: 'Too distracting, decline', effect: {} },
      { text: 'Limited engagement only', effect: { budget: 40000, readerSat: -5 } }
    ]
  },
  {
    id: 214,
    title: '📖 Educational platform wants content',
    description: 'Udemy/Coursera wants to feature your docs-based course. Could reach 50k+ students.',
    options: [
      { text: 'Create the course', effect: { budget: -30000, readers: 5000, revenue: 25000 } },
      { text: 'License existing content', effect: { readers: 3000, revenue: 15000 } },
      { text: 'Keep focus on core docs', effect: {} }
    ]
  },
  {
    id: 215,
    title: '🚀 Accelerator program invite',
    description: 'Y Combinator invited you to pitch docs as a standalone product. Could change everything.',
    options: [
      { text: 'Go all in on this', effect: { budget: -50000, revenue: 100000, readers: 2000 } },
      { text: 'Explore but stay cautious', effect: { budget: -20000, revenue: 40000 } },
      { text: 'Not ready for this pivot', effect: {} }
    ]
  },
  {
    id: 216,
    title: '🌟 User wrote amazing testimonial',
    description: 'A developer wrote a glowing blog post about how your docs saved their project. It\'s trending on HN.',
    options: [
      { text: 'Feature it prominently', effect: { readers: 1000, readerSat: 15 } },
      { text: 'Share on social media', effect: { readers: 600, readerSat: 10 } },
      { text: 'Send them swag as thanks', effect: { budget: -1000, readers: 400, readerSat: 12 } }
    ]
  },
  {
    id: 217,
    title: '🎓 CS professor wants to teach with your docs',
    description: 'A Stanford professor wants to base their entire course on your documentation.',
    options: [
      { text: 'Create special student resources', effect: { budget: -12000, readers: 2000, readerSat: 20 } },
      { text: 'Offer education discount', effect: { readers: 1500, readerSat: 15 } },
      { text: 'Just say yes', effect: { readers: 1000, readerSat: 10 } }
    ]
  },
  {
    id: 218,
    title: '💡 Junior dev submitted amazing PR',
    description: 'A community member fixed a dozen typos and improved 3 examples. High quality contribution!',
    options: [
      { text: 'Merge and thank them publicly', effect: { readerSat: 10, readers: 200 } },
      { text: 'Invite them to be a maintainer', effect: { readerSat: 15, readers: 400 } },
      { text: 'Feature them in newsletter', effect: { budget: -2000, readerSat: 12, readers: 300 } }
    ]
  },
  {
    id: 219,
    title: '📈 Traffic spike from dev.to post',
    description: 'Someone wrote a tutorial using your docs. It hit the front page of dev.to. Traffic is up 500%!',
    options: [
      { text: 'Reach out to collaborate more', effect: { budget: -5000, readers: 1500, readerSat: 15 } },
      { text: 'Optimize for the traffic', effect: { budget: -8000, readers: 2000, readerSat: 10 } },
      { text: 'Just enjoy the spike', effect: { readers: 1000, readerSat: 5 } }
    ]
  },
  {
    id: 220,
    title: '🏆 Team member nominated for docs award',
    description: 'One of your technical writers was nominated for "Technical Writer of the Year"!',
    options: [
      { text: 'Support their campaign', effect: { budget: -8000, readerSat: 15, readers: 500 } },
      { text: 'Celebrate with team bonus', effect: { budget: -15000, readerSat: 20 } },
      { text: 'Just congratulate them', effect: { readerSat: 5 } }
    ]
  },
  {
    id: 221,
    title: '🎯 Perfect satisfaction survey results',
    description: 'This quarter\'s user survey came back with 98% satisfaction. Users LOVE your docs.',
    options: [
      { text: 'Share results with leadership', effect: { readers: 300, readerSat: 10 } },
      { text: 'Case study about your process', effect: { budget: -10000, readers: 800, readerSat: 15 } },
      { text: 'Team celebration dinner', effect: { budget: -5000, readerSat: 12 } }
    ]
  },
  {
    id: 222,
    title: '🤝 Dream SME joined the company',
    description: 'A new engineer joined who actually LOVES writing docs. They\'re offering to help regularly.',
    options: [
      { text: 'Make them a docs champion', effect: { readerSat: 20, readers: 400 } },
      { text: 'Train them on your style guide', effect: { budget: -5000, readerSat: 25, readers: 500 } },
      { text: 'Give them a docs project', effect: { readerSat: 15, readers: 300 } }
    ]
  },
  {
    id: 223,
    title: '💰 Docs reduced support tickets by 60%',
    description: 'Support team reports tickets dropped dramatically since your new docs launched. They\'re thrilled!',
    options: [
      { text: 'Present ROI to leadership', effect: { budget: 25000, readerSat: 10 } },
      { text: 'Create support-specific docs', effect: { budget: -8000, readerSat: 20, readers: 300 } },
      { text: 'Collaborate on more improvements', effect: { budget: -12000, readerSat: 25 } }
    ]
  },
  {
    id: 224,
    title: '🌍 International community formed',
    description: 'Users are translating your docs into 5 languages voluntarily. A global community is forming!',
    options: [
      { text: 'Official translation program', effect: { budget: -20000, readers: 3000, readerSat: 25 } },
      { text: 'Support them with tools', effect: { budget: -10000, readers: 2000, readerSat: 20 } },
      { text: 'Just thank them publicly', effect: { readers: 1000, readerSat: 10 } }
    ]
  },
  {
    id: 225,
    title: '📚 Competitor cited you as inspiration',
    description: 'A major competitor publicly said your docs are the gold standard they\'re trying to match.',
    options: [
      { text: 'Write about your process', effect: { budget: -5000, readers: 1200, readerSat: 15 } },
      { text: 'Offer to share learnings', effect: { readers: 800, readerSat: 20 } },
      { text: 'Quietly appreciate it', effect: { readerSat: 10 } }
    ]
  },
  {
    id: 226,
    title: '🎊 Intern made breakthrough improvement',
    description: 'Your intern found a way to auto-generate code examples. This will save hundreds of hours!',
    options: [
      { text: 'Promote and fund the project', effect: { budget: -15000, readerSat: 25, readers: 500 } },
      { text: 'Offer them a full-time role', effect: { budget: -20000, readerSat: 20, readers: 400 } },
      { text: 'Roll it out gradually', effect: { budget: -8000, readerSat: 15, readers: 200 } }
    ]
  },
  {
    id: 227,
    title: '🎤 Dev influencer praised your docs',
    description: 'A tech influencer with 2M followers said your docs are "chef\'s kiss" in their latest video.',
    options: [
      { text: 'Partner with them for content', effect: { budget: -12000, readers: 4000, readerSat: 20 } },
      { text: 'Invite them to speak', effect: { budget: -8000, readers: 2500, readerSat: 15 } },
      { text: 'Just thank them', effect: { readers: 1500, readerSat: 10 } }
    ]
  },
  {
    id: 228,
    title: '💼 VC firm wants to invest in docs',
    description: 'A VC firm thinks "docs as a product" is the future. They want to fund your expansion.',
    options: [
      { text: 'Take the investment', effect: { budget: 250000, revenue: 50000, readers: 1000 } },
      { text: 'Negotiate better terms', effect: { budget: 150000, revenue: 35000, readers: 800 } },
      { text: 'Stay bootstrapped', effect: { readerSat: 5 } }
    ]
  },
  {
    id: 229,
    title: '🎯 Perfect timing on trend',
    description: 'Your recent docs update perfectly aligned with a new industry trend. You\'re suddenly the experts.',
    options: [
      { text: 'Create thought leadership content', effect: { budget: -10000, readers: 2000, readerSat: 20 } },
      { text: 'Host industry webinar', effect: { budget: -15000, readers: 2500, readerSat: 25 } },
      { text: 'Ride the wave', effect: { readers: 1000, readerSat: 10 } }
    ]
  }
];