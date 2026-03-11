import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

/* ── Fonts ─────────────────────────────────────────────────────────────────── */
if (!document.getElementById('pf2-fonts')) {
  const l = document.createElement('link');
  l.id = 'pf2-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap';
  document.head.appendChild(l);
}

/* ── CSS ────────────────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes pf-up      { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pf-in      { from{opacity:0} to{opacity:1} }
  @keyframes pf-scale   { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes pf-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
  @keyframes pf-spin    { to{transform:rotate(360deg)} }
  @keyframes pf-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pf-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes pf-glow    { 0%,100%{box-shadow:0 0 30px rgba(240,165,0,0.15)} 50%{box-shadow:0 0 60px rgba(240,165,0,0.35)} }
  @keyframes pf-toast   { 0%{opacity:0;transform:translateX(-50%) translateY(16px)} 15%,80%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-8px)} }
  @keyframes pf-particle{ 0%{transform:translateY(0) translateX(0);opacity:0} 10%{opacity:1} 90%{opacity:0.3} 100%{transform:translateY(-120px) translateX(var(--dx));opacity:0} }
  @keyframes pf-border  { 0%,100%{border-color:rgba(240,165,0,0.2)} 50%{border-color:rgba(240,165,0,0.5)} }
  @keyframes pf-scan    { 0%{top:-100%} 100%{top:200%} }

  .pf2 *, .pf2 *::before, .pf2 *::after { box-sizing:border-box; margin:0; padding:0; }
  .pf2 { font-family:'DM Sans',sans-serif; background:#050505; min-height:100vh; color:#E8E6DE; overflow-x:hidden; padding-bottom:100px; }

  .pf2-hero { position:relative; width:100%; height:260px; overflow:hidden; background:#050505; }
  .pf2-hero-bg {
    position:absolute; inset:0;
    background:
      radial-gradient(ellipse at 15% 60%, rgba(240,165,0,0.22) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 20%, rgba(0,200,150,0.14) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 100%, rgba(100,80,255,0.10) 0%, transparent 50%),
      linear-gradient(180deg, #0c0a00 0%, #080808 60%, #050505 100%);
  }
  .pf2-hero-lines { position:absolute; inset:0; overflow:hidden; opacity:0.5; }
  .pf2-hero-lines::before {
    content:''; position:absolute; inset:0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(240,165,0,0.06) 60px),
      repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(240,165,0,0.04) 60px);
  }
  .pf2-scan {
    position:absolute; left:0; right:0; height:1px;
    background:linear-gradient(90deg, transparent, rgba(240,165,0,0.6), transparent);
    animation:pf-scan 4s linear infinite; pointer-events:none;
  }
  .pf2-hero-title {
    position:absolute; bottom:28px; left:50%; transform:translateX(-50%);
    font-family:'Playfair Display',serif; font-size:clamp(13px,2vw,16px);
    color:rgba(240,165,0,0.5); letter-spacing:0.4em; text-transform:uppercase;
    white-space:nowrap; font-style:italic;
  }
  .pf2-particle {
    position:absolute; width:3px; height:3px; border-radius:50%;
    background:rgba(240,165,0,0.7);
    animation:pf-particle var(--dur) ease-in infinite;
    animation-delay:var(--delay);
  }

  .pf2-body { max-width:920px; margin:0 auto; padding:0 24px; }

  .pf2-identity {
    display:grid; grid-template-columns:auto 1fr; gap:28px; align-items:flex-end;
    margin-top:-72px; margin-bottom:36px; animation:pf-up 0.6s ease both;
  }
  .pf2-avatar-zone { position:relative; }
  .pf2-avatar-ring {
    position:absolute; inset:-6px; border-radius:50%;
    border:1px solid transparent;
    background:linear-gradient(135deg,rgba(240,165,0,0.6),transparent,rgba(0,200,150,0.4)) border-box;
    -webkit-mask:linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite:destination-out; mask-composite:exclude;
    animation:pf-spin 8s linear infinite;
  }
  .pf2-avatar-ring2 {
    position:absolute; inset:-12px; border-radius:50%;
    border:1px dashed rgba(240,165,0,0.15);
    animation:pf-spin 16s linear infinite reverse;
  }
  .pf2-avatar {
    width:120px; height:120px; border-radius:50%; cursor:pointer;
    border:3px solid #050505;
    background:radial-gradient(circle at 35% 35%, #2a2000, #0d0d0d);
    display:flex; align-items:center; justify-content:center;
    font-size:46px; overflow:hidden; position:relative; z-index:2;
    box-shadow:0 0 0 1px rgba(240,165,0,0.15), 0 16px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04);
    transition:transform 0.3s;
  }
  .pf2-avatar:hover { transform:scale(1.04); }
  .pf2-avatar img { width:100%; height:100%; object-fit:cover; }
  .pf2-avatar-hover {
    position:absolute; inset:3px; border-radius:50%; z-index:3;
    background:rgba(0,0,0,0.75); display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:4px;
    opacity:0; transition:opacity 0.25s; cursor:pointer; backdrop-filter:blur(4px);
  }
  .pf2-avatar-zone:hover .pf2-avatar-hover { opacity:1; }
  .pf2-avatar-hover span:first-child { font-size:24px; }
  .pf2-avatar-hover span:last-child  { font-size:9px; color:#ccc; letter-spacing:0.15em; font-weight:700; }
  .pf2-status-dot {
    position:absolute; bottom:4px; right:4px; z-index:4;
    width:16px; height:16px; border-radius:50%;
    background:radial-gradient(circle, #00ff9d, #00c872);
    border:2px solid #050505; box-shadow:0 0 8px rgba(0,255,157,0.6);
    animation:pf-pulse 2.5s ease-in-out infinite;
  }
  .pf2-nameblock { padding-bottom:8px; }
  .pf2-name {
    font-family:'Playfair Display',serif;
    font-size:clamp(36px,5.5vw,60px); font-weight:900; line-height:1; letter-spacing:-0.02em;
    background:linear-gradient(135deg, #F5F0E8 30%, #F0A500 70%, #FFD060);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:pf-shimmer 4s linear infinite; margin-bottom:8px;
  }
  .pf2-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:13px; color:#4a4a44; }
  .pf2-meta-sep { color:#222; }
  .pf2-chip {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 12px; border-radius:100px; font-size:10px; font-weight:700;
    letter-spacing:0.12em; text-transform:uppercase; font-family:'JetBrains Mono',monospace;
  }
  .pf2-chip-gold {
    background:linear-gradient(135deg,rgba(240,165,0,0.15),rgba(240,165,0,0.05));
    border:1px solid rgba(240,165,0,0.25); color:#F0A500; animation:pf-border 3s ease infinite;
  }
  .pf2-chip-green { background:rgba(0,200,150,0.08); border:1px solid rgba(0,200,150,0.2); color:#00C896; }

  .pf2-stats {
    display:grid; grid-template-columns:repeat(4,1fr); gap:2px;
    margin-bottom:24px; border-radius:16px; overflow:hidden;
    border:1px solid #161616; animation:pf-up 0.6s 0.08s ease both;
  }
  .pf2-stat {
    background:#0d0d0d; padding:20px 16px;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:4px; position:relative; overflow:hidden; cursor:default;
    transition:background 0.25s; border-right:1px solid #161616;
  }
  .pf2-stat:last-child { border-right:none; }
  .pf2-stat::before {
    content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, var(--c), transparent);
    transform:scaleX(0); transition:transform 0.3s;
  }
  .pf2-stat:hover { background:#111; }
  .pf2-stat:hover::before { transform:scaleX(1); }
  .pf2-stat-glow {
    position:absolute; inset:0;
    background:radial-gradient(circle at 50% 100%, var(--c), transparent 70%);
    opacity:0; transition:opacity 0.3s;
  }
  .pf2-stat:hover .pf2-stat-glow { opacity:0.06; }
  .pf2-stat-num { font-family:'Playfair Display',serif; font-size:34px; font-weight:900; color:var(--c); line-height:1; position:relative; z-index:1; }
  .pf2-stat-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600; color:#383832; letter-spacing:0.15em; text-transform:uppercase; position:relative; z-index:1; }
  .pf2-stat-ico { font-size:16px; position:relative; z-index:1; margin-bottom:2px; }

  .pf2-card {
    border-radius:20px; margin-bottom:16px;
    background:linear-gradient(160deg, #0f0f0f 0%, #0a0a0a 100%);
    border:1px solid #181818; overflow:hidden; position:relative; transition:border-color 0.3s;
  }
  .pf2-card:hover { border-color:#242420; }
  .pf2-card::before {
    content:''; position:absolute; top:0; left:24px; right:24px; height:1px;
    background:linear-gradient(90deg, transparent, rgba(240,165,0,0.15), transparent);
  }
  .pf2-card-inner { padding:24px; }
  .pf2-card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; }
  .pf2-label {
    font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600;
    color:#333; letter-spacing:0.25em; text-transform:uppercase;
    display:flex; align-items:center; gap:10px;
  }
  .pf2-label::before { content:''; width:20px; height:1px; background:linear-gradient(90deg,#F0A500,transparent); }

  .pf2-comp-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
  .pf2-comp-pct { font-family:'Playfair Display',serif; font-size:42px; font-weight:900; color:#F0A500; line-height:1; font-style:italic; }
  .pf2-comp-msg { font-size:12px; color:#444; text-align:right; line-height:1.5; }
  .pf2-bar-track { width:100%; height:4px; background:#161616; border-radius:100px; margin-bottom:16px; overflow:hidden; }
  .pf2-bar-fill {
    height:100%; border-radius:100px;
    background:linear-gradient(90deg,#B07A00,#F0A500,#FFD060);
    box-shadow:0 0 16px rgba(240,165,0,0.5); transition:width 1s cubic-bezier(0.4,0,0.2,1);
  }
  .pf2-comp-pills { display:flex; gap:8px; flex-wrap:wrap; }
  .pf2-comp-pill {
    display:flex; align-items:center; gap:6px;
    padding:5px 12px; border-radius:100px; font-size:11px; border:1px solid; transition:all 0.2s;
  }
  .pf2-comp-pill.done  { background:rgba(0,200,150,0.06); border-color:rgba(0,200,150,0.2); color:#00C896; }
  .pf2-comp-pill.todo  { background:rgba(255,255,255,0.02); border-color:#1c1c1c; color:#383832; }
  .pf2-comp-pill-dot   { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

  .pf2-badges { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:10px; }
  .pf2-badge {
    padding:16px; border-radius:14px; border:1px solid #181818;
    background:linear-gradient(135deg,#0d0d0d,#090909);
    display:flex; gap:12px; align-items:flex-start;
    transition:all 0.25s; position:relative; overflow:hidden; cursor:default;
  }
  .pf2-badge::after {
    content:''; position:absolute; inset:0;
    background:radial-gradient(circle at 0% 100%, var(--bc), transparent 60%);
    opacity:0; transition:opacity 0.3s;
  }
  .pf2-badge:hover::after { opacity:0.05; }
  .pf2-badge:hover { border-color:#282820; transform:translateY(-2px); }
  .pf2-badge.earned { border-color:rgba(240,165,0,0.18); --bc:#F0A500; animation:pf-glow 3s ease infinite; }
  .pf2-badge.locked { opacity:0.28; filter:grayscale(1) brightness(0.6); }
  .pf2-badge-ico  { font-size:26px; flex-shrink:0; position:relative; z-index:1; }
  .pf2-badge-body { position:relative; z-index:1; }
  .pf2-badge-name { font-size:12px; font-weight:600; color:#888; margin-bottom:3px; }
  .pf2-badge.earned .pf2-badge-name { color:#F0A500; }
  .pf2-badge-desc { font-size:10px; color:#333; line-height:1.4; }
  .pf2-badge-earned-tag {
    display:inline-flex; margin-top:6px;
    background:rgba(240,165,0,0.1); border:1px solid rgba(240,165,0,0.2);
    color:#F0A500; font-size:8px; font-weight:700; padding:2px 7px; border-radius:100px;
    font-family:'JetBrains Mono',monospace; letter-spacing:0.1em;
  }

  .pf2-rows { display:flex; flex-direction:column; }
  .pf2-row {
    display:grid; grid-template-columns:180px 1fr; align-items:center;
    padding:15px 0; border-bottom:1px solid #111; gap:16px; transition:background 0.2s;
  }
  .pf2-row:last-child { border-bottom:none; padding-bottom:0; }
  .pf2-row:hover { background:rgba(255,255,255,0.008); margin:0 -24px; padding-left:24px; padding-right:24px; }
  .pf2-row-key { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; color:#383832; letter-spacing:0.1em; flex-shrink:0; }
  .pf2-row-val { font-size:14px; font-weight:500; text-align:right; }
  .pf2-row-val.gold    { color:#F0A500; font-family:'JetBrains Mono',monospace; font-size:12px; }
  .pf2-row-val.teal    { color:#00C896; font-family:'JetBrains Mono',monospace; font-size:12px; }
  .pf2-row-val.dim     { color:#282822; }
  .pf2-row-val.default { color:#888; }

  .pf2-input {
    background:rgba(255,255,255,0.03); border:1px solid #222;
    color:#E8E6DE; font-size:13px; padding:10px 16px;
    border-radius:10px; outline:none; font-family:'DM Sans',sans-serif;
    width:100%; max-width:280px; float:right; transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .pf2-input:focus {
    border-color:rgba(240,165,0,0.4);
    box-shadow:0 0 0 3px rgba(240,165,0,0.06), 0 0 20px rgba(240,165,0,0.05);
    background:rgba(240,165,0,0.02);
  }
  .pf2-select {
    background:rgba(255,255,255,0.03); border:1px solid #222;
    color:#E8E6DE; font-size:13px; padding:10px 16px;
    border-radius:10px; outline:none; font-family:'DM Sans',sans-serif;
    width:100%; max-width:280px; float:right; cursor:pointer;
    transition:border-color 0.2s, box-shadow 0.2s; appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23444' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 14px center; padding-right:36px;
  }
  .pf2-select:focus { border-color:rgba(240,165,0,0.4); box-shadow:0 0 0 3px rgba(240,165,0,0.06); }
  .pf2-select option { background:#111; }

  .pf2-btn-ghost {
    background:transparent; border:1px solid #242420;
    color:#555; font-size:12px; font-weight:600; padding:8px 18px;
    border-radius:10px; cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all 0.2s; letter-spacing:0.02em;
  }
  .pf2-btn-ghost:hover { color:#E8E6DE; border-color:#444; background:rgba(255,255,255,0.04); }
  .pf2-btn-gold {
    background:linear-gradient(135deg,#C68A00,#F0A500 50%,#FFD060);
    background-size:200% auto; border:none; color:#000;
    font-size:12px; font-weight:700; padding:8px 22px; border-radius:10px;
    cursor:pointer; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 20px rgba(240,165,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
    transition:all 0.25s; letter-spacing:0.03em;
  }
  .pf2-btn-gold:hover {
    background-position:right center; transform:translateY(-1px);
    box-shadow:0 8px 28px rgba(240,165,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .pf2-socials { display:flex; gap:10px; flex-wrap:wrap; }
  .pf2-social-btn {
    display:flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.03); border:1px solid #1c1c1c;
    color:#555; font-size:12px; font-weight:500; padding:10px 16px;
    border-radius:12px; cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all 0.2s; text-decoration:none; flex:1; min-width:120px; justify-content:center;
  }
  .pf2-social-btn:hover { color:#E8E6DE; border-color:#333; background:rgba(255,255,255,0.06); transform:translateY(-1px); }
  .pf2-social-ico { font-size:16px; }

  .pf2-timeline { display:flex; flex-direction:column; gap:0; }
  .pf2-tl-item {
    display:flex; gap:16px; align-items:flex-start; padding:12px 0;
    border-bottom:1px solid #0f0f0f; position:relative;
  }
  .pf2-tl-item:last-child { border-bottom:none; }
  .pf2-tl-dot {
    width:28px; height:28px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; border:1px solid; margin-top:2px;
  }
  .pf2-tl-title { font-size:13px; color:#888; font-weight:500; margin-bottom:2px; }
  .pf2-tl-date  { font-size:10px; color:#333; font-family:'JetBrains Mono',monospace; }

  .pf2-danger {
    border-radius:20px; overflow:hidden; margin-bottom:16px;
    background:linear-gradient(160deg, #0f0808 0%, #0a0808 100%);
    border:1px solid rgba(255,59,59,0.1); animation:pf-up 0.6s 0.28s ease both;
  }
  .pf2-danger-inner { padding:24px; }
  .pf2-danger-head { display:flex; align-items:center; gap:8px; margin-bottom:16px; }
  .pf2-danger-label { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600; color:rgba(255,59,59,0.6); letter-spacing:0.25em; text-transform:uppercase; }
  .pf2-danger-row  { display:flex; justify-content:space-between; align-items:center; gap:16px; }
  .pf2-danger-title { font-size:14px; color:#666; font-weight:600; margin-bottom:3px; }
  .pf2-danger-sub   { font-size:12px; color:#333; line-height:1.5; }
  .pf2-btn-danger {
    background:rgba(255,59,59,0.06); border:1px solid rgba(255,59,59,0.15);
    color:rgba(255,59,59,0.7); font-size:12px; font-weight:600; padding:9px 18px;
    border-radius:10px; cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all 0.2s; flex-shrink:0; white-space:nowrap;
  }
  .pf2-btn-danger:hover { background:rgba(255,59,59,0.12); border-color:rgba(255,59,59,0.3); color:#FF3B3B; }

  .pf2-toast {
    position:fixed; bottom:32px; left:50%;
    background:#0f0f0f; border:1px solid rgba(0,200,150,0.3);
    color:#00C896; font-size:12px; font-weight:600; padding:13px 26px;
    border-radius:100px; z-index:9999; white-space:nowrap;
    font-family:'JetBrains Mono',monospace; letter-spacing:0.06em;
    box-shadow:0 12px 40px rgba(0,0,0,0.7), 0 0 30px rgba(0,200,150,0.1);
    animation:pf-toast 2.8s ease forwards;
  }

  @media(max-width:640px){
    .pf2-stats { grid-template-columns:repeat(2,1fr); }
    .pf2-identity { grid-template-columns:1fr; margin-top:-40px; }
    .pf2-avatar { width:88px; height:88px; font-size:34px; }
    .pf2-row { grid-template-columns:1fr; }
    .pf2-row-val { text-align:left; }
    .pf2-input,.pf2-select { max-width:100%; float:none; }
    .pf2-danger-row { flex-direction:column; align-items:flex-start; }
    .pf2-badges { grid-template-columns:1fr 1fr; }
  }
`;

/* ── Static Data ────────────────────────────────────────────────────────────── */
const BIZ_ICONS  = { Freelancer:'💻', 'Small Trader':'🏪', 'Gig Worker':'🛵', 'Micro Manufacturer':'🏭', Consultant:'🧑‍💼', Other:'🧾' };
const BIZ_TYPES  = ['Freelancer','Small Trader','Gig Worker','Micro Manufacturer','Consultant','Other'];
const STATES     = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];
const INCOME_RNG = ['Under ₹2.5L','₹2.5L – ₹5L','₹5L – ₹10L','₹10L – ₹25L','Above ₹25L'];

const BADGES = [
  { icon:'🏅', name:'Early Adopter',    desc:'Among the first to join TaxSaathi',   earned:true  },
  { icon:'✨', name:'Profile Complete', desc:'Filled every profile field',           earned:false },
  { icon:'📅', name:'On-Time Filer',    desc:'Filed 3 consecutive returns on time',  earned:false },
  { icon:'🧾', name:'GST Pro',          desc:'Linked & used GST features',           earned:false },
  { icon:'🤝', name:'Referrer',         desc:'Invited a friend to TaxSaathi',        earned:false },
  { icon:'💎', name:'Tax Wizard',       desc:'Used all 6 major features',            earned:false },
];

const STATS = [
  { icon:'📋', val:'7',  lbl:'Deadlines', color:'#F0A500' },
  { icon:'✅', val:'3',  lbl:'Filed',     color:'#00C896' },
  { icon:'⚡', val:'2',  lbl:'Urgent',    color:'#FF6B35' },
  { icon:'🏅', val:'1',  lbl:'Badges',    color:'#7B8CFF' },
];

const FIELDS = [
  { key:'name',          label:'FULL NAME',      type:'text'    },
  { key:'businessType',  label:'BUSINESS TYPE',  type:'select',  opts:BIZ_TYPES  },
  { key:'income',        label:'ANNUAL INCOME',  type:'select',  opts:INCOME_RNG },
  { key:'state',         label:'HOME STATE',     type:'select',  opts:STATES     },
  { key:'gstRegistered', label:'GST STATUS',     type:'select',  opts:['Yes','No','Applied'] },
  { key:'apiKey',        label:'ANTHROPIC KEY',  type:'password' },
];

const TIMELINE = [
  { icon:'✅', color:'#00C896', bg:'rgba(0,200,150,0.08)', border:'rgba(0,200,150,0.2)',  title:'GSTR-3B filed successfully',  date:'Mar 10, 2026' },
  { icon:'📋', color:'#F0A500', bg:'rgba(240,165,0,0.08)', border:'rgba(240,165,0,0.2)',  title:'Profile updated',             date:'Feb 28, 2026' },
  { icon:'🏅', color:'#7B8CFF', bg:'rgba(123,140,255,0.08)',border:'rgba(123,140,255,0.2)',title:'Badge earned: Early Adopter', date:'Feb 14, 2026' },
  { icon:'🔐', color:'#888',    bg:'rgba(136,136,136,0.06)',border:'rgba(136,136,136,0.15)',title:'Account created',            date:'Feb 14, 2026' },
];

const PARTICLES = Array.from({length:12}, (_, i) => ({
  id: i,
  left: `${8 + (i * 8) % 88}%`,
  bottom: `${5 + (i * 13) % 40}%`,
  dur: `${3 + (i % 4)}s`,
  delay: `${(i * 0.4) % 3}s`,
  dx: `${(i % 2 === 0 ? 1 : -1) * (10 + i * 3)}px`,
}));

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function Profile() {
  const { profile, updateProfile, updateProfilePicture } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saved, setSaved]     = useState(false);
  const [pfp, setPfp]         = useState(null);
  const fileRef               = useRef();

  // Load pfp from DB via profile context (per user, not localStorage)
  useEffect(() => {
    if (profile?.profilePicture) setPfp(profile.profilePicture);
  }, [profile]);

  const startEdit = () => { setForm({ ...profile }); setEditing(true); };
  const save = async () => {
    await updateProfile(form);
    setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 2800);
  };

  const handlePfp = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setPfp(base64);                      // update UI instantly
      await updateProfilePicture(base64);  // save to DB per user
    };
    reader.readAsDataURL(file);
  };

  const completionFields = ['name','businessType','income','state','gstRegistered'];
  const filled = completionFields.filter(f => profile?.[f]).length;
  const pct    = Math.round((filled / completionFields.length) * 100);
  const bizIcon = BIZ_ICONS[profile?.businessType] || '👤';

  return (
    <>
      <style>{CSS}</style>
      <div className="pf2">

        {/* ── HERO BANNER ── */}
        <div className="pf2-hero">
          <div className="pf2-hero-bg" />
          <div className="pf2-hero-lines" />
          <div className="pf2-scan" />
          {PARTICLES.map(p => (
            <div key={p.id} className="pf2-particle" style={{
              left:p.left, bottom:p.bottom,
              '--dur':p.dur, '--delay':p.delay, '--dx':p.dx
            }}/>
          ))}
          <div className="pf2-hero-title">Member Dashboard</div>
        </div>

        <div className="pf2-body">

          {/* ── IDENTITY ── */}
          <div className="pf2-identity">
            <div className="pf2-avatar-zone">
              <div className="pf2-avatar-ring" />
              <div className="pf2-avatar-ring2" />
              <div className="pf2-avatar" onClick={() => fileRef.current.click()}>
                {pfp ? <img src={pfp} alt="pfp"/> : bizIcon}
              </div>
              <div className="pf2-avatar-hover" onClick={() => fileRef.current.click()}>
                <span>📷</span><span>UPLOAD</span>
              </div>
              <div className="pf2-status-dot" />
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePfp}/>
            </div>

            <div className="pf2-nameblock">
              <div className="pf2-name">{profile?.name || 'Your Name'}</div>
              <div className="pf2-meta">
                <span>{profile?.businessType || 'Business Type'}</span>
                <span className="pf2-meta-sep">·</span>
                <span>{profile?.state || 'State'}</span>
                <span className="pf2-chip pf2-chip-gold">✦ TaxSaathi Member</span>
                {profile?.gstRegistered === 'Yes' && <span className="pf2-chip pf2-chip-green">GST Registered</span>}
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="pf2-stats">
            {STATS.map((s,i) => (
              <div key={i} className="pf2-stat" style={{'--c':s.color}}>
                <div className="pf2-stat-glow"/>
                <div className="pf2-stat-ico">{s.icon}</div>
                <div className="pf2-stat-num">{s.val}</div>
                <div className="pf2-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* ── COMPLETION ── */}
          <div className="pf2-card" style={{animation:'pf-up 0.6s 0.1s ease both'}}>
            <div className="pf2-card-inner">
              <div className="pf2-card-head">
                <div className="pf2-label">Profile Strength</div>
                <div style={{fontSize:'11px', color:'#333', fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.1em'}}>
                  {filled} / {completionFields.length} COMPLETE
                </div>
              </div>
              <div className="pf2-comp-row">
                <div className="pf2-comp-pct">{pct}%</div>
                <div className="pf2-comp-msg">
                  {pct < 100
                    ? <><span style={{color:'#555'}}>Fill in remaining fields</span><br/><span style={{color:'#333'}}>to unlock all features</span></>
                    : <><span style={{color:'#00C896'}}>Profile complete!</span><br/><span style={{color:'#333'}}>All features unlocked</span></>
                  }
                </div>
              </div>
              <div className="pf2-bar-track">
                <div className="pf2-bar-fill" style={{width:`${pct}%`}}/>
              </div>
              <div className="pf2-comp-pills">
                {completionFields.map(f => (
                  <div key={f} className={`pf2-comp-pill ${profile?.[f] ? 'done' : 'todo'}`}>
                    <div className="pf2-comp-pill-dot" style={{background: profile?.[f] ? '#00C896':'#252520'}}/>
                    <span style={{textTransform:'capitalize'}}>{f.replace(/([A-Z])/g,' $1')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BADGES ── */}
          <div className="pf2-card" style={{animation:'pf-up 0.6s 0.14s ease both'}}>
            <div className="pf2-card-inner">
              <div className="pf2-card-head">
                <div className="pf2-label">Achievements</div>
                <span style={{fontSize:'10px', color:'#333', fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.1em'}}>
                  {BADGES.filter(b=>b.earned).length} / {BADGES.length} EARNED
                </span>
              </div>
              <div className="pf2-badges">
                {BADGES.map((b,i) => (
                  <div key={i} className={`pf2-badge ${b.earned?'earned':'locked'}`} style={{'--bc':'#F0A500'}}>
                    <div className="pf2-badge-ico">{b.icon}</div>
                    <div className="pf2-badge-body">
                      <div className="pf2-badge-name">{b.name}</div>
                      <div className="pf2-badge-desc">{b.desc}</div>
                      {b.earned && <div className="pf2-badge-earned-tag">✓ EARNED</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BUSINESS DETAILS ── */}
          <div className="pf2-card" style={{animation:'pf-up 0.6s 0.18s ease both'}}>
            <div className="pf2-card-inner">
              <div className="pf2-card-head">
                <div className="pf2-label">Business Details</div>
                {!editing
                  ? <button className="pf2-btn-ghost" onClick={startEdit}>✎ Edit Profile</button>
                  : <div style={{display:'flex',gap:'8px'}}>
                      <button className="pf2-btn-ghost" onClick={()=>setEditing(false)}>Cancel</button>
                      <button className="pf2-btn-gold" onClick={save}>Save Changes</button>
                    </div>
                }
              </div>
              <div className="pf2-rows">
                {FIELDS.map(f => (
                  <div key={f.key} className="pf2-row">
                    <div className="pf2-row-key">{f.label}</div>
                    {editing ? (
                      f.type === 'select'
                        ? <select className="pf2-select" value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})}>
                            <option value="">Select...</option>
                            {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                          </select>
                        : <input className="pf2-input" type={f.type}
                            value={form[f.key]||''} placeholder={f.key==='apiKey'?'sk-ant-api03-...':''}
                            onChange={e=>setForm({...form,[f.key]:e.target.value})}/>
                    ) : (
                      <div className={`pf2-row-val ${
                        f.key==='apiKey'&&profile?.apiKey?'teal':
                        f.key==='income'?'gold':
                        !profile?.[f.key]?'dim':'default'
                      }`}>
                        {f.key==='apiKey'
                          ? (profile?.apiKey ? '● ●●●●●● Connected' : 'Not configured')
                          : (profile?.[f.key] || '—')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── ACTIVITY TIMELINE ── */}
          <div className="pf2-card" style={{animation:'pf-up 0.6s 0.22s ease both'}}>
            <div className="pf2-card-inner">
              <div className="pf2-card-head">
                <div className="pf2-label">Recent Activity</div>
              </div>
              <div className="pf2-timeline">
                {TIMELINE.map((t,i) => (
                  <div key={i} className="pf2-tl-item">
                    <div className="pf2-tl-dot" style={{background:t.bg, borderColor:t.border, color:t.color}}>
                      {t.icon}
                    </div>
                    <div className="pf2-tl-body">
                      <div className="pf2-tl-title">{t.title}</div>
                      <div className="pf2-tl-date">{t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div className="pf2-card" style={{animation:'pf-up 0.6s 0.24s ease both'}}>
            <div className="pf2-card-inner">
              <div className="pf2-card-head">
                <div className="pf2-label">Quick Actions</div>
              </div>
              <div className="pf2-socials">
                {[
                  {ico:'📥', label:'Export Data'},
                  {ico:'🔔', label:'Notifications'},
                  {ico:'🔐', label:'Security'},
                  {ico:'💬', label:'Support'},
                ].map((a,i) => (
                  <button key={i} className="pf2-social-btn">
                    <span className="pf2-social-ico">{a.ico}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── DANGER ZONE ── */}
          <div className="pf2-danger">
            <div className="pf2-danger-inner">
              <div className="pf2-danger-head">
                <div className="pf2-danger-label">⚠ Danger Zone</div>
              </div>
              <div className="pf2-danger-row">
                <div>
                  <div className="pf2-danger-title">Delete Account</div>
                  <div className="pf2-danger-sub">Permanently deletes your account, all filing history,<br/>and saved data. This cannot be undone.</div>
                </div>
                <button className="pf2-btn-danger">Delete Account</button>
              </div>
            </div>
          </div>

        </div>

        {saved && <div className="pf2-toast">✓ Profile saved successfully</div>}
      </div>
    </>
  );
}