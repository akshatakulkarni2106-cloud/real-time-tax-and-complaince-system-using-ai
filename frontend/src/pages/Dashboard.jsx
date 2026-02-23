import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DEADLINES = [
  { title:'GSTR-1 Filing',   date:'Mar 11', category:'GST',         urgency:'urgent' },
  { title:'Advance Tax Q4',  date:'Mar 15', category:'Income Tax',  urgency:'urgent' },
  { title:'GSTR-3B Filing',  date:'Mar 20', category:'GST',         urgency:'upcoming' },
  { title:'ITR Filing',      date:'Jul 31', category:'Income Tax',  urgency:'safe' },
];

export default function Dashboard() {
  const { profile } = useApp();
  const navigate    = useNavigate();

  const actions = [
    { icon:'🤖', label:'AI Copilot',    path:'/chat' },
    { icon:'⏰', label:'Deadlines',     path:'/deadlines' },
    { icon:'✅', label:'Checklist',     path:'/checklist' },
    { icon:'🧮', label:'Calculator',    path:'/calculator' },
    { icon:'🏛️', label:'Gov Schemes',  path:'/schemes' },
    { icon:'📁', label:'Documents',     path:'/documents' },
  ];

  return (
    <div className="page">
      <div className="dash-container">
        <div style={{marginBottom:'32px'}}>
          <div style={{color:'var(--muted)', fontSize:'14px', marginBottom:'4px'}}>Welcome back 👋</div>
          <div className="page-title">{profile?.name || 'Dashboard'}</div>
          <div style={{color:'var(--muted)', fontSize:'14px'}}>{profile?.businessType} · {profile?.state}</div>
        </div>

        <div className="metric-cards">
          {[
            { label:'Urgent Deadlines', value:'2',              color:'red',    sub:'This month' },
            { label:'GST Status',       value:profile?.gstRegistered || '—', color:'orange', sub:'Registration' },
            { label:'Income Range',     value:profile?.income || '—',         color:'',      sub:'Annual estimate' },
            { label:'Compliance Score', value:'72%',            color:'green',  sub:'Keep it up!' },
          ].map((m,i) => (
            <div key={i} className="metric-card">
              <div className="metric-label">{m.label}</div>
              <div className={`metric-value ${m.color}`} style={{fontSize: m.value.length > 5 ? '18px':'32px'}}>{m.value}</div>
              <div className="metric-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="section-title">Quick Actions</div>
        <div className="quick-actions">
          {actions.map((a,i) => (
            <div key={i} className="quick-action" onClick={() => navigate(a.path)}>
              <div className="qa-icon">{a.icon}</div>
              <div className="qa-label">{a.label}</div>
            </div>
          ))}
        </div>

        <div className="section-title">Upcoming Deadlines</div>
        <div className="deadline-list">
          {DEADLINES.map((d,i) => (
            <div key={i} className={`deadline-item ${d.urgency}`}>
              <div className="dl-info">
                <div className="dl-title">{d.title}</div>
                <div className="dl-date">{d.category} · {d.date}</div>
              </div>
              <div className={`dl-badge ${d.urgency === 'urgent' ? 'urgent' : d.urgency === 'upcoming' ? 'soon' : 'ok'}`}>
                {d.urgency === 'urgent' ? '⚠️ Urgent' : d.urgency === 'upcoming' ? 'Soon' : '✅ Safe'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}