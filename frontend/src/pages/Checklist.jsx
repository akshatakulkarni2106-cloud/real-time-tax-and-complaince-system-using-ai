import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const ITEMS = [
  { section:'🏛️ Registration Basics', color:'#f0a500', items:[
    { id:'1', title:'Get PAN Card',               desc:'Mandatory for all business and tax filings in India' },
    { id:'2', title:'Open Business Bank Account', desc:'Separate from personal — essential for clean bookkeeping' },
    { id:'3', title:'GST Registration',           desc:'Required if annual turnover exceeds ₹40L (goods) or ₹20L (services)' },
    { id:'4', title:'Udyam (MSME) Registration',  desc:'Free registration that unlocks priority lending and government schemes' },
  ]},
  { section:'📊 Monthly Compliance', color:'#4d8fff', items:[
    { id:'5', title:'File GSTR-1 by 11th',        desc:'Upload all sales invoices every month on GST portal' },
    { id:'6', title:'File GSTR-3B by 20th',       desc:'Pay GST dues and submit monthly summary return' },
    { id:'7', title:'Maintain Invoice Records',   desc:'Keep all purchase and sale bills neatly organized' },
    { id:'8', title:'Track Business Expenses',    desc:'Log all expenses even without receipts — helps reduce tax' },
  ]},
  { section:'📅 Annual Filing', color:'#00d4a0', items:[
    { id:'9',  title:'File ITR by July 31',       desc:'Annual income tax return — mandatory if income > ₹2.5L' },
    { id:'10', title:'Pay Advance Tax Quarterly', desc:'4 installments if estimated annual tax exceeds ₹10,000' },
    { id:'11', title:'File GSTR-9 Annual Return', desc:'Annual summary of all GST transactions for the year' },
    { id:'12', title:'Renew Trade Licence',       desc:'Check with your local municipality for renewal requirements' },
  ]},
];

export default function Checklist() {
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState({});
  const { getChecklist, updateChecklist } = useApp();

  useEffect(() => {
    getChecklist().then(data => {
      setChecked(data);
      setLoading(false);
    });
  }, []);

  const toggle = async (id) => {
    const newVal = !checked[id];
    setChecked(c => ({...c, [id]: newVal}));
    setSaving(s => ({...s, [id]: true}));
    await updateChecklist(id, newVal);
    setSaving(s => ({...s, [id]: false}));
  };

  const total = ITEMS.reduce((s, sec) => s + sec.items.length, 0);
  const done  = Object.values(checked).filter(Boolean).length;
  const pct   = Math.round((done / total) * 100);

  return (
    <div className="page">
      <div className="checklist-container">

        {/* HEADER */}
        <div style={{marginBottom:'40px', animation:'fadeUp 0.4s ease both'}}>
          <div className="page-title">✅ Compliance Checklist</div>
          <div className="page-sub" style={{marginBottom:'24px'}}>
            Your progress is saved to the database automatically
          </div>

          {/* Overall Progress Bar */}
          <div style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'24px',
            display:'flex', alignItems:'center', gap:'24px'
          }}>
            <div style={{flex:1}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <div style={{fontSize:'13px', color:'var(--text2)', fontWeight:'500'}}>
                  Overall Progress
                </div>
                <div style={{
                  fontFamily:'Syne', fontSize:'20px', fontWeight:'800',
                  color: pct === 100 ? 'var(--green)' : 'var(--accent)'
                }}>
                  {pct}%
                </div>
              </div>
              <div style={{height:'8px', background:'var(--border)', borderRadius:'4px', overflow:'hidden'}}>
                <div style={{
                  height:'100%',
                  width:`${pct}%`,
                  background: pct === 100
                    ? 'linear-gradient(90deg, #00d4a0, #00ffbb)'
                    : 'linear-gradient(90deg, #f0a500, #ffcc44)',
                  borderRadius:'4px',
                  transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: pct === 100
                    ? '0 0 12px rgba(0,212,160,0.4)'
                    : '0 0 12px rgba(240,165,0,0.3)'
                }}/>
              </div>
              <div style={{fontSize:'12px', color:'var(--muted)', marginTop:'8px'}}>
                {done} of {total} tasks completed
              </div>
            </div>
            {pct === 100 && (
              <div style={{fontSize:'48px', animation:'float 3s ease-in-out infinite'}}>🎉</div>
            )}
          </div>
        </div>

        {/* LOADING SKELETONS */}
        {loading ? (
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{height:'76px', borderRadius:'var(--radius)'}}/>
            ))}
          </div>
        ) : (
          ITEMS.map((sec, si) => {
            const secDone = sec.items.filter(it => checked[it.id]).length;
            return (
              <div key={si} style={{marginBottom:'40px', animation:`fadeUp 0.4s ${si*0.1}s ease both`}}>

                {/* Section Header */}
                <div className="cl-section-title">
                  <span>{sec.section}</span>
                  <span style={{
                    fontSize:'12px',
                    fontFamily:'var(--font-body)',
                    fontWeight:'600',
                    color: secDone === sec.items.length ? 'var(--green)' : 'var(--muted)',
                    background: secDone === sec.items.length ? 'var(--green-glow)' : 'var(--surface2)',
                    padding:'3px 10px',
                    borderRadius:'100px',
                    border:`1px solid ${secDone === sec.items.length ? 'rgba(0,212,160,0.3)' : 'var(--border2)'}`
                  }}>
                    {secDone}/{sec.items.length}
                  </span>
                </div>

                {/* Section Progress */}
                <div className="cl-progress">
                  <div className="cl-progress-fill" style={{
                    width:`${(secDone / sec.items.length) * 100}%`,
                    background:`linear-gradient(90deg, ${sec.color}, ${sec.color}88)`
                  }}/>
                </div>

                {/* Items */}
                {sec.items.map((item, ii) => (
                  <div
                    key={item.id}
                    className={`cl-item ${checked[item.id] ? 'checked' : ''}`}
                    onClick={() => toggle(item.id)}
                    style={{animationDelay:`${(si * 4 + ii) * 0.04}s`}}
                  >
                    <div className="cl-checkbox">
                      {saving[item.id]
                        ? <div className="spinner" style={{width:'12px', height:'12px'}}/>
                        : checked[item.id] ? '✓' : ''
                      }
                    </div>
                    <div style={{flex:1}}>
                      <div className="cl-item-title">{item.title}</div>
                      <div className="cl-item-desc">{item.desc}</div>
                    </div>
                    {checked[item.id] && (
                      <div style={{
                        fontSize:'11px', color:'var(--green)',
                        fontWeight:'600', whiteSpace:'nowrap'
                      }}>
                        ✓ Done
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
