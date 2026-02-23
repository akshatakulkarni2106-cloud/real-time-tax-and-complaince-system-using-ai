import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ businessType:'', income:'', state:'', gstRegistered:'No' });
  const { updateProfile } = useApp();
  const navigate = useNavigate();

  const bizTypes = [
    { icon:'💻', label:'Freelancer',         desc:'Designer, developer, writer' },
    { icon:'🏪', label:'Small Trader',       desc:'Shop, retail, wholesale' },
    { icon:'🛵', label:'Gig Worker',         desc:'Delivery, cab, marketplace' },
    { icon:'🏭', label:'Micro Manufacturer', desc:'Home production, crafts' },
  ];

  const incomes = ['Under ₹2.5 Lakhs','₹2.5L – ₹5L','₹5L – ₹10L','₹10L – ₹20L','₹20L – ₹40L','Above ₹40 Lakhs'];
  const states  = ['Andhra Pradesh','Bihar','Delhi','Gujarat','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal','Other'];

  const steps = [
    'Your Business Type',
    'Annual Income Range',
    'Location & GST Status'
  ];

  const finish = async () => {
    await updateProfile(data);
    navigate('/dashboard');
  };

  return (
    <div className="page">
      <div className="onboarding-wrap">
        <div style={{color:'var(--muted)', fontSize:'13px', marginBottom:'12px'}}>Step {step+1} of {steps.length}</div>
        <div className="step-indicator">
          {steps.map((_,i) => <div key={i} className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}/>)}
        </div>
        <div className="page-title">{steps[step]}</div>

        {step === 0 && (
          <div className="option-grid">
            {bizTypes.map((b,i) => (
              <div key={i} className={`option-card ${data.businessType === b.label ? 'selected' : ''}`}
                onClick={() => setData({...data, businessType: b.label})}>
                <div className="opt-icon">{b.icon}</div>
                <div className="opt-label">{b.label}</div>
                <div className="opt-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="form-group">
            <label className="form-label">Select Income Range</label>
            <select className="form-input form-select" value={data.income} onChange={e => setData({...data, income: e.target.value})}>
              <option value="">Select...</option>
              {incomes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-input form-select" value={data.state} onChange={e => setData({...data, state: e.target.value})}>
                <option value="">Select state...</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">GST Registered?</label>
              <div style={{display:'flex', gap:'12px'}}>
                {['Yes','No','Not Sure'].map(o => (
                  <div key={o} className={`option-card ${data.gstRegistered === o ? 'selected' : ''}`}
                    style={{flex:1, padding:'14px'}} onClick={() => setData({...data, gstRegistered: o})}>
                    <div className="opt-label">{o}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{display:'flex', gap:'12px', marginTop:'40px'}}>
          {step > 0 && <button className="btn-secondary" style={{flex:1}} onClick={() => setStep(step-1)}>← Back</button>}
          {step < steps.length - 1
            ? <button className="btn-primary" style={{flex:1}} onClick={() => setStep(step+1)}>Continue →</button>
            : <button className="btn-primary" style={{flex:1}} onClick={finish}>Go to Dashboard 🚀</button>
          }
        </div>
      </div>
    </div>
  );
}