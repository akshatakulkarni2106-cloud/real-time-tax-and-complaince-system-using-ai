import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const CHIPS = [
  'Do I need GST registration?',
  'ITR deadline for freelancers?',
  'What is Section 44AD?',
  'Penalty for late GST filing?',
  'How to register on Udyam?',
  'Advance tax payment dates?',
];

const TOPICS = [
  { icon:'🧾', label:'GST Queries' },
  { icon:'💰', label:'Income Tax' },
  { icon:'📅', label:'Deadlines' },
  { icon:'🏛️', label:'Schemes' },
  { icon:'⚠️', label:'Penalties' },
  { icon:'📋', label:'Documents' },
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTopic, setActiveTopic] = useState('GST Queries');
  const { sendChat, getChatHistory, clearChat, profile } = useApp();
  const bottomRef  = useRef();
  const inputRef   = useRef();

  useEffect(() => {
    getChatHistory().then(history => {
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([{
          role: 'bot',
          text: `Namaste ${profile?.name || ''}! 🙏\n\nI'm TaxSaathi, your personal compliance copilot. I can help you with:\n\n• GST registration & filing\n• Income tax & ITR\n• Government schemes & loans\n• Deadlines & penalties\n• Document requirements\n\nWhat would you like to know today?`
        }]);
      }
      setFetching(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (msg = input) => {
    if (!msg.trim() || loading) return;
    setInput('');
    setMessages(m => [...m, { role:'user', text: msg }]);
    setLoading(true);
    try {
      const reply = await sendChat(msg);
      setMessages(m => [...m, { role:'bot', text: reply }]);
    } catch(e) {
      setMessages(m => [...m, { role:'bot', text:'❌ Connection error. Make sure your API key is saved in Profile settings.' }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleClear = async () => {
    await clearChat();
    setMessages([{ role:'bot', text:'Chat cleared! Ask me anything about taxes and compliance 😊' }]);
  };

  return (
    <div className="page" style={{height:'calc(100vh - 64px)', display:'flex', overflow:'hidden'}}>

      {/* SIDEBAR */}
      <div style={{
        width:'220px', borderRight:'1px solid var(--border)',
        background:'var(--surface)', display:'flex', flexDirection:'column',
        padding:'24px 12px', flexShrink:0
      }}>
        <div style={{fontFamily:'var(--font-head)', fontSize:'13px', fontWeight:'700', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1.5px', padding:'0 8px', marginBottom:'12px'}}>
          Topics
        </div>
        {TOPICS.map(t => (
          <div key={t.label}
            onClick={() => setActiveTopic(t.label)}
            style={{
              padding:'10px 12px', borderRadius:'8px', fontSize:'13px', cursor:'pointer',
              transition:'all 0.18s', marginBottom:'3px', display:'flex', alignItems:'center', gap:'9px',
              background: activeTopic === t.label ? 'var(--accent-glow)' : 'transparent',
              color: activeTopic === t.label ? 'var(--accent)' : 'var(--muted)',
              border: activeTopic === t.label ? '1px solid rgba(240,165,0,0.25)' : '1px solid transparent',
            }}>
            <span>{t.icon}</span>{t.label}
          </div>
        ))}

        <div style={{marginTop:'auto', padding:'16px 8px 0', borderTop:'1px solid var(--border)'}}>
          <div style={{fontSize:'11px', color:'var(--muted)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px'}}>
            History
          </div>
          <div style={{fontSize:'13px', color:'var(--green)', fontWeight:'600', marginBottom:'12px'}}>
            ● Saved to DB
          </div>
          <button className="edit-btn" style={{width:'100%', textAlign:'center'}} onClick={handleClear}>
            Clear Chat
          </button>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>

        {/* CHAT HEADER */}
        <div style={{
          padding:'16px 24px', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', gap:'12px',
          background:'var(--surface)'
        }}>
          <div style={{
            width:'38px', height:'38px', background:'var(--accent-glow)',
            borderRadius:'10px', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'20px', border:'1px solid rgba(240,165,0,0.25)'
          }}>🤖</div>
          <div>
            <div style={{fontFamily:'var(--font-head)', fontSize:'16px', fontWeight:'700'}}>
              TaxSaathi AI Copilot
            </div>
            <div style={{fontSize:'12px', color:'var(--muted)', display:'flex', alignItems:'center', gap:'6px'}}>
              <span style={{width:'6px', height:'6px', background:'var(--green)', borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite'}}/>
              Powered by Claude · Chat saved to database
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages" style={{flex:1}}>

          {fetching ? (
            <div style={{display:'flex', flexDirection:'column', gap:'16px', padding:'8px 0'}}>
              {[1,2].map(i => (
                <div key={i} style={{display:'flex', gap:'12px'}}>
                  <div className="skeleton" style={{width:'34px', height:'34px', borderRadius:'10px', flexShrink:0}}/>
                  <div style={{flex:1, maxWidth:'60%'}}>
                    <div className="skeleton skeleton-text" style={{width:'80%'}}/>
                    <div className="skeleton skeleton-text" style={{width:'60%'}}/>
                    <div className="skeleton skeleton-text" style={{width:'40%'}}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            messages.map((m,i) => (
              <div key={i} className={`chat-msg ${m.role}`} style={{animationDelay:`${Math.min(i*0.05, 0.3)}s`}}>
                <div className={`msg-avatar ${m.role}`}>
                  {m.role === 'bot' ? '🤖' : '👤'}
                </div>
                <div className="msg-bubble" style={{whiteSpace:'pre-wrap'}}>
                  {m.text}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="chat-msg">
              <div className="msg-avatar bot">🤖</div>
              <div className="msg-bubble">
                <div className="msg-typing">
                  <div className="typing-dot"/>
                  <div className="typing-dot"/>
                  <div className="typing-dot"/>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* INPUT AREA */}
        <div className="chat-input-area">
          <div className="quick-chips">
            {CHIPS.map((q,i) => (
              <button key={i} className="chip" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder="Ask about GST, income tax, schemes, deadlines..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button className="send-btn" onClick={() => send()} disabled={!input.trim() || loading}>
              {loading ? <div className="spinner" style={{width:'18px', height:'18px', borderTopColor:'#000'}}/> : '→'}
            </button>
          </div>
          <div style={{fontSize:'11px', color:'var(--muted)', marginTop:'8px', textAlign:'center'}}>
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
