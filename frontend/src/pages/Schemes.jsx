const SCHEMES = [
  { title:'PM SVANidhi',           tag:'Street Vendors',  eligibility:'Street vendors with vending certificate', desc:'Working capital loan from ₹10,000 to ₹50,000 with no collateral needed.', benefits:['Loan up to ₹50,000','No collateral','Subsidized interest','Credit score building'] },
  { title:'MUDRA Loan (Shishu)',   tag:'Micro Businesses', eligibility:'Non-farm micro enterprises < ₹50,000',   desc:'Collateral-free loans to help micro-businesses start and grow operations.',  benefits:['Up to ₹50,000','Low interest','No collateral','Multiple banks'] },
  { title:'Udyam Registration',    tag:'MSME Benefit',    eligibility:'All micro, small & medium enterprises',   desc:'Free registration that unlocks priority lending and government scheme access.', benefits:['Priority credit','Tender preference','Patent subsidy','Late payment protection'] },
  { title:'Jan Dhan Overdraft',    tag:'Gig Workers',     eligibility:'Jan Dhan account holders',                desc:'Overdraft facility up to ₹10,000 — a safety net for gig workers.',           benefits:['₹10,000 overdraft','No processing fee','Instant access'] },
  { title:'Presumptive Tax 44AD',  tag:'Tax Benefit',     eligibility:'Businesses with turnover < ₹2 crore',    desc:'Declare 8% of turnover as income — no bookkeeping or audit required.',        benefits:['No books needed','8% presumptive','Simple ITR','No audit'] },
];

export default function Schemes() {
  return (
    <div className="page">
      <div className="schemes-container">
        <div className="page-title">🏛️ Government Schemes</div>
        <div className="page-sub">Benefits you may be eligible for — most people don't know these exist!</div>
        {SCHEMES.map((s,i) => (
          <div key={i} className="scheme-card">
            <div className="scheme-header">
              <div className="scheme-title">{s.title}</div>
              <div className="scheme-tag">{s.tag}</div>
            </div>
            <div className="scheme-desc">{s.desc}</div>
            <div className="scheme-benefits">{s.benefits.map((b,j) => <span key={j} className="scheme-benefit">✓ {b}</span>)}</div>
            <div className="scheme-eligibility">👤 Eligibility: {s.eligibility}</div>
          </div>
        ))}
      </div>
    </div>
  );
}