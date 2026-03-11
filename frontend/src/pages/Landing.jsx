import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Fonts ─────────────────────────────────────────────────────────────────── */
if (!document.getElementById('ld-fonts')) {
  const l = document.createElement('link');
  l.id = 'ld-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap';
  document.head.appendChild(l);
}

/* ── CSS ────────────────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes ld-up      { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ld-in      { from{opacity:0} to{opacity:1} }
  @keyframes ld-float   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.03)} }
  @keyframes ld-orb     { 0%{transform:translate(0,0)} 25%{transform:translate(50px,-40px)} 50%{transform:translate(-30px,60px)} 75%{transform:translate(70px,20px)} 100%{transform:translate(0,0)} }
  @keyframes ld-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes ld-spin    { to{transform:rotate(360deg)} }
  @keyframes ld-pulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
  @keyframes ld-scan    { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes ld-ripple  { 0%{transform:translate(-50%,-50%) scale(0);opacity:0.7} 100%{transform:translate(-50%,-50%) scale(1);opacity:0} }
  @keyframes ld-spark   { 0%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)} }
  @keyframes ld-particle{ 0%{opacity:0;transform:translateY(0)} 10%{opacity:1} 90%{opacity:0.4} 100%{opacity:0;transform:translateY(-160px) translateX(var(--dx))} }
  @keyframes ld-ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes ld-countup { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
  @keyframes ld-glow    { 0%,100%{box-shadow:0 0 30px rgba(240,165,0,0.1)} 50%{box-shadow:0 0 60px rgba(240,165,0,0.3)} }
  @keyframes ld-border  { 0%,100%{border-color:rgba(240,165,0,0.15)} 50%{border-color:rgba(240,165,0,0.4)} }

  .ld * { box-sizing:border-box; margin:0; padding:0; }
  .ld {
    font-family:'DM Sans',sans-serif;
    background:#050505; color:#E8E6DE;
    overflow-x:hidden; min-height:100vh;
    cursor:crosshair;
    position:relative;
  }

  /* ══ LIVE WALLPAPER CANVAS ══ */
  .ld-wallpaper {
    position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden;
  }
  .ld-orb {
    position:absolute; border-radius:50%;
    filter:blur(90px); pointer-events:none;
    animation:ld-orb var(--dur) ease-in-out infinite;
    animation-delay:var(--delay);
    will-change:transform;
  }
  .ld-grid {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(240,165,0,0.03) 1px,transparent 1px),
      linear-gradient(90deg,rgba(240,165,0,0.03) 1px,transparent 1px);
    background-size:64px 64px;
    animation:ld-in 2s ease forwards;
  }
  .ld-scan-line {
    position:absolute; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(240,165,0,0.25),rgba(255,255,255,0.05),rgba(240,165,0,0.25),transparent);
    animation:ld-scan 8s linear infinite;
    animation-delay:1s;
  }
  .ld-particle {
    position:absolute; width:2px; height:2px; border-radius:50%;
    background:rgba(240,165,0,0.8); pointer-events:none;
    animation:ld-particle var(--dur) ease-in infinite;
    animation-delay:var(--delay);
  }

  /* ══ CLICK EFFECTS ══ */
  .ld-ripple {
    position:fixed; border-radius:50%; pointer-events:none; z-index:999;
    border:1.5px solid rgba(240,165,0,0.6);
    width:var(--s); height:var(--s);
    animation:ld-ripple 1s cubic-bezier(0,.6,.4,1) forwards;
  }
  .ld-ripple2 {
    position:fixed; border-radius:50%; pointer-events:none; z-index:999;
    border:1px solid rgba(240,165,0,0.2);
    width:var(--s2); height:var(--s2);
    animation:ld-ripple 1.5s cubic-bezier(0,.5,.5,1) .1s forwards;
  }
  .ld-spark {
    position:fixed; width:5px; height:5px; border-radius:50%;
    background:var(--sc); pointer-events:none; z-index:999;
    animation:ld-spark .8s ease-out forwards;
    animation-delay:var(--sd);
  }

  /* ══ NAVBAR ══ */
  .ld-nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; justify-content:space-between; align-items:center;
    padding:18px 48px;
    background:rgba(5,5,5,0.7); backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(240,165,0,0.06);
    animation:ld-up 0.6s ease both;
  }
  .ld-logo {
    font-family:'Bebas Neue',sans-serif; font-size:26px;
    letter-spacing:0.05em; color:#F5F0E8;
  }
  .ld-logo span { color:#F0A500; }
  .ld-nav-right { display:flex; gap:12px; align-items:center; }
  .ld-nav-link {
    font-size:13px; color:#444; font-weight:500; cursor:pointer;
    transition:color .2s; background:none; border:none;
    font-family:'DM Sans',sans-serif; padding:6px 12px;
  }
  .ld-nav-link:hover { color:#E8E6DE; }
  .ld-nav-cta {
    background:linear-gradient(135deg,#C68A00,#F0A500);
    border:none; color:#000; font-size:13px; font-weight:700;
    padding:10px 22px; border-radius:10px; cursor:pointer;
    font-family:'DM Sans',sans-serif; letter-spacing:0.03em;
    box-shadow:0 4px 20px rgba(240,165,0,0.25);
    transition:all .25s;
  }
  .ld-nav-cta:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(240,165,0,0.4); }

  /* ══ HERO ══ */
  .ld-hero {
    min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    padding:120px 32px 80px; text-align:center;
    position:relative; z-index:10;
  }
  .ld-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(240,165,0,0.07); border:1px solid rgba(240,165,0,0.18);
    color:#F0A500; font-size:11px; font-weight:700;
    padding:7px 18px; border-radius:100px; margin-bottom:32px;
    font-family:'JetBrains Mono',monospace; letter-spacing:0.12em; text-transform:uppercase;
    animation:ld-up 0.7s ease both, ld-border 3s ease 1s infinite;
  }
  .ld-badge-dot { width:6px; height:6px; border-radius:50%; background:#F0A500; animation:ld-pulse 2s infinite; }

  .ld-h1 {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(70px,10vw,140px); line-height:0.9;
    letter-spacing:0.01em; margin-bottom:28px;
  }
  .ld-h1 .l1 { display:block; color:#F0F0E8; animation:ld-up 0.7s .1s ease both; }
  .ld-h1 .l2 {
    display:block;
    background:linear-gradient(135deg,#F0A500 0%,#FFD060 40%,#F0A500 80%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:ld-up 0.7s .18s ease both, ld-shimmer 4s linear .8s infinite;
  }
  .ld-h1 .l3 {
    display:block; color:transparent;
    -webkit-text-stroke:2px rgba(240,165,0,0.35);
    animation:ld-up 0.7s .26s ease both;
    font-style:italic;
  }

  .ld-sub {
    font-size:clamp(14px,2vw,18px); color:#3e3e38; max-width:560px;
    line-height:1.7; margin-bottom:44px;
    animation:ld-up 0.7s .32s ease both;
  }
  .ld-sub strong { color:#666; font-weight:600; }

  .ld-btns {
    display:flex; gap:14px; flex-wrap:wrap; justify-content:center;
    margin-bottom:64px; animation:ld-up 0.7s .38s ease both;
  }
  .ld-btn-primary {
    background:linear-gradient(135deg,#B07800,#F0A500 50%,#FFD060);
    background-size:200% auto; border:none; color:#000;
    font-size:15px; font-weight:700; padding:16px 36px; border-radius:14px;
    cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.03em;
    box-shadow:0 8px 28px rgba(240,165,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
    transition:all .25s; animation:ld-glow 3s ease 1s infinite;
  }
  .ld-btn-primary:hover { background-position:right center; transform:translateY(-2px); box-shadow:0 14px 40px rgba(240,165,0,0.45); }
  .ld-btn-secondary {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1);
    color:#666; font-size:15px; font-weight:600; padding:16px 36px; border-radius:14px;
    cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .25s;
    backdrop-filter:blur(8px);
  }
  .ld-btn-secondary:hover { color:#E8E6DE; border-color:rgba(255,255,255,0.2); background:rgba(255,255,255,0.06); }

  /* Stats */
  .ld-stats {
    display:flex; gap:0; animation:ld-up 0.7s .44s ease both;
    border:1px solid #161610; border-radius:16px; overflow:hidden;
    backdrop-filter:blur(10px); background:rgba(10,10,8,0.5);
  }
  .ld-stat {
    padding:20px 32px; text-align:center; border-right:1px solid #161610;
    transition:background .2s; position:relative; overflow:hidden;
  }
  .ld-stat:last-child { border-right:none; }
  .ld-stat:hover { background:rgba(240,165,0,0.04); }
  .ld-stat-n {
    font-family:'Bebas Neue',sans-serif; font-size:36px; line-height:1;
    color:#F0A500; margin-bottom:4px;
    animation:ld-countup 0.5s ease both;
  }
  .ld-stat-l { font-size:10px; color:#333; font-family:'JetBrains Mono',monospace; letter-spacing:0.15em; text-transform:uppercase; }

  /* ══ TICKER ══ */
  .ld-ticker {
    padding:14px 0; background:rgba(240,165,0,0.04);
    border-top:1px solid rgba(240,165,0,0.08);
    border-bottom:1px solid rgba(240,165,0,0.08);
    overflow:hidden; position:relative; z-index:10; margin-top:0;
  }
  .ld-ticker-inner {
    display:flex; gap:0; white-space:nowrap;
    animation:ld-ticker 20s linear infinite;
    width:fit-content;
  }
  .ld-ticker-item {
    display:inline-flex; align-items:center; gap:10px;
    font-size:11px; font-weight:600; color:#383830;
    font-family:'JetBrains Mono',monospace; letter-spacing:0.1em;
    padding:0 32px; text-transform:uppercase;
  }
  .ld-ticker-dot { width:4px; height:4px; border-radius:50%; background:#F0A500; opacity:0.5; }

  /* ══ FEATURES ══ */
  .ld-section { padding:100px 48px; position:relative; z-index:10; }
  .ld-section-label {
    text-align:center; margin-bottom:60px;
  }
  .ld-section-eyebrow {
    font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600;
    color:#F0A500; letter-spacing:0.25em; text-transform:uppercase; margin-bottom:14px;
  }
  .ld-section-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(42px,5vw,72px); line-height:0.95;
    color:#F0F0E8; letter-spacing:0.01em;
  }
  .ld-section-title span {
    background:linear-gradient(135deg,#F0A500,#FFD060);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }

  .ld-features {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:2px; max-width:1100px; margin:0 auto;
    border:1px solid #141410; border-radius:20px; overflow:hidden;
  }
  .ld-feat {
    background:#0a0a08; padding:32px 28px;
    border-right:1px solid #141410; border-bottom:1px solid #141410;
    transition:background .25s, transform .25s; position:relative; overflow:hidden;
    cursor:default;
  }
  .ld-feat::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(circle at 0% 0%, rgba(240,165,0,0.06), transparent 60%);
    opacity:0; transition:opacity .3s;
  }
  .ld-feat:hover { background:#0f0f0c; }
  .ld-feat:hover::before { opacity:1; }
  .ld-feat-glow {
    position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(240,165,0,0.2),transparent);
    transform:scaleX(0); transition:transform .3s; transform-origin:left;
  }
  .ld-feat:hover .ld-feat-glow { transform:scaleX(1); }
  .ld-feat-ico  { font-size:32px; margin-bottom:16px; display:block; animation:ld-float 4s ease-in-out infinite; animation-delay:var(--fi); }
  .ld-feat-title{ font-family:'Bebas Neue',sans-serif; font-size:22px; color:#E0DED6; letter-spacing:0.04em; margin-bottom:10px; }
  .ld-feat-desc { font-size:13px; color:#3a3a34; line-height:1.65; }

  /* ══ TESTIMONIALS ══ */
  .ld-testi-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:12px; max-width:1000px; margin:0 auto;
  }
  .ld-testi {
    background:linear-gradient(160deg,#0d0d0b,#090907);
    border:1px solid #181814; border-radius:18px; padding:28px;
    transition:all .25s; position:relative; overflow:hidden;
  }
  .ld-testi::before {
    content:'"'; position:absolute; top:-10px; right:20px;
    font-family:'Bebas Neue',sans-serif; font-size:120px;
    color:rgba(240,165,0,0.04); line-height:1; pointer-events:none;
  }
  .ld-testi:hover { border-color:#242420; transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.5); }
  .ld-testi-text { font-size:15px; color:#555; line-height:1.7; margin-bottom:24px; font-style:italic; }
  .ld-testi-bottom { display:flex; align-items:center; gap:12px; padding-top:20px; border-top:1px solid #141410; }
  .ld-testi-avatar { font-size:32px; }
  .ld-testi-name { font-size:14px; font-weight:600; color:#888; }
  .ld-testi-role { font-size:11px; color:#333; margin-top:2px; }

  /* ══ CTA ══ */
  .ld-cta {
    padding:120px 48px; text-align:center; position:relative; z-index:10;
    border-top:1px solid #141410;
  }
  .ld-cta-bg {
    position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 100%, rgba(240,165,0,0.06), transparent 60%);
    pointer-events:none;
  }
  .ld-cta-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(50px,7vw,90px); line-height:0.95;
    color:#F0F0E8; margin-bottom:20px; letter-spacing:0.01em;
  }
  .ld-cta-title span {
    background:linear-gradient(135deg,#F0A500,#FFD060);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }
  .ld-cta-sub { font-size:16px; color:#3a3a34; max-width:460px; margin:0 auto 44px; line-height:1.6; }

  /* ══ FOOTER ══ */
  .ld-footer {
    padding:32px 48px; border-top:1px solid #141410;
    display:flex; justify-content:space-between; align-items:center;
    position:relative; z-index:10; flex-wrap:wrap; gap:12px;
  }
  .ld-footer-logo { font-family:'Bebas Neue',sans-serif; font-size:20px; color:#2a2a24; letter-spacing:0.05em; }
  .ld-footer-logo span { color:#383830; }
  .ld-footer-text { font-size:11px; color:#242420; font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; }

  @media(max-width:768px){
    .ld-nav { padding:16px 20px; }
    .ld-hero { padding:100px 20px 60px; }
    .ld-stats { flex-wrap:wrap; }
    .ld-stat { flex:1; min-width:80px; padding:16px 16px; }
    .ld-section { padding:60px 20px; }
    .ld-cta { padding:60px 20px; }
    .ld-footer { padding:24px 20px; flex-direction:column; text-align:center; }
  }
`;

/* ── Data ───────────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon:'🤖', title:'AI Tax Assistant',    desc:'Ask anything about GST, ITR, or compliance in plain language. Instant jargon-free answers.', delay:'0s' },
  { icon:'⏰', title:'Deadline Tracker',    desc:'Smart deadline calendar with auto-alerts. Never miss a GST or ITR filing date ever again.', delay:'0.3s' },
  { icon:'✅', title:'Smart Checklists',    desc:'Step-by-step compliance checklists tailored precisely to your business type and income.', delay:'0.6s' },
  { icon:'🧮', title:'Tax Calculator',      desc:'Estimate your tax liability in seconds. See instantly if GST registration is needed.', delay:'0.9s' },
  { icon:'🏛️', title:'Government Schemes', desc:'Discover loans, subsidies, and MSME benefits you qualify for — most people miss these!', delay:'1.2s' },
  { icon:'📊', title:'Live Dashboard',      desc:'Visual compliance score, charts, and progress tracker — always know exactly where you stand.', delay:'1.5s' },
];

const TESTIMONIALS = [
  { name:'Ravi Kumar',   role:'Street Vendor, Mumbai',   text:'I used to be terrified of tax. Now I file GST myself every month!', avatar:'🧑‍🦱' },
  { name:'Priya Sharma', role:'Freelancer, Bangalore',   text:'Found out I qualify for MUDRA loan through this app. Got ₹2L funded!', avatar:'👩‍💻' },
  { name:'Mohan Das',    role:'Small Trader, Chennai',   text:'Saved ₹8,000 using Presumptive Taxation — the calculator showed me!', avatar:'🧔' },
];

const TICKER_ITEMS = ['GST Filing','ITR Returns','Advance Tax','TDS Compliance','MSME Schemes','MUDRA Loans','Form 16','GSTR-1','GSTR-3B','Presumptive Tax'];
const SPARK_COLORS = ['#F0A500','#FFD060','#FF9500','#FFF0A0','#FFFFFF','#FFB300'];

/* ── Particles config ───────────────────────────────────────────────────────── */
const PARTICLES = Array.from({length:18}, (_,i) => ({
  id:i, left:`${5+(i*5.5)%90}%`, bottom:`${3+(i*7)%35}%`,
  dur:`${3.5+(i%5)*0.8}s`, delay:`${(i*0.35)%4}s`, dx:`${(i%2?1:-1)*(12+i*4)}px`
}));

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate      = useNavigate();
  const { token }     = useApp();
  const [clicks, setClicks] = useState([]);
  const clickId       = useRef(0);

  /* ── Click handler ── */
  const handleClick = useCallback((e) => {
    // Don't fire on buttons/links
    if (e.target.closest('button,a,.ld-feat,.ld-testi')) return;
    const id = ++clickId.current;
    const x = e.clientX, y = e.clientY;
    const sparks = Array.from({length:10}, (_,i) => ({
      id:`sp${id}-${i}`, type:'spark', x, y,
      tx:`${(Math.random()-.5)*140}px`, ty:`${-(Math.random()*100+20)}px`,
      sc: SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)],
      sd:`${i*0.03}s`,
    }));
    const batch = [
      {id:`r1-${id}`, type:'r1', x, y},
      {id:`r2-${id}`, type:'r2', x, y},
      ...sparks,
    ];
    setClicks(p => [...p, ...batch]);
    setTimeout(() => setClicks(p => p.filter(c => !batch.map(b=>b.id).includes(c.id))), 1600);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="ld" onClick={handleClick}>

        {/* ══ LIVE WALLPAPER ══ */}
        <div className="ld-wallpaper">
          {/* Animated orbs */}
          <div className="ld-orb" style={{width:'700px',height:'700px',left:'-180px',top:'-180px',background:'radial-gradient(circle,rgba(240,165,0,0.11),transparent 65%)','--dur':'20s','--delay':'0s'}}/>
          <div className="ld-orb" style={{width:'600px',height:'600px',right:'-120px',top:'20%',background:'radial-gradient(circle,rgba(0,200,150,0.07),transparent 65%)','--dur':'26s','--delay':'-8s'}}/>
          <div className="ld-orb" style={{width:'500px',height:'500px',left:'30%',bottom:'-100px',background:'radial-gradient(circle,rgba(80,60,255,0.06),transparent 65%)','--dur':'18s','--delay':'-14s'}}/>
          <div className="ld-orb" style={{width:'350px',height:'350px',right:'20%',bottom:'30%',background:'radial-gradient(circle,rgba(240,100,0,0.05),transparent 65%)','--dur':'22s','--delay':'-5s'}}/>
          {/* Grid */}
          <div className="ld-grid"/>
          {/* Scan line */}
          <div className="ld-scan-line"/>
          {/* Floating particles */}
          {PARTICLES.map(p => (
            <div key={p.id} className="ld-particle" style={{left:p.left,bottom:p.bottom,'--dur':p.dur,'--delay':p.delay,'--dx':p.dx}}/>
          ))}
        </div>

        {/* ══ CLICK EFFECTS ══ */}
        {clicks.map(c => {
          if (c.type==='r1')    return <div key={c.id} className="ld-ripple"  style={{left:c.x,top:c.y,'--s':'140px','--s2':'260px'}}/>;
          if (c.type==='r2')    return <div key={c.id} className="ld-ripple2" style={{left:c.x,top:c.y,'--s':'140px','--s2':'260px'}}/>;
          if (c.type==='spark') return <div key={c.id} className="ld-spark"   style={{left:c.x,top:c.y,'--tx':c.tx,'--ty':c.ty,'--sc':c.sc,'--sd':c.sd}}/>;
          return null;
        })}

        {/* ══ NAVBAR ══ */}
        <nav className="ld-nav">
          <div className="ld-logo">Tax<span>Saathi</span></div>
          <div className="ld-nav-right">
            <button className="ld-nav-link" onClick={()=>navigate('/login')}>Sign In</button>
            <button className="ld-nav-cta"  onClick={()=>navigate(token?'/dashboard':'/login')}>Get Started →</button>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section className="ld-hero">
          <div className="ld-badge"><div className="ld-badge-dot"/> 🇮🇳 · Built for Indian Micro-Businesses</div>
          <h1 className="ld-h1">
            <span className="l1">Tax Compliance</span>
            <span className="l2">Made Simple.</span>
            <span className="l3">Fear Gone.</span>
          </h1>
          <p className="ld-sub">
            Your intelligent compliance copilot — built for <strong>freelancers, traders, gig workers</strong>, and small business owners who want to stay compliant <strong>without the confusion.</strong>
          </p>
          <div className="ld-btns">
            <button className="ld-btn-primary" onClick={()=>navigate(token?'/dashboard':'/login')}>Start Free — No CA Needed →</button>
            <button className="ld-btn-secondary" onClick={()=>navigate('/login')}>Sign In</button>
          </div>
          <div className="ld-stats">
            {[['8+','Tools'],['₹0','Forever'],['100%','Simple'],['24/7','AI Help']].map(([n,l],i)=>(
              <div key={i} className="ld-stat">
                <div className="ld-stat-n">{n}</div>
                <div className="ld-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <div className="ld-ticker">
          <div className="ld-ticker-inner">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i)=>(
              <span key={i} className="ld-ticker-item">
                <span className="ld-ticker-dot"/>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══ FEATURES ══ */}
        <section className="ld-section">
          <div className="ld-section-label">
            <div className="ld-section-eyebrow">Everything You Need</div>
            <div className="ld-section-title">Built for <span>Real Business</span></div>
          </div>
          <div className="ld-features">
            {FEATURES.map((f,i)=>(
              <div key={i} className="ld-feat">
                <div className="ld-feat-glow"/>
                <span className="ld-feat-ico" style={{'--fi':f.delay}}>{f.icon}</span>
                <div className="ld-feat-title">{f.title}</div>
                <div className="ld-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section className="ld-section" style={{paddingTop:0}}>
          <div className="ld-section-label">
            <div className="ld-section-eyebrow">Real Stories</div>
            <div className="ld-section-title">People Like You Are <span>Already Winning</span></div>
          </div>
          <div className="ld-testi-grid">
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="ld-testi">
                <div className="ld-testi-text">{t.text}</div>
                <div className="ld-testi-bottom">
                  <div className="ld-testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="ld-testi-name">{t.name}</div>
                    <div className="ld-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="ld-cta">
          <div className="ld-cta-bg"/>
          <div className="ld-cta-title">Ready to Stop<br/><span>Fearing Tax?</span></div>
          <div className="ld-cta-sub">Join thousands of micro-businesses who've taken control of their compliance.</div>
          <button className="ld-btn-primary" style={{fontSize:'16px',padding:'18px 48px'}}
            onClick={()=>navigate(token?'/dashboard':'/login')}>
            Get Started Free →
          </button>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="ld-footer">
          <div className="ld-footer-logo">Tax<span>Saathi</span></div>
          <div className="ld-footer-text">© 2026 TAXSAATHI · MADE WITH ♥ IN INDIA</div>
        </footer>

        {/* Click hint */}
        <div style={{position:'fixed',bottom:'16px',left:'50%',transform:'translateX(-50%)',fontSize:'9px',color:'#1a1a16',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.18em',pointerEvents:'none',zIndex:5,textTransform:'uppercase'}}>
          Click anywhere · Interactive
        </div>
      </div>
    </>
  );
}
