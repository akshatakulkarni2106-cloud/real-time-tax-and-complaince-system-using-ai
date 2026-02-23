const DEADLINES = [
  { title:'GSTR-1 Filing',       date:'2026-03-11', category:'GST',         desc:'Monthly return for outward supplies',      urgency:'urgent' },
  { title:'Advance Tax Q4',      date:'2026-03-15', category:'Income Tax',  desc:'4th installment of advance tax',           urgency:'urgent' },
  { title:'GSTR-3B Filing',      date:'2026-03-20', category:'GST',         desc:'Monthly summary return',                   urgency:'upcoming' },
  { title:'ITR Filing',          date:'2026-07-31', category:'Income Tax',  desc:'Annual income tax return deadline',        urgency:'safe' },
  { title:'TDS Return Q4',       date:'2026-05-31', category:'TDS',         desc:'Quarterly TDS return',                     urgency:'safe' },
  { title:'GST Annual Return',   date:'2026-12-31', category:'GST',         desc:'GSTR-9 for FY 2025-26',                    urgency:'safe' },
];

export default function Deadlines() {
  const today = new Date();
  const daysLeft = (d) => Math.ceil((new Date(d) - today) / 86400000);

  return (
    <div className="page">
      <div className="deadlines-container">
        <div className="page-title">📅 Filing Deadlines</div>
        <div className="page-sub">All your tax deadlines — never pay a late fee again.</div>

        <div style={{marginBottom:'32px'}}>
          <div className="month-label">⚠️ Urgent — Act Now</div>
          {DEADLINES.filter(d => d.urgency === 'urgent').map((d,i) => {
            const days = daysLeft(d.date);
            const dt   = new Date(d.date);
            return (
              <div key={i} className="deadline-card urgent">
                <div className="dl-date-box">
                  <div className="dl-day">{dt.getDate()}</div>
                  <div className="dl-month">{dt.toLocaleString('default',{month:'short'})}</div>
                </div>
                <div className="dl-content">
                  <div className="dl-card-title">{d.title}</div>
                  <div className="dl-card-desc">{d.desc} · {d.category}</div>
                </div>
                <div className="dl-days-left red">{days < 0 ? 'Overdue!' : `${days} days left`}</div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="month-label">📆 Upcoming This Year</div>
          {DEADLINES.filter(d => d.urgency !== 'urgent').map((d,i) => {
            const days = daysLeft(d.date);
            const dt   = new Date(d.date);
            return (
              <div key={i} className={`deadline-card ${d.urgency}`}>
                <div className="dl-date-box">
                  <div className="dl-day">{dt.getDate()}</div>
                  <div className="dl-month">{dt.toLocaleString('default',{month:'short'})}</div>
                </div>
                <div className="dl-content">
                  <div className="dl-card-title">{d.title}</div>
                  <div className="dl-card-desc">{d.desc} · {d.category}</div>
                </div>
                <div className={`dl-days-left ${days < 30 ? 'orange' : 'green'}`}>{days} days left</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}