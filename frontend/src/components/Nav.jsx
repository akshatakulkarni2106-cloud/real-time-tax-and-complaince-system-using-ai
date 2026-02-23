import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, profile, logout } = useApp();
  const path = location.pathname;

  const links = [
    { path:'/dashboard',  label:'Dashboard' },
    { path:'/chat',       label:'AI Copilot' },
    { path:'/deadlines',  label:'Deadlines' },
    { path:'/checklist',  label:'Checklist' },
    { path:'/calculator', label:'Calculator' },
    { path:'/schemes',    label:'Schemes' },
    { path:'/documents',  label:'Documents' },
    { path:'/profile',    label:'Profile' },
  ];

  const isHidden = path === '/' || path === '/login' || path === '/onboarding';

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => navigate('/')}>Tax<span>Saathi</span></div>
      {!isHidden && token && (
        <div className="nav-links">
          {links.map(l => (
            <button key={l.path} className={`nav-link ${path === l.path ? 'active' : ''}`}
              onClick={() => navigate(l.path)}>
              {l.label}
            </button>
          ))}
        </div>
      )}
      {token
        ? !isHidden && <button className="nav-cta" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        : path === '/' && <button className="nav-cta" onClick={() => navigate('/login')}>Get Started →</button>
      }
    </nav>
  );
}