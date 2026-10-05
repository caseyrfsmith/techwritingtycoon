import { createElement, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  Wallet,
  Award,
  Play,
  Pause,
  Check,
  ChevronRight,
  Leaf,
  Building2,
  Rocket,
  Skull,
  X,
  SkipForward,
  Clock,
  Bot,
} from "lucide-react";
import {
  scenarios,
  weeklyFocuses,
  touchpointData,
  achievements,
  timelines,
} from "./gameData.js";
import {
  createGame,
  advanceWeek,
  weeklyCosts,
  projectCapacity,
  purchase,
  resolveEvent,
  milestones,
  agentReadiness,
  repairProjects,
  scenarioPlan,
} from "./gameEngine.js";
import {
  ContentLibrary,
  TeamPanel,
  RevenuePanel,
  AchievementsPanel,
  EventDialog,
  AgentPanel,
  SupportPanel,
  LaunchEssentials,
} from "./GamePanels.jsx";
import "./App.css";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const signed = (value) => `${value > 0 ? "+" : ""}${value}`;
const clean = (name) => name.replace(/^[^A-Za-z]+/, "");
const scenarioIcons = [Rocket, Building2, Leaf, Skull];
const tabs = [
  { key: "content", label: "Content library", icon: BookOpen },
  { key: "agents", label: "Agent experience", icon: Bot },
  { key: "team", label: "Your team", icon: Users },
  { key: "revenue", label: "Revenue streams", icon: Wallet },
  { key: "achievements", label: "Achievements", icon: Award },
];
const saveKey = "tech-writing-tycoon-v2";
function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(saveKey));
    if (
      saved?.version === 2 &&
      scenarios[saved.game?.scenario] &&
      Array.isArray(saved.game.projects) &&
      saved.game.missionBonus
    )
      return {
        game: {
          ...createGame(saved.game.scenario),
          ...saved.game,
          touchpoints: {
            ...createGame(saved.game.scenario).touchpoints,
            ...saved.game.touchpoints,
          },
          elapsedDays:
            saved.game.elapsedDays ??
            Math.min(saved.game.week * 7, saved.game.goalDays || 90),
          goalDays: saved.game.goalDays || 90,
          goalWeeks: Math.ceil((saved.game.goalDays || 90) / 7),
          isPaused: true,
        },
        saved: true,
      };
  } catch {
    /* A fresh game also works when browser storage is unavailable. */
  }
  return { game: createGame(), saved: false };
}

export default function App() {
  const [initial] = useState(loadGame);
  const [rawGame, setGame] = useState(initial.game);
  const game = repairProjects(rawGame);
  const [setup, setSetup] = useState(!initial.saved);
  const [selected, setSelected] = useState(initial.game.scenario);
  const [selectedDays, setSelectedDays] = useState(initial.game.goalDays || 90);
  const [tab, setTab] = useState("content");
  const [speed, setSpeed] = useState(8000);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    setGame(repairProjects);
  }, []);
  useEffect(() => {
    if (setup || game.isPaused || game.pendingEvent || game.outcome) return;
    const timer = setInterval(
      () => setGame((prev) => advanceWeek(prev)),
      speed,
    );
    return () => clearInterval(timer);
  }, [setup, game.isPaused, game.pendingEvent, game.outcome, speed]);
  useEffect(() => {
    if (setup) return;
    try {
      localStorage.setItem(saveKey, JSON.stringify({ version: 2, game }));
    } catch {
      setStorageFailed(true);
    }
  }, [game, setup]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  const scenario = scenarioPlan(selected, selectedDays);
  const currentScenario = scenarioPlan(game.scenario, game.goalDays);
  const costs = weeklyCosts(game);
  const published = Object.values(game.touchpoints).filter(
    (content) => content.invested,
  ).length;
  const income = game.revenue + game.weeklyFunding;
  const disabled = Boolean(game.outcome || game.pendingEvent);
  const buy = (type, key) => {
    setGame((prev) => purchase(prev, type, key));
  };
  const resolve = (index) => setGame((prev) => resolveEvent(prev, index));
  const nextWeek = () =>
    setGame((prev) =>
      advanceWeek({ ...prev, isPaused: true }, { manual: true }),
    );
  const start = (key = selected, days = selectedDays) => {
    setGame(createGame(key, Date.now(), days));
    setSetup(false);
    setTab("content");
    setFilter("all");
    setQuery("");
    setMessage("Pick a project and a weekly focus, then advance a week.");
  };
  const goalList = milestones(game);
  const mission = currentScenario.objective;
  const report = game.report;
  const newlyEarned = report
    ? game.activity
        .filter(
          (entry) =>
            entry.week === report.week && entry.text.startsWith("Achievement:"),
        )
        .map((entry) => entry.text.replace("Achievement: ", ""))
    : [];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">
            <BookOpen size={21} />
          </span>
          <span>
            Tech Writing<span className="brand-sub">TYCOON</span>
          </span>
        </div>
        <div className="nav-caption">YOUR WORKSPACE</div>
        <nav>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={!setup && tab === key ? "nav-item active" : "nav-item"}
              aria-current={!setup && tab === key ? "page" : undefined}
              onClick={() => {
                setTab(key);
                setQuery("");
              }}
              disabled={setup}
            >
              {createElement(Icon, { size: 18 })}
              {label}
              {key === "achievements" && (
                <span className="nav-count">{game.achievements.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="version">
            {storageFailed
              ? "Progress is not saved in this browser."
              : "Progress saves in this browser."}
          </span>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <span>{setup ? "New game" : clean(currentScenario.name)}</span>
          </div>
          <span className="topbar-note">
            <span className="status-dot" />
            {setup
              ? "Choose a mission"
              : game.isPaused || game.pendingEvent || game.outcome
                ? "Paused"
                : "Auto-playing"}
          </span>
        </header>
        <div className="main-content">
          {setup ? (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    FOUR TEAMS. FOUR DIFFERENT PROBLEMS.
                  </div>
                  <h1>
                    Pick your challenge<span className="green">.</span>
                  </h1>
                  <p className="intro">
                    Build useful docs, manage your team, and handle the
                    occasional plot twist.
                  </p>
                </div>
                {(game.week > 0 || game.activity.length > 0) && (
                  <button className="secondary" onClick={() => setSetup(false)}>
                    Return to game
                  </button>
                )}
              </div>
              <section
                className="timeline-picker"
                aria-labelledby="timeline-title"
              >
                <div>
                  <h2 id="timeline-title">Choose your timeline</h2>
                  <p>Budget and milestones adjust to the time available.</p>
                </div>
                <div className="timeline-options">
                  {timelines.map((timeline) => (
                    <button
                      key={timeline.days}
                      className={
                        selectedDays === timeline.days ? "selected" : ""
                      }
                      aria-pressed={selectedDays === timeline.days}
                      onClick={() => setSelectedDays(timeline.days)}
                    >
                      {timeline.label}
                    </button>
                  ))}
                </div>
              </section>
              <div className="setup-heading">
                <h2>Where do you want to start?</h2>
                <span>Each mission has its own win conditions.</span>
              </div>
              <div className="scenario-grid">
                {Object.keys(scenarios).map((key, index) => {
                  const data = scenarioPlan(key, selectedDays);
                  const Icon = scenarioIcons[index];
                  return (
                    <button
                      key={key}
                      className={`scenario-card ${selected === key ? "selected" : ""}`}
                      onClick={() => setSelected(key)}
                      aria-pressed={selected === key}
                    >
                      <div className="scenario-top">
                        <span className={`scenario-icon tone-${index}`}>
                          <Icon size={24} />
                        </span>
                        <span className={`difficulty level-${index}`}>
                          {data.difficulty}
                        </span>
                      </div>
                      <h3>{clean(data.name)}</h3>
                      <p>{data.description}</p>
                      <div className="scenario-stats">
                        <div>
                          <span>Team budget</span>
                          <strong>{money(data.budget)}</strong>
                        </div>
                        <div>
                          <span>Deadline</span>
                          <strong>{data.goals.days} days</strong>
                        </div>
                        <div>
                          <span>Starting readers</span>
                          <strong>
                            {data.startingReaders.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                      <div className="scenario-choice">
                        {selected === key ? (
                          <>
                            <Check size={16} /> Selected
                          </>
                        ) : (
                          <>
                            Choose mission <ArrowRight size={16} />
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <section className="launch-panel">
                <div>
                  <span className="eyebrow">YOUR MISSION</span>
                  <h2>{scenario.mission}</h2>
                  {selected === "nightmare" && (
                    <p>
                      Essentials:{" "}
                      {scenario.criticalContent
                        .map((key) => touchpointData[key].name)
                        .join(", ")}
                      . This plan requires{" "}
                      {Math.ceil(scenario.objective.target / 25)} of the 4.
                    </p>
                  )}
                  <p>
                    {scenario.goals.readers.toLocaleString()} readers ·{" "}
                    {scenario.objective.target}
                    {scenario.objective.unit}{" "}
                    {scenario.objective.label.toLowerCase()} ·{" "}
                    {scenario.goals.satisfaction}% satisfaction
                  </p>
                  {selected === "opensource" && (
                    <p>
                      Includes {money(scenario.weeklyFunding)}/week in committed
                      funding. No ads or premium paywalls.
                    </p>
                  )}
                </div>
                <button className="primary" onClick={() => start()}>
                  Start mission <ArrowRight size={18} />
                </button>
              </section>
              <div className="how-it-works">
                {[
                  [
                    "01",
                    "Assign a project",
                    "Projects reserve staff and take 7–28 days to ship.",
                  ],
                  [
                    "02",
                    "Choose a focus",
                    "Trade growth for quality, or invest in the community.",
                  ],
                  [
                    "03",
                    "Advance a week",
                    "See what shipped, handle decisions, and adjust your plan.",
                  ],
                ].map(([number, title, text]) => (
                  <div key={number}>
                    <span>{number}</span>
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    {clean(currentScenario.name).toUpperCase()} ·{" "}
                    {game.goalDays - game.elapsedDays} DAYS LEFT ·{" "}
                    {game.goalDays}-DAY PLAN
                  </div>
                  <h1>{currentScenario.mission}</h1>
                  <p className="intro">{currentScenario.tip}</p>
                </div>
                <button
                  className="secondary"
                  onClick={() => {
                    setGame((prev) => ({ ...prev, isPaused: true }));
                    setSelected(game.scenario);
                    setSelectedDays(game.goalDays);
                    setSetup(true);
                  }}
                >
                  New game
                </button>
              </div>
              <div className="simulation-bar">
                <div>
                  <span className="week-label">
                    DAY{" "}
                    <strong>
                      {game.elapsedDays.toString().padStart(2, "0")}
                    </strong>
                    <span>/ {game.goalDays}</span>
                  </span>
                  <span className="simulation-hint">
                    {game.outcome
                      ? "Mission finished"
                      : game.isPaused
                        ? "Plan your next move"
                        : "Time advances automatically"}
                  </span>
                </div>
                <div className="play-controls">
                  <label className="speed">
                    Speed
                    <select
                      aria-label="Simulation speed"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                    >
                      <option value={12000}>Slow</option>
                      <option value={8000}>Normal</option>
                      <option value={4000}>Fast</option>
                    </select>
                  </label>
                  <button
                    className="secondary compact"
                    disabled={disabled}
                    onClick={() =>
                      setGame((prev) => ({ ...prev, isPaused: !prev.isPaused }))
                    }
                  >
                    {game.isPaused ? <Play size={16} /> : <Pause size={16} />}
                    {game.isPaused ? "Auto-play" : "Pause"}
                  </button>
                  <button
                    className="primary compact"
                    disabled={disabled}
                    onClick={nextWeek}
                  >
                    Advance {Math.min(7, game.goalDays - game.elapsedDays)} days{" "}
                    <SkipForward size={16} />
                  </button>
                </div>
              </div>
              {game.outcome && (
                <div className="outcome" role="status">
                  <Award size={25} />
                  <div>
                    <strong>
                      {game.outcome === "won"
                        ? `Mission complete in ${game.elapsedDays} days!`
                        : game.outcome === "timeout"
                          ? "Deadline reached. Here’s where you landed."
                          : "The team budget ran out."}
                    </strong>
                    <p>
                      {game.outcome === "won"
                        ? `${game.achievements.length} achievements · ${money(game.budget)} remaining.`
                        : `${goalList.filter((goal) => goal.value >= goal.target).length} of 3 milestones reached. Try another focus or project order.`}
                    </p>
                  </div>
                  <button
                    className="secondary"
                    onClick={() => start(game.scenario, game.goalDays)}
                  >
                    Replay mission
                  </button>
                </div>
              )}
              <div className="metrics">
                {[
                  [
                    "Team budget",
                    money(game.budget),
                    `${money(costs)} weekly costs`,
                    Wallet,
                  ],
                  [
                    "Active readers",
                    game.activeReaders.toLocaleString(),
                    `${Math.round(game.churn)}% weekly reader drop-off`,
                    Users,
                  ],
                  [
                    "Reader satisfaction",
                    `${Math.floor(game.readerSat)}%`,
                    `Goal: ${game.goalReaderSat}%`,
                    Leaf,
                  ],
                  [
                    mission.label,
                    `${Math.floor(game[mission.key])}${mission.unit}`,
                    `Goal: ${mission.target}${mission.unit}`,
                    Award,
                  ],
                ].map(([label, value, hint, Icon]) => (
                  <div className="metric" key={label}>
                    <div>
                      <span>{label}</span>
                      {createElement(Icon, { size: 18 })}
                    </div>
                    <strong>{value}</strong>
                    <small>{hint}</small>
                  </div>
                ))}
              </div>
              {game.scenario === "nightmare" && (
                <LaunchEssentials
                  game={game}
                  buy={buy}
                  showEssentials={() => {
                    setTab("content");
                    setFilter("essentials");
                    setQuery("");
                    document
                      .getElementById("content-library")
                      ?.scrollIntoView({ block: "start" });
                  }}
                  showTeam={() => {
                    setTab("team");
                    document
                      .getElementById("content-library")
                      ?.scrollIntoView({ block: "start" });
                  }}
                />
              )}
              <SupportPanel
                game={game}
                showSupport={() => {
                  setTab("content");
                  setFilter("support");
                  setQuery("");
                  document.getElementById("content-library")?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                    block: "start",
                  });
                }}
              />
              <section className="weekly-focus">
                <div>
                  <h2>This week’s focus</h2>
                  <p>
                    Affects your next week. Project build times stay the same.
                  </p>
                </div>
                <div className="focus-options">
                  {Object.entries(weeklyFocuses).map(([key, focus]) => (
                    <button
                      key={key}
                      className={
                        game.focus === key
                          ? "focus-option selected"
                          : "focus-option"
                      }
                      aria-pressed={game.focus === key}
                      disabled={disabled}
                      onClick={() =>
                        setGame((prev) => ({ ...prev, focus: key }))
                      }
                    >
                      <strong>
                        {focus.label}
                        {game.focus === key && <Check size={16} />}
                      </strong>
                      <span>{focus.description}</span>
                    </button>
                  ))}
                </div>
              </section>
              {report && (
                <section className="week-report" aria-live="polite">
                  <div className="report-heading">
                    <h2>
                      Day{" "}
                      {report.elapsedDays ??
                        Math.min(report.week * 7, game.goalDays)}{" "}
                      report
                    </h2>
                    <span>
                      {report.completed.length
                        ? `${report.completed.length} shipped`
                        : "Work in progress"}
                    </span>
                  </div>
                  <div className="report-numbers">
                    <span>
                      <strong>{signed(report.readerDelta)}</strong> readers
                    </span>
                    <span>
                      <strong>
                        {signed(Number(report.satisfactionDelta.toFixed(1)))}
                      </strong>{" "}
                      satisfaction points
                    </span>
                    <span>
                      <strong>
                        {report.cashDelta > 0 ? "+" : ""}
                        {money(report.cashDelta)}
                      </strong>{" "}
                      net cash
                    </span>
                  </div>
                  {report.support && (
                    <p className="shipped">
                      <Check size={17} />
                      Estimated support requests: {report.support.avoided}{" "}
                      avoided, {report.support.remaining} remaining during these{" "}
                      {report.turnDays} days.
                    </p>
                  )}
                  {report.completed.length > 0 && (
                    <p className="shipped">
                      <Check size={17} />
                      Shipped:{" "}
                      {report.completed
                        .map((key) => touchpointData[key].name)
                        .join(", ")}
                    </p>
                  )}
                  {newlyEarned.length > 0 && (
                    <p className="shipped">
                      <Award size={17} />
                      Unlocked: {newlyEarned.join(" · ")}
                    </p>
                  )}
                </section>
              )}
              {game.projects.length > 0 && (
                <section className="project-board">
                  <div className="report-heading">
                    <h2>
                      <Clock size={18} /> On the workbench
                    </h2>
                    <span>
                      {game.projects.length}/{projectCapacity(game)} project
                      slots
                    </span>
                  </div>
                  <div className="project-cards">
                    {game.projects.map((project) => (
                      <div className="project-card" key={project.key}>
                        <strong>{touchpointData[project.key].name}</strong>
                        <progress
                          aria-label={`${touchpointData[project.key].name} progress`}
                          value={project.duration - project.remaining}
                          max={project.duration}
                        />
                        <span>
                          {Math.ceil(project.remaining * 7)} days left
                        </span>
                      </div>
                    ))}
                  </div>
                  <p>
                    Assigned staff are reserved until a project ships. Event
                    delays apply to active projects.
                  </p>
                </section>
              )}
              <div className="workspace-grid">
                <section className="library" id="content-library">
                  <div className="section-heading">
                    <div>
                      <h2>{tabs.find((item) => item.key === tab).label}</h2>
                      <p>
                        {tab === "content"
                          ? "Start a project. Benefits begin when it ships."
                          : tab === "team"
                            ? "More available staff means more work can run in parallel."
                            : tab === "agents"
                              ? "Help agents find answers, use APIs, and recover from errors."
                              : tab === "revenue"
                                ? "Optional income to extend your runway. Sales aren’t a win condition."
                                : "Milestones earned through your decisions."}
                      </p>
                    </div>
                    <span className="pill">
                      {tab === "content"
                        ? `${published} live · ${game.projects.length}/${projectCapacity(game)} building`
                        : tab === "agents"
                          ? `${agentReadiness(game)}/100 readiness`
                          : tab === "team"
                            ? `${Object.values(game.team).reduce((a, b) => a + b, 0)} people`
                            : tab === "achievements"
                              ? `${game.achievements.length}/${Object.keys(achievements).length} unlocked`
                              : `${money(game.revenue)}/week earned`}
                    </span>
                  </div>
                  {tab === "content" && (
                    <ContentLibrary
                      game={game}
                      query={query}
                      setQuery={setQuery}
                      filter={filter}
                      setFilter={setFilter}
                      buy={buy}
                    />
                  )}
                  {tab === "agents" && <AgentPanel game={game} buy={buy} />}
                  {tab === "team" && <TeamPanel game={game} buy={buy} />}
                  {tab === "revenue" && <RevenuePanel game={game} buy={buy} />}
                  {tab === "achievements" && <AchievementsPanel game={game} />}
                </section>
                <aside className="right-column">
                  <section className="goals-panel">
                    <span className="eyebrow">WIN CONDITIONS</span>
                    <h2>Mission milestones</h2>
                    <p>
                      Reach all three by day {game.goalDays} and stay within
                      budget.
                    </p>
                    {goalList.map((goal) => (
                      <div className="goal" key={goal.key}>
                        <div>
                          <span>
                            {goal.value >= goal.target && <Check size={14} />}{" "}
                            {goal.label}
                          </span>
                          <strong>
                            {goal.value.toLocaleString()}
                            {goal.unit}
                            <small>
                              {" "}
                              / {goal.target.toLocaleString()}
                              {goal.unit}
                            </small>
                          </strong>
                        </div>
                        <progress
                          aria-label={goal.label}
                          value={Math.min(goal.value, goal.target)}
                          max={goal.target}
                        />
                      </div>
                    ))}
                  </section>
                  <section className="runway cash-panel">
                    <h3>Weekly cash flow</h3>
                    <div>
                      <span>Earned income</span>
                      <strong>{money(game.revenue)}</strong>
                    </div>
                    {game.weeklyFunding > 0 && (
                      <div>
                        <span>Committed funding</span>
                        <strong>{money(game.weeklyFunding)}</strong>
                      </div>
                    )}
                    <div>
                      <span>Team + maintenance</span>
                      <strong>−{money(costs)}</strong>
                    </div>
                    <div className="net-cash">
                      <span>Net per week</span>
                      <strong>{money(income - costs)}</strong>
                    </div>
                    <p>
                      Cash runway:{" "}
                      {costs <= income
                        ? "self-sustaining"
                        : `${Math.max(0, Math.floor((7 * game.budget) / (costs - income)))} days`}{" "}
                      at current costs.
                    </p>
                  </section>
                  <section className="activity-panel">
                    <h3>Recent activity</h3>
                    {game.activity.length === 0 ? (
                      <p>Your first project starts the log.</p>
                    ) : (
                      <ol>
                        {game.activity.slice(0, 6).map((entry, index) => (
                          <li key={`${entry.week}-${index}`}>
                            <span>
                              D{Math.min(entry.week * 7, game.goalDays)}
                            </span>
                            {entry.text}
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      {message && (
        <div className="toast" role="status">
          <Check size={17} />
          {message}
          <button
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {game.pendingEvent && !setup && (
        <EventDialog game={game} resolve={resolve} />
      )}
    </div>
  );
}
