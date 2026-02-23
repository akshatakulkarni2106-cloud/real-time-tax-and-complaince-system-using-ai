import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { profile, updateProfile } = useApp();
  const [editing, setEditing]      = useState(false);
  const [form, setForm]            = useState({});
  const [saved, setSaved]          = useState(false);

  const startEdit = () => { setForm({...profile}); setEditing(true); };

  const save = async () => {
    await updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const bizIcon = { Freelancer:'💻', 'Small Trader':'🏪', 'Gig Worker':'🛵', 'Micro Manufacturer':'🏭' };

  return (
    <div className="page">
      <div className="profile-container">
        <div className="page-title">👤 My Profile</div>
        <div className="page-sub">Your personalized compliance settings — saved to database</div>

        <div className="profile-header">
          <div className="profile-avatar">{bizIcon[profile?.businessType] || '👤'}</div>
          <div>
            <div className="profile-name">{profile?.name}</div>
            <div className="profile-type">{profile?.businessType} · {profile?.state}</div>
            <div className="profile-badge">✓ TaxSaathi Member</div>
          </div>
        </div>

        <div className="profile-section">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <div className="profile-section-title" style={{margin:0}}>Business Details</div>
            {!editing
              ? <button className="edit-btn" onClick={startEdit}>Edit</button>
              : <div style={{display:'flex', gap:'8px'}}>
                  <button className="edit-btn" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="nav-cta" onClick={save}>Save</button>
                </div>
            }
          </div>
          {[
            { key:'name',          label:'Name' },
            { key:'businessType',  label:'Business Type' },
            { key:'income',        label:'Annual Income' },
            { key:'state',         label:'State' },
            { key:'gstRegistered', label:'GST Registered' },
            { key:'apiKey',        label:'Anthropic API Key' },
          ].map(f => (
            <div key={f.key} className="profile-row">
              <div className="profile-key">{f.label}</div>
              {editing
                ? <input className="form-input" style={{maxWidth:'260px', padding:'8px 12px'}}
                    value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}
                    type={f.key === 'apiKey' ? 'password' : 'text'}
                    placeholder={f.key === 'apiKey' ? 'sk-ant-...' : ''}/>
                : <div className="profile-val">
                    {f.key === 'apiKey' ? (profile?.apiKey ? '●●●●●● Connected' : 'Not set') : profile?.[f.key] || '—'}
                  </div>
              }
            </div>
          ))}
        </div>

        {saved && <div className="toast">✓ Profile saved to database!</div>}
      </div>
    </div>
  );
}