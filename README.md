# Tech Writing Tycoon

A documentation team strategy game built with React and Vite.

## Run locally

```sh
npm ci
npm run dev
```

## Play

Choose Startup, Enterprise, Open source, or Launch rescue and a 30-, 60-, 90-, 180-, or 365-day timeline. Budgets and mission targets scale with the selected plan.

Assign available staff to projects, choose a focus, then advance up to seven days. Projects take 7–28 days; their benefits start when they ship. Auto-play is optional. Events pause time until you decide.

Win by reaching the reader, satisfaction, and scenario-specific milestones within budget. Revenue is optional; any earned income unlocks First dollar. Funding and earnings are tracked separately.

Agent experience projects cover Markdown docs, llms.txt, OpenAPI, MCP, and task testing. Readiness is a simulated game score, with specification links in the app. It is not a measurement of a real website.

Progress saves locally in the browser. Returning to a saved game pauses auto-play.

## Checks

```sh
npm test
npm run lint
npm run build
```

`src/gameEngine.js` owns simulation rules, purchases, project scheduling, save repair, and event resolution. `src/gameData.js` defines scenarios and costs; these are gameplay assumptions rather than industry benchmarks.
