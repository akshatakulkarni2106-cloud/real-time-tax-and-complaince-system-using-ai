import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const ITEMS = [
  { section:'🏛️ Registration', items:[
    { id:'1', title:'Get PAN Card',            desc:'Mandatory for all tax filings' },
    { id:'2', title:'Open Business Bank Account', desc:'Separate from personal account' },
    { id:'3', title:'GST Registration',        desc:'Required if turnover > ₹40L' },
    { id:'4', title:'Udyam Registration',      desc:'Free MSME registration' },
  ]},
  { section:'📊 Monthly Tasks', items:[
    { id:'5', title:'File GSTR-1 by 11th',     desc:'Upload sales invoices every month' },
    { id:'6', title:'File GSTR-3B by 20th',    desc:'Pay GST dues and summary return' },
    { id:'7', title:'Maintain Invoice Records', desc:'Keep all purchase and sale bills' },
    { id:'8', title:'Track Cash Expenses',     desc:'Log all business expenses' },
  ]},
  { section:'📅 Annual Tasks', items:[
    { id:'9',  title:'File ITR by July 31',    desc:'Annual income tax return' },
    { id:'10', title:'Pay Advance Tax',        desc:'Quarterly if tax > ₹10,000' },
    { id:'11', title:'File GSTR-9',            desc:'Annual GST return' },
    { id:'12', title:'Renew Trade Licence',    desc:'Check with local municipality' },
  ]},
];

export default function Checklist() {
  const [checked, setChecked] = useState({});
  const { getChecklist, updateChecklist } = useApp();

  useEffect(() => { getChecklist().then(setChecked); }, []);

  const toggle = async (id) => {
    const newVal = !checked[id];
    setChecked(c => ({...c, [id]: newVal}));
    await updateChecklist(id, newVal);
  };

  const total = ITEMS.reduce((s, sec) => s + sec.items.length, 0);
  const done  = Object.values(checked).filter(Boolean).length;

  return (
    <div className="page">
      <div className="checklist-container">
        <div className="page-title">✅ Compliance Checklist</div>
        <div className="page-sub">{done} of {total} tasks completed · Progress saved to database</div>
        <div className="cl-progress" style={{marginBottom:'40px'}}>
          <div className="cl-progress-fill" style={{width:`${(done/total)*100}%`}}/>
        </div>

        {ITEMS.map((sec, si) => {
          const secDone = sec.items.filter(it => checked[it.id]).length;
          return (
            <div key={si} className="checklist-section">
              <div className="cl-section-title">
                {sec.section}
                <span style={{fontSize:'13px', color:'var(--muted)', fontWeight:400, fontFamily:'var(--font-body)'}}>
                  {secDone}/{sec.items.length}
                </span>
              </div>
              <div className="cl-progress" style={{marginBottom:'16px'}}>
                <div className="cl-progress-fill" style={{width:`${(secDone/sec.items.length)*100}%`}}/>
              </div>
              {sec.items.map(item => (
                <div key={item.id} className={`cl-item ${checked[item.id] ? 'checked' : ''}`} onClick={() => toggle(item.id)}>
                  <div className="cl-checkbox">{checked[item.id] && '✓'}</div>
                  <div>
                    <div className="cl-item-title">{item.title}</div>
                    <div className="cl-item-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}