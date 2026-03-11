import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/* ── Fonts ─────────────────────────────────────────────────────────────────── */
if (!document.getElementById('lg-fonts')) {
  const l = document.createElement('link');
  l.id = 'lg-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap';
  document.head.appendChild(l);
}

/* ── CSS ────────────────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes lg-up     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lg-in     { from{opacity:0} to{opacity:1} }
  @keyframes lg-float  { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-14px) rotate(1deg)} 66%{transform:translateY(-6px) rotate(-1deg)} }
  @keyframes lg-spin   { to{transform:rotate(360deg)} }
  @keyframes lg-pulse  { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
  @keyframes lg-shimmer{ 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes lg-ripple { 0%{transform:translate(-50%,-50%) scale(0);opacity:0.6} 100%{transform:translate(-50%,-50%) scale(1);opacity:0} }
  @keyframes lg-spark  { 0%{transform:translate(-50%,-50%) scale(0) rotate(0deg);opacity:1} 100%{transform:translate(var(--sx),var(--sy)) scale(0.3) rotate(var(--sr));opacity:0} }
  @keyframes lg-orb    { 0%{transform:translate(0,0) scale(1)} 25%{transform:translate(40px,-30px) scale(1.1)} 50%{transform:translate(-20px,50px) scale(0.95)} 75%{transform:translate(60px,20px) scale(1.05)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes lg-scan   { 0%{top:-2px} 100%{top:100%} }
  @keyframes lg-border { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
  @keyframes lg-shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  @keyframes lg-particle { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--px),var(--py)) scale(0)} }

  .lg-root {
    position:fixed; inset:0; overflow:hidden;
    font-family:'DM Sans',sans-serif;
    background:#050505; color:#E8E6DE;
    cursor:crosshair;
  }

  /* ══ CANVAS BG ══ */
  .lg-canvas { position:absolute; inset:0; z-index:0; }

  /* ══ ORBS ══ */
  .lg-orb {
    position:absolute; border-radius:50%;
    filter:blur(80px); pointer-events:none; z-index:1;
    animation:lg-orb var(--dur) ease-in-out infinite;
    animation-delay:var(--delay);
  }

  /* ══ GRID ══ */
  .lg-grid {
    position:absolute; inset:0; z-index:2; pointer-events:none;
    background-image:
      linear-gradient(rgba(240,165,0,0.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(240,165,0,0.035) 1px,transparent 1px);
    background-size:60px 60px;
    mask-image:radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%);
  }

  /* ══ RIPPLE ══ */
  .lg-ripple {
    position:absolute; border-radius:50%; pointer-events:none; z-index:3;
    border:1px solid rgba(240,165,0,0.5);
    width:var(--size); height:var(--size);
    animation:lg-ripple 0.9s cubic-bezier(0,0.5,0.5,1) forwards;
  }
  .lg-ripple2 {
    position:absolute; border-radius:50%; pointer-events:none; z-index:3;
    border:1px solid rgba(240,165,0,0.25);
    width:var(--size2); height:var(--size2);
    animation:lg-ripple 1.3s cubic-bezier(0,0.5,0.5,1) 0.1s forwards;
  }
  .lg-spark {
    position:absolute; width:4px; height:4px; border-radius:50%;
    background:var(--sc); pointer-events:none; z-index:4;
    animation:lg-spark 0.7s ease-out forwards;
    animation-delay:var(--sd);
  }
  .lg-click-dot {
    position:absolute; width:8px; height:8px; border-radius:50%;
    background:#F0A500; pointer-events:none; z-index:5;
    transform:translate(-50%,-50%);
    animation:lg-particle 0.4s ease-out forwards;
  }

  /* ══ CONTENT LAYOUT ══ */
  .lg-layout {
    position:absolute; inset:0; z-index:10;
    display:grid; grid-template-columns:1fr 480px;
    align-items:center;
  }

  /* ══ LEFT HERO ══ */
  .lg-hero {
    padding:60px 48px 60px 72px;
    display:flex; flex-direction:column; justify-content:center;
    animation:lg-up 0.8s ease both;
  }
  .lg-eyebrow {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(240,165,0,0.08); border:1px solid rgba(240,165,0,0.18);
    color:#F0A500; font-size:10px; font-weight:700;
    padding:6px 14px; border-radius:100px; width:fit-content;
    font-family:'JetBrains Mono',monospace; letter-spacing:0.15em; text-transform:uppercase;
    margin-bottom:28px; animation:lg-pulse 3s ease infinite;
  }
  .lg-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#F0A500; }
  .lg-hero-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(60px,7vw,100px); line-height:0.92; letter-spacing:0.01em;
    margin-bottom:24px;
  }
  .lg-hero-title .w1 { color:#F5F0E8; display:block; }
  .lg-hero-title .w2 {
    display:block;
    background:linear-gradient(135deg,#F0A500,#FFD060,#F0A500);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:lg-shimmer 3s linear infinite;
  }
  .lg-hero-title .w3 {
    display:block; color:transparent;
    -webkit-text-stroke:2px rgba(240,165,0,0.4);
    font-style:italic;
  }
  .lg-hero-sub {
    font-size:15px; color:#4a4a42; line-height:1.7; max-width:420px;
    margin-bottom:40px; font-weight:400;
  }
  .lg-hero-sub strong { color:#666; font-weight:600; }
  .lg-trust {
    display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  }
  .lg-trust-item {
    display:flex; align-items:center; gap:7px;
    font-size:12px; color:#383832; font-weight:500;
  }
  .lg-trust-ico { font-size:14px; }
  .lg-trust-sep { width:1px; height:16px; background:#1c1c1c; }

  /* ══ RIGHT FORM PANEL ══ */
  .lg-panel-wrap {
    padding:32px 48px 32px 0;
    display:flex; align-items:center; justify-content:center;
    animation:lg-up 0.8s 0.15s ease both;
  }
  .lg-panel {
    width:100%; max-width:420px;
    background:rgba(10,10,8,0.85);
    border:1px solid rgba(240,165,0,0.12);
    border-radius:24px; overflow:hidden;
    backdrop-filter:blur(24px);
    box-shadow:0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04);
    position:relative;
  }
  .lg-panel-scan {
    position:absolute; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(240,165,0,0.4),transparent);
    animation:lg-scan 5s linear infinite; pointer-events:none; z-index:1;
  }
  .lg-panel::before {
    content:''; position:absolute; top:0; left:20%; right:20%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(240,165,0,0.3),transparent);
  }

  .lg-panel-inner { padding:36px; position:relative; z-index:2; }

  /* Tabs */
  .lg-tabs {
    display:grid; grid-template-columns:1fr 1fr;
    background:rgba(255,255,255,0.02); border:1px solid #1a1a1a;
    border-radius:12px; padding:4px; gap:4px; margin-bottom:32px;
  }
  .lg-tab {
    padding:10px; border-radius:9px; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.25s; border:none; font-family:'DM Sans',sans-serif;
    letter-spacing:0.02em;
  }
  .lg-tab.active {
    background:linear-gradient(135deg,#C68A00,#F0A500);
    color:#000; box-shadow:0 4px 16px rgba(240,165,0,0.25);
  }
  .lg-tab.inactive { background:transparent; color:#444; }
  .lg-tab.inactive:hover { color:#888; }

  /* Logo in panel */
  .lg-panel-logo {
    font-family:'Bebas Neue',sans-serif; font-size:22px;
    color:#F5F0E8; letter-spacing:0.05em; margin-bottom:4px;
    text-align:center;
  }
  .lg-panel-logo span { color:#F0A500; }
  .lg-panel-sub { text-align:center; font-size:12px; color:#383832; margin-bottom:28px; }

  /* Fields */
  .lg-field { margin-bottom:16px; }
  .lg-field-label {
    display:block; font-size:10px; font-weight:600; color:#383832;
    font-family:'JetBrains Mono',monospace; letter-spacing:0.15em; text-transform:uppercase;
    margin-bottom:7px;
  }
  .lg-field-wrap { position:relative; }
  .lg-field-ico {
    position:absolute; left:14px; top:50%; transform:translateY(-50%);
    font-size:14px; pointer-events:none; z-index:1;
  }
  .lg-input {
    width:100%; background:rgba(255,255,255,0.03); border:1px solid #1e1e1a;
    color:#E8E6DE; font-size:14px; padding:12px 14px 12px 40px;
    border-radius:11px; outline:none; font-family:'DM Sans',sans-serif;
    transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .lg-input:focus {
    border-color:rgba(240,165,0,0.45);
    box-shadow:0 0 0 3px rgba(240,165,0,0.07), 0 0 20px rgba(240,165,0,0.05);
    background:rgba(240,165,0,0.025);
  }
  .lg-input::placeholder { color:#2e2e2a; }

  /* Error */
  .lg-error {
    background:rgba(255,59,59,0.06); border:1px solid rgba(255,59,59,0.15);
    color:#FF6B6B; font-size:12px; padding:10px 14px; border-radius:9px;
    margin-bottom:16px; font-weight:500;
    animation:lg-shake 0.4s ease;
  }

  /* Submit */
  .lg-submit {
    width:100%; padding:14px;
    background:linear-gradient(135deg,#B07800,#F0A500 50%,#FFD060);
    background-size:200% auto;
    border:none; border-radius:12px; color:#000;
    font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif;
    cursor:pointer; letter-spacing:0.04em;
    box-shadow:0 6px 24px rgba(240,165,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
    transition:all 0.25s; position:relative; overflow:hidden;
    margin-bottom:20px;
  }
  .lg-submit:hover:not(:disabled) {
    background-position:right center; transform:translateY(-1px);
    box-shadow:0 10px 32px rgba(240,165,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .lg-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .lg-submit-inner { display:flex; align-items:center; justify-content:center; gap:8px; }
  .lg-spinner {
    width:14px; height:14px; border:2px solid rgba(0,0,0,0.3);
    border-top-color:#000; border-radius:50%; animation:lg-spin 0.7s linear infinite;
  }

  /* Footer link */
  .lg-switch {
    text-align:center; font-size:13px; color:#383832;
  }
  .lg-switch-link {
    color:#F0A500; cursor:pointer; font-weight:600; margin-left:5px;
    transition:color 0.2s;
  }
  .lg-switch-link:hover { color:#FFD060; }

  /* Divider */
  .lg-divider {
    display:flex; align-items:center; gap:12px; margin:20px 0;
  }
  .lg-divider-line { flex:1; height:1px; background:#141410; }
  .lg-divider-txt  { font-size:10px; color:#2a2a26; font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; }

  /* Features list */
  .lg-features { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
  .lg-feature {
    display:flex; align-items:center; gap:10px;
    font-size:12px; color:#3a3a36; transition:color 0.2s;
  }
  .lg-feature:hover { color:#666; }
  .lg-feature-dot { width:5px; height:5px; border-radius:50%; background:#F0A500; flex-shrink:0; opacity:0.6; }

  /* Mobile */
  @media(max-width:768px){
    .lg-layout { grid-template-columns:1fr; grid-template-rows:auto 1fr; }
    .lg-hero { padding:40px 24px 20px; }
    .lg-hero-title { font-size:52px; }
    .lg-panel-wrap { padding:0 20px 40px; }
    .lg-trust { display:none; }
  }
`;

/* ── Spark colors ─────────────────────────────────────────────────────────── */
const SPARK_COLORS = ['#F0A500','#FFD060','#FF9500','#FFF0A0','#FFFFFF'];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [effects, setEffects]       = useState([]);
  const { login, register }         = useApp();
  const navigate                    = useNavigate();
  const effectId                    = useRef(0);

  /* ── Click effects ── */
  const handleClick = useCallback((e) => {
    const id = ++effectId.current;
    const x = e.clientX, y = e.clientY;
    const sparks = Array.from({length:8}, (_,i) => ({
      id:`sp-${id}-${i}`,
      type:'spark',
      x, y,
      sx:`${(Math.random()-0.5)*120}px`,
      sy:`${-(Math.random()*80+20)}px`,
      sr:`${(Math.random()-0.5)*360}deg`,
      sd:`${i*0.04}s`,
      sc: SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)],
    }));

    const newEffects = [
      { id:`r1-${id}`, type:'ripple',  x, y, size:'120px',  size2:'220px' },
      { id:`r2-${id}`, type:'ripple2', x, y, size:'120px',  size2:'220px' },
      { id:`dot-${id}`,type:'dot',     x, y },
      ...sparks,
    ];

    setEffects(prev => [...prev, ...newEffects]);
    setTimeout(() => setEffects(prev => prev.filter(ef => !newEffects.map(n=>n.id).includes(ef.id))), 1400);
  }, []);

  /* ── Auth ── */
  const handle = async () => {
    setError(''); setLoading(true);
    try {
      if (isRegister) { await register(name, email, password); navigate('/onboarding'); }
      else            { await login(email, password);           navigate('/dashboard');  }
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  const switchMode = () => { setIsRegister(v=>!v); setError(''); };

  return (
    <>
      <style>{CSS}</style>
      <div className="lg-root" onClick={handleClick}>

        {/* ── Click Effects ── */}
        {effects.map(ef => {
          if (ef.type === 'ripple')  return <div key={ef.id} className="lg-ripple"  style={{left:ef.x, top:ef.y, '--size':ef.size,  '--size2':ef.size2}} />;
          if (ef.type === 'ripple2') return <div key={ef.id} className="lg-ripple2" style={{left:ef.x, top:ef.y, '--size':ef.size,  '--size2':ef.size2}} />;
          if (ef.type === 'dot')     return <div key={ef.id} className="lg-click-dot" style={{left:ef.x, top:ef.y}} />;
          if (ef.type === 'spark')   return <div key={ef.id} className="lg-spark" style={{left:ef.x, top:ef.y, '--sx':ef.sx, '--sy':ef.sy, '--sr':ef.sr, '--sd':ef.sd, '--sc':ef.sc}} />;
          return null;
        })}

        {/* ── Background Orbs ── */}
        <div className="lg-orb" style={{width:'600px',height:'600px',left:'-150px',top:'-100px',background:'radial-gradient(circle,rgba(240,165,0,0.12),transparent 65%)','--dur':'18s','--delay':'0s'}}/>
        <div className="lg-orb" style={{width:'500px',height:'500px',right:'-100px',bottom:'-80px',background:'radial-gradient(circle,rgba(0,200,150,0.08),transparent 65%)','--dur':'22s','--delay':'-6s'}}/>
        <div className="lg-orb" style={{width:'400px',height:'400px',left:'40%',top:'30%',background:'radial-gradient(circle,rgba(100,80,255,0.06),transparent 65%)','--dur':'26s','--delay':'-12s'}}/>

        {/* ── Grid ── */}
        <div className="lg-grid" />

        {/* ── Layout ── */}
        <div className="lg-layout" onClick={e => e.stopPropagation()}>

          {/* LEFT HERO */}
          <div className="lg-hero">
            <div className="lg-eyebrow">
              <div className="lg-eyebrow-dot"/>
              IN · Built for Indian Micro-Businesses
            </div>

            <div className="lg-hero-title">
              <span className="w1">Tax</span>
              <span className="w2">Compliance</span>
              <span className="w3">Simplified.</span>
            </div>

            <p className="lg-hero-sub">
              Your intelligent compliance copilot — built for <strong>freelancers, traders, gig workers</strong>, and small business owners who want to stay compliant <strong>without the confusion.</strong>
            </p>

            <div className="lg-features">
              {['Auto-calculated GST & ITR deadlines','AI Copilot for tax questions','One-click compliance checklist','Scheme eligibility checker'].map((f,i)=>(
                <div key={i} className="lg-feature">
                  <div className="lg-feature-dot"/>
                  {f}
                </div>
              ))}
            </div>

            <div className="lg-trust">
              <div className="lg-trust-item"><span className="lg-trust-ico">🔒</span> 100% Secure</div>
              <div className="lg-trust-sep"/>
              <div className="lg-trust-item"><span className="lg-trust-ico">⚡</span> Free Forever</div>
              <div className="lg-trust-sep"/>
              <div className="lg-trust-item"><span className="lg-trust-ico">🇮🇳</span> Made in India</div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg-panel-wrap">
            <div className="lg-panel">
              <div className="lg-panel-scan"/>
              <div className="lg-panel-inner">

                <div className="lg-panel-logo">Tax<span>Saathi</span></div>
                <div className="lg-panel-sub">
                  {isRegister ? 'Join thousands of smart business owners' : 'Welcome back! Great to see you again'}
                </div>

                {/* Tabs */}
                <div className="lg-tabs">
                  <button className={`lg-tab ${!isRegister?'active':'inactive'}`} onClick={()=>{setIsRegister(false);setError('')}}>Sign In</button>
                  <button className={`lg-tab ${isRegister?'active':'inactive'}`}  onClick={()=>{setIsRegister(true);setError('')}}>Sign Up</button>
                </div>

                {/* Fields */}
                {isRegister && (
                  <div className="lg-field" style={{animation:'lg-up 0.3s ease both'}}>
                    <label className="lg-field-label">Full Name</label>
                    <div className="lg-field-wrap">
                      <span className="lg-field-ico">👤</span>
                      <input className="lg-input" placeholder="Ravi Kumar" value={name} onChange={e=>setName(e.target.value)}/>
                    </div>
                  </div>
                )}

                <div className="lg-field">
                  <label className="lg-field-label">Email Address</label>
                  <div className="lg-field-wrap">
                    <span className="lg-field-ico">✉️</span>
                    <input className="lg-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                  </div>
                </div>

                <div className="lg-field">
                  <label className="lg-field-label">Password</label>
                  <div className="lg-field-wrap">
                    <span className="lg-field-ico">🔐</span>
                    <input className="lg-input" type="password" placeholder="••••••••" value={password}
                      onChange={e=>setPassword(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&handle()}/>
                  </div>
                </div>

                {error && <div className="lg-error">⚠ {error}</div>}

                <button className="lg-submit" onClick={handle} disabled={loading}>
                  <div className="lg-submit-inner">
                    {loading && <div className="lg-spinner"/>}
                    {loading ? 'Please wait...' : isRegister ? 'Create Free Account →' : 'Sign In →'}
                  </div>
                </button>

                <div className="lg-switch">
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  <span className="lg-switch-link" onClick={switchMode}>
                    {isRegister ? 'Sign In' : 'Sign Up Free'}
                  </span>
                </div>

                <div className="lg-divider">
                  <div className="lg-divider-line"/>
                  <div className="lg-divider-txt">NO CA NEEDED</div>
                  <div className="lg-divider-line"/>
                </div>

                <div style={{textAlign:'center',fontSize:'11px',color:'#242420',lineHeight:'1.6'}}>
                  By continuing you agree to our Terms of Service.<br/>
                  Your data is encrypted and never shared.
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Click hint */}
        <div style={{position:'absolute',bottom:'20px',left:'50%',transform:'translateX(-50%)',fontSize:'10px',color:'#1e1e1a',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.15em',pointerEvents:'none',zIndex:5}}>
          CLICK ANYWHERE TO INTERACT
        </div>
      </div>
    </>
  );
}
