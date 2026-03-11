import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const DEADLINES = [
  { title:'GSTR-1 Filing',   date:'Mar 11', category:'GST',        urgency:'urgent' },
  { title:'Advance Tax Q4',  date:'Mar 15', category:'Income Tax', urgency:'urgent' },
  { title:'GSTR-3B Filing',  date:'Mar 20', category:'GST',        urgency:'upcoming' },
  { title:'ITR Filing',      date:'Jul 31', category:'Income Tax', urgency:'safe' },
];

const COMPLIANCE_DATA = [
  { month:'Oct', score:45 },
  { month:'Nov', score:52 },
  { month:'Dec', score:60 },
  { month:'Jan', score:58 },
  { month:'Feb', score:72 },
  { month:'Mar', score:78 },
];

const TASK_DATA = [
  { name:'GST',        done:3, total:4 },
  { name:'Income Tax', done:2, total:3 },
  { name:'MSME',       done:1, total:2 },
  { name:'Banking',    done:2, total:2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{background:'#1e1e32', border:'1px solid #32324a', borderRadius:'8px', padding:'10px 14px'}}>
        <div style={{fontSize:'11px', color:'#5c5c7a', marginBottom:'4px'}}>{label}</div>
        <div style={{fontSize:'16px', fontFamily:'Syne', fontWeight:'800', color:'#00d4a0'}}>
          {payload[0].value}%
        </div>
      </div>
    );
  }
  return null;
};

function SkeletonCard() {
  return (
    <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'24px'}}>
      <div className="skeleton skeleton-text" style={{width:'40%', marginBottom:'12px'}}/>
      <div className="skeleton" style={{height:'36px', width:'55%', borderRadius:'6px', marginBottom:'8px'}}/>
      <div className="skeleton skeleton-text" style={{width:'60%'}}/>
    </div>
  );
}

export default function Dashboard() {
  const { profile }   = useApp();
  const navigate      = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [score, setScore]       = useState(0);
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) {
      let s = 0;
      const interval = setInterval(() => {
        s += 2;
        setAnimScore(s);
        if (s >= 72) { setAnimScore(72); clearInterval(interval); }
      }, 18);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const actions = [
    { icon:'🤖', label:'AI Copilot',   path:'/chat' },
    { icon:'⏰', label:'Deadlines',    path:'/deadlines' },
    { icon:'✅', label:'Checklist',    path:'/checklist' },
    { icon:'🧮', label:'Calculator',   path:'/calculator' },
    { icon:'🏛️', label:'Schemes',     path:'/schemes' },
    { icon:'📁', label:'Documents',    path:'/documents' },
  ];

  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (animScore / 100) * circumference;

  return (
    <div className="page">
      <div className="dash-container">

        {/* HEADER */}
        <div style={{marginBottom:'32px', animation:'fadeUp 0.4s ease both'}}>
          <div style={{fontSize:'13px', color:'var(--muted)', marginBottom:'4px', letterSpacing:'0.5px'}}>
            WELCOME BACK
          </div>
          <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'16px'}}>
            <div>
              <div className="page-title" style={{marginBottom:'4px'}}>{profile?.name || 'Dashboard'}</div>
              <div style={{color:'var(--text2)', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span style={{background:'var(--accent-glow)', color:'var(--accent)', padding:'2px 10px', borderRadius:'100px', fontSize:'12px', fontWeight:'600', border:'1px solid rgba(240,165,0,0.3)'}}>
                  {profile?.businessType || 'Micro Business'}
                </span>
                <span style={{color:'var(--muted)'}}>·</span>
                <span>{profile?.state || 'India'}</span>
              </div>
            </div>
            {/* Compliance Ring */}
            <div style={{display:'flex', alignItems:'center', gap:'16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 24px'}}>
              <div className="progress-ring">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle className="progress-ring-bg" cx="40" cy="40" r="32"/>
                  <circle
                    className="progress-ring-fill"
                    cx="40" cy="40" r="32"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontSize:'18px', fontWeight:'800', color:'var(--green)', top:0, left:0, right:0, bottom:0, textAlign:'center', lineHeight:'80px'}}>
                  {animScore}%
                </div>
              </div>
              <div>
                <div style={{fontSize:'11px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Compliance</div>
                <div style={{fontSize:'14px', fontWeight:'600', color:'var(--green)'}}>Good Standing</div>
                <div style={{fontSize:'11px', color:'var(--muted)', marginTop:'2px'}}>Keep it up! 🎉</div>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="metric-cards">
          {loading ? (
            [1,2,3,4].map(i => <SkeletonCard key={i}/>)
          ) : (
            <>
              {[
                { label:'Urgent Deadlines', value:'2',                          color:'red',    sub:'Action needed now', delay:'0s' },
                { label:'GST Status',       value: profile?.gstRegistered||'—', color:'orange', sub:'Registration status', delay:'0.08s' },
                { label:'Income Range',     value: profile?.income ? profile.income.split('–')[0].trim() : '—', color:'blue', sub:'Annual estimate', delay:'0.16s' },
                { label:'Tasks Done',       value:'8/12',                       color:'green',  sub:'This quarter', delay:'0.24s' },
              ].map((m,i) => (
                <div key={i} className="metric-card" style={{animationDelay: m.delay}}>
                  <div className="metric-label">{m.label}</div>
                  <div className={`metric-value ${m.color}`} style={{fontSize: m.value.length > 6 ? '18px':'30px'}}>{m.value}</div>
                  <div className="metric-sub">{m.sub}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* CHARTS ROW */}
        {!loading && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'36px'}}>

            {/* Compliance Trend */}
            <div className="chart-card">
              <div className="chart-title">📈 Compliance Score Trend</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={COMPLIANCE_DATA} margin={{top:5, right:5, bottom:0, left:-30}}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00d4a0" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00d4a0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{fill:'#5c5c7a', fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#5c5c7a', fontSize:11}} axisLine={false} tickLine={false} domain={[30,100]}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="score" stroke="#00d4a0" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{fill:'#00d4a0', r:3, strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Task Completion */}
            <div className="chart-card">
              <div className="chart-title">✅ Tasks by Category</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={TASK_DATA} margin={{top:5, right:5, bottom:0, left:-30}} barSize={20}>
                  <XAxis dataKey="name" tick={{fill:'#5c5c7a', fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#5c5c7a', fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip
                    contentStyle={{background:'#1e1e32', border:'1px solid #32324a', borderRadius:'8px', fontSize:'12px'}}
                    labelStyle={{color:'#a0a0bc'}}
                    itemStyle={{color:'#00d4a0'}}
                  />
                  <Bar dataKey="done" radius={[4,4,0,0]}>
                    {TASK_DATA.map((_, i) => (
                      <Cell key={i} fill={i === 3 ? '#00d4a0' : '#f0a500'} opacity={0.85}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions" style={{marginBottom:'36px'}}>
          {actions.map((a,i) => (
            <div key={i} className="quick-action" style={{animationDelay:`${i*0.06}s`}} onClick={() => navigate(a.path)}>
              <span className="qa-icon">{a.icon}</span>
              <div className="qa-label">{a.label}</div>
            </div>
          ))}
        </div>

        {/* UPCOMING DEADLINES */}
        <div className="section-title">Upcoming Deadlines</div>
        {loading ? (
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{height:'70px', borderRadius:'var(--radius)'}}/>)}
          </div>
        ) : (
          <div className="deadline-list">
            {DEADLINES.map((d,i) => (
              <div key={i} className={`deadline-item ${d.urgency}`} style={{animationDelay:`${i*0.08}s`}}>
                <div>
                  <div className="dl-title">{d.title}</div>
                  <div className="dl-date">{d.category} · {d.date}</div>
                </div>
                <div className={`dl-badge ${d.urgency === 'urgent' ? 'urgent' : d.urgency === 'upcoming' ? 'soon' : 'ok'}`}>
                  {d.urgency === 'urgent' ? '⚠ Urgent' : d.urgency === 'upcoming' ? 'Upcoming' : '✓ Safe'}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
