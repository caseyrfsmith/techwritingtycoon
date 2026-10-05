import { test } from "node:test";
import assert from "node:assert/strict";
import { scenarios, projectDurations, touchpointData } from "./gameData.js";
import { gameEvents } from "./gameEvents.js";
import {
  createGame,
  advanceWeek,
  weeklyCosts,
  purchase,
  resolveEvent,
  projectBlock,
  projectCapacity,
  availableStaff,
  revenueBlock,
  agentReadiness,
  milestones,
  repairProjects,
  scenarioPlan,
  supportPrevention,
} from "./gameEngine.js";

const step = (state) => advanceWeek(state, { manual: true, events: false });

test("scenarios start with distinct audiences, assets, and missions", () => {
  const startup = createGame("startup", 42);
  startup.touchpoints.searchSEO.invested = true;
  const community = createGame("opensource", 42);
  assert.equal(community.touchpoints.searchSEO.invested, false);
  assert.equal(community.activeReaders, scenarios.opensource.startingReaders);
  assert.equal(community.budget, scenarios.opensource.budget);
  assert.notEqual(community.activeReaders, startup.activeReaders);
  assert.equal(community.isPaused, true);
  assert.equal(community.week, 0);
  assert.deepEqual(
    milestones(community).map((goal) => goal.key),
    ["activeReaders", "contributors", "readerSat"],
  );
});

test("projects reserve staff, finish on schedule, and only then publish", () => {
  const state = createGame("startup", 42);
  const started = purchase(state, "content", "codeExamples");
  assert.equal(started.budget, state.budget - 10000);
  assert.equal(started.touchpoints.codeExamples.invested, false);
  assert.equal(availableStaff(started).engineers, 0);
  const first = step(started);
  assert.equal(first.touchpoints.codeExamples.invested, false);
  assert.equal(first.projects[0].remaining, 1);
  const second = step(first);
  assert.equal(second.touchpoints.codeExamples.invested, true);
  assert.equal(availableStaff(second).engineers, 1);
  assert.equal(second.projects.length, 0);
  assert.deepEqual(second.report.completed, ["codeExamples"]);
});

test("duplicate projects and unavailable staff cannot spend money", () => {
  const started = purchase(
    createGame("startup", 42),
    "content",
    "codeExamples",
  );
  assert.equal(purchase(started, "content", "codeExamples"), started);
  assert.match(projectBlock(started, "markdownDocs"), /available engineers/);
  assert.equal(purchase(started, "content", "markdownDocs"), started);
  assert.equal(projectCapacity(started), 2);
});

test("agent infrastructure requires published foundations", () => {
  const state = createGame("startup", 42);
  assert.match(projectBlock(state, "llmsIndex"), /machine-readable/);
  assert.match(projectBlock(state, "openApiContract"), /api reference/);
  assert.equal(purchase(state, "content", "llmsIndex"), state);
  assert.equal(agentReadiness(state), 0);
  state.touchpoints.markdownDocs.invested = true;
  state.touchpoints.agentTaskTests.invested = true;
  state.touchpoints.openApiContract.invested = true;
  assert.equal(agentReadiness(state), 75);
  const next = step(state);
  assert.ok(next.achievements.includes("agentReady"));
  assert.ok(!milestones(next).some((goal) => goal.key === "agentReadiness"));
});

test("premium paywalls and ads stay disabled for open source", () => {
  const state = createGame("opensource", 42);
  assert.match(revenueBlock(state, "advertising"), /Unavailable/);
  assert.equal(purchase(state, "revenue", "advertising"), state);
  assert.equal(purchase(state, "revenue", "premiumContent"), state);
});

test("certification and premium revenue need real content", () => {
  const state = createGame("startup", 42);
  assert.equal(purchase(state, "revenue", "certificationFees"), state);
  assert.equal(purchase(state, "revenue", "premiumContent"), state);
  state.monetization.certificationFees.enabled = true;
  assert.equal(step(state).revenue, 0);
});

test("earned income replenishes cash, and any amount earns first dollar", () => {
  const state = createGame("startup", 42);
  state.monetization.advertising.enabled = true;
  const before = structuredClone(state);
  const next = step(state);
  assert.ok(next.revenue > 0);
  assert.equal(next.budget, state.budget - weeklyCosts(next) + next.revenue);
  assert.equal(next.totalRevenue, next.revenue);
  assert.ok(next.achievements.includes("firstRevenue"));
  assert.deepEqual(state, before);
});

test("funding increases cash without counting as earned revenue", () => {
  const state = createGame("opensource", 42);
  state.pendingEvent = gameEvents.find((event) => event.id === "sponsor-match");
  const before = structuredClone(state);
  const next = resolveEvent(state, 1);
  assert.equal(next.budget, state.budget + 6000);
  assert.equal(next.totalFunding, 6000);
  assert.equal(next.totalRevenue, 0);
  assert.ok(!next.achievements.includes("firstRevenue"));
  assert.deepEqual(state, before);
  const week = step(next);
  assert.equal(week.totalFunding, 6000 + scenarios.opensource.weeklyFunding);
});

test("event choices cannot spend unavailable cash", () => {
  const state = createGame("startup", 42);
  state.budget = 1000;
  state.pendingEvent = gameEvents.find((event) => event.id === "budget-review");
  assert.equal(resolveEvent(state, 1), state);
  assert.equal(resolveEvent(state, 0).budget, 4000);
});

test("events delay active projects and can complete the final-week mission", () => {
  let state = purchase(createGame("startup", 42), "content", "codeExamples");
  state.pendingEvent = gameEvents.find(
    (event) => event.id === "release-change",
  );
  const delayed = resolveEvent(state, 1);
  assert.equal(
    delayed.projects[0].remaining,
    projectDurations.codeExamples + 1,
  );
  assert.equal(state.projects[0].remaining, projectDurations.codeExamples);
  state = createGame("startup", 42);
  state.week = state.goalWeeks;
  state.elapsedDays = state.goalDays;
  state.activeReaders = state.goalReaders;
  state.readerSat = state.goalReaderSat - 2;
  state.touchpoints.codeExamples.invested = true;
  state.touchpoints.useCaseLibrary.invested = true;
  state.pendingEvent = gameEvents.find(
    (event) => event.id === "reader-feedback",
  );
  const won = resolveEvent(state, 0);
  assert.equal(won.outcome, "won");
  assert.equal(won.pendingEvent, null);
  assert.equal(won.isPaused, true);
});

test("wins take precedence over timeout, but bankruptcy cannot win", () => {
  const state = createGame("startup", 42);
  state.week = state.goalWeeks - 1;
  state.elapsedDays = state.goalDays - (state.goalDays % 7 || 7);
  state.activeReaders = 10000;
  state.readerSat = 100;
  state.touchpoints.codeExamples.invested = true;
  state.touchpoints.useCaseLibrary.invested = true;
  assert.equal(step(state).outcome, "won");
  state.budget = 0;
  assert.equal(step(state).outcome, "bankrupt");
});

test("revenue alone is not a win condition", () => {
  const state = createGame("startup", 42);
  state.totalRevenue = 1000000;
  assert.equal(step(state).outcome, null);
  assert.ok(!milestones(state).some((goal) => goal.key === "totalRevenue"));
});

test("manual play advances paused games; unresolved events and completed games stay frozen", () => {
  const state = createGame("startup", 42);
  assert.equal(advanceWeek(state), state);
  assert.equal(step(state).week, 1);
  state.pendingEvent = gameEvents[0];
  assert.equal(step(state), state);
  state.pendingEvent = null;
  state.outcome = "timeout";
  assert.equal(step(state), state);
});

test("seeded events are repeatable, contextual, and do not mutate state", () => {
  const state = createGame("nightmare", 42);
  state.week = 2;
  const before = structuredClone(state);
  const first = advanceWeek(state, { manual: true });
  const second = advanceWeek(state, { manual: true });
  assert.deepEqual(first, second);
  assert.ok(first.pendingEvent);
  assert.ok(
    !first.pendingEvent.scenarios ||
      first.pendingEvent.scenarios.includes(state.scenario),
  );
  assert.ok(
    !first.pendingEvent.requiresContent ||
      first.touchpoints[first.pendingEvent.requiresContent].invested,
  );
  assert.deepEqual(state, before);
});

const plans = {
  startup: [
    "codeExamples",
    "useCaseLibrary",
    "searchSEO",
    "bestPractices",
    "docsLanding",
    "productTours",
  ],
  enterprise: [
    "troubleshooting",
    "codeExamples",
    "socialContent",
    "bestPractices",
    "useCaseLibrary",
    "videoTutorials",
    "communityForum",
    "advancedGuides",
  ],
  opensource: [
    "communityForum",
    "searchSEO",
    "socialContent",
    "contributorProgram",
    "bestPractices",
    "useCaseLibrary",
    "docsLanding",
    "troubleshooting",
  ],
  nightmare: ["apiReference", "codeExamples", "troubleshooting", "searchSEO"],
};
for (const key of Object.keys(plans))
  for (const days of [30, 60, 90, 180, 365]) {
    test(`${key}: ${days}-day mission can be won without lucky events or earned revenue`, () => {
      let state = createGame(key, 42, days);
      let remaining = [...plans[key]];
      let focusSchedule = [];
      if (key === "nightmare" || key === "opensource")
        state = purchase(state, "team", "techWriters");
      if (key === "opensource" || (key === "nightmare" && days > 90))
        state = purchase(state, "team", "contentDesigners");
      if (key === "startup" && days >= 180) {
        state = purchase(state, "team", "engineers");
        remaining.push("interactiveDemo");
      }
      if (key === "startup" && days === 30)
        remaining = ["codeExamples", "searchSEO"];
      if (key === "enterprise" && days >= 180) remaining.push("searchSEO");
      if (key === "enterprise" && days === 30)
        remaining = ["troubleshooting", "codeExamples", "socialContent"];
      if (key === "opensource" && days === 30) {
        remaining = ["communityForum", "searchSEO", "socialContent"];
        focusSchedule = [
          "quality",
          "quality",
          "community",
          "community",
          "quality",
        ];
      }
      if (key === "nightmare" && days === 30)
        remaining = ["codeExamples", "searchSEO"];
      if (key === "nightmare" && days === 60)
        remaining = ["codeExamples", "troubleshooting", "searchSEO"];
      if (key === "nightmare" && days > 90)
        remaining.push("bestPractices", "useCaseLibrary", "docsLanding");
      for (let turn = 0; turn < state.goalWeeks && !state.outcome; turn++) {
        for (const project of [...remaining])
          if (!projectBlock(state, project)) {
            state = purchase(state, "content", project);
            remaining.splice(remaining.indexOf(project), 1);
          }
        state = {
          ...state,
          focus:
            focusSchedule[state.week] ||
            (state.readerSat < state.goalReaderSat + 1
              ? "quality"
              : key === "opensource" && state.contributors < state.goalObjective
                ? "community"
                : key === "enterprise" &&
                    state.supportDeflection < state.goalObjective
                  ? "quality"
                  : "growth"),
        };
        state = step(state);
      }
      assert.equal(state.outcome, "won", JSON.stringify(milestones(state)));
      assert.equal(state.totalRevenue, 0);
      assert.ok(state.budget >= 0);
      assert.ok(state.elapsedDays <= days);
    });
  }

test("every content project, including agent projects, has a finite build and can ship", () => {
  for (const [key, data] of Object.entries(touchpointData)) {
    assert.ok(
      Number.isInteger(projectDurations[key]) && projectDurations[key] > 0,
      `Missing build duration: ${key}`,
    );
    let state = createGame("enterprise", 42);
    state.activeReaders = 0;
    state.budget = 1000000;
    state.team.educators = 2;
    for (const content of Object.values(state.touchpoints))
      content.invested = true;
    state.touchpoints[key].invested = false;
    state = purchase(state, "content", key);
    assert.equal(state.projects.length, 1, `Could not start ${data.name}`);
    for (let week = 0; week < projectDurations[key]; week++)
      state = step(state);
    assert.equal(
      state.touchpoints[key].invested,
      true,
      `Could not finish ${data.name}`,
    );
    assert.equal(state.projects.length, 0);
  }
});

test("broken live and JSON-saved project timers recover without charging again", () => {
  const started = purchase(
    createGame("startup", 42),
    "content",
    "markdownDocs",
  );
  started.week = 1;
  started.projects[0].remaining = NaN;
  started.projects[0].duration = undefined;
  for (const state of [started, JSON.parse(JSON.stringify(started))]) {
    const before = structuredClone(state);
    const repaired = repairProjects(state);
    assert.equal(repaired.projects[0].duration, 2);
    assert.equal(repaired.projects[0].remaining, 1);
    assert.equal(repaired.budget, state.budget);
    assert.equal(step(repaired).touchpoints.markdownDocs.invested, true);
    assert.deepEqual(state, before);
  }
});

for (const days of [30, 60, 90, 180, 365])
  test(`${days}-day plans stop on the exact deadline`, () => {
    let state = createGame("startup", 42, days);
    state.goalReaders = 1000000000;
    state.budget = 1000000000;
    while (!state.outcome) {
      state = step(state);
      assert.ok(state.elapsedDays <= days);
    }
    assert.equal(state.outcome, "timeout");
    assert.equal(state.elapsedDays, days);
    assert.equal(state.week, Math.ceil(days / 7));
    assert.equal(state.report.turnDays, days % 7 || 7);
  });

test("partial final turns prorate payroll, funding, and project work", () => {
  let state = createGame("opensource", 42, 30);
  state.week = 4;
  state.elapsedDays = 28;
  state.goalReaders = 1000000000;
  state = purchase(state, "content", "markdownDocs");
  const next = step(state);
  assert.equal(next.elapsedDays, 30);
  assert.equal(next.report.turnDays, 2);
  assert.equal(next.report.costs, Math.round((weeklyCosts(state) * 2) / 7));
  assert.equal(next.report.funding, Math.round((state.weeklyFunding * 2) / 7));
  assert.equal(
    next.budget,
    state.budget - next.report.costs + next.report.funding,
  );
  assert.equal(Math.ceil(next.projects[0].remaining * 7), 12);
  assert.equal(repairProjects(next), next);
});

test("timeline targets and budgets scale while revenue stays optional", () => {
  const sprint = scenarioPlan("startup", 30);
  const year = scenarioPlan("startup", 365);
  assert.ok(sprint.budget < year.budget);
  assert.ok(sprint.goals.readers < year.goals.readers);
  assert.ok(sprint.objective.target < year.objective.target);
  assert.equal(scenarioPlan("nightmare", 30).objective.target, 50);
  assert.equal(scenarioPlan("nightmare", 90).objective.target, 100);
  assert.throws(() => scenarioPlan("startup", 18));
});

test("support project benefits start on publication and appear in the turn report", () => {
  const state = createGame("enterprise", 42);
  const before = structuredClone(state);
  const baseline = supportPrevention(state);
  const building = purchase(state, "content", "troubleshooting");
  assert.equal(supportPrevention(building).percent, baseline.percent);
  const first = step(building);
  assert.equal(supportPrevention(first).percent, baseline.percent);
  const shipped = step(first);
  assert.equal(supportPrevention(shipped).percent, baseline.percent + 18);
  assert.deepEqual(
    shipped.report.support,
    supportPrevention(shipped, shipped.report.turnDays),
  );
  assert.equal(
    shipped.report.support.potential,
    shipped.report.support.avoided + shipped.report.support.remaining,
  );
  assert.deepEqual(state, before);
});

test("Task-based how-to guides and actionable errors prevent requests across all scenarios", () => {
  let state = createGame("startup", 42);
  const baseline = supportPrevention(state).percent;
  state = step(purchase(state, "content", "frequentlyAskedQuestions"));
  assert.equal(supportPrevention(state).percent, baseline + 5);
  state = purchase(state, "content", "actionableErrors");
  state = step(state);
  assert.equal(supportPrevention(state).percent, baseline + 5);
  state = step(state);
  assert.equal(supportPrevention(state).percent, baseline + 14);
});

test("support estimates respect shorter turns and never exceed potential requests", () => {
  const state = createGame("startup", 42);
  state.activeReaders = 1000;
  state.missionBonus.supportDeflection = 100;
  const full = supportPrevention(state);
  const partial = supportPrevention(state, 2);
  assert.equal(full.percent, 90);
  assert.ok(partial.potential < full.potential);
  assert.ok(partial.avoided <= partial.potential);
  assert.equal(partial.remaining + partial.avoided, partial.potential);
});

test("existing live saves gain new support projects without losing investments", () => {
  const state = createGame("startup", 42);
  delete state.touchpoints.frequentlyAskedQuestions;
  delete state.touchpoints.actionableErrors;
  const repaired = repairProjects(state);
  assert.equal(repaired.touchpoints.frequentlyAskedQuestions.invested, false);
  assert.equal(repaired.touchpoints.actionableErrors.invested, false);
  assert.equal(repaired.touchpoints.quickStart.invested, true);
  assert.equal(repaired.budget, state.budget);
});
