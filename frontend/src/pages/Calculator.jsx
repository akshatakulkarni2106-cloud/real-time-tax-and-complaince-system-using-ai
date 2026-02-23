    import { useState } from 'react';

export default function Calculator() {
  const [income,   setIncome]   = useState('');
  const [expenses, setExpenses] = useState('');
  const [result,   setResult]   = useState(null);

  const calculate = () => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expenses) || 0;
    const taxable = inc - exp;
    let tax = 0;
    if      (taxable <= 250000)  tax = 0;
    else if (taxable <= 500000)  tax = (taxable - 250000) * 0.05;
    else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20;
    else                         tax = 112500 + (taxable - 1000000) * 0.30;
    const total = tax + tax * 0.04;
    const presumptive = inc * 0.08 * 0.05 * 1.04;
    setResult({ taxable, total, gstNeeded: inc >= 2000000, presumptive });
  };

  const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');

  return (
    <div className="page">
      <div className="calc-container">
        <div className="page-title">🧮 Tax Calculator</div>
        <div className="page-sub">Estimate your tax for FY 2025-26</div>
        <div className="calc-grid">
          <div className="calc-inputs">
            <div className="section-title" style={{fontSize:'18px'}}>Your Numbers</div>
            <div className="form-group">
              <label className="form-label">Annual Income (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 800000" value={income} onChange={e => setIncome(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Business Expenses (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 150000" value={expenses} onChange={e => setExpenses(e.target.value)}/>
            </div>
            <div style={{background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:'10px', padding:'14px', fontSize:'13px', color:'var(--muted)', lineHeight:'1.6', marginBottom:'4px'}}>
              💡 Under Section 44AD, declare just 8% of turnover as profit — no books needed!
            </div>
            <button className="calc-btn" onClick={calculate}>Calculate →</button>
          </div>
          <div className="calc-result">
            <div className="section-title" style={{fontSize:'18px'}}>Results</div>
            {result ? (
              <>
                {[
                  { label:'Taxable Income',       val: fmt(result.taxable),    cls:'' },
                  { label:'Tax + Health & Ed Cess', val: fmt(result.total),   cls:'highlight' },
                  { label:'GST Registration',     val: result.gstNeeded ? '⚠️ Required':'✅ Not Required', cls: result.gstNeeded ? 'danger':'safe' },
                  { label:'Presumptive Tax (44AD)', val: fmt(result.presumptive), cls:'safe' },
                ].map((r,i) => (
                  <div key={i} className="result-item">
                    <div className="result-label">{r.label}</div>
                    <div className={`result-value ${r.cls}`}>{r.val}</div>
                  </div>
                ))}
                <div style={{background:'rgba(46,204,113,0.08)', border:'1px solid rgba(46,204,113,0.2)', borderRadius:'10px', padding:'14px', fontSize:'13px', color:'var(--muted)', marginTop:'16px', lineHeight:'1.6'}}>
                  {result.total > result.presumptive
                    ? `✨ Save ${fmt(result.total - result.presumptive)} using Presumptive Taxation!`
                    : '✅ Your regular tax calculation is optimal.'}
                </div>
              </>
            ) : (
              <div style={{color:'var(--muted)', textAlign:'center', marginTop:'60px', fontSize:'14px'}}>
                Enter your income and click Calculate
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}