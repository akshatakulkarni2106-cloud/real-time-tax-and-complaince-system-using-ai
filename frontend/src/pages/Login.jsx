import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const { login, register }         = useApp();
  const navigate                    = useNavigate();

  const handle = async () => {
    setError(''); setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
        navigate('/onboarding');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh'}}>
      <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'20px', padding:'48px', width:'100%', maxWidth:'440px'}}>
        <div className="nav-logo" style={{fontSize:'28px', marginBottom:'8px'}}>Tax<span style={{color:'var(--text)'}}>Saathi</span></div>
        <div style={{color:'var(--muted)', fontSize:'14px', marginBottom:'40px'}}>
          {isRegister ? 'Create your free account' : 'Welcome back! Login to continue'}
        </div>

        {isRegister && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Ravi Kumar" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>

        {error && <div style={{color:'var(--accent2)', fontSize:'13px', marginBottom:'16px'}}>❌ {error}</div>}

        <button className="btn-primary" style={{width:'100%'}} onClick={handle} disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Create Account →' : 'Login →'}
        </button>

        <div style={{textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--muted)'}}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span style={{color:'var(--accent)', cursor:'pointer', marginLeft:'6px'}}
            onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Sign Up Free'}
          </span>
        </div>
      </div>
    </div>
  );
}