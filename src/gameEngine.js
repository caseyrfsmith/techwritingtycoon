import {
  scenarios,
  achievements,
  teamRoles,
  touchpointData,
  monetizationData,
  projectDurations,
  agentChecks,
  timelines,
} from "./gameData.js";
import { gameEvents } from "./gameEvents.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const totalTeam = (state) =>
  Object.values(state.team).reduce((sum, count) => sum + count, 0);
const live = (state, key) => Boolean(state.touchpoints[key]?.invested);

export function scenarioPlan(key, days = 90) {
  const base = scenarios[key];
  if (!base || !timelines.some((timeline) => timeline.days === days))
    throw new Error("Unknown scenario or timeline");
  const factor = days / base.goals.days;
  const initialObjective =
    key === "opensource"
      ? 2
      : key === "startup"
        ? 35
        : key === "enterprise"
          ? 15
          : 25;
  const objectiveCap =
    key === "enterprise"
      ? 70
      : key === "startup"
        ? 95
        : key === "nightmare"
          ? 100
          : Infinity;
  let target = Math.min(
    objectiveCap,
    Math.ceil(
      initialObjective + (base.objective.target - initialObjective) * factor,
    ),
  );
  if (key === "nightmare") target = Math.min(100, Math.ceil(target / 25) * 25);
  return {
    ...base,
    budget: Math.round((base.budget * (0.35 + 0.65 * factor)) / 1000) * 1000,
    mission:
      key === "nightmare" && target < 100
        ? `Ship ${target / 25} of the 4 launch essentials.`
        : base.mission,
    goals: {
      days,
      readers: Math.round(
        base.startingReaders +
          (base.goals.readers - base.startingReaders) * factor,
      ),
      satisfaction: Math.min(
        95,
        Math.round(
          base.startingSatisfaction +
            (base.goals.satisfaction - base.startingSatisfaction) *
              Math.min(factor, 1.5),
        ),
      ),
    },
    objective: { ...base.objective, target },
  };
}

export function createGame(key = "startup", seed = Date.now(), days = 90) {
  const scenario = scenarioPlan(key, days);
  const state = {
    scenario: key,
    week: 0,
    elapsedDays: 0,
    isPaused: true,
    outcome: null,
    focus: "balanced",
    budget: scenario.budget,
    revenue: 0,
    weeklyFunding: scenario.weeklyFunding,
    totalRevenue: 0,
    totalFunding: 0,
    readerSat: scenario.startingSatisfaction,
    activeReaders: scenario.startingReaders,
    churn: 7,
    team: { ...scenario.team },
    touchpoints: Object.fromEntries(
      Object.keys(touchpointData).map((key) => [
        key,
        { invested: scenario.startingContent.includes(key) },
      ]),
    ),
    monetization: Object.fromEntries(
      Object.keys(monetizationData).map((key) => [
        key,
        { enabled: key === "freemium" },
      ]),
    ),
    projects: [],
    activity: [],
    report: null,
    achievements: [],
    pendingEvent: null,
    eventHistory: [],
    randomSeed: seed >>> 0,
    premiumSubscribers: 0,
    enterpriseClients: 0,
    certifications: 0,
    adImpressions: 0,
    activation: 35,
    supportDeflection: 10,
    contributors: key === "opensource" ? 2 : 0,
    launchCoverage: key === "nightmare" ? 25 : 0,
    missionBonus: { activation: 0, supportDeflection: 0 },
    goalReaders: scenario.goals.readers,
    goalReaderSat: scenario.goals.satisfaction,
    goalDays: scenario.goals.days,
    goalWeeks: Math.ceil(scenario.goals.days / 7),
    goalObjective: scenario.objective.target,
  };
  updateMission(state);
  return state;
}

export function weeklyCosts(state) {
  return (
    teamRoles.reduce(
      (sum, role) => sum + state.team[role.key] * role.salary,
      0,
    ) +
    Object.entries(state.touchpoints).reduce(
      (sum, [key, value]) =>
        sum + (value.invested ? touchpointData[key].maintenance * 100 : 0),
      0,
    )
  );
}

// Repair projects from saves created before all build durations were defined.
// JSON serializes NaN/undefined timing values as null or omitted properties.
export function repairProjects(state) {
  const missingContent = Object.keys(touchpointData).filter(
    (key) => !state.touchpoints[key],
  );
  if (missingContent.length)
    state = {
      ...state,
      touchpoints: {
        ...state.touchpoints,
        ...Object.fromEntries(
          missingContent.map((key) => [key, { invested: false }]),
        ),
      },
    };
  if (
    !Number.isFinite(state.goalDays) ||
    !Number.isFinite(state.elapsedDays) ||
    !Number.isFinite(state.goalObjective)
  ) {
    const plan = scenarioPlan(state.scenario, state.goalDays || 90);
    state = {
      ...state,
      goalDays: plan.goals.days,
      goalWeeks: Math.ceil(plan.goals.days / 7),
      elapsedDays: Math.min(state.week * 7, plan.goals.days),
      goalObjective: plan.objective.target,
    };
  }
  let changed = false;
  const projects = state.projects.map((project) => {
    const durationValid =
      Number.isFinite(project.duration) && project.duration > 0;
    const remainingValid =
      Number.isFinite(project.remaining) && project.remaining > 0;
    if (
      durationValid &&
      remainingValid &&
      project.remaining <= project.duration
    )
      return project;
    changed = true;
    const duration = durationValid
      ? project.duration
      : projectDurations[project.key];
    const started = state.activity.find((entry) =>
      entry.text.startsWith(
        `Started ${touchpointData[project.key].name.toLowerCase()} —`,
      ),
    );
    const startedWeek = project.startedWeek ?? started?.week ?? state.week;
    const remaining = remainingValid
      ? Math.min(project.remaining, duration)
      : Math.max(1, duration - Math.max(0, state.week - startedWeek));
    return { ...project, duration, remaining, startedWeek };
  });
  return changed ? { ...state, projects } : state;
}

export function projectCapacity(state) {
  return clamp(Math.floor(totalTeam(state) / 2), 1, 4);
}

export function availableStaff(state) {
  const staff = { ...state.team };
  state.projects.forEach((project) =>
    Object.entries(touchpointData[project.key].requires || {}).forEach(
      ([role, count]) => {
        staff[role] -= count;
      },
    ),
  );
  return staff;
}

export function revenueBlock(state, key) {
  const restrictions = scenarios[state.scenario].restrictions || {};
  if (
    (restrictions.noAds && key === "advertising") ||
    (restrictions.noPremium && key === "premiumContent")
  )
    return "Unavailable in this scenario";
  if (key === "premiumContent" && !live(state, "advancedGuides"))
    return "Publish advanced guides first";
  if (
    key === "enterpriseSupport" &&
    (!live(state, "troubleshooting") || state.team.techWriters < 2)
  )
    return "Needs troubleshooting and 2 writers";
  if (
    key === "certificationFees" &&
    (!live(state, "certification") || state.team.educators < 2)
  )
    return "Needs certification and 2 educators";
  if (
    key === "sponsoredContent" &&
    !live(state, "socialContent") &&
    !live(state, "communityForum")
  )
    return "Publish social content or a forum first";
  return "";
}

export function projectBlock(state, key) {
  if (state.touchpoints[key].invested) return "Already published";
  if (state.projects.some((project) => project.key === key))
    return "In progress";
  if (state.projects.length >= projectCapacity(state))
    return "Project slots full";
  const prerequisite = (touchpointData[key].prerequisites || []).find(
    (required) => !live(state, required),
  );
  if (prerequisite)
    return `Publish ${touchpointData[prerequisite].name.toLowerCase()} first`;
  const staff = availableStaff(state);
  const missing = Object.entries(touchpointData[key].requires || {}).filter(
    ([role, count]) => staff[role] < count,
  );
  if (missing.length)
    return `Needs ${missing.map(([role, count]) => `${count} available ${teamRoles.find((r) => r.key === role).label.toLowerCase()}`).join(", ")}`;
  if (state.budget < touchpointData[key].cost) return "Not enough budget";
  return "";
}

function addActivity(state, text) {
  return [{ week: state.week, text }, ...state.activity].slice(0, 12);
}

export function purchase(state, type, key) {
  state = repairProjects(state);
  if (state.outcome || state.pendingEvent) return state;
  const data =
    type === "team"
      ? teamRoles.find((role) => role.key === key)
      : type === "content"
        ? touchpointData[key]
        : monetizationData[key];
  if (!data || state.budget < data.cost) return state;
  if (type === "team")
    return {
      ...state,
      budget: state.budget - data.cost,
      team: { ...state.team, [key]: state.team[key] + 1 },
      activity: addActivity(state, `Hired ${data.label.toLowerCase()}.`),
    };
  if (type === "content") {
    if (projectBlock(state, key)) return state;
    return {
      ...state,
      budget: state.budget - data.cost,
      projects: [
        ...state.projects,
        {
          key,
          remaining: projectDurations[key],
          duration: projectDurations[key],
          startedWeek: state.week,
        },
      ],
      activity: addActivity(
        state,
        `Started ${data.name.toLowerCase()} — ${projectDurations[key] * 7} days.`,
      ),
    };
  }
  if (state.monetization[key].enabled || revenueBlock(state, key)) return state;
  return {
    ...state,
    budget: state.budget - data.cost,
    monetization: { ...state.monetization, [key]: { enabled: true } },
    activity: addActivity(state, `Enabled ${data.name.toLowerCase()}.`),
  };
}

export function milestones(state) {
  const scenario = scenarios[state.scenario];
  return [
    {
      key: "activeReaders",
      label: "Active readers",
      value: state.activeReaders,
      target: state.goalReaders,
      unit: "",
    },
    {
      ...scenario.objective,
      target: state.goalObjective,
      value: Math.floor(state[scenario.objective.key]),
    },
    {
      key: "readerSat",
      label: "Reader satisfaction",
      value: Math.floor(state.readerSat),
      target: state.goalReaderSat,
      unit: "%",
    },
  ];
}

export function agentReadiness(state) {
  return agentChecks.reduce(
    (score, check) => score + (live(state, check.key) ? check.points : 0),
    0,
  );
}

// These are simulated support volumes, scaled to audience size and turn length.
export function supportPrevention(state, days = 7) {
  const percent = clamp(
    10 +
      Object.entries(state.touchpoints).reduce(
        (sum, [key, content]) =>
          sum +
          (content.invested ? touchpointData[key].supportReduction || 0 : 0),
        0,
      ) +
      state.missionBonus.supportDeflection,
    0,
    90,
  );
  const potential = Math.ceil((state.activeReaders * 0.12 * days) / 7);
  const avoided = Math.round((potential * percent) / 100);
  return { percent, potential, avoided, remaining: potential - avoided };
}

function updateMission(state) {
  state.activation = clamp(
    20 +
      (live(state, "quickStart") ? 15 : 0) +
      (live(state, "codeExamples") ? 20 : 0) +
      (live(state, "productTours") ? 15 : 0) +
      (live(state, "useCaseLibrary") ? 10 : 0) +
      (live(state, "interactiveDemo") ? 20 : 0) +
      state.missionBonus.activation,
    0,
    100,
  );
  state.supportDeflection = supportPrevention(state).percent;
  const critical = scenarios[state.scenario].criticalContent || [];
  state.launchCoverage = critical.length
    ? Math.round(
        (100 * critical.filter((key) => live(state, key)).length) /
          critical.length,
      )
    : 0;
}

function finish(state, previous) {
  updateMission(state);
  const won = milestones(state).every((goal) => goal.value >= goal.target);
  const unlock = (key, condition) => {
    if (condition && !state.achievements.includes(key)) {
      state.achievements.push(key);
      state.activity = addActivity(
        state,
        `Achievement: ${achievements[key].name}`,
      );
    }
  };
  unlock("firstRevenue", state.totalRevenue > 0);
  unlock("noAds", won && !state.monetization.advertising.enabled);
  unlock("enterprise", state.enterpriseClients >= 3);
  unlock("perfectSat", state.readerSat >= 95);
  unlock("fastWin", won && state.elapsedDays < state.goalDays / 2);
  unlock("budgetMaster", won && state.budget >= 200000);
  unlock("teamSmall", won && totalTeam(state) <= 5);
  unlock(
    "community",
    live(state, "contributorProgram") && live(state, "communityForum"),
  );
  unlock("certKing", state.certifications >= 100);
  unlock("premium", state.premiumSubscribers >= 200);
  unlock("agentReady", agentReadiness(state) >= 75);
  unlock("survivor", previous.budget < 0 && state.budget >= 0);
  if (state.budget < 0) {
    state.outcome = "bankrupt";
  } else if (won) {
    state.outcome = "won";
  } else if (!state.pendingEvent && state.elapsedDays >= state.goalDays) {
    state.outcome = "timeout";
  }
  if (state.outcome) {
    state.isPaused = true;
    state.pendingEvent = null;
  }
  return state;
}

// State-owned randomness keeps React updater replays and seeded playtests consistent.
function random(state) {
  state.randomSeed = (Math.imul(state.randomSeed, 1664525) + 1013904223) >>> 0;
  return state.randomSeed / 4294967296;
}

export function advanceWeek(prev, { manual = false, events = true } = {}) {
  prev = repairProjects(prev);
  if ((!manual && prev.isPaused) || prev.pendingEvent || prev.outcome)
    return prev;
  const turnDays = Math.min(7, prev.goalDays - prev.elapsedDays);
  const fraction = turnDays / 7;
  const state = {
    ...prev,
    week: prev.week + 1,
    elapsedDays: prev.elapsedDays + turnDays,
    touchpoints: { ...prev.touchpoints },
    projects: [],
    achievements: [...prev.achievements],
    missionBonus: { ...prev.missionBonus },
    pendingEvent: null,
  };
  const staffed = { ...prev.team };
  const completed = [];
  for (const project of prev.projects) {
    const requirements = Object.entries(
      touchpointData[project.key].requires || {},
    );
    const canWork = requirements.every(
      ([role, count]) => staffed[role] >= count,
    );
    if (canWork)
      requirements.forEach(([role, count]) => {
        staffed[role] -= count;
      });
    const remaining = Math.max(0, project.remaining - (canWork ? fraction : 0));
    if (remaining <= 0) {
      state.touchpoints[project.key] = { invested: true };
      completed.push(project.key);
    } else state.projects.push({ ...project, remaining });
  }
  completed.forEach((key) => {
    state.activity = addActivity(
      state,
      `Shipped ${touchpointData[key].name.toLowerCase()}.`,
    );
  });
  const activeContent = Object.entries(state.touchpoints)
    .filter(([, content]) => content.invested)
    .map(([key]) => touchpointData[key]);
  const qualityTarget = Math.min(
    95,
    45 +
      activeContent.reduce(
        (sum, content) => sum + (content.satisfactionBoost || 0) * 0.6,
        0,
      ),
  );
  const qualityChange = clamp((qualityTarget - prev.readerSat) * 0.15, -2, 3);
  state.readerSat = clamp(
    prev.readerSat +
      (qualityChange +
        (prev.focus === "quality" ? 2 : prev.focus === "growth" ? -0.5 : 0.5) +
        (prev.focus === "agents" && live(state, "markdownDocs") ? 1 : 0)) *
        fraction +
      completed.length * 2,
    0,
    100,
  );
  state.churn = clamp(
    7 -
      activeContent.reduce(
        (sum, content) => sum + (content.churnReduction || 0) * 0.35,
        0,
      ) +
      (state.readerSat < 45 ? 3 : state.readerSat >= 75 ? -2 : 0),
    1,
    15,
  );
  const baseGrowth = prev.scenario === "enterprise" ? 120 : 60;
  const growth =
    baseGrowth +
    activeContent.reduce((sum, content) => sum + (content.readerBoost || 0), 0);
  const focusMultiplier =
    prev.focus === "agents" && live(state, "markdownDocs")
      ? 1.2
      : prev.focus === "growth"
        ? 1.5
        : prev.focus === "quality" || prev.focus === "community"
          ? 0.75
          : 1;
  state.activeReaders = Math.max(
    0,
    Math.round(
      (prev.activeReaders + growth * focusMultiplier * fraction) *
        (1 - state.churn / 100) ** fraction,
    ),
  );
  if (live(state, "communityForum"))
    state.contributors +=
      ((live(state, "contributorProgram") ? 1 : state.week % 2 === 0 ? 1 : 0) +
        (prev.focus === "community" ? 1 : 0)) *
      fraction;
  if (prev.focus === "quality")
    state.missionBonus.supportDeflection = Math.min(
      10,
      state.missionBonus.supportDeflection + 0.5 * fraction,
    );

  let revenue = 0;
  if (
    prev.monetization.premiumContent.enabled &&
    !revenueBlock(state, "premiumContent")
  ) {
    state.premiumSubscribers = Math.floor(state.activeReaders * 0.05);
    revenue += Math.round((state.premiumSubscribers * 25) / 4.33);
  }
  if (
    prev.monetization.enterpriseSupport.enabled &&
    !revenueBlock(state, "enterpriseSupport")
  ) {
    if (state.week % 4 === 0 && state.readerSat >= 60)
      state.enterpriseClients = Math.min(
        state.team.techWriters,
        prev.enterpriseClients + 1,
      );
    revenue += Math.round(
      (Math.min(state.enterpriseClients, state.team.techWriters) * 5000) / 4.33,
    );
  }
  if (
    prev.monetization.advertising.enabled &&
    !revenueBlock(state, "advertising")
  ) {
    state.adImpressions = state.activeReaders * 10;
    revenue += Math.floor(state.adImpressions * 0.005);
    state.readerSat = Math.max(0, state.readerSat - 1);
  }
  if (
    prev.monetization.certificationFees.enabled &&
    !revenueBlock(state, "certificationFees")
  ) {
    const candidates = Math.max(
      0,
      Math.floor(state.activeReaders * 0.2) - state.certifications,
    );
    const exams = Math.min(
      candidates,
      Math.floor(state.team.educators * 5 * fraction),
    );
    state.certifications += exams;
    revenue += Math.round((exams * 200) / fraction);
  }
  if (
    prev.monetization.sponsoredContent.enabled &&
    !revenueBlock(state, "sponsoredContent")
  )
    revenue += 200 + Math.floor(state.activeReaders * 0.12);
  state.revenue = revenue;
  const earned = Math.round(revenue * fraction);
  const funding = Math.round(state.weeklyFunding * fraction);
  state.totalRevenue += earned;
  state.totalFunding += funding;
  const costs = Math.round(weeklyCosts(state) * fraction);
  state.budget += earned + funding - costs;
  updateMission(state);

  if (
    events &&
    state.week % 3 === 0 &&
    state.budget >= 0 &&
    !milestones(state).every((goal) => goal.value >= goal.target)
  ) {
    const available = gameEvents.filter(
      (event) =>
        !state.eventHistory.includes(event.id) &&
        (!event.scenarios || event.scenarios.includes(state.scenario)) &&
        (!event.requiresContent || live(state, event.requiresContent)),
    );
    if (available.length)
      state.pendingEvent =
        available[Math.floor(random(state) * available.length)];
  }
  state.report = {
    week: state.week,
    elapsedDays: state.elapsedDays,
    turnDays,
    completed,
    readerDelta: state.activeReaders - prev.activeReaders,
    satisfactionDelta: state.readerSat - prev.readerSat,
    cashDelta: state.budget - prev.budget,
    revenue: earned,
    funding,
    costs,
    support: supportPrevention(state, turnDays),
  };
  state.activity = addActivity(
    state,
    `Day ${state.elapsedDays}: ${state.activeReaders - prev.activeReaders >= 0 ? "+" : ""}${state.activeReaders - prev.activeReaders} readers, ${Math.floor(state.readerSat)}% satisfaction.`,
  );
  return finish(state, prev);
}

export function resolveEvent(prev, optionIndex) {
  prev = repairProjects(prev);
  const option = prev.pendingEvent?.options[optionIndex];
  if (!option || prev.outcome) return prev;
  const effect = option.effect;
  // Funding is cash only. Earned revenue contributes to both cash and earnings.
  if (
    prev.budget +
      (effect.budget || 0) +
      (effect.revenue || 0) +
      (effect.funding || 0) <
    0
  )
    return prev;
  const state = {
    ...prev,
    team: { ...prev.team },
    achievements: [...prev.achievements],
    missionBonus: { ...prev.missionBonus },
    projects: prev.projects.map((project) => ({
      ...project,
      remaining: project.remaining + (effect.delay || 0),
      duration: project.duration + (effect.delay || 0),
    })),
    pendingEvent: null,
    eventHistory: [...prev.eventHistory, prev.pendingEvent.id],
  };
  Object.entries(effect.team || {}).forEach(([role, change]) => {
    state.team[role] = Math.max(0, state.team[role] + change);
  });
  state.budget +=
    (effect.budget || 0) + (effect.revenue || 0) + (effect.funding || 0);
  state.totalRevenue += effect.revenue || 0;
  state.totalFunding += effect.funding || 0;
  state.readerSat = clamp(state.readerSat + (effect.readerSat || 0), 0, 100);
  state.activeReaders = Math.max(
    0,
    state.activeReaders + (effect.readers || 0),
  );
  state.contributors += effect.contributors || 0;
  state.missionBonus.activation += effect.activation || 0;
  state.missionBonus.supportDeflection += effect.supportDeflection || 0;
  state.activity = addActivity(
    state,
    `${prev.pendingEvent.title}: ${option.text}.`,
  );
  if (state.report)
    state.report = {
      ...state.report,
      readerDelta: state.report.readerDelta + (effect.readers || 0),
      satisfactionDelta:
        state.report.satisfactionDelta + (effect.readerSat || 0),
      support: supportPrevention(state, state.report.turnDays || 7),
      cashDelta:
        state.report.cashDelta +
        (effect.budget || 0) +
        (effect.revenue || 0) +
        (effect.funding || 0),
    };
  return finish(state, prev);
}
