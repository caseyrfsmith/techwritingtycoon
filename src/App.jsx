import React, { useState, useEffect } from 'react';
import { Play, Pause, DollarSign, Users, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Info, BookOpen, Zap, Award, Target } from 'lucide-react';
import { scenarios, achievements, touchpointData, monetizationData, teamRoles, metricTooltips } from './gameData';
import { chaosEvents, opportunityEvents } from './gameEvents';

const DocsResourcesTycoon = () => {
  const [gameState, setGameState] = useState({
    week: 1,
    isPaused: true,
    budget: 500000,
    revenue: 0,
    totalRevenue: 0,
    readerSat: 50,
    activeReaders: 0,
    churn: 15,
    premiumSubscribers: 0,
    enterpriseClients: 0,
    certifications: 0,
    adImpressions: 0,
    team: {
      techWriters: 2,
      contentDesigners: 1,
      videoProducers: 0,
      engineers: 1,
      educators: 0
    },
    touchpoints: {
      docsHome: { invested: true },
      searchSEO: { invested: false },
      socialContent: { invested: false },
      webinars: { invested: false },
      docsLanding: { invested: true },
      comparison: { invested: false },
      useCaseLibrary: { invested: false },
      productTours: { invested: true },
      quickStart: { invested: true },
      codeExamples: { invested: false },
      videoTutorials: { invested: false },
      interactiveDemo: { invested: false },
      apiReference: { invested: true },
      troubleshooting: { invested: false },
      communityForum: { invested: false },
      advancedGuides: { invested: false },
      bestPractices: { invested: false },
      certification: { invested: false },
      contributorProgram: { invested: false }
    },
    monetization: {
      freemium: { enabled: true, cost: 0 },
      premiumContent: { enabled: false, cost: 25000 },
      enterpriseSupport: { enabled: false, cost: 50000 },
      advertising: { enabled: false, cost: 5000 },
      certificationFees: { enabled: false, cost: 15000 },
      sponsoredContent: { enabled: false, cost: 10000 }
    },
    pendingEvent: null,
    eventHistory: [],
    achievements: [],
    goalReaders: 1000,
    goalWeeks: 26,
    goalReaderSat: 70,
    goalRevenue: 100000,
    scenario: 'startup'
  });

  const [showEvent, setShowEvent] = useState(false);
  const [message, setMessage] = useState(null);
  const [gameSpeed, setGameSpeed] = useState(4000);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  const [showMonetization, setShowMonetization] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showScenarios, setShowScenarios] = useState(true);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  const calculateWeeklyCosts = (state) => {
    let costs = 0;
    teamRoles.forEach(role => {
      costs += state.team[role.key] * role.salary;
    });
    Object.keys(state.touchpoints).forEach(key => {
      if (state.touchpoints[key].invested && touchpointData[key]) {
        costs += touchpointData[key].maintenance * 100;
      }
    });
    return costs;
  };

  const hireTeamMember = (roleKey) => {
    const role = teamRoles.find(r => r.key === roleKey);
    if (gameState.budget >= role.cost) {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - role.cost,
        team: { ...prev.team, [roleKey]: prev.team[roleKey] + 1 }
      }));
      setMessage({ type: 'success', text: `Hired a ${role.label.toLowerCase()}!` });
    } else {
      setMessage({ type: 'error', text: 'Not enough budget!' });
    }
  };

  const investInTouchpoint = (key) => {
    const data = touchpointData[key];
    if (gameState.touchpoints[key].invested) {
      setMessage({ type: 'info', text: `${data.name} is already active!` });
      return;
    }
    
    // Check staff requirements
    if (data.requires) {
      const missingStaff = [];
      Object.keys(data.requires).forEach(role => {
        if (gameState.team[role] < data.requires[role]) {
          const roleLabel = teamRoles.find(r => r.key === role)?.label || role;
          missingStaff.push(`${data.requires[role]} ${roleLabel}`);
        }
      });
      
      if (missingStaff.length > 0) {
        setMessage({ type: 'error', text: `Not enough staff! Need: ${missingStaff.join(', ')}` });
        return;
      }
    }
    
    if (gameState.budget >= data.cost) {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - data.cost,
        touchpoints: { ...prev.touchpoints, [key]: { invested: true } }
      }));
      setMessage({ type: 'success', text: `Created ${data.name}!` });
    } else {
      setMessage({ type: 'error', text: 'Not enough budget!' });
    }
  };

  const enableMonetization = (key) => {
    const data = monetizationData[key];
    if (key === 'freemium') {
      setMessage({ type: 'info', text: 'Freemium is always enabled' });
      return;
    }
    if (gameState.monetization[key].enabled) {
      setMessage({ type: 'info', text: 'Already enabled!' });
      return;
    }
    if (gameState.budget >= data.cost) {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - data.cost,
        monetization: { ...prev.monetization, [key]: { ...prev.monetization[key], enabled: true } }
      }));
      setMessage({ type: 'success', text: `Enabled ${data.name}!` });
    } else {
      setMessage({ type: 'error', text: 'Not enough budget!' });
    }
  };

  const handleEventChoice = (option) => {
    setGameState(prev => {
      const newState = { ...prev };
      if (option.effect.budget) newState.budget += option.effect.budget;
      if (option.effect.revenue) newState.totalRevenue += option.effect.revenue;
      if (option.effect.readerSat) newState.readerSat = Math.max(0, Math.min(100, newState.readerSat + option.effect.readerSat));
      if (option.effect.readers) newState.activeReaders += option.effect.readers;
      if (option.effect.enterpriseClients) newState.enterpriseClients += option.effect.enterpriseClients;
      if (option.effect.team) {
        Object.keys(option.effect.team).forEach(role => {
          newState.team[role] = Math.max(0, newState.team[role] + option.effect.team[role]);
        });
      }
      return {
        ...newState,
        pendingEvent: null,
        eventHistory: [...prev.eventHistory, prev.pendingEvent.id]
      };
    });
    setShowEvent(false);
    setMessage({ type: 'success', text: 'Event resolved!' });
  };

  const startScenario = (scenarioKey) => {
    const scenario = scenarios[scenarioKey];
    setGameState({
      ...gameState,
      scenario: scenarioKey,
      budget: scenario.budget,
      team: { ...scenario.team },
      goalReaders: scenario.goals.readers,
      goalRevenue: scenario.goals.revenue,
      goalReaderSat: scenario.goals.satisfaction,
      goalWeeks: scenario.goals.weeks,
      week: 1,
      revenue: 0,
      totalRevenue: 0,
      isPaused: false,
      eventHistory: [],
      achievements: []
    });
    setShowScenarios(false);
  };

  useEffect(() => {
if (gameState.isPaused || showEvent) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev };
        newState.week += 1;

        // Calculate costs
        const weeklyCosts = calculateWeeklyCosts(prev);
        newState.budget -= weeklyCosts;

        // Reader growth from touchpoints
        let newReaders = 10; // Base organic growth
        Object.keys(prev.touchpoints).forEach(key => {
          if (prev.touchpoints[key].invested && touchpointData[key].readerBoost) {
            newReaders += touchpointData[key].readerBoost;
          }
        });
        newState.activeReaders = Math.max(0, prev.activeReaders + newReaders);

        // Satisfaction changes
        let satChange = -2; // Base decay
        Object.keys(prev.touchpoints).forEach(key => {
          if (prev.touchpoints[key].invested && touchpointData[key].satisfactionBoost) {
            satChange += touchpointData[key].satisfactionBoost * 0.1;
          }
        });
        newState.readerSat = Math.max(0, Math.min(100, prev.readerSat + satChange));

        // Churn
        let churnRate = 15;
        Object.keys(prev.touchpoints).forEach(key => {
          if (prev.touchpoints[key].invested && touchpointData[key].churnReduction) {
            churnRate -= touchpointData[key].churnReduction * 0.5;
          }
        });
        if (prev.readerSat > 70) churnRate -= 5;
        if (prev.readerSat < 40) churnRate += 10;
        newState.churn = Math.max(2, Math.min(30, churnRate));
        
        const churned = Math.floor(newState.activeReaders * (newState.churn / 100));
        newState.activeReaders = Math.max(0, newState.activeReaders - churned);

        // Revenue
        let weeklyRevenue = 0;
        if (prev.monetization.premiumContent.enabled) {
          newState.premiumSubscribers = Math.floor(newState.activeReaders * 0.05);
          weeklyRevenue += newState.premiumSubscribers * 25;
        }
        if (prev.monetization.enterpriseSupport.enabled) {
          weeklyRevenue += prev.enterpriseClients * 5000;
        }
        if (prev.monetization.advertising.enabled) {
          newState.adImpressions = newState.activeReaders * 10;
          weeklyRevenue += Math.floor(newState.adImpressions * 0.05);
          newState.readerSat = Math.max(0, newState.readerSat - 2);
        }
        if (prev.monetization.certificationFees.enabled) {
          const newCerts = Math.floor(newState.activeReaders * 0.02);
          newState.certifications += newCerts;
          weeklyRevenue += newCerts * 200;
        }
        if (prev.monetization.sponsoredContent.enabled) {
          weeklyRevenue += Math.floor(newState.activeReaders / 100) * 150;
        }

        newState.revenue = weeklyRevenue;
        newState.totalRevenue += weeklyRevenue;

        // Check for events - randomized, not tied to specific weeks
        // 20% chance each week for chaos, 15% for opportunity
        if (!prev.pendingEvent) {
          const availableChaos = chaosEvents.filter(event => !prev.eventHistory.includes(event.id));
          const availableOpportunities = opportunityEvents.filter(event => 
            !prev.eventHistory.includes(event.id) &&
            (!event.requires || prev.monetization[event.requires]?.enabled)
          );
          
          let selectedEvent = null;
          
          // Roll for chaos event (20% chance)
          if (Math.random() < 0.20 && availableChaos.length > 0) {
            selectedEvent = availableChaos[Math.floor(Math.random() * availableChaos.length)];
          }
          // Roll for opportunity event (15% chance, only if no chaos)
          else if (Math.random() < 0.15 && availableOpportunities.length > 0) {
            selectedEvent = availableOpportunities[Math.floor(Math.random() * availableOpportunities.length)];
          }
          
          if (selectedEvent) {
            newState.pendingEvent = selectedEvent;
            setShowEvent(true);
          }
        }

        // Check achievements
        const newAchievements = [];
        if (newState.totalRevenue > 0 && !prev.achievements.includes('firstRevenue')) {
          newAchievements.push('firstRevenue');
        }
        if (newState.totalRevenue >= prev.goalRevenue && !prev.monetization.advertising.enabled && !prev.achievements.includes('noAds')) {
          newAchievements.push('noAds');
        }
        if (newState.enterpriseClients >= 3 && !prev.achievements.includes('enterprise')) {
          newAchievements.push('enterprise');
        }
        if (newState.readerSat >= 95 && !prev.achievements.includes('perfectSat')) {
          newAchievements.push('perfectSat');
        }
        if (newState.week <= 15 && newState.activeReaders >= prev.goalReaders && !prev.achievements.includes('fastWin')) {
          newAchievements.push('fastWin');
        }
        if (newState.budget >= 200000 && newState.activeReaders >= prev.goalReaders && !prev.achievements.includes('budgetMaster')) {
          newAchievements.push('budgetMaster');
        }
        const totalTeam = Object.values(newState.team).reduce((a, b) => a + b, 0);
        if (totalTeam <= 5 && newState.activeReaders >= prev.goalReaders && !prev.achievements.includes('teamSmall')) {
          newAchievements.push('teamSmall');
        }
        if (newState.premiumSubscribers >= 200 && !prev.achievements.includes('premium')) {
          newAchievements.push('premium');
        }
        if (newState.certifications >= 100 && !prev.achievements.includes('certKing')) {
          newAchievements.push('certKing');
        }

        if (newAchievements.length > 0) {
          newState.achievements = [...prev.achievements, ...newAchievements];
        }

        // Check win/lose conditions
        if (newState.activeReaders >= prev.goalReaders &&
            newState.totalRevenue >= prev.goalRevenue &&
            newState.readerSat >= prev.goalReaderSat) {
          newState.isPaused = true;
          setMessage({ type: 'success', text: `🎉 YOU WIN! Completed in ${newState.week} weeks!` });
        }
        if (newState.week >= prev.goalWeeks) {
          newState.isPaused = true;
          setMessage({ type: 'error', text: '⏰ Time\'s up! Goals not met.' });
        }
        if (newState.budget < -100000) {
          newState.isPaused = true;
          setMessage({ type: 'error', text: '💸 GAME OVER - Ran out of budget!' });
        }

        return newState;
      });
    }, gameSpeed);

    return () => clearInterval(interval);
}, [gameState.isPaused, gameSpeed, showEvent]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (showScenarios) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Tech Writing Tycoon
            </h1>
            <p className="text-xl text-slate-300">
              Build the best developer documentation on the internet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <div key={key} className="bg-slate-800 p-6 rounded-lg border-2 border-slate-700 hover:border-cyan-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold">{scenario.name}</h2>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    scenario.difficulty === 'Medium' ? 'bg-yellow-600' :
                    scenario.difficulty === 'Hard' ? 'bg-orange-600' :
                    scenario.difficulty === 'Nightmare' || scenario.difficulty === 'EXTREME' ? 'bg-red-600' :
                    'bg-green-600'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                <p className="text-slate-300 mb-4">{scenario.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Starting budget:</span>
                    <span className="font-bold text-green-400">{formatCurrency(scenario.budget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reader goal:</span>
                    <span className="font-bold text-cyan-400">{scenario.goals.readers} readers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Revenue goal:</span>
                    <span className="font-bold text-green-400">{formatCurrency(scenario.goals.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time limit:</span>
                    <span className="font-bold text-yellow-400">{scenario.goals.weeks} weeks</span>
                  </div>
                </div>
                <button
                  onClick={() => startScenario(key)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  Start {scenario.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Tech Writing Tycoon
            </h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors"
              >
                {gameState.isPaused ? <><Play size={20} /> Start</> : <><Pause size={20} /> Pause</>}
              </button>
              <button
                onClick={() => setShowMonetization(!showMonetization)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors"
              >
                <DollarSign size={20} /> Revenue
              </button>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors"
              >
                <Award size={20} /> {gameState.achievements.length}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-700 hover:bg-slate-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors"
              >
                New Game
              </button>
            </div>
          </div>

          {message && (
            <div className={`border-2 p-3 md:p-4 rounded-lg mb-4 ${
              message.type === 'success' ? 'bg-green-900/50 border-green-500' :
              message.type === 'error' ? 'bg-red-900/50 border-red-500' :
              'bg-cyan-900/50 border-cyan-500'
            }`}>
              <p className="font-semibold text-center">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-slate-800 p-3 md:p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-yellow-400" />
                  <div className="text-sm text-slate-400">Week</div>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{gameState.week}</div>
              <div className="text-xs text-slate-400">of {gameState.goalWeeks}</div>
            </div>

            <div className="bg-slate-800 p-3 md:p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  <div className="text-sm text-slate-400">Budget</div>
                </div>
                <button
                  onMouseEnter={() => setHoveredTooltip('budget')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${gameState.budget < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {formatCurrency(gameState.budget)}
              </div>
              <div className="text-xs text-slate-400">{formatCurrency(calculateWeeklyCosts(gameState))}/wk</div>
              {hoveredTooltip === 'budget' && (
                <div className="absolute z-50 bg-slate-950 border-2 border-cyan-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                  {metricTooltips.budget}
                </div>
              )}
            </div>

            <div className="bg-slate-800 p-3 md:p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-cyan-400" />
                  <div className="text-sm text-slate-400">Readers</div>
                </div>
                <button
                  onMouseEnter={() => setHoveredTooltip('activeReaders')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">{gameState.activeReaders}</div>
              <div className="text-xs text-slate-400">goal: {gameState.goalReaders}</div>
              {hoveredTooltip === 'activeReaders' && (
                <div className="absolute z-50 bg-slate-950 border-2 border-cyan-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                  {metricTooltips.activeReaders}
                </div>
              )}
            </div>

            <div className="bg-slate-800 p-3 md:p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-purple-400" />
                  <div className="text-sm text-slate-400">Reader Sat</div>
                </div>
                <button
                  onMouseEnter={() => setHoveredTooltip('readerSat')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-purple-400">{Math.floor(gameState.readerSat)}%</div>
              <div className="text-xs text-slate-400">goal: {gameState.goalReaderSat}%</div>
              {hoveredTooltip === 'readerSat' && (
                <div className="absolute z-50 bg-slate-950 border-2 border-cyan-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                  {metricTooltips.readerSat}
                </div>
              )}
            </div>

            <div className="bg-slate-800 p-3 md:p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingDown size={20} className="text-red-400" />
                  <div className="text-sm text-slate-400">Churn</div>
                </div>
                <button
                  onMouseEnter={() => setHoveredTooltip('churn')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-red-400">{Math.floor(gameState.churn)}%</div>
              <div className="text-xs text-slate-400">per week</div>
              {hoveredTooltip === 'churn' && (
                <div className="absolute z-50 bg-slate-950 border-2 border-cyan-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                  {metricTooltips.churn}
                </div>
              )}
            </div>

            <div className="bg-slate-800 p-3 md:p-4 rounded-lg relative" style={{ gridColumn: 'span 3' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  <div className="text-sm text-slate-400">Revenue</div>
                </div>
                <button
                  onMouseEnter={() => setHoveredTooltip('totalRevenue')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-green-400">{formatCurrency(gameState.revenue)}/wk</div>
              <div className="text-xs text-slate-400">
                total: {formatCurrency(gameState.totalRevenue)} / {formatCurrency(gameState.goalRevenue)}
              </div>
              {hoveredTooltip === 'totalRevenue' && (
                <div className="absolute z-50 bg-slate-950 border-2 border-cyan-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                  {metricTooltips.totalRevenue}
                </div>
              )}
            </div>
          </div>

          {showAchievements && (
            <div className="bg-slate-800 p-4 md:p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award size={24} />
                Achievements ({gameState.achievements.length}/{Object.keys(achievements).length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(achievements).map(([key, achievement]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border-2 ${
                      gameState.achievements.includes(key)
                        ? 'bg-purple-900/30 border-purple-500'
                        : 'bg-slate-700/30 border-slate-600 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-slate-400">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showMonetization && (
            <div className="bg-slate-800 p-4 md:p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign size={24} />
                Revenue streams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(monetizationData).map(([key, strategy]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg ${
                      gameState.monetization[key].enabled
                        ? 'bg-green-900/30 border-2 border-green-600'
                        : 'bg-slate-700'
                    }`}
                  >
                    <div className="font-semibold mb-1">{strategy.name}</div>
                    <div className="text-sm text-slate-400 mb-2">{strategy.description}</div>
                    {!gameState.monetization[key].enabled && key !== 'freemium' && (
                      <button
                        onClick={() => enableMonetization(key)}
                        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold transition-colors"
                      >
                        Enable ({formatCurrency(strategy.cost)})
                      </button>
                    )}
                    {gameState.monetization[key].enabled && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle size={16} />
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-4 md:p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen size={24} />
              Content & touchpoints
            </h2>
            
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              {Object.entries(touchpointData).map(([key, data]) => {
                const tp = gameState.touchpoints[key];
                
                // Check if staff requirements are met
                let staffRequirementsMet = true;
                let missingStaff = [];
                if (data.requires) {
                  Object.keys(data.requires).forEach(role => {
                    if (gameState.team[role] < data.requires[role]) {
                      staffRequirementsMet = false;
                      const roleLabel = teamRoles.find(r => r.key === role)?.label || role;
                      missingStaff.push(`${data.requires[role]} ${roleLabel}`);
                    }
                  });
                }
                
                return (
                  <div key={key} className={`p-4 rounded-lg relative ${tp.invested ? 'bg-green-900/30 border-2 border-green-600' : 'bg-slate-700'}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {tp.invested && <CheckCircle size={16} className="text-green-400" />}
                          {data.name}
                          <button
                            onMouseEnter={() => setHoveredTooltip(key + '_tp')}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            className="text-slate-400 hover:text-cyan-400 transition-colors"
                          >
                            <Info size={16} />
                          </button>
                        </div>
                        <div className="text-sm text-slate-400">{data.impact}</div>
                        {data.requires && !tp.invested && (
                          <div className="text-xs text-slate-400 mt-1">
                            Requires: {Object.entries(data.requires).map(([role, count]) => {
                              const roleLabel = teamRoles.find(r => r.key === role)?.label || role;
                              const hasEnough = gameState.team[role] >= count;
                              return (
                                <span key={role} className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                                  {count} {roleLabel}
                                  {Object.keys(data.requires).indexOf(role) < Object.keys(data.requires).length - 1 ? ', ' : ''}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{formatCurrency(data.cost)}</div>
                        <div className="text-xs text-slate-400">${data.maintenance * 100}/wk</div>
                      </div>
                    </div>
                    
                    {hoveredTooltip === key + '_tp' && (
                      <div className="absolute z-50 bg-slate-950 border-2 border-cyan-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                        {data.tooltip}
                      </div>
                    )}
                    
                    {!tp.invested && (
                      <button
                        onClick={() => investInTouchpoint(key)}
                        disabled={!staffRequirementsMet}
                        className={`w-full py-2 rounded mt-2 font-semibold transition-colors ${
                          staffRequirementsMet 
                            ? 'bg-cyan-600 hover:bg-cyan-700' 
                            : 'bg-slate-600 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {staffRequirementsMet ? 'Create' : 'Need more staff'}
                      </button>
                    )}
                    
                    {tp.invested && (
                      <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                        <CheckCircle size={16} />
                        Published
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800 p-4 md:p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users size={24} />
              Your docs team
            </h2>
            
            <div className="space-y-3">
              {teamRoles.map(role => (
                <div key={role.key} className="bg-slate-700 p-4 rounded-lg relative">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {role.label}
                          <button
                            onMouseEnter={() => setHoveredTooltip(role.key + '_team')}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            className="text-slate-400 hover:text-purple-400 transition-colors"
                          >
                            <Info size={16} />
                          </button>
                        </div>
                        <div className="text-sm text-slate-400">
                          Count: {gameState.team[role.key]} | ${role.salary}/wk each
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">{formatCurrency(role.cost)}</div>
                      <div className="text-xs text-slate-400">to hire</div>
                    </div>
                  </div>
                  
                  {hoveredTooltip === role.key + '_team' && (
                    <div className="absolute z-50 bg-slate-950 border-2 border-purple-500 p-3 rounded-lg text-sm mt-2 left-0 right-0 shadow-xl">
                      {role.tooltip}
                    </div>
                  )}
                  
                  <button
                    onClick={() => hireTeamMember(role.key)}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold transition-colors"
                  >
                    Hire +1
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
              <div className="font-semibold mb-2">Weekly costs</div>
              <div className="text-2xl font-bold text-red-400">
                {formatCurrency(calculateWeeklyCosts(gameState))}/week
              </div>
            </div>
          </div>
        </div>

        {showEvent && gameState.pendingEvent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 md:p-6 z-50">
            <div className="bg-slate-800 rounded-lg p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={32} className="text-yellow-400" />
                <h2 className="text-2xl font-bold">{gameState.pendingEvent.title}</h2>
              </div>
              
              <p className="text-slate-300 mb-6 text-lg">
                {gameState.pendingEvent.description}
              </p>
              
              <div className="space-y-3">
                {gameState.pendingEvent.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEventChoice(option)}
                    className="w-full p-4 rounded-lg text-left bg-slate-700 hover:bg-slate-600 transition-all"
                  >
                    <div className="font-semibold mb-1">{option.text}</div>
                    <div className="text-sm text-slate-400">
                      {Object.keys(option.effect).map(key => {
                        if (key === 'budget') return `Budget: ${formatCurrency(option.effect[key])}`;
                        if (key === 'revenue') return `Revenue: +${formatCurrency(option.effect[key])}`;
                        if (key === 'readerSat') return `Reader sat: ${option.effect[key] > 0 ? '+' : ''}${option.effect[key]}%`;
                        if (key === 'readers') return `${option.effect[key] > 0 ? '+' : ''}${option.effect[key]} readers`;
                        if (key === 'enterpriseClients') return `+${option.effect[key]} enterprise client(s)`;
                        return '';
                      }).filter(Boolean).join(' • ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsResourcesTycoon;