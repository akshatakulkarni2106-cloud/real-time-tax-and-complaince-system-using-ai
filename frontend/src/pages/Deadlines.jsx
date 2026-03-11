import { useState, useEffect } from 'react';

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap';
document.head.appendChild(fontLink);

// ─── Dynamic Deadline Generator ───────────────────────────────────────────────
function makeDate(year, month, day) {
  return new Date(year, month, day).toISOString().split('T')[0];
}

function generateDeadlines() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const deadlines = [];

  for (let i = -1; i <= 3; i++) {
    let dm = m + i, dy = y;
    if (dm < 0) { dm += 12; dy -= 1; }
    if (dm > 11) { dm -= 12; dy += 1; }
    const monthName = new Date(dy, dm, 1).toLocaleString('default', { month: 'long' });
    const shortMonth = new Date(dy, dm, 1).toLocaleString('default', { month: 'short' });
    let g1m = dm + 1, g1y = dy;
    if (g1m > 11) { g1m -= 12; g1y += 1; }
    deadlines.push({ title: `GSTR-1`, subtitle: shortMonth, date: makeDate(g1y, g1m, 11), category: 'GST', desc: `Outward supplies return — upload all ${monthName} sales invoices` });
    deadlines.push({ title: `GSTR-3B`, subtitle: shortMonth, date: makeDate(g1y, g1m, 20), category: 'GST', desc: `Monthly summary return — pay GST dues for ${monthName}` });
  }

  [{ label:'Q1', month:5, day:15, desc:'1st advance tax installment (15%)' },
   { label:'Q2', month:8, day:15, desc:'2nd advance tax installment (45% cumulative)' },
   { label:'Q3', month:11, day:15, desc:'3rd advance tax installment (75% cumulative)' },
   { label:'Q4', month:2, day:15, desc:'Final advance tax installment (100%)', next:true }]
  .forEach(({ label, month, day, desc, next }) => {
    deadlines.push({ title: `Advance Tax`, subtitle: label, date: makeDate(next ? y+1 : y, month, day), category: 'Income Tax', desc: `${desc} for FY ${y}-${String(y+1).slice(2)}` });
  });

  [{ q:'Q1', month:6, day:31, range:'Apr–Jun' },
   { q:'Q2', month:9, day:31, range:'Jul–Sep' },
   { q:'Q3', month:0, day:31, range:'Oct–Dec', next:true },
   { q:'Q4', month:4, day:31, range:'Jan–Mar', next:true }]
  .forEach(({ q, month, day, range, next }) => {
    deadlines.push({ title: `TDS Return`, subtitle: q, date: makeDate(next ? y+1 : y, month, day), category: 'TDS', desc: `Quarterly TDS return for ${range}` });
  });

  deadlines.push(
    { title: 'ITR Filing', subtitle: 'Annual', date: makeDate(y, 6, 31), category: 'Income Tax', desc: `Annual income tax return for FY ${y-1}-${String(y).slice(2)}` },
    { title: 'ITR (Audit)', subtitle: 'Extended', date: makeDate(y, 9, 31), category: 'Income Tax', desc: `Extended deadline for businesses requiring audit` },
    { title: 'GSTR-9', subtitle: 'Annual', date: makeDate(y, 11, 31), category: 'GST', desc: `Annual GST return for FY ${y-1}-${String(y).slice(2)}` },
    { title: 'Form 16', subtitle: 'Issue', date: makeDate(y, 5, 15), category: 'TDS', desc: `Employers must issue TDS certificate to employees` }
  );

  return deadlines.map(d => {
    const days = Math.ceil((new Date(d.date) - today) / 86400000);
    let urgency = 'safe';
    if (days < 0) urgency = 'overdue';
    else if (days <= 14) urgency = 'urgent';
    else if (days <= 45) urgency = 'upcoming';
    return { ...d, urgency, days };
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .filter(d => d.days >= -7)
  .filter((d, i, arr) => arr.findIndex(x => x.title === d.title && x.date === d.date) === i);
}

// ─── Category Config ──────────────────────────────────────────────────────────
const CAT = {
  'GST':         { color: '#F0A500', glow: 'rgba(240,165,0,0.3)',   icon: '🟡', bg: 'rgba(240,165,0,0.08)' },
  'Income Tax':  { color: '#00D4A0', glow: 'rgba(0,212,160,0.3)',   icon: '🟢', bg: 'rgba(0,212,160,0.08)' },
  'TDS':         { color: '#4D8FFF', glow: 'rgba(77,143,255,0.3)',  icon: '🔵', bg: 'rgba(77,143,255,0.08)' },
};

const URGENCY = {
  overdue:  { color: '#FF3B3B', label: 'OVERDUE',  bg: 'rgba(255,59,59,0.12)',  border: 'rgba(255,59,59,0.4)' },
  urgent:   { color: '#FF6B35', label: 'ACT NOW',  bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.4)' },
  upcoming: { color: '#F0A500', label: 'UPCOMING', bg: 'rgba(240,165,0,0.12)',  border: 'rgba(240,165,0,0.4)' },
  safe:     { color: '#00D4A0', label: 'ON TRACK', bg: 'rgba(0,212,160,0.12)',  border: 'rgba(0,212,160,0.4)' },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(240,165,0,0.1); } 50% { box-shadow: 0 0 40px rgba(240,165,0,0.25); } }

  .dl-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .dl-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #090909;
    min-height: 100vh;
    color: #E8E8E0;
    padding: 40px 24px 80px;
    position: relative;
    overflow: hidden;
  }

  .dl-wrap::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(240,165,0,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .dl-wrap::after {
    content: '';
    position: fixed;
    bottom: -200px; right: -200px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,212,160,0.03) 0%, transparent 70%);
    pointer-events: none;
  }

  .dl-inner { max-width: 860px; margin: 0 auto; }

  /* Header */
  .dl-header { margin-bottom: 40px; animation: fadeUp 0.5s ease both; }

  .dl-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    color: #F0A500;
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }

  .dl-eyebrow::before {
    content: '';
    width: 24px; height: 2px;
    background: #F0A500;
    display: inline-block;
  }

  .dl-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(48px, 8vw, 80px);
    line-height: 0.9;
    color: #F5F5EE;
    letter-spacing: 0.01em;
    margin-bottom: 12px;
  }

  .dl-title span {
    background: linear-gradient(135deg, #F0A500, #FFD060, #F0A500);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .dl-subtitle {
    font-size: 14px; color: #666; font-weight: 400; line-height: 1.5;
    max-width: 460px;
  }

  /* Stats Row */
  .dl-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 28px;
    animation: fadeUp 0.5s 0.1s ease both;
  }

  .dl-stat {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .dl-stat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent);
    pointer-events: none;
  }

  .dl-stat:hover { transform: translateY(-2px); }

  .dl-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 8px; opacity: 0.8;
  }

  .dl-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px; line-height: 1;
    margin-bottom: 2px;
  }

  .dl-stat-sub { font-size: 10px; opacity: 0.5; }

  /* Filter Tabs */
  .dl-filters {
    display: flex; gap: 6px; flex-wrap: wrap;
    margin-bottom: 32px;
    animation: fadeUp 0.5s 0.15s ease both;
  }

  .dl-filter-btn {
    padding: 7px 16px;
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
    border: 1px solid rgba(255,255,255,0.08);
    font-family: 'DM Sans', sans-serif;
    background: rgba(255,255,255,0.03);
    color: #666;
    letter-spacing: 0.02em;
  }

  .dl-filter-btn:hover { color: #ccc; border-color: rgba(255,255,255,0.15); }
  .dl-filter-btn.active { border-color: #F0A500; color: #F0A500; background: rgba(240,165,0,0.08); }

  .dl-filter-count {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 50%;
    font-size: 10px; margin-left: 5px;
    background: rgba(255,255,255,0.06);
  }

  /* Section Label */
  .dl-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600;
    color: #444; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 12px 0 10px;
    border-bottom: 1px solid #1a1a1a;
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 10px;
  }

  /* Cards */
  .dl-card {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: 0;
    margin-bottom: 6px;
    border-radius: 14px;
    border: 1px solid #1C1C1C;
    background: #111;
    overflow: hidden;
    animation: slideIn 0.4s ease both;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    cursor: default;
  }

  .dl-card:hover {
    transform: translateX(4px);
    border-color: #2a2a2a;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  .dl-card.overdue { border-color: rgba(255,59,59,0.2); }
  .dl-card.urgent  { border-color: rgba(255,107,53,0.15); }
  .dl-card.overdue:hover, .dl-card.urgent:hover { box-shadow: 0 4px 24px rgba(255,59,59,0.08); }

  /* Date Column */
  .dl-date-col {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 16px 0;
    border-right: 1px solid #1a1a1a;
    background: #0D0D0D;
    min-width: 56px;
  }

  .dl-date-day {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; line-height: 1;
    color: #E8E8E0;
  }

  .dl-date-mon {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; font-weight: 600;
    color: #444; letter-spacing: 0.1em;
    text-transform: uppercase; margin-top: 1px;
  }

  /* Body */
  .dl-body {
    padding: 14px 18px;
    display: flex; flex-direction: column; justify-content: center;
  }

  .dl-card-head {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 4px;
  }

  .dl-card-title {
    font-size: 14px; font-weight: 600;
    color: #E8E8E0; letter-spacing: 0.01em;
  }

  .dl-card-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; font-weight: 600;
    padding: 2px 7px; border-radius: 4px;
    letter-spacing: 0.08em;
  }

  .dl-card-desc {
    font-size: 12px; color: #555; line-height: 1.4;
    margin-bottom: 8px;
  }

  .dl-cat-tag {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600;
    padding: 3px 8px; border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.06em;
  }

  /* Right col */
  .dl-right {
    padding: 14px 18px;
    display: flex; flex-direction: column;
    align-items: flex-end; justify-content: center;
    min-width: 90px;
    border-left: 1px solid #1a1a1a;
  }

  .dl-days-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px; line-height: 1;
    margin-bottom: 1px;
  }

  .dl-days-label {
    font-size: 9px; color: #444;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 8px;
  }

  .dl-urgency-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; font-weight: 600;
    padding: 3px 8px; border-radius: 100px;
    letter-spacing: 0.1em;
  }

  .dl-overdue-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; color: #FF3B3B;
    animation: pulse 1.5s infinite;
    letter-spacing: 0.05em;
  }

  /* Info bar */
  .dl-infobar {
    margin-top: 36px;
    padding: 20px 24px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(240,165,0,0.04), rgba(240,165,0,0.02));
    border: 1px solid rgba(240,165,0,0.12);
    animation: fadeUp 0.5s 0.3s ease both;
  }

  .dl-infobar-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    color: #F0A500; letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }

  .dl-infobar p {
    font-size: 13px; color: #555; line-height: 1.7;
  }

  .dl-infobar strong { color: #888; }

  .dl-timestamp {
    margin-top: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #333;
  }

  /* Dot indicator */
  .dl-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00D4A0; display: inline-block;
    animation: pulse 1.5s infinite;
  }

  @media (max-width: 600px) {
    .dl-stats { grid-template-columns: repeat(2, 1fr); }
    .dl-card { grid-template-columns: 48px 1fr auto; }
    .dl-title { font-size: 48px; }
  }
`;

export default function Deadlines() {
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const DEADLINES = generateDeadlines();

  useEffect(() => { setMounted(true); }, []);

  const filtered = filter === 'all' ? DEADLINES : DEADLINES.filter(d => d.urgency === filter);
  const counts = {
    all: DEADLINES.length,
    overdue: DEADLINES.filter(d => d.urgency === 'overdue').length,
    urgent: DEADLINES.filter(d => d.urgency === 'urgent').length,
    upcoming: DEADLINES.filter(d => d.urgency === 'upcoming').length,
    safe: DEADLINES.filter(d => d.urgency === 'safe').length,
  };

  const today = new Date();

  // Group by urgency for section labels
  const sections = [];
  let lastUrgency = null;
  filtered.forEach((d, i) => {
    if (d.urgency !== lastUrgency) {
      sections.push({ type: 'label', urgency: d.urgency, index: i });
      lastUrgency = d.urgency;
    }
    sections.push({ type: 'card', data: d, index: i });
  });

  return (
    <>
      <style>{styles}</style>
      <div className="dl-wrap">
        <div className="dl-inner">

          {/* Header */}
          <div className="dl-header">
            <div className="dl-eyebrow">
              <span className="dl-live-dot" /> Tax Filing Calendar
            </div>
            <div className="dl-title">
              Filing<br /><span>Deadlines</span>
            </div>
            <div className="dl-subtitle">
              Every Indian tax deadline, auto-calculated — so you never pay a late fee again.
            </div>
          </div>

          {/* Stats */}
          <div className="dl-stats">
            {[
              { key:'overdue',  label:'Overdue',  icon:'●' },
              { key:'urgent',   label:'Urgent',   icon:'▲' },
              { key:'upcoming', label:'Upcoming', icon:'◆' },
              { key:'safe',     label:'On Track', icon:'✓' },
            ].map((s, i) => {
              const u = URGENCY[s.key];
              return (
                <div key={s.key} className="dl-stat"
                  onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
                  style={{
                    background: filter === s.key ? u.bg : 'rgba(255,255,255,0.02)',
                    borderColor: filter === s.key ? u.border : '#1a1a1a',
                    boxShadow: filter === s.key ? `0 0 24px ${u.bg}` : 'none',
                    animationDelay: `${i * 0.07}s`
                  }}
                >
                  <div className="dl-stat-label" style={{ color: u.color }}>{s.icon} {s.label}</div>
                  <div className="dl-stat-num" style={{ color: u.color }}>{counts[s.key]}</div>
                  <div className="dl-stat-sub">deadlines</div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="dl-filters">
            {[
              { key:'all', label:'All Deadlines' },
              { key:'overdue', label:'Overdue' },
              { key:'urgent', label:'Urgent' },
              { key:'upcoming', label:'Upcoming' },
              { key:'safe', label:'Safe' },
            ].map(f => (
              <button key={f.key} className={`dl-filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}>
                {f.label}
                <span className="dl-filter-count">{counts[f.key]}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div>
            {sections.map((s, i) => {
              if (s.type === 'label') {
                const u = URGENCY[s.urgency];
                const labels = { overdue:'Overdue', urgent:'Act Now', upcoming:'Upcoming Soon', safe:'On Track' };
                return (
                  <div key={`label-${i}`} className="dl-section-label">
                    <span style={{ color: u.color }}>■</span>
                    <span>{labels[s.urgency]}</span>
                  </div>
                );
              }

              const d = s.data;
              const dt = new Date(d.date);
              const cat = CAT[d.category] || CAT['TDS'];
              const u = URGENCY[d.urgency];

              return (
                <div key={i} className={`dl-card ${d.urgency}`}
                  style={{ animationDelay: `${s.index * 0.04}s` }}>

                  {/* Date */}
                  <div className="dl-date-col">
                    <div className="dl-date-day">{dt.getDate()}</div>
                    <div className="dl-date-mon">{dt.toLocaleString('default', { month:'short' })}</div>
                  </div>

                  {/* Body */}
                  <div className="dl-body">
                    <div className="dl-card-head">
                      <span className="dl-card-title">{d.title}</span>
                      {d.subtitle && (
                        <span className="dl-card-badge"
                          style={{ background: cat.bg, color: cat.color }}>
                          {d.subtitle}
                        </span>
                      )}
                    </div>
                    <div className="dl-card-desc">{d.desc}</div>
                    <div>
                      <span className="dl-cat-tag" style={{ background: cat.bg, color: cat.color }}>
                        {d.category}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="dl-right">
                    {d.urgency === 'overdue' ? (
                      <div className="dl-overdue-text">OVERDUE</div>
                    ) : (
                      <>
                        <div className="dl-days-num" style={{ color: u.color }}>{d.days}</div>
                        <div className="dl-days-label">days left</div>
                      </>
                    )}
                    <div className="dl-urgency-pill"
                      style={{ background: u.bg, color: u.color, border: `1px solid ${u.border}` }}>
                      {u.label}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Info Bar */}
          <div className="dl-infobar">
            <div className="dl-infobar-title">
              <span>⚡</span> Penalty Guide
            </div>
            <p>
              <strong>GST late filing:</strong> ₹50/day (max ₹5,000) &nbsp;·&nbsp;
              <strong>ITR late filing:</strong> ₹5,000 fine &nbsp;·&nbsp;
              <strong>TDS default:</strong> ₹200/day + 1.5% interest/month.
              Filing on time — even without full payment — significantly reduces penalties.
            </p>
            <div className="dl-timestamp">
              AUTO-REFRESHED · {today.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }).toUpperCase()}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
