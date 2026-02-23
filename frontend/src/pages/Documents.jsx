const DOCS = [
  { category:'🪪 Identity & Registration', docs:[
    { name:'PAN Card',          icon:'🎫', desc:'Mandatory for all tax filings',          status:'mandatory' },
    { name:'Aadhaar Card',      icon:'🆔', desc:'Required for GST & bank opening',        status:'mandatory' },
    { name:'Address Proof',     icon:'🏠', desc:'Electricity bill or rent agreement',     status:'mandatory' },
    { name:'Passport/Voter ID', icon:'📘', desc:'Additional KYC document',               status:'optional'  },
  ]},
  { category:'💼 Business Documents', docs:[
    { name:'GST Certificate',   icon:'📜', desc:'If registered — needed for invoicing',  status:'mandatory' },
    { name:'Udyam Certificate', icon:'🏭', desc:'MSME registration certificate',         status:'optional'  },
    { name:'Trade Licence',     icon:'📋', desc:'Issued by local municipality',          status:'optional'  },
    { name:'Bank Statement',    icon:'🏦', desc:'Last 6-12 months for loans/tax',        status:'mandatory' },
  ]},
  { category:'📊 Financial Records', docs:[
    { name:'Sale Invoices',     icon:'🧾', desc:'All invoices raised to customers',      status:'mandatory' },
    { name:'Purchase Bills',    icon:'🛒', desc:'All expense receipts & bills',          status:'mandatory' },
    { name:'GST Returns Copy',  icon:'📑', desc:'GSTR-1, GSTR-3B filed copies',          status:'mandatory' },
    { name:'ITR Acknowledgement',icon:'✅',desc:'Previous year filed ITR copy',          status:'optional'  },
  ]},
];

export default function Documents() {
  return (
    <div className="page">
      <div className="docs-container">
        <div className="page-title">📁 Document Guide</div>
        <div className="page-sub">Know exactly which documents to keep ready for every filing.</div>
        {DOCS.map((cat,i) => (
          <div key={i} className="doc-category">
            <div className="doc-cat-title">{cat.category}</div>
            <div className="doc-grid">
              {cat.docs.map((d,j) => (
                <div key={j} className="doc-card">
                  <div className="doc-icon">{d.icon}</div>
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-desc">{d.desc}</div>
                  <div className={`doc-status ${d.status}`}>{d.status}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}