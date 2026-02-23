import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useApp();

  const features = [
    { icon:'🤖', title:'AI Tax Assistant',     desc:'Ask anything about GST, ITR in plain language.' },
    { icon:'⏰', title:'Deadline Tracker',     desc:'Never miss a filing deadline again.' },
    { icon:'✅', title:'Smart Checklists',     desc:'Step-by-step compliance tailored to your business.' },
    { icon:'🧮', title:'Tax Calculator',       desc:'Estimate your tax liability instantly.' },
    { icon:'🏛️', title:'Government Schemes',  desc:'Discover loans and subsidies you qualify for.' },
    { icon:'📁', title:'Document Guide',       desc:'Know exactly which documents to keep ready.' },
  ];

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-bg"><div className="hero-orb orb1"/><div className="hero-orb orb2"/></div>
        <div className="hero-badge">🇮🇳 Built for Indian Micro-Businesses</div>
        <h1>Tax Compliance<br/>Made <span className="accent">Simple.</span><br/>Fear <span className="accent2">Eliminated.</span></h1>
        <p className="hero-sub">Your intelligent compliance copilot — for freelancers, traders, and gig workers who want to stay compliant without confusion.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate(token ? '/dashboard' : '/login')}>
            Start Free — No CA Needed
          </button>
          <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
        </div>
        <div className="hero-stats">
          {[['8+','Pages'],['₹0','Cost'],['100%','Simplified'],['24/7','AI Help']].map(([n,l]) => (
            <div key={l} className="stat"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="features-grid">
        {features.map((f,i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}