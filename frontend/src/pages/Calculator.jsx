import { useState } from 'react';

const SLABS = [
  { limit: 400000,  rate: 0.00, color: '#22c55e', label: '0%',  range: 'Up to ₹4L' },
  { limit: 800000,  rate: 0.05, color: '#84cc16', label: '5%',  range: '₹4L – ₹8L' },
  { limit: 1200000, rate: 0.10, color: '#eab308', label: '10%', range: '₹8L – ₹12L' },
  { limit: 1600000, rate: 0.15, color: '#f97316', label: '15%', range: '₹12L – ₹16L' },
  { limit: 2000000, rate: 0.20, color: '#ef4444', label: '20%', range: '₹16L – ₹20L' },
  { limit: 2400000, rate: 0.25, color: '#dc2626', label: '25%', range: '₹20L – ₹24L' },
  { limit: Infinity, rate: 0.30, color: '#991b1b', label: '30%', range: 'Above ₹24L' },
];

function computeNewRegimeTax(taxableIncome) {
  let tax = 0, prev = 0, activeSlabIdx = -1;
  for (let i = 0; i < SLABS.length; i++) {
    if (taxableIncome <= prev) break;
    const slice = Math.min(taxableIncome, SLABS[i].limit) - prev;
    tax += slice * SLABS[i].rate;
    if (slice > 0) activeSlabIdx = i;
    prev = SLABS[i].limit;
  }
  return { tax, activeSlabIdx };
}

const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

  .ts-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #0c0c0c;
    min-height: 100vh;
    padding: 52px 20px 60px;
    color: #fff;
    box-sizing: border-box;
  }

  /* ── Header ── */
  .ts-header { text-align: center; margin-bottom: 52px; }

  .ts-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(234,179,8,0.1);
    border: 1px solid rgba(234,179,8,0.22);
    border-radius: 999px;
    padding: 5px 15px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #eab308; margin-bottom: 22px;
  }

  .ts-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(34px, 6vw, 58px);
    font-weight: 800; line-height: 1.05;
    margin: 0 0 14px;
    background: linear-gradient(135deg, #ffffff 25%, #eab308 85%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ts-sub-head { color: #888; font-size: 14px; font-weight: 300; letter-spacing: 0.02em; }

  /* ── Layout grid ── */
  .ts-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px; max-width: 980px; margin: 0 auto;
  }
  @media (max-width: 700px) { .ts-grid { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .ts-card {
    background: #131313;
    border: 1px solid #222;
    border-radius: 22px;
    padding: 30px 28px;
    position: relative; overflow: hidden;
  }
  .ts-card::after {
    content: '';
    position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(234,179,8,0.45), transparent);
    pointer-events: none;
  }

  .ts-section-label {
    font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: #eab308; margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }

  .ts-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, #333, transparent);
  }

  /* ── Toggle ── */
  .ts-toggle {
    display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
    background: #0c0c0c; border: 1px solid #222;
    border-radius: 13px; padding: 4px;
    margin-bottom: 26px;
  }
  .ts-tog-btn {
    padding: 11px 8px; border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.22s;
    background: transparent; color: #888;
  }
  .ts-tog-btn.on {
    background: linear-gradient(135deg, #eab308, #b45309);
    color: #0c0c0c; font-weight: 700;
    box-shadow: 0 2px 18px rgba(234,179,8,0.28);
  }

  /* ── Form field ── */
  .ts-field { margin-bottom: 22px; }
  .ts-lbl {
    display: block; font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #888; margin-bottom: 9px;
  }
  .ts-inp-wrap { position: relative; }
  .ts-sym {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    font-size: 17px; font-weight: 600; color: #eab308; pointer-events: none;
  }
  .ts-inp {
    width: 100%; box-sizing: border-box;
    background: #0c0c0c; border: 1px solid #262626;
    border-radius: 12px; padding: 13px 13px 13px 32px;
    font-family: 'DM Sans', sans-serif; font-size: 16px;
    font-weight: 500; color: #fff; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ts-inp:focus { border-color: rgba(234,179,8,0.6); box-shadow: 0 0 0 3px rgba(234,179,8,0.08); }
  .ts-inp::placeholder { color: #2c2c2c; }
  .ts-inp::-webkit-inner-spin-button, .ts-inp::-webkit-outer-spin-button { -webkit-appearance: none; }

  /* ── Hint box ── */
  .ts-hint {
    background: rgba(234,179,8,0.05); border: 1px solid rgba(234,179,8,0.18);
    border-radius: 11px; padding: 11px 13px;
    font-size: 12px; color: #aaa; line-height: 1.6;
    margin-bottom: 22px; display: flex; gap: 9px;
  }
  .ts-hint-i { color: #eab308; flex-shrink: 0; font-size: 12px; }

  /* ── Slab reference ── */
  .ts-slabs { margin-bottom: 26px; }
  .ts-slab-bar {
    display: flex; gap: 3px; height: 5px;
    border-radius: 999px; overflow: hidden; margin-bottom: 10px;
  }
  .ts-seg { flex: 1; border-radius: 2px; opacity: 0.3; transition: opacity 0.35s, transform 0.35s; }
  .ts-seg.lit { opacity: 1; transform: scaleY(1.4); }

  .ts-slab-rows {}
  .ts-sr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; font-size: 12.5px; color: #999;
    border-bottom: 1px solid #1f1f1f; transition: color 0.3s;
  }
  .ts-sr:last-child { border-bottom: none; }
  .ts-sr.lit { color: #fff; }
  .ts-sr-left { display: flex; align-items: center; gap: 7px; }
  .ts-dot { width: 6px; height: 6px; border-radius: 50%; opacity: 0.35; transition: opacity 0.3s; }
  .ts-sr.lit .ts-dot { opacity: 1; }
  .ts-rate { font-weight: 700; font-size: 12px; }

  /* ── CTA button ── */
  .ts-cta {
    width: 100%; padding: 14px 0;
    background: linear-gradient(135deg, #eab308 0%, #b45309 100%);
    border: none; border-radius: 13px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    color: #0c0c0c; cursor: pointer; letter-spacing: 0.04em;
    transition: all 0.22s;
    box-shadow: 0 4px 22px rgba(234,179,8,0.22);
  }
  .ts-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(234,179,8,0.38); }
  .ts-cta:active { transform: translateY(0); }

  /* ── Empty state ── */
  .ts-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 340px; gap: 14px;
  }
  .ts-empty-glyph {
    font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800;
    color: #333; line-height: 1;
  }
  .ts-empty-txt { font-size: 14px; color: #888; font-weight: 500; }

  /* ── Hero total ── */
  .ts-hero {
    background: linear-gradient(135deg, rgba(234,179,8,0.09) 0%, rgba(180,83,9,0.05) 100%);
    border: 1px solid rgba(234,179,8,0.18);
    border-radius: 18px; padding: 26px 22px; text-align: center;
    margin-bottom: 20px; position: relative; overflow: hidden;
  }
  .ts-hero::before {
    content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(234,179,8,0.55), transparent);
  }
  .ts-hero-lbl { font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin-bottom: 10px; }
  .ts-hero-amt {
    font-family: 'Syne', sans-serif; font-size: 44px; font-weight: 800;
    color: #eab308; line-height: 1; margin-bottom: 8px;
  }
  .ts-hero-rate { font-size: 13px; color: #888; }
  .ts-hero-rate strong { color: #eab308; }

  /* ── Stat cards ── */
  .ts-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .ts-stat {
    background: #0c0c0c; border: 1px solid #1e1e1e;
    border-radius: 13px; padding: 14px 14px;
  }
  .ts-stat-lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; margin-bottom: 7px; }
  .ts-stat-val { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 700; color: #ddd; }
  .ts-stat-val.gold { color: #eab308; }
  .ts-stat-val.green { color: #22c55e; }
  .ts-stat-val.red { color: #f87171; }
  .ts-stat.span2 { grid-column: 1 / -1; }

  /* ── Breakdown rows ── */
  .ts-divider { height: 1px; background: linear-gradient(90deg, transparent, #222, transparent); margin: 16px 0; }
  .ts-brow {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid #191919; font-size: 13px;
  }
  .ts-brow:last-child { border-bottom: none; }
  .ts-brow-l { color: #888; }
  .ts-brow-v { font-weight: 600; color: #ddd; }
  .ts-brow-v.minus { color: #22c55e; }


`;

export default function TaxCalculator() {
  const [income, setIncome] = useState('');
  const [type,   setType]   = useState('salaried');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const inc = parseFloat(income) || 0;
    const sd  = type === 'salaried' ? 75000 : 0;
    const taxableIncome = Math.max(0, inc - sd);

    const { tax: baseTax, activeSlabIdx } = computeNewRegimeTax(taxableIncome);
    const rebateApplicable = taxableIncome <= 1200000 && baseTax > 0;
    const taxAfterRebate   = rebateApplicable ? 0 : baseTax;

    let surcharge = 0;
    if      (taxableIncome > 50000000) surcharge = taxAfterRebate * 0.25;
    else if (taxableIncome > 20000000) surcharge = taxAfterRebate * 0.25;
    else if (taxableIncome > 10000000) surcharge = taxAfterRebate * 0.15;
    else if (taxableIncome > 5000000)  surcharge = taxAfterRebate * 0.10;

    const taxPlusSurcharge = taxAfterRebate + surcharge;
    const cess      = taxPlusSurcharge * 0.04;
    const totalTax  = taxPlusSurcharge + cess;
    const effRate   = inc > 0 ? (totalTax / inc * 100) : 0;
    const gstNeeded = inc >= 2000000;

    let presumptiveTax = null;
    if (type === 'business') {
      const pInc = inc * 0.08;
      const { tax: pTax } = computeNewRegimeTax(Math.max(0, pInc));
      const pRebate = pInc <= 1200000 && pTax > 0;
      presumptiveTax = (pRebate ? 0 : pTax) * 1.04;
    }

    setResult({ taxableIncome, sd, baseTax, rebateApplicable, totalTax, effRate, gstNeeded, presumptiveTax, activeSlabIdx, cess });
  };

  const inc = parseFloat(income) || 0;



  return (
    <>
      <style>{CSS}</style>
      <div className="ts-wrap">

        {/* Header */}
        <div className="ts-header">
          <div className="ts-pill">✦ &nbsp;New Tax Regime &nbsp;·&nbsp; FY 2025-26</div>
          <h1 className="ts-h1">Tax Calculator</h1>
          <p className="ts-sub-head">Instant estimate based on Budget 2025 slabs</p>
        </div>

        <div className="ts-grid">

          {/* ─── Left panel ─── */}
          <div className="ts-card">
            <div className="ts-section-label">Your Numbers</div>

            {/* Type toggle */}
            <div className="ts-toggle">
              {[
                { key: 'salaried', label: '💼  Salaried' },
                { key: 'business', label: '🏢  Business' },
              ].map(({ key, label }) => (
                <button key={key} className={`ts-tog-btn${type === key ? ' on' : ''}`} onClick={() => setType(key)}>
                  {label}
                </button>
              ))}
            </div>

            {/* Income */}
            <div className="ts-field">
              <label className="ts-lbl">Annual Income</label>
              <div className="ts-inp-wrap">
                <span className="ts-sym">₹</span>
                <input
                  className="ts-inp"
                  type="number"
                  placeholder="e.g. 12,00,000"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && calculate()}
                />
              </div>
            </div>

            {/* Hint */}
            <div className="ts-hint">
              <span className="ts-hint-i">✦</span>
              {type === 'salaried'
                ? <span>₹75,000 standard deduction is automatically applied. Effective zero tax up to ₹12.75L.</span>
                : <span>Under Section 44AD, declare just 8% of turnover as profit — no books of accounts needed!</span>
              }
            </div>

            {/* Slab reference */}
            <div className="ts-slabs">
              <div className="ts-section-label" style={{ fontSize: '10px', marginBottom: '10px' }}>Tax Slabs</div>
              <div className="ts-slab-bar">
                {SLABS.map((s, i) => (
                  <div key={i} className={`ts-seg${result?.activeSlabIdx === i ? ' lit' : ''}`} style={{ background: s.color }} />
                ))}
              </div>
              <div className="ts-slab-rows">
                {SLABS.map((s, i) => (
                  <div key={i} className={`ts-sr${result?.activeSlabIdx === i ? ' lit' : ''}`}>
                    <div className="ts-sr-left">
                      <div className="ts-dot" style={{ background: s.color }} />
                      <span>{s.range}</span>
                    </div>
                    <span className="ts-rate" style={{ color: result?.activeSlabIdx === i ? s.color : undefined }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="ts-cta" onClick={calculate}>Calculate Tax →</button>
          </div>

          {/* ─── Right panel ─── */}
          <div className="ts-card">
            <div className="ts-section-label">Results</div>

            {result ? (
              <>
                {/* Hero amount */}
                <div className="ts-hero">
                  <div className="ts-hero-lbl">Total Tax Payable</div>
                  <div className="ts-hero-amt">{fmt(result.totalTax)}</div>
                  <div className="ts-hero-rate">
                    Effective rate &nbsp;<strong>{result.effRate.toFixed(2)}%</strong>
                  </div>
                </div>

                {/* Stat grid */}
                <div className="ts-stats">
                  <div className="ts-stat">
                    <div className="ts-stat-lbl">Taxable Income</div>
                    <div className="ts-stat-val">{fmt(result.taxableIncome)}</div>
                  </div>
                  <div className="ts-stat">
                    <div className="ts-stat-lbl">GST Registration</div>
                    <div className={`ts-stat-val ${result.gstNeeded ? 'red' : 'green'}`}>
                      {result.gstNeeded ? 'Required' : 'Not needed'}
                    </div>
                  </div>
                  {result.presumptiveTax !== null && (
                    <div className="ts-stat span2">
                      <div className="ts-stat-lbl">Presumptive Tax under Sec 44AD — tax on 8% of ₹{Math.round(inc).toLocaleString('en-IN')} = ₹{Math.round(inc*0.08).toLocaleString('en-IN')}</div>
                      <div className="ts-stat-val gold">{fmt(result.presumptiveTax)}</div>
                    </div>
                  )}
                </div>

                {/* Breakdown */}
                <div className="ts-divider" />
                <div className="ts-brow">
                  <span className="ts-brow-l">Gross income</span>
                  <span className="ts-brow-v">{fmt(inc)}</span>
                </div>
                {result.sd > 0 && (
                  <div className="ts-brow">
                    <span className="ts-brow-l">Standard deduction</span>
                    <span className="ts-brow-v minus">− {fmt(result.sd)}</span>
                  </div>
                )}
                {result.rebateApplicable && (
                  <div className="ts-brow">
                    <span className="ts-brow-l">Rebate u/s 87A</span>
                    <span className="ts-brow-v minus">− {fmt(result.baseTax)}</span>
                  </div>
                )}
                <div className="ts-brow">
                  <span className="ts-brow-l">Health & Education Cess (4%)</span>
                  <span className="ts-brow-v">{fmt(result.cess)}</span>
                </div>

              </>
            ) : (
              <div className="ts-empty">
                <div className="ts-empty-glyph">₹</div>
                <div className="ts-empty-txt">Enter your income and hit Calculate</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Results will appear here</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
