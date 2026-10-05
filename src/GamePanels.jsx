import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Plus,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import {
  touchpointData,
  teamRoles,
  monetizationData,
  projectDurations,
  achievements,
  agentChecks,
  scenarios,
} from "./gameData.js";
import {
  availableStaff,
  projectBlock,
  revenueBlock,
  agentReadiness,
  supportPrevention,
} from "./gameEngine.js";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function ContentLibrary({
  game,
  query,
  setQuery,
  filter,
  setFilter,
  buy,
}) {
  const entries = Object.entries(touchpointData).filter(
    ([key, data]) =>
      data.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "essentials"
          ? scenarios[game.scenario].criticalContent?.includes(key)
          : filter === "support"
            ? data.supportReduction > 0
            : filter === "published"
              ? game.touchpoints[key].invested
              : filter === "building"
                ? game.projects.some((project) => project.key === key)
                : !game.touchpoints[key].invested &&
                  !game.projects.some((project) => project.key === key))),
  );
  return (
    <>
      <div className="library-tools">
        <div className="filters">
          {[
            "all",
            "available",
            "building",
            "published",
            "support",
            ...(game.scenario === "nightmare" ? ["essentials"] : []),
          ].map((value) => (
            <button
              className={filter === value ? "chosen" : ""}
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={16} />
          <input
            aria-label="Search content"
            placeholder="Find content…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="content-list">
        {entries.map(([key, data]) => {
          const active = game.touchpoints[key].invested;
          const project = game.projects.find((project) => project.key === key);
          const block = projectBlock(game, key);
          const benefit = [
            data.readerBoost && `+${data.readerBoost} new readers/week`,
            data.satisfactionBoost && "Improves content quality",
            data.churnReduction && "Helps readers stick around",
            data.supportReduction &&
              `Support prevention +${data.supportReduction} points`,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <div className="content-row" key={key}>
              <span className={`content-icon ${active ? "published" : ""}`}>
                <BookOpen size={19} />
              </span>
              <div className="content-details">
                <h3>
                  {data.name}
                  {scenarios[game.scenario].criticalContent?.includes(key) && (
                    <span className="essential-label">Launch essential</span>
                  )}
                  {active && (
                    <span className="published-label">
                      <Check size={14} /> Live
                    </span>
                  )}
                  {project && <span className="pill">Building</span>}
                </h3>
                <p>{data.tooltip}</p>
                <span className="impact">{benefit}</span>
                {project ? (
                  <div className="project-progress">
                    <progress
                      aria-label={`${data.name} build progress`}
                      value={project.duration - project.remaining}
                      max={project.duration}
                    />
                    <span>{Math.ceil(project.remaining * 7)} days left</span>
                  </div>
                ) : (
                  !active && (
                    <>
                      <span className="build-time">
                        {projectDurations[key] * 7}-day project
                      </span>
                      {block && <span className="needs">{block}</span>}
                    </>
                  )
                )}
              </div>
              <div className="content-price">
                <strong>
                  {active
                    ? "Published"
                    : project
                      ? "In progress"
                      : money(data.cost)}
                </strong>
                <small>{money(data.maintenance * 100)}/week when live</small>
              </div>
              {!active && !project && (
                <button
                  className="add-button"
                  title={block || `Start ${data.name}`}
                  aria-label={`Start ${data.name}`}
                  disabled={Boolean(game.outcome || game.pendingEvent || block)}
                  onClick={() => buy("content", key)}
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="empty">
            No content in this view. Try another filter or search.
          </p>
        )}
      </div>
    </>
  );
}

export function TeamPanel({ game, buy }) {
  const free = availableStaff(game);
  return (
    <div className="option-list">
      {teamRoles.map((role) => (
        <div className="option-row" key={role.key}>
          <span className="content-icon">
            <Users size={20} />
          </span>
          <div>
            <h3>
              {role.label} <span className="pill">{game.team[role.key]}</span>
            </h3>
            <p>{role.tooltip}</p>
            <small>
              {Math.max(0, free[role.key])} available · {money(role.salary)}
              /week per person
            </small>
          </div>
          <button
            className="secondary"
            disabled={Boolean(
              game.outcome || game.pendingEvent || game.budget < role.cost,
            )}
            onClick={() => buy("team", role.key)}
          >
            <Plus size={15} /> Hire · {money(role.cost)}
          </button>
        </div>
      ))}
    </div>
  );
}

export function RevenuePanel({ game, buy }) {
  return (
    <div className="option-list">
      {Object.entries(monetizationData).map(([key, data]) => {
        const block = revenueBlock(game, key);
        const enabled = game.monetization[key].enabled;
        return (
          <div className="option-row" key={key}>
            <span className="content-icon">
              <Wallet size={20} />
            </span>
            <div>
              <h3>{data.name}</h3>
              <p>{data.description}</p>
              {block && <small className="needs">{block}</small>}
            </div>
            {enabled ? (
              <span className="live">
                <Check size={15} />
                {block ? "Needs staff" : "Active"}
              </span>
            ) : (
              <button
                className="secondary"
                disabled={Boolean(
                  game.outcome ||
                  game.pendingEvent ||
                  block ||
                  game.budget < data.cost,
                )}
                onClick={() => buy("revenue", key)}
              >
                Enable · {money(data.cost)}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AchievementsPanel({ game }) {
  return (
    <div className="achievement-grid">
      {Object.entries(achievements).map(([key, data]) => (
        <div
          className={`achievement ${game.achievements.includes(key) ? "earned" : ""}`}
          key={key}
        >
          <span>{data.icon}</span>
          <h3>{data.name.replace(/^[^A-Za-z]+/, "")}</h3>
          <p>{data.description}</p>
          <small>
            {game.achievements.includes(key) ? "Unlocked" : "Locked"}
          </small>
        </div>
      ))}
    </div>
  );
}

export function EventDialog({ game, resolve }) {
  const container = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    container.current.querySelector("button:not(:disabled)")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [game.pendingEvent.id]);
  const labels = {
    readerSat: "Satisfaction",
    readers: "Readers",
    contributors: "Contributors",
    activation: "Onboarding",
    supportDeflection: "Support requests avoided",
    funding: "Grant funding",
    budget: "Cash",
    revenue: "Earned revenue",
    delay: "Project delay",
  };
  const signed = (value) => `${value > 0 ? "+" : ""}${value}`;
  const trapFocus = (e) => {
    if (e.key !== "Tab") return;
    const buttons = [
      ...container.current.querySelectorAll("button:not(:disabled)"),
    ];
    const first = buttons[0];
    const last = buttons.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  return (
    <div className="modal-backdrop">
      <section
        ref={container}
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
        aria-describedby="event-description"
        onKeyDown={trapFocus}
      >
        <div className="eyebrow">DECISION TIME · DAY {game.elapsedDays}</div>
        <h2 id="event-title">{game.pendingEvent.title}</h2>
        <p id="event-description">{game.pendingEvent.description}</p>
        <div className="event-options">
          {game.pendingEvent.options.map((option, index) => {
            const affordable =
              game.budget +
                (option.effect.budget || 0) +
                (option.effect.funding || 0) +
                (option.effect.revenue || 0) >=
              0;
            return (
              <button
                key={index}
                disabled={!affordable}
                onClick={() => resolve(index)}
              >
                <strong>
                  {option.text}
                  <ArrowRight size={17} />
                </strong>
                <small>
                  {Object.entries(option.effect)
                    .map(([key, value]) =>
                      key === "team"
                        ? Object.entries(value)
                            .map(
                              ([role, count]) =>
                                `${signed(count)} ${teamRoles.find((r) => r.key === role)?.label.toLowerCase()}`,
                            )
                            .join(", ")
                        : `${labels[key] || key}: ${["budget", "revenue", "funding"].includes(key) ? `${value > 0 ? "+" : ""}${money(value)}` : signed(key === "delay" ? value * 7 : value)}${key === "delay" ? " days to active projects" : ["readerSat", "activation", "supportDeflection"].includes(key) ? " points" : ""}`,
                    )
                    .join(" · ") || "No immediate changes"}
                  {!affordable && " · Not enough budget"}
                </small>
              </button>
            );
          })}
        </div>
        <span className="modal-note">
          Time doesn’t advance until you decide.
        </span>
      </section>
    </div>
  );
}

export function AgentPanel({ game, buy }) {
  const score = agentReadiness(game);
  return (
    <>
      <div className="agent-score">
        <div>
          <strong>
            {score}
            <small>/100</small>
          </strong>
          <div>
            <h3>Agent readiness</h3>
            <p>
              A simulated score for discoverability, usable contracts, and
              tested tasks. Optional for every mission.
            </p>
          </div>
        </div>
        <progress aria-label="Agent readiness" value={score} max={100} />
        <p>
          Readable docs and task tests do most of the work. MCP is useful when
          you have actual tasks to expose.
        </p>
      </div>
      <div className="agent-checks">
        {agentChecks.map((check) => {
          const data = touchpointData[check.key];
          const complete = game.touchpoints[check.key].invested;
          const project = game.projects.find(
            (project) => project.key === check.key,
          );
          const block = projectBlock(game, check.key);
          return (
            <div className="agent-check" key={check.key}>
              <span className={`agent-check-mark ${complete ? "done" : ""}`}>
                {complete ? <Check size={18} /> : check.points}
              </span>
              <div>
                <h3>{check.label}</h3>
                <p>{check.description}</p>
                <a href={check.source} target="_blank" rel="noreferrer">
                  Read the specification <ArrowRight size={14} />
                </a>
                {!complete && !project && (
                  <small>
                    {block ||
                      `${projectDurations[check.key] * 7}-day project · ${money(data.cost)}`}
                  </small>
                )}
              </div>
              {complete ? (
                <span className="live">+{check.points} points</span>
              ) : project ? (
                <span className="pill">
                  {Math.ceil(project.remaining * 7)} days left
                </span>
              ) : (
                <button
                  className="secondary"
                  disabled={Boolean(game.outcome || game.pendingEvent || block)}
                  onClick={() => buy("content", check.key)}
                >
                  Build · {money(data.cost)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function SupportPanel({ game, showSupport }) {
  const support = supportPrevention(game);
  const shipped = Object.entries(touchpointData)
    .filter(
      ([key, data]) => data.supportReduction && game.touchpoints[key].invested,
    )
    .map(([, data]) => data.name);
  return (
    <section className="support-panel">
      <div className="report-heading">
        <div>
          <h2>Prevent support requests</h2>
          <p>
            Estimated at your current audience size. Project effects begin when
            they ship.
          </p>
        </div>
        <button className="secondary" onClick={showSupport}>
          Find support projects <ArrowRight size={16} />
        </button>
      </div>
      <div className="support-numbers">
        <div>
          <strong>{Math.floor(support.percent)}%</strong>
          <span>requests prevented</span>
        </div>
        <div>
          <strong>{support.avoided}</strong>
          <span>requests avoided / week</span>
        </div>
        <div>
          <strong>{support.remaining}</strong>
          <span>requests still reaching support / week</span>
        </div>
      </div>
      <p>
        {shipped.length
          ? `Helping now: ${shipped.join(", ")}.`
          : "Publish troubleshooting, task-based how-to guides, or clearer error messages to help readers solve problems themselves."}{" "}
        Quality focus adds 0.5 prevention points per week, up to 10 extra
        points.
      </p>
    </section>
  );
}

export function LaunchEssentials({ game, buy, showEssentials, showTeam }) {
  const keys = scenarios[game.scenario].criticalContent;
  const ready = keys.filter((key) => game.touchpoints[key].invested).length;
  const needed = Math.ceil(game.goalObjective / 25);
  return (
    <section
      className="launch-essentials"
      aria-labelledby="launch-essentials-title"
    >
      <div className="report-heading">
        <div>
          <h2 id="launch-essentials-title">Launch essentials</h2>
          <p>
            {needed === keys.length
              ? "Ship all four of these resources."
              : `Ship any ${needed} of these four resources for your ${game.goalDays}-day plan.`}{" "}
            {ready} ready, {Math.max(0, needed - ready)} more needed.
          </p>
        </div>
        <button className="secondary" onClick={showEssentials}>
          View essential projects <ArrowRight size={16} />
        </button>
      </div>
      <div className="essentials-grid">
        {keys.map((key) => {
          const data = touchpointData[key];
          const published = game.touchpoints[key].invested;
          const project = game.projects.find((project) => project.key === key);
          const block = projectBlock(game, key);
          return (
            <div
              className={`essential-card ${published ? "ready" : ""}`}
              key={key}
            >
              <h3>{data.name}</h3>
              <p>{data.tooltip}</p>
              <span className={published ? "live" : "essential-status"}>
                {published ? (
                  <>
                    <Check size={15} /> Ready for launch
                  </>
                ) : project ? (
                  `Building · ${Math.ceil(project.remaining * 7)} days left`
                ) : (
                  `Not started · ${projectDurations[key] * 7} days to build`
                )}
              </span>
              {!published && !project && (
                <>
                  <small>{block || `${money(data.cost)} to start`}</small>
                  {block.startsWith("Needs") ? (
                    <button className="secondary" onClick={showTeam}>
                      View team requirements
                    </button>
                  ) : (
                    <button
                      className="secondary"
                      aria-label={`Build essential: ${data.name}`}
                      disabled={Boolean(
                        game.outcome || game.pendingEvent || block,
                      )}
                      onClick={() => buy("content", key)}
                    >
                      Start · {money(data.cost)}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
